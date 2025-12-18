"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "../components/Header";
import { RecipeGrid } from "../components/RecipeGrid";
import { RecipeToolbar } from "../components/RecipeToolbar";
import { Recipe } from "../types/recipe";
import { getSupabaseClient } from "../../lib/supabaseClient";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function BrowseRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

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
      } else if (data) {
        // Process the data to include like counts and user like status
        const recipesWithLikes = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map(async (recipe: any) => {
            // Get total like count
            const { count: likeCount } = await supabase
              .from("recipe_likes")
              .select("*", { count: "exact", head: true })
              .eq("recipe_id", recipe.id);

            // Check if current user liked this recipe
            const { data: userLike } = await supabase
              .from("recipe_likes")
              .select("id")
              .eq("recipe_id", recipe.id)
              .eq("user_id", user.id)
              .maybeSingle();

            return {
              ...recipe,
              likes_count: likeCount || 0,
              is_liked_by_user: !!userLike,
            } as Recipe;
          })
        );

        setRecipes(recipesWithLikes);
      }

      setLoading(false);
    }

    load();
  }, []);

  // Get unique categories from recipes
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    recipes.forEach(recipe => {
      if (recipe.category && recipe.category.trim()) {
        uniqueCategories.add(recipe.category.trim());
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [recipes]);

  // Filter recipes based on search and filters
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // Search filter
      const matchesSearch = !searchQuery || 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.category?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = !selectedCategory || recipe.category === selectedCategory;

      // Difficulty filter
      const matchesDifficulty = !selectedDifficulty || 
        (recipe.difficulty && recipe.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [recipes, searchQuery, selectedCategory, selectedDifficulty]);

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
          <>
            <RecipeToolbar
              onSearch={setSearchQuery}
              onCategoryFilter={setSelectedCategory}
              onDifficultyFilter={setSelectedDifficulty}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedDifficulty={selectedDifficulty}
              categories={categories}
            />

            {filteredRecipes.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-600">
                    Showing {filteredRecipes.length} of {recipes.length} recipes
                  </p>
                </div>
                <RecipeGrid recipes={filteredRecipes} showAuthor={true} />
              </>
            ) : (
              <p className="text-sm text-zinc-600">
                No recipes match your current filters. Try adjusting your search or filter criteria.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}


