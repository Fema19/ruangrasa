import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const startHref = "/register";

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
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-[#cfd8c5] via-[#e1d6c8] to-[#c9d6d2] text-slate-800">
      <section className="relative px-4 py-6 sm:px-6 sm:py-8 lg:px-16">
        <div className="absolute inset-0 -z-10 animate-slow-float bg-[radial-gradient(circle_at_20%_20%,rgba(255,250,240,0.24),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(34,94,84,0.12),transparent_28%),radial-gradient(circle_at_70%_78%,rgba(180,132,92,0.12),transparent_30%)]" />
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 py-2">
          <Link href="/" className="text-lg font-semibold tracking-wide">
            RuangRasa
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/login"
              className="rounded-full border border-white/45 bg-[#fffaf0]/35 px-4 py-2 text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]/50"
            >
              Masuk
            </Link>
            <Link
              href={startHref}
              className="rounded-full bg-gradient-to-r from-emerald-700 to-teal-600 px-4 py-2 font-semibold text-white shadow-lg shadow-emerald-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:opacity-90"
            >
              Mulai
            </Link>
          </div>
        </nav>

        <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-2xl animate-soft-fade-up">
            <div className="mb-5 inline-flex rounded-full border border-white/40 bg-[#fffaf0]/35 px-4 py-2 text-sm text-slate-700 backdrop-blur">
              Mental health journal dan mood tracker pribadi
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
              RuangRasa
            </h1>
            <p className="mt-5 max-w-xl text-xl font-semibold leading-snug text-slate-700 sm:text-2xl">
              Catat perasaanmu, pahami polanya, rawat dirimu pelan-pelan.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              RuangRasa membantumu menulis jurnal harian, melacak mood
              bulanan, dan melihat pola emosi tanpa menghakimi.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={startHref}
                className="rounded-full bg-gradient-to-r from-emerald-700 to-teal-600 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-emerald-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:opacity-90"
              >
                Mulai Menulis
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/45 bg-[#fffaf0]/35 px-6 py-3 text-center font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]/50"
              >
                Masuk
              </Link>
            </div>
          </div>

          <div className="relative animate-slow-float">
            <div className="rounded-2xl border border-white/35 bg-[#fffaf0]/45 p-4 shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-scale-in sm:rounded-3xl sm:p-6">
              <div className="flex items-center justify-between border-b border-white/35 pb-4">
                <div>
                  <p className="text-sm text-slate-500">Hari ini</p>
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
                    className="rounded-2xl border border-white/35 bg-[#fffaf0]/35 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]/45"
                  >
                    <p className="text-sm text-slate-600">{item}</p>
                    <div className="mt-4 h-2 rounded-full bg-gradient-to-r from-emerald-700 to-teal-600" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-sm text-slate-600">
                {Array.from({ length: 28 }, (_, index) => {
                  const moods = ["😊", "😐", "🌿", "😔", "", "😴", "😰"];
                  return (
                    <div
                      key={index}
                      className="flex aspect-square items-center justify-center rounded-xl border border-white/35 bg-[#fffaf0]/35 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03]"
                    >
                      {moods[index % moods.length] || index + 1}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-white/40 bg-[#fffaf0]/35 p-4 text-sm leading-6 text-slate-700">
                Kamu cukup konsisten menulis jurnal bulan ini. Ini bisa
                membantumu memahami pola perasaan dengan lebih baik.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/30 bg-[#fffaf0]/25 px-4 py-12 sm:px-6 sm:py-16 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-white/35 bg-[#fffaf0]/45 p-5 shadow-[0_20px_60px_rgba(71,85,105,0.14)] backdrop-blur-xl animate-soft-fade-up transition-all duration-300 hover:-translate-y-1 sm:rounded-3xl sm:p-6"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fffaf0]/25 px-6 py-10 text-center sm:px-10">
        <p className="mx-auto max-w-3xl text-sm leading-6 text-slate-400">
          RuangRasa bukan pengganti psikolog, psikiater, atau bantuan medis
          profesional. Aplikasi ini hanya membantu mencatat dan memahami pola
          perasaan pribadi.
        </p>
      </section>
    </main>
  );
}
