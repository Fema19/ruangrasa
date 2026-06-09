import { redirect } from "next/navigation";
import { LoginForm } from "@/app/login/login-form";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(129,140,248,0.34),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(244,114,182,0.2),transparent_28%),linear-gradient(135deg,#020617_0%,#111827_50%,#312e81_100%)] px-4 py-12 text-white">
      <LoginForm />
    </main>
  );
}
