import type { Mood } from "@/types/database";

export const moodLabels: Record<Mood, string> = {
  happy: "Senang",
  calm: "Tenang",
  neutral: "Biasa",
  sad: "Sedih",
  anxious: "Cemas",
  angry: "Marah",
  tired: "Lelah",
  empty: "Kosong",
};

export const moodEmojis: Record<Mood, string> = {
  happy: "😊",
  calm: "🌿",
  neutral: "😐",
  sad: "😔",
  anxious: "😰",
  angry: "😡",
  tired: "😴",
  empty: "🫥",
};

export const moodColors: Record<Mood, string> = {
  happy: "border-amber-300/60 bg-amber-200/70 text-amber-900",
  calm: "border-emerald-300/60 bg-emerald-200/60 text-emerald-900",
  neutral: "border-stone-300/60 bg-stone-200/70 text-stone-800",
  sad: "border-sky-300/60 bg-sky-200/60 text-sky-900",
  anxious: "border-orange-300/60 bg-orange-200/60 text-orange-900",
  angry: "border-rose-300/60 bg-rose-200/60 text-rose-900",
  tired: "border-slate-300/60 bg-slate-200/70 text-slate-800",
  empty: "border-zinc-300/60 bg-zinc-200/70 text-zinc-800",
};

export const moodOptions = Object.keys(moodLabels) as Mood[];

export const factorOptions = [
  "work",
  "education",
  "family",
  "relationship",
  "money",
  "health",
  "future",
  "loneliness",
  "self-esteem",
] as const;

export const activityOptions = [
  "sleep",
  "exercise",
  "hobby",
  "learning",
  "socializing",
  "praying",
  "music",
  "walking",
  "rest",
] as const;

export const factorLabels = {
  work: "Pekerjaan",
  education: "Pendidikan",
  school: "Pendidikan",
  family: "Keluarga",
  relationship: "Relasi",
  money: "Keuangan",
  health: "Kesehatan",
  future: "Masa Depan",
  loneliness: "Kesepian",
  "self-esteem": "Kepercayaan Diri",
} satisfies Record<string, string>;

export const activityLabels = {
  sleep: "Tidur",
  exercise: "Olahraga",
  hobby: "Hobi",
  coding: "Hobi",
  gaming: "Hobi",
  learning: "Belajar",
  study: "Belajar",
  socializing: "Bersosialisasi",
  talking: "Bersosialisasi",
  praying: "Ibadah",
  music: "Musik",
  walking: "Jalan Santai",
  rest: "Istirahat",
} satisfies Record<string, string>;

export function normalizeFactor(value: string) {
  return value === "school" ? "education" : value;
}

export function normalizeActivity(value: string) {
  if (value === "coding" || value === "gaming") {
    return "hobby";
  }

  if (value === "study") {
    return "learning";
  }

  if (value === "talking") {
    return "socializing";
  }

  return value;
}

export function isMood(value: string): value is Mood {
  return moodOptions.includes(value as Mood);
}

export function uniqueClean(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean))
  );
}

export function splitTags(value: string) {
  return uniqueClean(value.split(","));
}

export function getMoodCounts(journals: Array<{ mood: Mood }>) {
  return journals.reduce<Record<Mood, number>>(
    (counts, journal) => {
      counts[journal.mood] += 1;
      return counts;
    },
    {
      happy: 0,
      calm: 0,
      neutral: 0,
      sad: 0,
      anxious: 0,
      angry: 0,
      tired: 0,
      empty: 0,
    }
  );
}

export function getDominantMood(journals: Array<{ mood: Mood }>) {
  const counts = getMoodCounts(journals);
  const [dominantMood, total] = Object.entries(counts).sort(
    ([, firstCount], [, secondCount]) => secondCount - firstCount
  )[0] as [Mood, number];

  return total > 0 ? dominantMood : null;
}

export function getAverageIntensity(
  journals: Array<{ intensity: number | null }>
) {
  if (journals.length === 0) {
    return null;
  }

  const total = journals.reduce(
    (sum, journal) => sum + Number(journal.intensity ?? 0),
    0
  );

  return total / journals.length;
}

export function getMonthlyInsights(input: {
  dominantMood: Mood | null;
  averageIntensity: number | null;
  totalJournals: number;
}) {
  const insights: string[] = [];

  if (input.dominantMood === "anxious") {
    insights.push(
      "Bulan ini kamu cukup sering mencatat rasa cemas. Coba perhatikan faktor yang paling sering muncul dan beri ruang istirahat untuk diri sendiri."
    );
  }

  if (input.averageIntensity !== null && input.averageIntensity >= 7) {
    insights.push(
      "Rata-rata intensitas emosimu cukup tinggi bulan ini. Mungkin kamu perlu mengurangi beban dan mencari dukungan dari orang yang kamu percaya."
    );
  }

  if (input.totalJournals >= 10) {
    insights.push(
      "Kamu cukup konsisten menulis jurnal bulan ini. Ini bisa membantumu memahami pola perasaan dengan lebih baik."
    );
  }

  if (insights.length === 0) {
    insights.push(
      "Belum ada pola besar yang menonjol bulan ini. Tetap catat dengan lembut agar gambaran emosimu makin jelas."
    );
  }

  return insights;
}
