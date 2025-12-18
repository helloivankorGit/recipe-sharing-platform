"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "../../components/Header";
import { getSupabaseClient } from "../../../lib/supabaseClient";
import { Database } from "../../../lib/database.types";

type Recipe = Database['public']['Tables']['recipes']['Row'];

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

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
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", params.id as string)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setRecipe(data as Recipe);
        setIsOwner(data.user_id === user.id);
      }

      setLoading(false);
    }

    if (params.id) {
      load();
    }
  }, [params.id, router]);

  // Parse ingredients from string to array
  const getIngredients = () => {
    if (!recipe?.ingredients) return [];
    try {
      // Try to parse as JSON array first
      const parsed = JSON.parse(recipe.ingredients);
      return Array.isArray(parsed) ? parsed : [recipe.ingredients];
    } catch {
      // If not JSON, treat as plain text and split by lines
      return recipe.ingredients.split('\n').filter(line => line.trim() !== '');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-4xl flex-col gap-8 px-4 py-10 sm:px-8 sm:py-14">
          <p className="text-sm text-zinc-600">Loading recipe...</p>
        </main>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-4xl flex-col gap-8 px-4 py-10 sm:px-8 sm:py-14">
          <div className="text-center">
            <p className="text-sm text-red-700 mb-4">
              {error || "Recipe not found"}
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
            >
              Back to Browse
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-4xl flex-col gap-8 px-4 py-10 sm:px-8 sm:py-14">
        {/* Header with back button */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">          <Link
            href="/browse"
            className="inline-flex items-center justify-center rounded-full bg-zinc-100 p-2 text-zinc-600 hover:bg-zinc-200 transition-colors"
          >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              {recipe.title}
            </h1>
          </div>
          
          {isOwner && (
            <Link
              href={`/recipes/${recipe.id}/edit`}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Recipe
            </Link>
          )}
        </header>

        {/* Recipe content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Description */}
            {recipe.description && (
              <section className="mb-8">
                <p className="text-zinc-700 leading-relaxed">
                  {recipe.description}
                </p>
              </section>
            )}

            {/* Ingredients */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">
                Ingredients
              </h2>
              <ul className="space-y-2">
                {getIngredients().map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-zinc-700"
                  >
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-zinc-400 mt-2 shrink-0"></span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Instructions */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">
                Instructions
              </h2>
              <div className="prose prose-zinc max-w-none">
                <div className="whitespace-pre-wrap text-zinc-700 leading-relaxed">
                  {recipe.instructions}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sticky top-8">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                Recipe Info
              </h3>
              
              <div className="space-y-4">
                {recipe.cooking_time != null && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg">⏰</span>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">Cooking Time</p>
                      <p className="text-xs text-zinc-600">{recipe.cooking_time} minutes</p>
                    </div>
                  </div>
                )}

                {recipe.difficulty && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📊</span>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">Difficulty</p>
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 mt-1">
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>
                )}

                {recipe.category && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🏷️</span>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">Category</p>
                      <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 mt-1">
                        {recipe.category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-lg">📅</span>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">Created</p>
                    <p className="text-xs text-zinc-600">
                      {new Date(recipe.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
