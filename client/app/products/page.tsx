"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { fetchGraphQL } from "../lib/graphql";
import type { Product } from "../lib/types";

const GET_PRODUCTS = `
  query GetProducts($search: String) {
    getProducts(search: $search) {
      id
      name
      price
      category_id
    }
  }
`;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadProducts = async (search: string = "") => {
    try {
      setLoading(true);
      const data = await fetchGraphQL<{ getProducts: Product[] }>(GET_PRODUCTS, { search });
      setProducts(data.getProducts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts(searchTerm);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Products</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Browse product inventory and pricing.</p>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-slate-100 dark:focus:ring-slate-100"
            />
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Search
            </button>
          </form>
        </div>

        <section className="mt-8 space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent dark:border-white"></div>
              <p className="mt-4">Loading products…</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/50">{error}</div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <p>No products found matching "{searchTerm}"</p>
              <button onClick={() => { setSearchTerm(""); loadProducts(""); }} className="mt-4 text-sm font-semibold text-slate-900 underline dark:text-white">Clear search</button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product.id} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      ID: {product.id}
                    </span>
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                     <p className="text-xs text-slate-500">Category: {product.category_id || "Uncategorized"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
