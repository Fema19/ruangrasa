"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type LogoutButtonProps = {
  compact?: boolean;
};

export function LogoutButton({ compact = false }: LogoutButtonProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
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
          ? "rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/5 disabled:opacity-60"
          : "rounded-xl border border-white/10 px-5 py-3 font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/5 disabled:opacity-60"
      }
    >
      {loading ? "Logout..." : "Logout"}
    </button>
  );
}
