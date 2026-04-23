"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { fetchGraphQL } from "../lib/graphql";
import type { User } from "../lib/types";
import { usePermissions } from "../hooks/usePermissions";

const GET_USERS = `query GetUsers { getUsers { id name email } }`;
const UPDATE_USER = `mutation UpdateUser($id: ID!, $name: String!, $role: String!) { updateUser(id: $id, name: $name, role: $role) { id } }`;
const DELETE_USER = `mutation DeleteUser($id: ID!) { deleteUser(id: $id) }`;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { hasPermission } = usePermissions();

  const handleUpdateName = async (id: string, newName: string) => {
    if (!hasPermission("user:write")) return;
    try {
      await fetchGraphQL(UPDATE_USER, { id, name: newName, role: users.find(u => u.id === id)?.role || 'USER' });
      setUsers(users.map((u) => (u.id === id ? { ...u, name: newName } : u)));
    } catch (err: any) {
      alert(err.message || "Failed to update user");
    }
  };

  const handleDelete = async (id: string) => {
    if (!hasPermission("user:delete")) return;
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetchGraphQL(DELETE_USER, { id });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete user");
    }
  };

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
                <div key={user.id} className="flex items-center justify-between rounded border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div>
                    <input
                      type="text"
                      defaultValue={user.name}
                      readOnly={!hasPermission("user:write")}
                      onBlur={(e) => handleUpdateName(user.id, e.target.value)}
                      className={`block text-base font-semibold bg-transparent px-2 py-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:bg-slate-800 dark:focus:ring-slate-100 ${!hasPermission("user:write") ? "cursor-not-allowed opacity-70" : ""}`}
                    />
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 px-2">{user.email}</p>
                  </div>
                  {hasPermission("user:delete") && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
