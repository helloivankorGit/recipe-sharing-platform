import Image from "next/image";
import Link from "next/link";
import { Header } from "./components/Header";

const MOCK_RECIPES = [
  {
    id: "1",
    title: "One-Pot Creamy Tomato Pasta",
    description: "A weeknight-friendly pasta with a rich, silky tomato sauce.",
    time: "25 min",
    difficulty: "Easy",
    image: "/window.svg",
  },
  {
    id: "2",
    title: "Roasted Veggie Grain Bowl",
    description: "Colorful roasted vegetables over a lemony quinoa base.",
    time: "40 min",
    difficulty: "Medium",
    image: "/globe.svg",
  },
  {
    id: "3",
    title: "Cardamom Banana Bread",
    description: "Moist banana bread with warm spices and a crisp top.",
    time: "55 min",
    difficulty: "Easy",
    image: "/file.svg",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-5xl flex-col gap-16 px-4 py-10 sm:px-8 sm:py-14">
        {/* Intro + CTA */}
        <section className="max-w-2xl space-y-5">
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
            Publish your own recipes with structured ingredients and clear steps,
            then browse and save dishes from other home cooks. We&apos;ll handle
            the organization so you can focus on cooking.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/create"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
            >
              Start sharing
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-800 hover:border-zinc-300 hover:bg-white"
            >
              Explore featured recipes
            </Link>
          </div>
        </section>

        {/* Featured recipes (placeholder) */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 text-center">
            Featured recipes
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_RECIPES.map((recipe) => (
              <article
                key={recipe.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-32 w-full bg-zinc-100">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-contain p-4 opacity-80 group-hover:opacity-100"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 px-3.5 py-3">
                  <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900">
                    {recipe.title}
                  </h3>
                  <p className="line-clamp-3 text-xs text-zinc-600">
                    {recipe.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-2 text-[11px] text-zinc-500">
                    <span>{recipe.time}</span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
