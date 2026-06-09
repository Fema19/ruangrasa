import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  IDLE_LOGOUT_REASON,
  IDLE_TIMEOUT,
  LAST_ACTIVITY_COOKIE,
} from "@/lib/idle-timeout";

const protectedRoutes = ["/dashboard", "/journals", "/mood-tracker", "/profile"];
const authRoutes = ["/login", "/register"];

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  let cookiesToApply: { name: string; value: string; options: CookieOptions }[] =
    [];
  let headersToApply: Record<string, string> = {};

  function applySupabaseCookies(nextResponse: NextResponse) {
    cookiesToApply.forEach(({ name, value, options }) => {
      nextResponse.cookies.set(name, value, options);
    });

    Object.entries(headersToApply).forEach(([key, value]) => {
      nextResponse.headers.set(key, value);
    });

    return nextResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToApply = cookiesToSet;
          headersToApply = headers;

          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });
          applySupabaseCookies(response);
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = matchesRoute(pathname, protectedRoutes);

  if (isProtectedRoute && user) {
    const lastActivity = Number(
      request.cookies.get(LAST_ACTIVITY_COOKIE)?.value
    );

    if (
      Number.isFinite(lastActivity) &&
      Date.now() - lastActivity >= IDLE_TIMEOUT
    ) {
      await supabase.auth.signOut();

      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.search = "";
      redirectUrl.searchParams.set("reason", IDLE_LOGOUT_REASON);
      const redirectResponse = applySupabaseCookies(
        NextResponse.redirect(redirectUrl)
      );
      redirectResponse.cookies.set(LAST_ACTIVITY_COOKIE, "", {
        maxAge: 0,
        path: "/",
      });
      return redirectResponse;
    }
  }

  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return applySupabaseCookies(NextResponse.redirect(redirectUrl));
  }

  if (matchesRoute(pathname, authRoutes) && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return applySupabaseCookies(NextResponse.redirect(redirectUrl));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
