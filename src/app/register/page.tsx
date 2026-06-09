"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function RegisterPage() {
  const supabase = createSupabaseBrowserClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Register berhasil. Cek email untuk konfirmasi jika diminta.");
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold">Buat akun</h1>
        <p className="mt-2 text-sm text-slate-300">
          Mulai catat mood dan jurnal harianmu.
        </p>

        <div className="mt-6 space-y-4">
          <input
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none"
            placeholder="Nama lengkap"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none"
            placeholder="Password"
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-lg bg-white px-4 py-3 font-semibold text-slate-950 disabled:opacity-60"
          >
            {loading ? "Membuat akun..." : "Register"}
          </button>

          {message && <p className="text-sm text-slate-300">{message}</p>}
        </div>
      </form>
    </main>
  );
}