import { redirect } from "next/navigation";
import { JournalForm } from "@/components/JournalForm";
import { getAuthenticatedUser } from "@/lib/auth";
import { updateJournalAction } from "@/lib/journal-actions";
import type { Mood } from "@/types/database";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

type JournalEditValue = {
  id: string;
  mood: Mood;
  intensity: number;
  note: string | null;
  journal_date: string;
};

export default async function EditJournalPage({ params }: EditPageProps) {
  const { id } = await params;
  const { supabase, user } = await getAuthenticatedUser();

  const { data: journalData } = await supabase
    .from("journals")
    .select("id, mood, intensity, note, journal_date")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!journalData) {
    redirect("/journals");
  }

  const [factorsResult, tagsResult, activitiesResult] = await Promise.all([
    supabase.from("journal_factors").select("factor").eq("journal_id", id),
    supabase.from("journal_tags").select("tag").eq("journal_id", id),
    supabase
      .from("journal_activities")
      .select("activity")
      .eq("journal_id", id),
  ]);

  const journal = journalData as JournalEditValue;
  const action = updateJournalAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-violet-200">Edit jurnal</p>
        <h1 className="mt-2 text-3xl font-bold">Perbarui catatanmu</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Sesuaikan mood, tanggal, faktor, aktivitas, atau catatan yang sudah
          kamu tulis.
        </p>
      </div>

      <JournalForm
        action={action}
        mode="edit"
        initialValue={{
          mood: journal.mood,
          intensity: journal.intensity,
          note: journal.note,
          journal_date: journal.journal_date,
          factors: ((factorsResult.data ?? []) as { factor: string }[]).map(
            (row) => row.factor
          ),
          tags: ((tagsResult.data ?? []) as { tag: string }[]).map(
            (row) => row.tag
          ),
          activities: (
            (activitiesResult.data ?? []) as { activity: string }[]
          ).map((row) => row.activity),
        }}
      />
    </div>
  );
}
