"use client";

"use client";

import { Header } from "../components/Header";
import { AuthForm } from "../components/AuthForm";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-md flex-col px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Use your email to sign up. We only support email/password for now.
        </p>

        <AuthForm mode="signup" />
      </main>
    </div>
  );
}


