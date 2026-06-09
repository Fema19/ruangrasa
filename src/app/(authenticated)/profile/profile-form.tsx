"use client";

import { FormEvent, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type ProfileFormProps = {
  userId: string;
  email: string;
  fullName: string;
  username: string;
};

export function ProfileForm({
  userId,
  email,
  fullName,
  username,
}: ProfileFormProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [nameValue, setNameValue] = useState(fullName);
  const [usernameValue, setUsernameValue] = useState(username);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const cleanName = nameValue.trim();
    const cleanUsername = usernameValue.trim();

    const { error: updateError } = await supabase.from("profiles").upsert(
      {
        id: userId,
        full_name: cleanName || null,
        username: cleanUsername || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (updateError) {
      setError("Profile gagal diperbarui. Coba ulangi lagi.");
      setLoading(false);
      return;
    }

    setMessage("Profile berhasil diperbarui.");
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20"
    >
      <div className="grid gap-5">
        <label>
          <span className="text-sm font-medium text-slate-200">Email</span>
          <input
            value={email}
            disabled
            className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-400 outline-none"
          />
        </label>

        <label>
          <span className="text-sm font-medium text-slate-200">Full name</span>
          <input
            value={nameValue}
            onChange={(event) => setNameValue(event.target.value)}
            placeholder="Nama lengkap"
            className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300"
          />
        </label>

        <label>
          <span className="text-sm font-medium text-slate-200">Username</span>
          <input
            value={usernameValue}
            onChange={(event) => setUsernameValue(event.target.value)}
            placeholder="username"
            className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300"
          />
        </label>
      </div>

      {message && (
        <p className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-5 rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      )}

      <button
        disabled={loading}
        className="mt-6 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Menyimpan..." : "Simpan Profile"}
      </button>
    </form>
  );
}
