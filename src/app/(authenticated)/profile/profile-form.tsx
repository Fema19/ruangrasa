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
      className="rounded-2xl border border-white/35 bg-[#fffaf0]/45 p-4 shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-scale-in sm:rounded-3xl sm:p-6"
    >
      <div className="grid gap-5">
        <label>
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            value={email}
            disabled
            className="mt-3 w-full rounded-xl border border-white/45 bg-[#f4efe4]/45 px-4 py-3 text-slate-500 outline-none"
          />
        </label>

        <label>
          <span className="text-sm font-medium text-slate-700">Full name</span>
          <input
            value={nameValue}
            onChange={(event) => setNameValue(event.target.value)}
            placeholder="Nama lengkap"
            className="mt-3 w-full rounded-xl border border-white/45 bg-[#fffaf0]/35 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 focus:bg-[#fffaf0]/50"
          />
        </label>

        <label>
          <span className="text-sm font-medium text-slate-700">Username</span>
          <input
            value={usernameValue}
            onChange={(event) => setUsernameValue(event.target.value)}
            placeholder="username"
            className="mt-3 w-full rounded-xl border border-white/45 bg-[#fffaf0]/35 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 focus:bg-[#fffaf0]/50"
          />
        </label>
      </div>

      {message && (
        <p className="mt-5 rounded-xl border border-white/40 bg-[#fffaf0]/35 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-5 rounded-xl border border-white/40 bg-[#fffaf0]/35 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      )}

      <button
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100 sm:w-auto"
      >
        {loading ? "Menyimpan..." : "Simpan Profile"}
      </button>
    </form>
  );
}
