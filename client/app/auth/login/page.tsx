"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchGraphQL } from "../lib/graphql";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const query = `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
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
        login: { token: string; user: { id: number; name: string; email: string } };
      }>(query, { email, password });

      localStorage.setItem("token", data.login.token);
      localStorage.setItem("user", JSON.stringify(data.login.user));
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
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
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Sign in to your account</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-slate-900 hover:underline dark:text-slate-100">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}