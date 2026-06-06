"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail } from "lucide-react";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";
  const passwordChecks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(password) }
  ];
  const passwordValid = passwordChecks.every((check) => check.valid);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (isSignup && !passwordValid) {
      setError("Password must meet all requirements.");
      return;
    }
    setLoading(true);

    if (isSignup) {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      if (!response.ok) {
        setError("Could not create account. Check your details and try again.");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(isSignup ? "/onboarding" : "/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-black/10 bg-white p-6 shadow-soft">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink">{isSignup ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-1 text-sm text-ink/58">
          {isSignup ? "Save colleges and comparison sets across sessions." : "Continue your college shortlist."}
        </p>
      </div>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-black/15 bg-white px-4 py-3 text-sm font-bold text-ink hover:bg-mist"
      >
        <Mail size={18} /> Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase text-ink/35">
        <span className="h-px flex-1 bg-black/10" />
        or
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        {isSignup && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink/70">Name</span>
            <input className="input" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} />
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink/70">Email</span>
          <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink/70">Password</span>
          <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
        </label>
        {isSignup && (
          <ul className="grid gap-1 rounded-md bg-mist p-3 text-sm">
            {passwordChecks.map((check) => (
              <li key={check.label} className={check.valid ? "font-semibold text-moss" : "text-ink/55"}>
                {check.valid ? "✓" : "-"} {check.label}
              </li>
            ))}
          </ul>
        )}
        {error && <p className="rounded-md bg-coral/10 px-3 py-2 text-sm font-semibold text-coral">{error}</p>}
        <button disabled={loading || (isSignup && !passwordValid)} className="w-full rounded-md bg-coral px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
          {loading ? "Please wait" : isSignup ? "Sign up" : "Sign in"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink/60">
        {isSignup ? "Already have an account?" : "New to College Compass?"}{" "}
        <Link className="font-bold text-moss" href={isSignup ? "/signin" : "/signup"}>
          {isSignup ? "Sign in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
