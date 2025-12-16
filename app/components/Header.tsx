import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900">
            <span className="text-sm font-semibold text-zinc-50">R</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-50 shadow-sm hover:bg-zinc-800"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}


