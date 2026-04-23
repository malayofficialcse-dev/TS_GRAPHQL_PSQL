"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { fetchGraphQL } from "../lib/graphql";
import type { Product } from "../lib/types";

const GET_PRODUCTS = `query GetProducts { getProducts { id name price category_id } }`;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchGraphQL<{ getProducts: Product[] }>(GET_PRODUCTS);
        setProducts(data.getProducts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold">Products</h1>
        <p className="mt-2 text-slate-600">Browse product inventory and pricing.</p>

        <section className="mt-8 space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">Loading products…</div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">No products found.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {products.map((product) => (
                <div key={product.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-base font-semibold">{product.name}</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>Price: ${product.price.toFixed(2)}</p>
                    <p>Category ID: {product.category_id ?? "None"}</p>
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
