"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  IDLE_LOGOUT_REASON,
  IDLE_TIMEOUT,
  IDLE_TIMEOUT_COOKIE_MAX_AGE,
  LAST_ACTIVITY_COOKIE,
  LAST_ACTIVITY_KEY,
} from "@/lib/idle-timeout";

const activityEvents = [
  "click",
  "keydown",
  "mousemove",
  "pointerdown",
  "scroll",
  "touchstart",
] as const;

function persistLastActivity(value: number) {
  window.localStorage.setItem(LAST_ACTIVITY_KEY, String(value));
  document.cookie = `${LAST_ACTIVITY_COOKIE}=${value}; path=/; max-age=${IDLE_TIMEOUT_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function clearLastActivity() {
  window.localStorage.removeItem(LAST_ACTIVITY_KEY);
  document.cookie = `${LAST_ACTIVITY_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function IdleLogoutGuard() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWriteRef = useRef(0);
  const signingOutRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const logoutForIdle = useCallback(async () => {
    if (signingOutRef.current) {
      return;
    }

    signingOutRef.current = true;
    clearTimer();
    clearLastActivity();
    await supabase.auth.signOut();
    router.replace(`/login?reason=${IDLE_LOGOUT_REASON}`);
    router.refresh();
  }, [clearTimer, router, supabase]);

  const scheduleIdleCheck = useCallback(() => {
    clearTimer();

    const storedValue = window.localStorage.getItem(LAST_ACTIVITY_KEY);
    const lastActivity = storedValue ? Number(storedValue) : Date.now();
    const elapsed = Date.now() - lastActivity;

    if (!Number.isFinite(lastActivity) || elapsed >= IDLE_TIMEOUT) {
      void logoutForIdle();
      return;
    }

    timeoutRef.current = setTimeout(() => {
      void logoutForIdle();
    }, IDLE_TIMEOUT - elapsed);
  }, [clearTimer, logoutForIdle]);

  const markActivity = useCallback(() => {
    const now = Date.now();

    if (now - lastWriteRef.current < 1000) {
      return;
    }

    lastWriteRef.current = now;
    persistLastActivity(now);
    scheduleIdleCheck();
  }, [scheduleIdleCheck]);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(LAST_ACTIVITY_KEY);

    if (!storedValue) {
      persistLastActivity(Date.now());
    }

    scheduleIdleCheck();

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, markActivity, { passive: true });
    });

    function handleVisibilityOrFocus() {
      scheduleIdleCheck();
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === LAST_ACTIVITY_KEY) {
        scheduleIdleCheck();
      }
    }

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      clearTimer();
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, markActivity);
      });
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, [clearTimer, markActivity, scheduleIdleCheck]);

  return null;
}
