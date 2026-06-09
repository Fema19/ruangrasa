import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  formatDateId,
  getCurrentMonthValue,
  getJakartaDateString,
  getMonthRange,
} from "@/lib/date";
import {
  getAverageIntensity,
  getDominantMood,
  moodEmojis,
  moodLabels,
} from "@/lib/mood";
import type { Mood } from "@/types/database";

type JournalSummary = {
  id: string;
  mood: Mood;
  intensity: number;
  journal_date: string;
  note: string | null;
};

export default async function DashboardPage() {
  const { supabase, user } = await getAuthenticatedUser();
  const month = getMonthRange(getCurrentMonthValue());
  const today = getJakartaDateString();

  const [profileResult, journalsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, username")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("journals")
      .select("id, mood, intensity, journal_date, note")
      .eq("user_id", user.id)
      .gte("journal_date", month.start)
      .lt("journal_date", month.end)
      .order("journal_date", { ascending: false }),
  ]);

  const profile = profileResult.data as
    | { full_name: string | null; username: string | null }
    | null;
  const journals = (journalsResult.data ?? []) as JournalSummary[];
  const todayJournal = journals.find((journal) => journal.journal_date === today);
  const dominantMood = getDominantMood(journals);
  const averageIntensity = getAverageIntensity(journals);
  const displayName =
    profile?.full_name?.trim() || user.email?.split("@")[0] || "Teman";

  const stats = [
    {
      label: "Total jurnal bulan ini",
      value: journals.length.toString(),
    },
    {
      label: "Mood dominan bulan ini",
      value: dominantMood
        ? `${moodEmojis[dominantMood]} ${moodLabels[dominantMood]}`
        : "-",
    },
    {
      label: "Rata-rata intensity bulan ini",
      value: averageIntensity === null ? "-" : averageIntensity.toFixed(1),
    },
    {
      label: "Status jurnal hari ini",
      value: todayJournal ? "Sudah menulis" : "Belum menulis",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-sm font-medium text-violet-200">
            Dashboard {month.label}
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Halo, {displayName}
          </h1>
          <div className="mt-3 space-y-1 text-sm text-slate-300">
            <p>{user.email}</p>
            <p>Nama profil: {profile?.full_name || "Belum diisi"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href="/journals/new"
            className="rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-center font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:scale-[1.01]"
          >
            Tambah Jurnal
          </Link>
          <LogoutButton />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20"
          >
            <p className="text-sm text-slate-300">{stat.label}</p>
            <p className="mt-3 text-2xl font-bold">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Ringkasan jurnal hari ini</h2>
              <p className="mt-2 text-sm text-slate-300">{formatDateId(today)}</p>
            </div>
            <Link
              href={todayJournal ? `/journals/${todayJournal.id}` : "/journals/new"}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/5"
            >
              {todayJournal ? "Lihat" : "Tambah"}
            </Link>
          </div>

          {todayJournal ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/55 p-4">
              <p className="text-lg font-semibold">
                {moodEmojis[todayJournal.mood]} {moodLabels[todayJournal.mood]}{" "}
                · Intensity {todayJournal.intensity}
              </p>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
                {todayJournal.note || "Tidak ada catatan tambahan."}
              </p>
              <p className="mt-4 text-sm text-emerald-200">
                Kamu sudah menulis jurnal hari ini.
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-slate-950/35 p-5">
              <p className="font-semibold">Kamu belum menulis jurnal hari ini.</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Ambil beberapa menit untuk memberi nama pada perasaanmu.
              </p>
            </div>
          )}
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
          <h2 className="text-xl font-semibold">Arah cepat</h2>
          <div className="mt-5 grid gap-3">
            <Link
              href="/journals"
              className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/10"
            >
              Lihat semua jurnal
            </Link>
            <Link
              href="/mood-tracker"
              className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/10"
            >
              Buka mood tracker
            </Link>
            <Link
              href="/profile"
              className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/10"
            >
              Update profile
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
