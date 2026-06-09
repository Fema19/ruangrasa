"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  activityOptions,
  factorOptions,
  isMood,
  splitTags,
  uniqueClean,
} from "@/lib/mood";

export type JournalFormState = {
  error?: string;
};

type ParsedJournalForm =
  | {
      ok: true;
      mood: string;
      intensity: number;
      note: string | null;
      journalDate: string;
      factors: string[];
      tags: string[];
      activities: string[];
    }
  | {
      ok: false;
      error: string;
    };

type ParsedJournalInput = Extract<ParsedJournalForm, { ok: true }>;

type SupabaseServerClient = Awaited<
  ReturnType<typeof import("@/lib/supabase-server").createSupabaseServerClient>
>;

function getFormString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseSelectedOptions(
  formData: FormData,
  key: string,
  allowedValues: readonly string[]
) {
  const rawValues = uniqueClean(formData.getAll(key).map(String));
  const invalidValue = rawValues.find(
    (value) => !allowedValues.includes(value)
  );

  return {
    values: rawValues.filter((value) => allowedValues.includes(value)),
    hasInvalidValue: Boolean(invalidValue),
  };
}

function parseJournalForm(formData: FormData): ParsedJournalForm {
  const mood = getFormString(formData, "mood");
  const intensity = Number(getFormString(formData, "intensity"));
  const note = getFormString(formData, "note");
  const journalDate = getFormString(formData, "journal_date");
  const factors = parseSelectedOptions(formData, "factors", factorOptions);
  const activities = parseSelectedOptions(
    formData,
    "activities",
    activityOptions
  );
  const tags = splitTags(getFormString(formData, "tags"));

  if (!isMood(mood)) {
    return { ok: false, error: "Pilih mood terlebih dahulu." };
  }

  if (!Number.isFinite(intensity) || intensity < 1 || intensity > 10) {
    return { ok: false, error: "Intensity harus berupa angka 1 sampai 10." };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(journalDate)) {
    return { ok: false, error: "Tanggal jurnal wajib diisi." };
  }

  if (factors.hasInvalidValue || activities.hasInvalidValue) {
    return {
      ok: false,
      error: "Ada pilihan faktor atau aktivitas yang tidak valid.",
    };
  }

  return {
    ok: true,
    mood,
    intensity,
    note: note || null,
    journalDate,
    factors: factors.values,
    tags,
    activities: activities.values,
  };
}

async function findDuplicateJournal(
  supabase: SupabaseServerClient,
  userId: string,
  journalDate: string,
  ignoredJournalId?: string
) {
  let query = supabase
    .from("journals")
    .select("id")
    .eq("user_id", userId)
    .eq("journal_date", journalDate)
    .limit(1);

  if (ignoredJournalId) {
    query = query.neq("id", ignoredJournalId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    return { error: "Gagal memeriksa jurnal di tanggal ini." };
  }

  return { duplicateId: data?.id as string | undefined };
}

async function insertJournalRelations(
  supabase: SupabaseServerClient,
  journalId: string,
  input: Pick<ParsedJournalInput, "factors" | "tags" | "activities">
) {
  if (input.factors.length > 0) {
    const { error } = await supabase
      .from("journal_factors")
      .insert(
        input.factors.map((factor) => ({ journal_id: journalId, factor }))
      );

    if (error) {
      return "Jurnal tersimpan, tetapi detail tambahan gagal disimpan. Coba ulangi beberapa saat lagi.";
    }
  }

  if (input.tags.length > 0) {
    const { error } = await supabase
      .from("journal_tags")
      .insert(input.tags.map((tag) => ({ journal_id: journalId, tag })));

    if (error) {
      return "Jurnal tersimpan, tetapi detail tambahan gagal disimpan. Coba ulangi beberapa saat lagi.";
    }
  }

  if (input.activities.length > 0) {
    const { error } = await supabase.from("journal_activities").insert(
      input.activities.map((activity) => ({
        journal_id: journalId,
        activity,
      }))
    );

    if (error) {
      return "Jurnal tersimpan, tetapi detail tambahan gagal disimpan. Coba ulangi beberapa saat lagi.";
    }
  }

  return null;
}

async function replaceJournalRelations(
  supabase: SupabaseServerClient,
  journalId: string,
  input: Pick<ParsedJournalInput, "factors" | "tags" | "activities">
) {
  const deleteResults = await Promise.all([
    supabase.from("journal_factors").delete().eq("journal_id", journalId),
    supabase.from("journal_tags").delete().eq("journal_id", journalId),
    supabase.from("journal_activities").delete().eq("journal_id", journalId),
  ]);

  if (deleteResults.some((result) => result.error)) {
    return "Gagal memperbarui detail jurnal. Coba ulangi lagi.";
  }

  return insertJournalRelations(supabase, journalId, input);
}

function revalidateJournalRoutes(journalId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/journals");
  revalidatePath("/mood-tracker");

  if (journalId) {
    revalidatePath(`/journals/${journalId}`);
  }
}

export async function createJournalAction(
  _state: JournalFormState,
  formData: FormData
): Promise<JournalFormState> {
  const { supabase, user } = await getAuthenticatedUser();
  const input = parseJournalForm(formData);

  if (!input.ok) {
    return { error: input.error };
  }

  const duplicate = await findDuplicateJournal(
    supabase,
    user.id,
    input.journalDate
  );

  if (duplicate.error) {
    return { error: duplicate.error };
  }

  if (duplicate.duplicateId) {
    return {
      error:
        "Kamu sudah menulis jurnal untuk tanggal ini. Kamu bisa mengedit jurnal yang sudah ada.",
    };
  }

  const { data: journal, error } = await supabase
    .from("journals")
    .insert({
      user_id: user.id,
      mood: input.mood,
      intensity: input.intensity,
      note: input.note,
      journal_date: input.journalDate,
    })
    .select("id")
    .single();

  if (error || !journal) {
    if (error?.code === "23505") {
      return {
        error:
          "Kamu sudah menulis jurnal untuk tanggal ini. Kamu bisa mengedit jurnal yang sudah ada.",
      };
    }

    return { error: "Gagal menyimpan jurnal. Coba ulangi lagi." };
  }

  const relationError = await insertJournalRelations(supabase, journal.id, input);

  if (relationError) {
    await supabase
      .from("journals")
      .delete()
      .eq("id", journal.id)
      .eq("user_id", user.id);
    return { error: relationError };
  }

  revalidateJournalRoutes(journal.id);
  redirect("/journals");
}

export async function updateJournalAction(
  journalId: string,
  _state: JournalFormState,
  formData: FormData
): Promise<JournalFormState> {
  const { supabase, user } = await getAuthenticatedUser();
  const input = parseJournalForm(formData);

  if (!input.ok) {
    return { error: input.error };
  }

  const duplicate = await findDuplicateJournal(
    supabase,
    user.id,
    input.journalDate,
    journalId
  );

  if (duplicate.error) {
    return { error: duplicate.error };
  }

  if (duplicate.duplicateId) {
    return {
      error:
        "Kamu sudah menulis jurnal untuk tanggal ini. Kamu bisa mengedit jurnal yang sudah ada.",
    };
  }

  const { data: journal, error } = await supabase
    .from("journals")
    .update({
      mood: input.mood,
      intensity: input.intensity,
      note: input.note,
      journal_date: input.journalDate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", journalId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return {
        error:
          "Kamu sudah menulis jurnal untuk tanggal ini. Kamu bisa mengedit jurnal yang sudah ada.",
      };
    }

    return { error: "Gagal memperbarui jurnal. Coba ulangi lagi." };
  }

  if (!journal) {
    return { error: "Jurnal tidak ditemukan atau bukan milik akunmu." };
  }

  const relationError = await replaceJournalRelations(
    supabase,
    journalId,
    input
  );

  if (relationError) {
    return { error: relationError };
  }

  revalidateJournalRoutes(journalId);
  redirect(`/journals/${journalId}`);
}

export async function deleteJournalAction(journalId: string) {
  const { supabase, user } = await getAuthenticatedUser();
  const { error } = await supabase
    .from("journals")
    .delete()
    .eq("id", journalId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error("Gagal menghapus jurnal.");
  }

  revalidateJournalRoutes(journalId);
  redirect("/journals");
}
