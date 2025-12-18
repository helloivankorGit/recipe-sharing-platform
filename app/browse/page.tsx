"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "../components/Header";
import { RecipeGrid } from "../components/RecipeGrid";
import { Recipe } from "../types/recipe";
import { getSupabaseClient } from "../../lib/supabaseClient";

export default function BrowseRecipesPage() {
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
        .select(`
          *,
          profiles!recipes_user_id_fkey(username, full_name)
        `)
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
              Browse Recipes
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Discover delicious recipes shared by our community of home cooks.
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
            No recipes have been shared yet. Be the first to share a delicious recipe with the community!
          </p>
        )}

        {!loading && !error && recipes.length > 0 && (
          <RecipeGrid recipes={recipes} showAuthor={true} />
        )}
      </main>
    </div>
  );
}


