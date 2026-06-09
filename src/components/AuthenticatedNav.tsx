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
    <header className="sticky top-0 z-20 border-b border-white/35 bg-[#fffaf0]/35 shadow-[0_12px_36px_rgba(71,85,105,0.12)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="text-lg font-semibold text-slate-800"
          >
            RuangRasa
          </Link>
          <div className="hidden sm:block">
            <LogoutButton compact />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 whitespace-nowrap">
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
                    ? "shrink-0 rounded-xl bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition-all duration-300"
                    : "shrink-0 rounded-xl border border-white/45 bg-[#fffaf0]/35 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fffaf0]/50 hover:text-emerald-800"
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
