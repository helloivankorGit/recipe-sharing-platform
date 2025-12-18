"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { getSupabaseClient } from "../../lib/supabaseClient";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: profileError } = await (supabase as any)
        .from("profiles")
        .select("username, full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setError("Could not load your profile. Please try again.");
        setLoading(false);
        return;
      }

      if (data) {
        setUsername(data.username ?? "");
        setFullName(data.full_name ?? "");
      } else if (user.email) {
        setUsername(user.email.split("@")[0] ?? "");
      }

      setLoading(false);
    }

    load();
  }, [router, supabase]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You are not logged in.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: username.trim() || null,
        full_name: fullName.trim() || null,
      })
      .eq("id", user.id);

    if (updateError) {
      setError("Could not save your profile. Please try again.");
      setSaving(false);
      return;
    }

    setSuccess("Profile updated.");
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-5xl items-center justify-center px-4 py-10 sm:px-8 sm:py-14">
          <p className="text-sm text-zinc-500">Loading profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-2xl flex-col gap-8 px-4 py-10 sm:px-8 sm:py-14">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Profile
          </h1>
          <p className="text-sm text-zinc-600">
            Update how your name and handle appear in the app.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-zinc-800"
            >
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900"
              placeholder="your-handle"
            />
            <p className="text-xs text-zinc-500">
              This can be used later for public profile URLs.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-zinc-800"
            >
              Full name
            </label>
            <input
              id="full_name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-900"
              placeholder="Jane Doe"
            />
          </div>

          {error && (
            <p className="text-sm text-red-700">{error}</p>
          )}
          {success && (
            <p className="text-sm text-emerald-700">{success}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}


