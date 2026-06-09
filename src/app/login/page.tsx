import { redirect } from "next/navigation";
import { LoginForm } from "@/app/login/login-form";
import { BackButton } from "@/components/BackButton";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { IDLE_LOGOUT_REASON } from "@/lib/idle-timeout";

type LoginPageProps = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const sessionMessage =
    params.reason === IDLE_LOGOUT_REASON
      ? "Sesi kamu berakhir karena tidak ada aktivitas selama 15 menit. Silakan login kembali."
      : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#cfd8c5] via-[#e1d6c8] to-[#c9d6d2] px-4 py-6 text-slate-800 sm:py-12">
      <div className="w-full max-w-md space-y-4 animate-soft-fade-up">
        <BackButton />
        <LoginForm sessionMessage={sessionMessage} />
      </div>
    </main>
  );
}
