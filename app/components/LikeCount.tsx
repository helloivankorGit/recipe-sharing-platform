interface LikeCountProps {
  likeCount: number;
}

export function LikeCount({ likeCount }: LikeCountProps) {
  return (
    <span className="flex items-center gap-1 text-xs text-zinc-500">
      <span className="text-sm">❤️</span>
      <span>{likeCount}</span>
    </span>
  );
}
