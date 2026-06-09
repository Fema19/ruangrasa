"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function LoginForm() {
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

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-950/30 backdrop-blur"
    >
      <Link href="/" className="text-sm font-semibold text-violet-200">
        RuangRasa
      </Link>
      <h1 className="mt-5 text-3xl font-bold">Masuk</h1>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Lanjutkan mencatat perasaan dan pola mood-mu.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-200">Email</span>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300"
            placeholder="nama@email.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-200">Password</span>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error && (
          <p className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Masuk..." : "Login"}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-slate-300">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-violet-200">
          Register
        </Link>
      </p>
    </form>
  );
}
