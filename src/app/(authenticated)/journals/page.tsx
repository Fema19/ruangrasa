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
      <div className="flex flex-col justify-between gap-4 animate-soft-fade-up sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-emerald-800">Journals</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Jurnal perasaanmu
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Semua jurnal diurutkan dari tanggal terbaru.
          </p>
        </div>
        <Link
          href="/journals/new"
          className="w-full rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 px-5 py-3 text-center font-semibold text-white shadow-lg shadow-emerald-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:opacity-90 sm:w-auto"
        >
          Tambah Jurnal
        </Link>
      </div>

      {journals.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-white/45 bg-[#fffaf0]/45 p-6 text-center shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-scale-in sm:rounded-3xl sm:p-8">
          <h2 className="text-2xl font-semibold">Belum ada jurnal.</h2>
          <p className="mt-3 text-slate-600">
            Mulai pelan-pelan dari satu catatan kecil hari ini.
          </p>
          <Link
            href="/journals/new"
            className="mt-6 inline-flex w-full justify-center rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:opacity-90 sm:w-auto"
          >
            Mulai Menulis
          </Link>
        </section>
      ) : (
        <section className="grid gap-4">
          {journals.map((journal, index) => (
            <article
              key={journal.id}
              className="rounded-2xl border border-white/35 bg-[#fffaf0]/45 p-4 shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-fade-up transition-all duration-300 hover:-translate-y-1 sm:rounded-3xl sm:p-6"
              style={{ animationDelay: `${index * 70}ms` }}
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
                      <p className="text-sm text-slate-600">
                        {formatDateId(journal.journal_date)} · Intensity{" "}
                        {journal.intensity}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
                    {journal.note || "Tidak ada catatan tambahan."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Link
                    href={`/journals/${journal.id}`}
                    className="flex-1 rounded-lg border border-white/45 bg-[#fffaf0]/35 px-3 py-2 text-center text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]/50 sm:flex-none"
                  >
                    Detail
                  </Link>
                  <Link
                    href={`/journals/${journal.id}/edit`}
                    className="flex-1 rounded-lg border border-white/45 bg-[#fffaf0]/35 px-3 py-2 text-center text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]/50 sm:flex-none"
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
