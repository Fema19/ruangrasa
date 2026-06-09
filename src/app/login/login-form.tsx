"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  IDLE_TIMEOUT_COOKIE_MAX_AGE,
  LAST_ACTIVITY_COOKIE,
  LAST_ACTIVITY_KEY,
} from "@/lib/idle-timeout";

type LoginFormProps = {
  sessionMessage?: string;
};

export function LoginForm({ sessionMessage = "" }: LoginFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("Email atau password belum tepat. Coba periksa lagi ya.");
      setLoading(false);
      return;
    }

    const now = Date.now();
    window.localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
    document.cookie = `${LAST_ACTIVITY_COOKIE}=${now}; path=/; max-age=${IDLE_TIMEOUT_COOKIE_MAX_AGE}; SameSite=Lax`;
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleLogin}
      className="w-full rounded-2xl border border-white/35 bg-[#fffaf0]/45 p-6 shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-scale-in sm:rounded-3xl sm:p-8"
    >
      <Link href="/" className="text-sm font-semibold text-emerald-800">
        RuangRasa
      </Link>
      <h1 className="mt-5 text-3xl font-bold">Masuk</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Lanjutkan mencatat perasaan dan pola mood-mu.
      </p>

      {sessionMessage && (
        <p className="mt-5 rounded-xl border border-white/40 bg-[#fffaf0]/35 px-4 py-3 text-sm leading-6 text-amber-900">
          {sessionMessage}
        </p>
      )}

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            className="mt-2 w-full rounded-xl border border-white/45 bg-[#fffaf0]/35 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 focus:bg-[#fffaf0]/50"
            placeholder="nama@email.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            className="mt-2 w-full rounded-xl border border-white/45 bg-[#fffaf0]/35 px-4 py-3 text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 focus:bg-[#fffaf0]/50"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error && (
          <p className="rounded-xl border border-white/40 bg-[#fffaf0]/35 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100"
        >
          {loading ? "Masuk..." : "Login"}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-emerald-800">
          Register
        </Link>
      </p>
    </form>
  );
}
