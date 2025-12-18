"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseClient } from "../../lib/supabaseClient";
import { Comment } from "../types/comment";

interface CommentsProps {
  recipeId: string;
  recipeOwnerId: string;
}

export function Comments({ recipeId, recipeOwnerId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const getCurrentUser = async () => {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const loadComments = useCallback(async () => {
    setLoading(true);
    const supabase = getSupabaseClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("recipe_comments")
      .select(`
        *,
        profiles!recipe_comments_user_id_fkey(username, full_name)
      `)
      .eq("recipe_id", recipeId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setComments(data as Comment[]);
    }
    setLoading(false);
  }, [recipeId]);

  useEffect(() => {
    const initializeComments = async () => {
      await getCurrentUser();
      await loadComments();
    };
    
    initializeComments();
  }, [recipeId, loadComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId || submitting) return;

    setSubmitting(true);
    const supabase = getSupabaseClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("recipe_comments")
      .insert({
        recipe_id: recipeId,
        user_id: currentUserId,
        comment: newComment.trim(),
      });

    if (!error) {
      setNewComment("");
      loadComments(); // Reload comments to show the new one
    }

    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUserId) return;

    const supabase = getSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("recipe_comments")
      .delete()
      .eq("id", commentId);

    if (!error) {
      loadComments(); // Reload comments
    }
  };

  const canDeleteComment = () => {
    return currentUserId === recipeOwnerId; // Only recipe owner can delete comments
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Comments</h3>
        <p className="text-sm text-zinc-600">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      {currentUserId && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this recipe..."
            rows={3}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            required
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-zinc-100 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {comment.profiles?.full_name || 
                     comment.profiles?.username || 
                     "Anonymous"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
                {canDeleteComment() && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-xs text-red-600 hover:text-red-800 transition-colors"
                    title="Delete comment"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {comment.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
