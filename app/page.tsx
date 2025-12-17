"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "./components/Header";
import { getSupabaseClient } from "../lib/supabaseClient";

export default function Home() {
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        window.location.href = "/my-recipes";
      } else {
        setCheckingAuth(false);
      }
    });
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-5xl items-center justify-center px-4 py-10 sm:px-8 sm:py-14">
          <p className="text-sm text-zinc-500">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-5xl items-center justify-center px-4 py-10 sm:px-8 sm:py-14">
        {/* Intro + CTA */}
        <section className="mx-auto flex max-w-2xl flex-col items-center space-y-5 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Recipe Sharing Platform
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Share recipes you love.
            <span className="block text-zinc-600">
              Keep your favorites in one simple place.
            </span>
          </h1>
          <p className="text-base leading-relaxed text-zinc-600">
            Publish your own recipes with structured ingredients and clear
            steps, then browse and save dishes from other home cooks. We&apos;ll
            handle the organization so you can focus on cooking.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
            >
              Start sharing
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
