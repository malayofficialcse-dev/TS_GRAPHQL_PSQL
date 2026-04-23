"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { fetchGraphQL } from "../lib/graphql";
import type { User } from "../lib/types";

const GET_USERS = `query GetUsers { getUsers { id name email } }`;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchGraphQL<{ getUsers: User[] }>(GET_USERS);
        setUsers(data.getUsers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold">Users</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Browse all registered users from the backend.</p>

        <section className="mt-8 space-y-4">
          {loading ? (
            <div className="rounded border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">Loading users…</div>
          ) : error ? (
            <div className="rounded border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/50">{error}</div>
          ) : users.length === 0 ? (
            <div className="rounded border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">No users found.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {users.map((user) => (
                <div key={user.id} className="rounded border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-base font-semibold">{user.name}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
