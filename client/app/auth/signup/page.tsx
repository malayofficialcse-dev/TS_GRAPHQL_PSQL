"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchGraphQL } from "../lib/graphql";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const query = `
        mutation Signup($name: String, $email: String!, $password: String!) {
          signup(name: $name, email: $email, password: $password) {
            token
            user {
              id
              name
              email
            }
          }
        }
      `;

      const data = await fetchGraphQL<{
        signup: { token: string; user: { id: number; name: string; email: string } };
      }>(query, { name, email, password });

      localStorage.setItem("token", data.signup.token);
      localStorage.setItem("user", JSON.stringify(data.signup.user));
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            TS GraphQL PSQL
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
        <div className="rounded border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-semibold">Create Account</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Sign up for a new account</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                placeholder="Min 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-slate-900 hover:underline dark:text-slate-100">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}