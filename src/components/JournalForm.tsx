"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { JournalFormState } from "@/lib/journal-actions";
import {
  activityLabels,
  activityOptions,
  factorLabels,
  factorOptions,
  moodColors,
  moodEmojis,
  moodLabels,
  moodOptions,
  normalizeActivity,
  normalizeFactor,
} from "@/lib/mood";
import type { Mood } from "@/types/database";

type JournalFormInitialValue = {
  mood?: Mood;
  intensity?: number;
  note?: string | null;
  journal_date?: string;
  factors?: string[];
  tags?: string[];
  activities?: string[];
};

type JournalFormProps = {
  action: (
    state: JournalFormState,
    formData: FormData
  ) => Promise<JournalFormState>;
  initialValue?: JournalFormInitialValue;
  mode: "create" | "edit";
};

const initialState: JournalFormState = {};

export function JournalForm({
  action,
  initialValue,
  mode,
}: JournalFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [intensity, setIntensity] = useState(initialValue?.intensity ?? 5);
  const selectedFactors = new Set(
    (initialValue?.factors ?? []).map(normalizeFactor)
  );
  const selectedActivities = new Set(
    (initialValue?.activities ?? []).map(normalizeActivity)
  );

  return (
    <form action={formAction} className="space-y-6 animate-soft-fade-up sm:space-y-8">
      <section className="rounded-2xl border border-white/35 bg-[#fffaf0]/45 p-4 shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-scale-in sm:rounded-3xl sm:p-6">
        <h2 className="text-lg font-semibold">Mood</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {moodOptions.map((mood) => (
            <label key={mood} className="cursor-pointer">
              <input
                type="radio"
                name="mood"
                value={mood}
                defaultChecked={(initialValue?.mood ?? "neutral") === mood}
                className="peer sr-only"
                required
              />
              <span
                className={`flex min-h-24 flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all duration-300 hover:-translate-y-0.5 hover:brightness-[1.03] peer-checked:ring-2 peer-checked:ring-emerald-700/30 sm:min-h-28 sm:p-4 ${moodColors[mood]}`}
              >
                <span className="text-3xl">{moodEmojis[mood]}</span>
                <span className="mt-3 text-sm font-semibold">
                  {moodLabels[mood]}
                </span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/35 bg-[#fffaf0]/45 p-4 shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-scale-in sm:rounded-3xl sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-slate-700">
              Intensity
            </span>
            <div className="mt-3 flex items-center gap-4">
              <input
                type="range"
                name="intensity"
                min={1}
                max={10}
                value={intensity}
                onChange={(event) => setIntensity(Number(event.target.value))}
                className="w-full accent-emerald-700"
                required
              />
              <input
                type="number"
                min={1}
                max={10}
                value={intensity}
                onChange={(event) => setIntensity(Number(event.target.value))}
                className="w-20 rounded-xl border border-white/45 bg-[#fffaf0]/35 px-3 py-2 text-center text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 focus:bg-[#fffaf0]/50"
                aria-label="Nilai intensity"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-medium text-slate-700">
              Tanggal jurnal
            </span>
            <input
              type="date"
              name="journal_date"
              defaultValue={initialValue?.journal_date}
              className="mt-3 w-full rounded-xl border border-white/45 bg-[#fffaf0]/35 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 focus:bg-[#fffaf0]/50"
              required
            />
          </label>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-700">Catatan</span>
          <textarea
            name="note"
            defaultValue={initialValue?.note ?? ""}
            rows={8}
            placeholder="Tulis apa yang sedang kamu rasakan..."
            className="mt-3 w-full resize-y rounded-xl border border-white/45 bg-[#fffaf0]/35 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 focus:bg-[#fffaf0]/50"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-white/35 bg-[#fffaf0]/45 p-4 shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-scale-in sm:rounded-3xl sm:p-6">
        <h2 className="text-lg font-semibold">Faktor</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {factorOptions.map((factor) => (
            <label key={factor} className="cursor-pointer">
              <input
                type="checkbox"
                name="factors"
                value={factor}
                defaultChecked={selectedFactors.has(factor)}
                className="peer sr-only"
              />
              <span className="block rounded-xl border border-white/40 bg-[#fffaf0]/35 px-4 py-3 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]/50 peer-checked:border-emerald-700 peer-checked:bg-emerald-700/15">
                {factorLabels[factor]}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/35 bg-[#fffaf0]/45 p-4 shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-scale-in sm:rounded-3xl sm:p-6">
        <h2 className="text-lg font-semibold">Aktivitas</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activityOptions.map((activity) => (
            <label key={activity} className="cursor-pointer">
              <input
                type="checkbox"
                name="activities"
                value={activity}
                defaultChecked={selectedActivities.has(activity)}
                className="peer sr-only"
              />
              <span className="block rounded-xl border border-white/40 bg-[#fffaf0]/35 px-4 py-3 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]/50 peer-checked:border-emerald-700 peer-checked:bg-emerald-700/15">
                {activityLabels[activity]}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/35 bg-[#fffaf0]/45 p-4 shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-scale-in sm:rounded-3xl sm:p-6">
        <label>
          <span className="text-sm font-medium text-slate-700">Tags</span>
          <input
            name="tags"
            defaultValue={(initialValue?.tags ?? []).join(", ")}
            placeholder="contoh: tidur, kerja, keluarga"
            className="mt-3 w-full rounded-xl border border-white/45 bg-[#fffaf0]/35 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 focus:bg-[#fffaf0]/50"
          />
        </label>
      </section>

      {state.error && (
        <p className="rounded-xl border border-white/40 bg-[#fffaf0]/35 px-4 py-3 text-sm text-rose-800">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          disabled={pending}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100 sm:w-auto"
        >
          {pending
            ? "Menyimpan..."
            : mode === "create"
              ? "Simpan Jurnal"
              : "Update Jurnal"}
        </button>
        <Link
          href={mode === "create" ? "/journals" : "../"}
          className="w-full rounded-xl border border-white/45 bg-[#fffaf0]/35 px-5 py-3 text-center font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]/50 sm:w-auto"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
