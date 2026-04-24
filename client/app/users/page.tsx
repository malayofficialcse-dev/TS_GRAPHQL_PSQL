"use client";

import { useEffect, useState, useMemo } from "react";
import NavBar from "../components/NavBar";
import { fetchGraphQL } from "../lib/graphql";
import type { User } from "../lib/types";

const GET_USERS = `query GetUsers { getUsers { id name email } }`;
const DELETE_USER = `mutation DeleteUser($id: ID!) { deleteUser(id: $id) }`;
const UPDATE_USER = `mutation UpdateUser($id: ID!, $name: String!) { updateUser(id: $id, name: $name) { id name } }`;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

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

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetchGraphQL(DELETE_USER, { id });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete user");
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditName(user.name);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      await fetchGraphQL(UPDATE_USER, { id: editingId, name: editName });
      setUsers(users.map((u) => (u.id === editingId ? { ...u, name: editName } : u)));
      setEditingId(null);
    } catch (err: any) {
      alert(err.message || "Failed to update user");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Users</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Manage your application users and their permissions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 pl-10 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-slate-100 dark:focus:ring-slate-100 sm:w-64"
                />
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-800 dark:border-t-slate-100"></div>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">{error}</p>
                <button onClick={loadUsers} className="mt-4 text-sm font-semibold text-slate-900 hover:underline dark:text-slate-100">
                  Try again
                </button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                No users found matching your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="whitespace-nowrap px-6 py-4">
                          {editingId === user.id ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="rounded border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-600 dark:text-slate-400">
                          {user.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {editingId === user.id ? (
                              <>
                                <button
                                  onClick={handleUpdate}
                                  className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
