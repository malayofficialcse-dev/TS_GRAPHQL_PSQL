"use client";

import { useEffect, useState, useMemo } from "react";
import NavBar from "../components/NavBar";
import { fetchGraphQL } from "../lib/graphql";

const GET_CATEGORIES = `query GetCategories { getCategories { id name } }`;
const CREATE_CATEGORY = `mutation CreateCategory($name: String!) { createCategory(name: $name) { id name } }`;
const UPDATE_CATEGORY = `mutation UpdateCategory($id: ID!, $name: String!) { updateCategory(id: $id, name: $name) { id name } }`;
const DELETE_CATEGORY = `mutation DeleteCategory($id: ID!) { deleteCategory(id: $id) }`;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchGraphQL<{ getCategories: { id: string; name: string }[] }>(GET_CATEGORIES);
      setCategories(data.getCategories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await fetchGraphQL<{ createCategory: { id: string; name: string } }>(CREATE_CATEGORY, { name: newName });
      setCategories([...categories, data.createCategory]);
      setNewName("");
      setIsAdding(false);
    } catch (err: any) {
      alert(err.message || "Failed to create category");
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const data = await fetchGraphQL<{ updateCategory: { id: string; name: string } }>(UPDATE_CATEGORY, { id: editingId, name: editName });
      setCategories(categories.map((c) => (c.id === editingId ? data.updateCategory : c)));
      setEditingId(null);
    } catch (err: any) {
      alert(err.message || "Failed to update category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This may affect products in this category.")) return;
    try {
      await fetchGraphQL(DELETE_CATEGORY, { id });
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [categories, search]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Organize your products into meaningful categories.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-slate-100 dark:focus:ring-slate-100 sm:w-64"
              />
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Add Category
              </button>
            </div>
          </div>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {isAdding && (
              <form onSubmit={handleCreate} className="border-b border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Category name..."
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                    autoFocus
                  />
                  <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900">
                    Create
                  </button>
                  <button type="button" onClick={() => setIsAdding(false)} className="text-sm font-medium text-slate-500 hover:text-slate-700">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-800 dark:border-t-slate-100"></div>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No categories found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">ID</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredCategories.map((category) => (
                      <tr key={category.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="whitespace-nowrap px-6 py-4">
                          {editingId === category.id ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="rounded border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
                              autoFocus
                            />
                          ) : (
                            <span className="font-medium">{category.name}</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-500 text-xs">
                          {category.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {editingId === category.id ? (
                              <>
                                <button onClick={handleUpdate} className="text-xs font-semibold text-slate-900 dark:text-slate-100">Save</button>
                                <button onClick={() => setEditingId(null)} className="text-xs font-medium text-slate-500">Cancel</button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => { setEditingId(category.id); setEditName(category.name); }}
                                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDelete(category.id)}
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
