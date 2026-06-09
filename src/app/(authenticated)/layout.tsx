import { AuthenticatedNav } from "@/components/AuthenticatedNav";
import { IdleLogoutGuard } from "@/components/IdleLogoutGuard";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await getAuthenticatedUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#cfd8c5] via-[#e1d6c8] to-[#c9d6d2] text-slate-800">
      <IdleLogoutGuard />
      <AuthenticatedNav />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
}
