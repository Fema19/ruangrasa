import { getAuthenticatedUser } from "@/lib/auth";
import { ProfileForm } from "@/app/(authenticated)/profile/profile-form";

export default async function ProfilePage() {
  const { supabase, user } = await getAuthenticatedUser();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, username")
    .eq("id", user.id)
    .maybeSingle();

  const profile = data as
    | { full_name: string | null; username: string | null }
    | null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-violet-200">Profile</p>
        <h1 className="mt-2 text-3xl font-bold">Data akun</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Update nama dan username yang dipakai di RuangRasa.
        </p>
      </div>

      <ProfileForm
        userId={user.id}
        email={user.email ?? ""}
        fullName={profile?.full_name ?? ""}
        username={profile?.username ?? ""}
      />
    </div>
  );
}
