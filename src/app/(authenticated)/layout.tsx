import { AuthenticatedNav } from "@/components/AuthenticatedNav";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await getAuthenticatedUser();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AuthenticatedNav />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
