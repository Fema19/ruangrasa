"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/")}
      className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-[#fffaf0]/35 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]/50"
    >
      <span aria-hidden="true">←</span>
      <span>Kembali</span>
    </button>
  );
}
