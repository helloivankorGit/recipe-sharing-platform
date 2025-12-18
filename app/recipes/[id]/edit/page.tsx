"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "../../../components/Header";
import { getSupabaseClient } from "../../../../lib/supabaseClient";
import { Database } from "../../../../lib/database.types";

type Recipe = Database['public']['Tables']['recipes']['Row'];

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]); 
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState<number | "">("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("recipes")
        .select("*")
        .eq("id", params.id as string)
        .single();

      if (error) {
        setError(error.message);
      } else if (!data) {
        setError("Recipe not found");
      } else if (data.user_id !== user.id) {
        // Not the owner, redirect to recipe detail
        router.push(`/recipes/${params.id}`);
        return;
      } else {
        const recipeData = data as Recipe;
        setRecipe(recipeData);
        // Populate form with existing data
        setTitle(recipeData.title);
        setDescription(recipeData.description || "");
        setInstructions(recipeData.instructions);
        setCookingTime(recipeData.cooking_time || "");
        setDifficulty(recipeData.difficulty || "");
        setCategory(recipeData.category || "");

        // Parse ingredients
        try {
          const parsed = JSON.parse(recipeData.ingredients);
          setIngredients(Array.isArray(parsed) ? parsed : [recipeData.ingredients]);
        } catch {
          // If not JSON, treat as plain text and split by lines
          const ingredientLines = recipeData.ingredients.split('\n').filter((line: string) => line.trim() !== '');
          setIngredients(ingredientLines.length > 0 ? ingredientLines : [""]);
        }
      }

      setLoading(false);
    }

    if (params.id) {
      load();
    }
  }, [params.id, router]);

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipe) return;

    setSubmitting(true);
    setError(null);

    const supabase = getSupabaseClient();

    const filteredIngredients = ingredients.filter(ing => ing.trim() !== "");
    
    const updateData: Database['public']['Tables']['recipes']['Update'] = {
      title,
      description: description || null,
      ingredients: JSON.stringify(filteredIngredients),
      instructions,
      cooking_time: cookingTime === "" ? null : Number(cookingTime),
      difficulty: difficulty || null,
      category: category || null,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("recipes")
      .update(updateData)
      .eq("id", recipe.id);

    if (error) {
      setError(error.message);
    } else {
      router.push(`/recipes/${recipe.id}`);
    }

    setSubmitting(false);
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
              {error || "Recipe not found or you don't have permission to edit it"}
            </p>
            <Link
              href="/my-recipes"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
            >
              Back to My Recipes
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
        {/* Header */}
        <header className="flex items-center gap-4">
          <Link
            href={`/recipes/${recipe.id}`}
            className="inline-flex items-center justify-center rounded-full bg-zinc-100 p-2 text-zinc-600 hover:bg-zinc-200 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Edit Recipe
          </h1>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Recipe Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-zinc-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-zinc-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  placeholder="Brief description of your recipe..."
                />
              </div>

              <div>
                <label htmlFor="cookingTime" className="block text-sm font-medium text-zinc-700 mb-1">
                  Cooking Time (minutes)
                </label>
                <input
                  type="number"
                  id="cookingTime"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value === "" ? "" : parseInt(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  min="1"
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-zinc-700 mb-1">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="category" className="block text-sm font-medium text-zinc-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  placeholder="e.g., Breakfast, Dinner, Dessert..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900">
                Ingredients *
              </h2>
              <button
                type="button"
                onClick={addIngredient}
                className="inline-flex items-center justify-center rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 transition-colors"
              >
                + Add Ingredient
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                    placeholder={`Ingredient ${index + 1}`}
                    required={index === 0}
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Instructions *
            </h2>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={8}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="Step-by-step cooking instructions..."
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-4 justify-end">
            <Link
              href={`/recipes/${recipe.id}`}
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Update Recipe"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
