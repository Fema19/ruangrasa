"use client";

import { useState } from "react";
import { BackButton } from "@/components/BackButton";
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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#cfd8c5] via-[#e1d6c8] to-[#c9d6d2] px-4 py-6 text-slate-800 sm:py-12">
      <div className="w-full max-w-md space-y-4 animate-soft-fade-up">
        <BackButton />
        <form
          onSubmit={handleRegister}
          className="w-full rounded-2xl border border-white/35 bg-[#fffaf0]/45 p-6 shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-scale-in sm:rounded-3xl sm:p-8"
        >
          <h1 className="text-3xl font-bold">Buat akun</h1>
          <p className="mt-2 text-sm text-slate-600">
            Mulai catat mood dan jurnal harianmu.
          </p>

          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-lg border border-white/45 bg-[#fffaf0]/35 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 focus:bg-[#fffaf0]/50"
              placeholder="Nama lengkap"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              className="w-full rounded-lg border border-white/45 bg-[#fffaf0]/35 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 focus:bg-[#fffaf0]/50"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="w-full rounded-lg border border-white/45 bg-[#fffaf0]/35 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 focus:bg-[#fffaf0]/50"
              placeholder="Password"
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-emerald-700 to-teal-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:opacity-90 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100"
            >
              {loading ? "Membuat akun..." : "Register"}
            </button>

            {message && <p className="text-sm text-slate-600">{message}</p>}
          </div>
        </form>
      </div>
    </main>
  );
}
