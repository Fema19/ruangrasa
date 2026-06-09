import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  getAverageIntensity,
  getDominantMood,
  getMoodCounts,
  getMonthlyInsights,
  moodEmojis,
  moodLabels,
  moodOptions,
} from "@/lib/mood";
import {
  getCurrentMonthValue,
  getMonthRange,
  isValidMonthValue,
} from "@/lib/date";
import type { Mood } from "@/types/database";

type MoodTrackerPageProps = {
  searchParams: Promise<{ month?: string }>;
};

type JournalMood = {
  id: string;
  mood: Mood;
  intensity: number;
  journal_date: string;
};

const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export default async function MoodTrackerPage({
  searchParams,
}: MoodTrackerPageProps) {
  const params = await searchParams;
  const monthValue =
    typeof params.month === "string" && isValidMonthValue(params.month)
      ? params.month
      : getCurrentMonthValue();
  const month = getMonthRange(monthValue);
  const { supabase, user } = await getAuthenticatedUser();

  const { data } = await supabase
    .from("journals")
    .select("id, mood, intensity, journal_date")
    .eq("user_id", user.id)
    .gte("journal_date", month.start)
    .lt("journal_date", month.end)
    .order("journal_date", { ascending: true });

  const journals = (data ?? []) as JournalMood[];
  const journalsByDay = new Map(
    journals.map((journal) => [Number(journal.journal_date.slice(8, 10)), journal])
  );
  const moodCounts = getMoodCounts(journals);
  const dominantMood = getDominantMood(journals);
  const averageIntensity = getAverageIntensity(journals);
  const insights = getMonthlyInsights({
    dominantMood,
    averageIntensity,
    totalJournals: journals.length,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-violet-200">Mood Tracker</p>
          <h1 className="mt-2 text-3xl font-bold capitalize">{month.label}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Lihat mood yang kamu catat sepanjang bulan ini.
          </p>
        </div>

        <form className="flex flex-col gap-3 sm:flex-row" action="/mood-tracker">
          <input
            type="month"
            name="month"
            defaultValue={monthValue}
            className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-violet-300"
          />
          <button className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100">
            Filter
          </button>
        </form>
      </div>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400">
            {weekdays.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2">
            {Array.from({ length: month.firstDayOffset }, (_, index) => (
              <div key={`blank-${index}`} className="aspect-square" />
            ))}
            {Array.from({ length: month.daysInMonth }, (_, index) => {
              const day = index + 1;
              const journal = journalsByDay.get(day);

              return (
                <Link
                  key={day}
                  href={journal ? `/journals/${journal.id}` : "/journals/new"}
                  className={
                    journal
                      ? "flex aspect-square min-h-14 flex-col items-center justify-center rounded-2xl border border-violet-300/30 bg-violet-400/15 p-2 text-center transition hover:bg-violet-400/25"
                      : "flex aspect-square min-h-14 flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-950/45 p-2 text-center text-slate-500 transition hover:border-white/20 hover:text-slate-300"
                  }
                >
                  <span className="text-xs">{day}</span>
                  <span className="mt-1 text-xl" aria-hidden="true">
                    {journal ? moodEmojis[journal.mood] : "-"}
                  </span>
                </Link>
              );
            })}
          </div>
        </article>

        <aside className="space-y-5">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
            <h2 className="text-lg font-semibold">Summary mood</h2>
            <div className="mt-4 space-y-3">
              {moodOptions.map((mood) => (
                <div key={mood}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span>
                      {moodEmojis[mood]} {moodLabels[mood]}
                    </span>
                    <span className="font-semibold">{moodCounts[mood]}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-900">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-pink-300"
                      style={{
                        width:
                          journals.length === 0
                            ? "0%"
                            : `${(moodCounts[mood] / journals.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
            <h2 className="text-lg font-semibold">Insight sederhana</h2>
            <div className="mt-4 space-y-3">
              {insights.map((insight) => (
                <p
                  key={insight}
                  className="rounded-xl border border-white/10 bg-slate-950/45 p-4 text-sm leading-6 text-slate-300"
                >
                  {insight}
                </p>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-400">
              Insight ini bukan diagnosis. Ini hanya ringkasan berdasarkan
              jurnal yang kamu tulis.
            </p>
          </article>
        </aside>
      </section>
    </div>
  );
}
