"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { LAST_ACTIVITY_COOKIE, LAST_ACTIVITY_KEY } from "@/lib/idle-timeout";

type LogoutButtonProps = {
  compact?: boolean;
};

export function LogoutButton({ compact = false }: LogoutButtonProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    window.localStorage.removeItem(LAST_ACTIVITY_KEY);
    document.cookie = `${LAST_ACTIVITY_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={
        compact
          ? "rounded-lg border border-white/45 bg-[#fffaf0]/35 px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]/50 disabled:opacity-60 disabled:hover:translate-y-0"
          : "rounded-xl border border-white/45 bg-[#fffaf0]/35 px-5 py-3 font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]/50 disabled:opacity-60 disabled:hover:translate-y-0"
      }
    >
      {loading ? "Logout..." : "Logout"}
    </button>
  );
}
