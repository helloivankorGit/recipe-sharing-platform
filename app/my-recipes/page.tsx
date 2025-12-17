"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "../components/Header";
import { getSupabaseClient } from "../../lib/supabaseClient";

type Recipe = {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: string;
  instructions: string;
  cooking_time: number | null;
  difficulty: string | null;
  category: string | null;
};

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    async function load() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        // Not logged in; send to login.
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .neq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setRecipes(data || []);
      }

      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-5xl flex-col gap-8 px-4 py-10 sm:px-8 sm:py-14">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Recipes shared by other cooks on the platform.
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
          >
            New recipe
          </Link>
        </header>

        {loading && (
          <p className="text-sm text-zinc-600">Loading recipes...</p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-700">
            Something went wrong loading recipes: {error}
          </p>
        )}

        {!loading && !error && recipes.length === 0 && (
          <p className="text-sm text-zinc-600">
            No recipes from other users yet. Once people start sharing, you&apos;ll
            see them here.
          </p>
        )}

        {!loading && !error && recipes.length > 0 && (
          <section className="grid gap-4 sm:grid-cols-2">
            {recipes.map((recipe) => (
              <article
                key={recipe.id}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <h2 className="text-sm font-semibold text-zinc-900">
                  {recipe.title}
                </h2>
                {recipe.description && (
                  <p className="mt-1 line-clamp-3 text-xs text-zinc-600">
                    {recipe.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                  {recipe.cooking_time != null && (
                    <span>{recipe.cooking_time} min</span>
                  )}
                  {recipe.difficulty && (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
                      {recipe.difficulty}
                    </span>
                  )}
                  {recipe.category && (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
                      {recipe.category}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}


