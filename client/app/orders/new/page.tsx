"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../components/NavBar";
import { fetchGraphQL } from "../../lib/graphql";
import type { Product, User } from "../../lib/types";

const GET_USERS = `query GetUsers { getUsers { id name email } }`;
const GET_PRODUCTS = `query GetProducts { getProducts { id name price category_id } }`;
const CREATE_ORDER = `mutation CreateOrder($user_id: ID!, $product_id: ID!, $quantity: Int!, $status: String!) { createOrder(user_id: $user_id, product_id: $product_id, quantity: $quantity, status: $status) { id } }`;

export default function CreateOrderPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPickers = async () => {
      try {
        setLoading(true);
        const [userData, productData] = await Promise.all([
          fetchGraphQL<{ getUsers: User[] }>(GET_USERS),
          fetchGraphQL<{ getProducts: Product[] }>(GET_PRODUCTS),
        ]);
        setUsers(userData.getUsers || []);
        setProducts(productData.getProducts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    loadPickers();
  }, []);

  const selectedProduct = useMemo(() => products.find(p => p.id === productId), [products, productId]);
  const totalPrice = useMemo(() => (selectedProduct?.price || 0) * quantity, [selectedProduct, quantity]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId || !productId || quantity < 1) {
      setError("Please select a user, product, and quantity.");
      return;
    }

    try {
      setLoading(true);
      await fetchGraphQL(CREATE_ORDER, {
        user_id: userId,
        product_id: productId,
        quantity: Number(quantity),
        status,
      });
      setError("");
      router.push("/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create Order</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Place a new order for a customer.</p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Customer</label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-800"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                >
                  <option value="">Select a customer</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Product</label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-800"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} — ${product.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-800"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Initial Status</label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-800"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
            </div>

            {selectedProduct && (
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                  <span className="font-medium">${selectedProduct.price.toFixed(2)} × {quantity}</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
                  <span className="text-base font-bold">Total Price</span>
                  <span className="text-base font-bold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              <button
                className="flex-1 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Order"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
