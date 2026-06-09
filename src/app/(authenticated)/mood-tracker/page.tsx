import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  getAverageIntensity,
  getDominantMood,
  getMoodCounts,
  getMonthlyInsights,
  moodColors,
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
  const baseCalendarCellClass =
    "group flex aspect-square min-h-14 flex-col items-center justify-center rounded-xl p-1.5 text-center text-xs transition-all duration-300 animate-soft-scale-in hover:-translate-y-1 hover:scale-[1.03] sm:min-h-20 sm:rounded-2xl sm:p-2 sm:text-sm";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 animate-soft-fade-up lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-emerald-800">Mood Tracker</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Pola mood bulan ini
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {month.label}. Lihat bagaimana perasaanmu berubah dari hari ke
            hari.
          </p>
        </div>

        <form className="flex flex-col gap-3 sm:flex-row" action="/mood-tracker">
          <input
            type="month"
            name="month"
            defaultValue={monthValue}
            className="w-full rounded-xl border border-white/45 bg-[#fffaf0]/35 px-4 py-3 text-slate-800 outline-none transition-all duration-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 focus:bg-[#fffaf0]/50 sm:w-auto"
          />
          <button className="w-full rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:opacity-90 sm:w-auto">
            Filter
          </button>
        </form>
      </div>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-2xl border border-white/35 bg-[#fffaf0]/45 p-4 shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-fade-up sm:rounded-3xl sm:p-6">
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-slate-400 sm:gap-3">
            {weekdays.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-3">
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
                      ? `${baseCalendarCellClass} border ${moodColors[journal.mood]} hover:brightness-[1.03]`
                      : `${baseCalendarCellClass} border ${moodColors.empty} hover:brightness-[1.03]`
                  }
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <span className="text-xs">{day}</span>
                  <span
                    className="mt-1 text-lg transition-transform duration-300 group-hover:scale-110 sm:text-2xl"
                    aria-hidden="true"
                  >
                    {journal ? moodEmojis[journal.mood] : "-"}
                  </span>
                </Link>
              );
            })}
          </div>
        </article>

        <aside className="space-y-5">
          <article className="rounded-2xl border border-white/35 bg-[#fffaf0]/45 p-4 shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-scale-in sm:rounded-3xl sm:p-6">
            <h2 className="text-lg font-semibold">Summary mood</h2>
            <div className="mt-4 space-y-3">
              {moodOptions.map((mood) => (
                <div key={mood}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span
                      className={`rounded-full border px-2 py-1 ${moodColors[mood]}`}
                    >
                      {moodEmojis[mood]} {moodLabels[mood]}
                    </span>
                    <span className="font-semibold">{moodCounts[mood]}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#fffaf0]/35">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-700 to-teal-600"
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

          <article className="rounded-2xl border border-white/35 bg-[#fffaf0]/45 p-4 shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-scale-in sm:rounded-3xl sm:p-6">
            <h2 className="text-lg font-semibold">Insight sederhana</h2>
            <div className="mt-4 space-y-3">
              {insights.map((insight) => (
                <p
                  key={insight}
                  className="rounded-xl border border-white/40 bg-[#fffaf0]/35 p-4 text-sm leading-6 text-slate-700"
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
