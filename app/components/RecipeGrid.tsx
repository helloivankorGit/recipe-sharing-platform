import Link from "next/link";
import { Recipe } from "../types/recipe";
import { LikeCount } from "./LikeCount";
import { LikeButton } from "./LikeButton";

type RecipeGridProps = {
  recipes: Recipe[];
  showAuthor?: boolean;
  showEditButton?: boolean;
  onRecipeUnsaved?: (recipeId: string) => void;
};

export function RecipeGrid({ 
  recipes, 
  showAuthor = false, 
  showEditButton = false,
  onRecipeUnsaved 
}: RecipeGridProps) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <article
          key={recipe.id}
          className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-zinc-900 mb-1">
              {recipe.title}
            </h2>
            {showAuthor && (
              <p className="text-xs text-zinc-500">
                by {recipe.profiles?.full_name || recipe.profiles?.username || "Anonymous"}
              </p>
            )}
          </div>
          {recipe.description && (
            <p className="mt-1 line-clamp-3 text-sm text-zinc-600 mb-4">
              {recipe.description}
            </p>
          )}
          <div className="mt-auto">                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-4">
                    {recipe.cooking_time != null && (
                      <span className="flex items-center gap-1">
                        ⏰ {recipe.cooking_time} min
                      </span>
                    )}
                    {recipe.difficulty && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        {recipe.difficulty}
                      </span>
                    )}
                    {recipe.category && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        {recipe.category}
                      </span>
                    )}
                    {onRecipeUnsaved ? (
                      <LikeButton
                        recipeId={recipe.id}
                        initialLikeCount={recipe.likes_count || 0}
                        initialIsLiked={recipe.is_liked_by_user || false}
                        onLikeChange={(newCount, isLiked) => {
                          if (!isLiked) {
                            onRecipeUnsaved(recipe.id);
                          }
                        }}
                      />
                    ) : (
                      <LikeCount likeCount={recipe.likes_count || 0} />
                    )}
                  </div>
            {showEditButton ? (
              <div className="flex gap-2">
                <Link 
                  href={`/recipes/${recipe.id}`}
                  className="flex-1 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-colors text-center"
                >
                  View Recipe
                </Link>
                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  Edit
                </Link>
              </div>
            ) : (
              <Link 
                href={`/recipes/${recipe.id}`}
                className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-colors text-center"
              >
                View Recipe
              </Link>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
