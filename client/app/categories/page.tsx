"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { fetchGraphQL } from "../lib/graphql";

const GET_CATEGORIES = `query GetCategories { getCategories { id name } }`;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold">Categories</h1>
        <p className="mt-2 text-slate-600">Browse categories managed by the backend module.</p>

        <section className="mt-8 space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">Loading categories…</div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
          ) : categories.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">No categories found.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((category) => (
                <div key={category.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-base font-semibold">{category.name}</p>
                  <p className="mt-2 text-sm text-slate-600">ID: {category.id}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
