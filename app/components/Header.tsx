"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "../../lib/supabaseClient";

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    // Initial check
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        // "Auth session missing!" just means there is no active session.
        if (error.message === "Auth session missing!") {
          setIsAuthenticated(false);
          return;
        }

        console.error("Error getting user", error.message);
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(!!data.user);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
        <Link
          href={isAuthenticated ? "/browse" : "/"}
          className="flex items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900">
            <span className="text-sm font-semibold text-zinc-50">R</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                href="/browse"
                className="rounded-full px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Browse
              </Link>
              <Link
                href="/my-recipes"
                className="rounded-full px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
              >
                My Recipes
              </Link>
              <Link
                href="/profile"
                className="rounded-full px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-50 shadow-sm hover:bg-zinc-800"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-50 shadow-sm hover:bg-zinc-800"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}



