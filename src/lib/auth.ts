import { redirect } from "next/navigation";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const loginRedirect = "/login";

export const getAuthenticatedUser = cache(async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(loginRedirect);
  }

  return { supabase, user };
});
