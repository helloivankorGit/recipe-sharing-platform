"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { getSupabaseClient } from "../../lib/supabaseClient";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

type DifficultyOption = "easy" | "medium" | "hard" | "";

export default function CreateRecipePage() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyOption>("");
  const [category, setCategory] = useState("");

  const addIngredientField = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredientField = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  useEffect(() => {
    const supabase = getSupabaseClient();

    async function init() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      // Ensure there is a corresponding profile row for this user
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!existingProfile) {
        const username =
          user.email && user.email.includes("@")
            ? user.email.split("@")[0]
            : null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: insertProfileError } = await (supabase as any)
          .from("profiles")
          .insert({
            id: user.id,
            username,
            email: user.email ?? null,
          });

        if (insertProfileError) {
          setError(
            "Could not create your profile. Please try again or contact support."
          );
          setInitializing(false);
          return;
        }
      } else if (profileError) {
        setError(
          "Could not load your profile. Please refresh the page and try again."
        );
        setInitializing(false);
        return;
      }

      setUserId(user.id);
      setInitializing(false);
    }

    init();
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setSubmitting(true);
    setError(null);

    const supabase = getSupabaseClient();
    const cookingTimeValue =
      cookingTime.trim() === "" ? null : Number.parseInt(cookingTime, 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any)
      .from("recipes")
      .insert({
        user_id: userId,
        title: title.trim(),
        description: description.trim() || null,
        ingredients: JSON.stringify(ingredients.filter(ingredient => ingredient.trim() !== "")),
        instructions: instructions.trim(),
        cooking_time: Number.isNaN(cookingTimeValue) ? null : cookingTimeValue,
        difficulty: difficulty || null,
        category: category.trim() || null,
      });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    router.push("/browse");
  }

  if (initializing) {
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

      <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-3xl flex-col gap-8 px-4 py-10 sm:px-8 sm:py-14">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Create a recipe
          </h1>
          <p className="text-sm text-zinc-600">
            Add a simple recipe with ingredients and instructions. You can
            refine the structure later.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-800"
            >
              Title
            </label>
            <input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-800"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label
                htmlFor="cooking_time"
                className="block text-sm font-medium text-zinc-800"
              >
                Cooking time (min)
              </label>
              <input
                id="cooking_time"
                type="number"
                min={0}
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-zinc-800"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyOption)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-900"
              >
                <option value="">Select</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-zinc-800"
              >
                Category (optional)
              </label>
              <input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Pasta, Dessert"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-800">
              Ingredients
            </label>
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    required={index === 0}
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={index === 0 ? "Enter your first ingredient" : "Enter ingredient"}
                    className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeIngredientField(index)}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-red-300 bg-white text-red-600 shadow-sm transition hover:bg-red-50"
                      title="Remove ingredient"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredientField}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm transition hover:bg-zinc-50"
              >
                + Add ingredient
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="instructions"
              className="block text-sm font-medium text-zinc-800"
            >
              Instructions
            </label>
            <textarea
              id="instructions"
              required
              rows={6}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Write clear step-by-step instructions."
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900"
            />
          </div>

          {error && (
            <p className="text-sm text-red-700">
              Something went wrong saving your recipe: {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Saving..." : "Save recipe"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}


