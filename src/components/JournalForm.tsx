"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { JournalFormState } from "@/lib/journal-actions";
import {
  activityLabels,
  activityOptions,
  factorLabels,
  factorOptions,
  moodEmojis,
  moodLabels,
  moodOptions,
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
  const selectedFactors = new Set(initialValue?.factors ?? []);
  const selectedActivities = new Set(initialValue?.activities ?? []);

  return (
    <form action={formAction} className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
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
              <span className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-center transition peer-checked:border-violet-300 peer-checked:bg-violet-400/15">
                <span className="text-3xl">{moodEmojis[mood]}</span>
                <span className="mt-3 text-sm font-semibold">
                  {moodLabels[mood]}
                </span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-slate-200">
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
                className="w-full accent-violet-400"
                required
              />
              <input
                type="number"
                min={1}
                max={10}
                value={intensity}
                onChange={(event) => setIntensity(Number(event.target.value))}
                className="w-20 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-center text-white outline-none focus:border-violet-300"
                aria-label="Nilai intensity"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-medium text-slate-200">
              Tanggal jurnal
            </span>
            <input
              type="date"
              name="journal_date"
              defaultValue={initialValue?.journal_date}
              className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-violet-300"
              required
            />
          </label>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-medium text-slate-200">Catatan</span>
          <textarea
            name="note"
            defaultValue={initialValue?.note ?? ""}
            rows={8}
            placeholder="Tulis apa yang sedang kamu rasakan..."
            className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
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
              <span className="block rounded-xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm transition peer-checked:border-indigo-300 peer-checked:bg-indigo-400/15">
                {factorLabels[factor]}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
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
              <span className="block rounded-xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm transition peer-checked:border-pink-300 peer-checked:bg-pink-400/15">
                {activityLabels[activity]}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20">
        <label>
          <span className="text-sm font-medium text-slate-200">Tags</span>
          <input
            name="tags"
            defaultValue={(initialValue?.tags ?? []).join(", ")}
            placeholder="contoh: tidur, kerja, keluarga"
            className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300"
          />
        </label>
      </section>

      {state.error && (
        <p className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          disabled={pending}
          className="rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? "Menyimpan..."
            : mode === "create"
              ? "Simpan Jurnal"
              : "Update Jurnal"}
        </button>
        <Link
          href={mode === "create" ? "/journals" : "../"}
          className="rounded-xl border border-white/10 px-5 py-3 text-center font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/5"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
