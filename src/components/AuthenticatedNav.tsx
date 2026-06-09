"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/journals", label: "Journals" },
  { href: "/mood-tracker", label: "Mood Tracker" },
  { href: "/profile", label: "Profile" },
];

export function AuthenticatedNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard" className="text-lg font-semibold text-white">
            RuangRasa
          </Link>
          <div className="hidden sm:block">
            <LogoutButton compact />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                    : "shrink-0 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-white/25 hover:bg-white/5 hover:text-white"
                }
              >
                {item.label}
              </Link>
            );
          })}
          <div className="sm:hidden">
            <LogoutButton compact />
          </div>
        </div>
      </nav>
    </header>
  );
}
