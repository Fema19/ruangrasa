import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const startHref = user ? "/dashboard" : "/register";

  const features = [
    {
      title: "Jurnal Harian",
      body: "Tulis catatan pendek atau panjang tentang apa yang kamu rasakan hari ini.",
    },
    {
      title: "Mood Tracker",
      body: "Lihat mood harianmu dalam tampilan bulanan yang mudah dipindai.",
    },
    {
      title: "Insight Bulanan",
      body: "Temukan pola sederhana dari jurnalmu tanpa bahasa yang menghakimi.",
    },
    {
      title: "Privasi Terjaga",
      body: "Data journal milikmu dibatasi oleh akun dan RLS Supabase.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <section className="relative px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(129,140,248,0.34),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(244,114,182,0.22),transparent_28%),linear-gradient(135deg,#020617_0%,#111827_48%,#312e81_100%)]" />
        <nav className="mx-auto flex max-w-6xl items-center justify-between py-2">
          <Link href="/" className="text-lg font-semibold tracking-wide">
            RuangRasa
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/login"
              className="rounded-full border border-white/15 px-4 py-2 text-slate-200 transition hover:border-white/30 hover:text-white"
            >
              Masuk
            </Link>
            <Link
              href={startHref}
              className="rounded-full bg-white px-4 py-2 font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Mulai
            </Link>
          </div>
        </nav>

        <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-12 py-14 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
              Mental health journal dan mood tracker pribadi
            </div>
            <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              RuangRasa
            </h1>
            <p className="mt-5 max-w-xl text-2xl font-semibold leading-snug text-slate-100">
              Catat perasaanmu, pahami polanya, rawat dirimu pelan-pelan.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              RuangRasa membantumu menulis jurnal harian, melacak mood
              bulanan, dan melihat pola emosi tanpa menghakimi.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={startHref}
                className="rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:scale-[1.01]"
              >
                Mulai Menulis
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/15 px-6 py-3 text-center font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/5"
              >
                Masuk
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/15 bg-white/8 p-5 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-slate-300">Hari ini</p>
                  <p className="mt-1 text-xl font-semibold">Tenang</p>
                </div>
                <div className="text-5xl" aria-hidden="true">
                  🌿
                </div>
              </div>

              <div className="grid gap-4 py-5 sm:grid-cols-3">
                {["7 jurnal", "Mood stabil", "Intensity 5.8"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"
                  >
                    <p className="text-sm text-slate-300">{item}</p>
                    <div className="mt-4 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-pink-300" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-sm text-slate-300">
                {Array.from({ length: 28 }, (_, index) => {
                  const moods = ["😊", "😐", "🌿", "😔", "", "😴", "😰"];
                  return (
                    <div
                      key={index}
                      className="flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-white/5"
                    >
                      {moods[index % moods.length] || index + 1}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-pink-200/15 bg-pink-200/10 p-4 text-sm leading-6 text-pink-50">
                Kamu cukup konsisten menulis jurnal bulan ini. Ini bisa
                membantumu memahami pola perasaan dengan lebih baik.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950 px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20"
            >
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-10 text-center sm:px-10">
        <p className="mx-auto max-w-3xl text-sm leading-6 text-slate-400">
          RuangRasa bukan pengganti psikolog, psikiater, atau bantuan medis
          profesional. Aplikasi ini hanya membantu mencatat dan memahami pola
          perasaan pribadi.
        </p>
      </section>
    </main>
  );
}
