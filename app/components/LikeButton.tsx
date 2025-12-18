"use client";

import { useState } from "react";
import { getSupabaseClient } from "../../lib/supabaseClient";

interface LikeButtonProps {
  recipeId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  onLikeChange?: (newCount: number, isLiked: boolean) => void;
}

export function LikeButton({ 
  recipeId, 
  initialLikeCount, 
  initialIsLiked, 
  onLikeChange 
}: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const supabase = getSupabaseClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = "/login";
        return;
      }

      if (isLiked) {
        // Remove like
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from("recipe_likes")
          .delete()
          .eq("recipe_id", recipeId)
          .eq("user_id", user.id);

        if (!error) {
          const newCount = likeCount - 1;
          setLikeCount(newCount);
          setIsLiked(false);
          onLikeChange?.(newCount, false);
        }
      } else {
        // Add like
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from("recipe_likes")
          .insert({
            recipe_id: recipeId,
            user_id: user.id,
          });

        if (!error) {
          const newCount = likeCount + 1;
          setLikeCount(newCount);
          setIsLiked(true);
          onLikeChange?.(newCount, true);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        isLiked
          ? "bg-red-100 text-red-700 hover:bg-red-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span className="text-sm">
        {isLiked ? "❤️" : "🤍"}
      </span>
      <span>{likeCount}</span>
    </button>
  );
}
