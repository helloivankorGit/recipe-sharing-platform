"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "../components/Header";
import { RecipeGrid } from "../components/RecipeGrid";
import { Recipe } from "../types/recipe";
import { getSupabaseClient } from "../../lib/supabaseClient";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function SavedRecipesPage() {
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

      // Get recipes that the user has liked
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("recipe_likes")
        .select(`
          recipes!recipe_likes_recipe_id_fkey(
            *,
            profiles!recipes_user_id_fkey(username, full_name)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else if (data) {
        // Process the data to get the recipes with like information
        const savedRecipes = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map(async (like: any) => {
            const recipe = like.recipes;
            
            // Get total like count for this recipe
            const { count: likeCount } = await supabase
              .from("recipe_likes")
              .select("*", { count: "exact", head: true })
              .eq("recipe_id", recipe.id);

            return {
              ...recipe,
              likes_count: likeCount || 0,
              is_liked_by_user: true, // Always true since these are saved recipes
            } as Recipe;
          })
        );

        setRecipes(savedRecipes);
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
              Saved Recipes
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              All the recipes you&apos;ve liked and want to keep for later.
            </p>
          </div>
          <Link
            href="/browse"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
          >
            Browse More
          </Link>
        </header>

        {loading && (
          <p className="text-sm text-zinc-600">Loading saved recipes...</p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-700">
            Something went wrong loading your saved recipes: {error}
          </p>
        )}

        {!loading && !error && recipes.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <span className="text-6xl">🤍</span>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">
              No saved recipes yet
            </h3>
            <p className="text-sm text-zinc-600 mb-6">
              Start exploring recipes and save the ones you love by clicking the heart button.
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
            >
              Discover Recipes
            </Link>
          </div>
        )}

        {!loading && !error && recipes.length > 0 && (
          <RecipeGrid 
            recipes={recipes} 
            showAuthor={true}
            onRecipeUnsaved={(recipeId) => {
              // Remove the recipe from the list when it's unliked
              setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
            }}
          />
        )}
      </main>
    </div>
  );
}
