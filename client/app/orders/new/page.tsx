"use client";

import { useEffect, useState } from "react";
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold">Create a New Order</h1>
        <p className="mt-2 text-slate-600">Choose a user, product, quantity, and status to place a new order.</p>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm">
              User
              <select
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              Product
              <select
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} — ${product.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm">
                Quantity
                <input
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </label>

              <label className="grid gap-2 text-sm">
                Status
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </label>
            </div>

            <button
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-700"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating order…" : "Create Order"}
            </button>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </form>
        </section>
      </main>
    </div>
  );
}
