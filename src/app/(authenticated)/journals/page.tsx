import Link from "next/link";
import { DeleteJournalForm } from "@/components/DeleteJournalForm";
import { getAuthenticatedUser } from "@/lib/auth";
import { formatDateId } from "@/lib/date";
import { moodEmojis, moodLabels } from "@/lib/mood";
import type { Mood } from "@/types/database";

type JournalListItem = {
  id: string;
  mood: Mood;
  intensity: number;
  note: string | null;
  journal_date: string;
};

export default async function JournalsPage() {
  const { supabase, user } = await getAuthenticatedUser();
  const { data } = await supabase
    .from("journals")
    .select("id, mood, intensity, note, journal_date")
    .eq("user_id", user.id)
    .order("journal_date", { ascending: false });

  const journals = (data ?? []) as JournalListItem[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-violet-200">Journals</p>
          <h1 className="mt-2 text-3xl font-bold">Jurnal perasaanmu</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Semua jurnal diurutkan dari tanggal terbaru.
          </p>
        </div>
        <Link
          href="/journals/new"
          className="rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-center font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:scale-[1.01]"
        >
          Tambah Jurnal
        </Link>
      </div>

      {journals.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center shadow-xl shadow-slate-950/20">
          <h2 className="text-2xl font-semibold">Belum ada jurnal.</h2>
          <p className="mt-3 text-slate-300">
            Mulai dengan mencatat perasaanmu hari ini.
          </p>
          <Link
            href="/journals/new"
            className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Mulai Menulis
          </Link>
        </section>
      ) : (
        <section className="grid gap-4">
          {journals.map((journal) => (
            <article
              key={journal.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-4xl" aria-hidden="true">
                      {moodEmojis[journal.mood]}
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {moodLabels[journal.mood]}
                      </h2>
                      <p className="text-sm text-slate-300">
                        {formatDateId(journal.journal_date)} · Intensity{" "}
                        {journal.intensity}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-300">
                    {journal.note || "Tidak ada catatan tambahan."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/journals/${journal.id}`}
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/5"
                  >
                    Detail
                  </Link>
                  <Link
                    href={`/journals/${journal.id}/edit`}
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/5"
                  >
                    Edit
                  </Link>
                  <DeleteJournalForm journalId={journal.id} compact />
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
