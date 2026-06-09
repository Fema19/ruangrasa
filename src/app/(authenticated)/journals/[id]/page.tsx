import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteJournalForm } from "@/components/DeleteJournalForm";
import { getAuthenticatedUser } from "@/lib/auth";
import { formatDateId } from "@/lib/date";
import {
  activityLabels,
  factorLabels,
  moodEmojis,
  moodLabels,
} from "@/lib/mood";
import type { Mood } from "@/types/database";

type DetailPageProps = {
  params: Promise<{ id: string }>;
};

type JournalDetail = {
  id: string;
  mood: Mood;
  intensity: number;
  note: string | null;
  journal_date: string;
};

function factorLabel(value: string) {
  return factorLabels[value as keyof typeof factorLabels] ?? value;
}

function activityLabel(value: string) {
  return activityLabels[value as keyof typeof activityLabels] ?? value;
}

function PillList({
  items,
  emptyText,
}: {
  items: string[];
  emptyText: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-400">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-sm text-slate-200"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default async function JournalDetailPage({ params }: DetailPageProps) {
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

  const journal = journalData as JournalDetail;
  const [factorsResult, tagsResult, activitiesResult] = await Promise.all([
    supabase.from("journal_factors").select("factor").eq("journal_id", id),
    supabase.from("journal_tags").select("tag").eq("journal_id", id),
    supabase
      .from("journal_activities")
      .select("activity")
      .eq("journal_id", id),
  ]);

  const factors = ((factorsResult.data ?? []) as { factor: string }[]).map(
    (row) => factorLabel(row.factor)
  );
  const tags = ((tagsResult.data ?? []) as { tag: string }[]).map(
    (row) => row.tag
  );
  const activities = (
    (activitiesResult.data ?? []) as { activity: string }[]
  ).map((row) => activityLabel(row.activity));

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-violet-200">
            {formatDateId(journal.journal_date)}
          </p>
          <h1 className="mt-2 text-3xl font-bold">Detail jurnal</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/journals/${journal.id}/edit`}
            className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Edit
          </Link>
          <DeleteJournalForm journalId={journal.id} />
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="text-6xl" aria-hidden="true">
              {moodEmojis[journal.mood]}
            </span>
            <div>
              <p className="text-2xl font-bold">{moodLabels[journal.mood]}</p>
              <p className="mt-1 text-sm text-slate-300">
                Mood yang kamu catat
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/55 px-5 py-4">
            <p className="text-sm text-slate-300">Intensity</p>
            <p className="mt-1 text-3xl font-bold">{journal.intensity}/10</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold">Catatan</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
            {journal.note || "Tidak ada catatan tambahan."}
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
          <h2 className="text-lg font-semibold">Factors</h2>
          <div className="mt-4">
            <PillList items={factors} emptyText="Belum ada faktor." />
          </div>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
          <h2 className="text-lg font-semibold">Tags</h2>
          <div className="mt-4">
            <PillList items={tags} emptyText="Belum ada tag." />
          </div>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
          <h2 className="text-lg font-semibold">Activities</h2>
          <div className="mt-4">
            <PillList items={activities} emptyText="Belum ada aktivitas." />
          </div>
        </article>
      </section>
    </div>
  );
}
