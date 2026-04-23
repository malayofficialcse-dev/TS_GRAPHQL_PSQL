"use client";

import React, { useEffect, useMemo, useState } from "react";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:5000/graphql";

const queries = {
  getUsers: `query GetUsers { getUsers { id name email } }`,
  getProducts: `query GetProducts { getProducts { id name price category_id } }`,
  getOrders: `query GetOrders { getOrders { id user_id product_id quantity total_price status order_date } }`,
  createOrder: `mutation CreateOrder($user_id: ID!, $product_id: ID!, $quantity: Int!, $status: String!) { createOrder(user_id: $user_id, product_id: $product_id, quantity: $quantity, status: $status) { id user_id product_id quantity total_price status order_date } }`,
};

const fetchGraphQL = async (query: string, variables?: Record<string, unknown>) => {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  if (json.errors) {
    throw new Error(json.errors.map((error: any) => error.message).join(" | ") || "GraphQL error");
  }

  return json.data;
};

export default function Home() {
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; price: number; category_id?: string }[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("PENDING");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const userLookup = useMemo(
    () => Object.fromEntries(users.map((user) => [user.id, user.name])),
    [users]
  );

  const productLookup = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product.name])),
    [products]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [userData, productData, orderData] = await Promise.all([
        fetchGraphQL(queries.getUsers),
        fetchGraphQL(queries.getProducts),
        fetchGraphQL(queries.getOrders),
      ]);

      setUsers(userData.getUsers || []);
      setProducts(productData.getProducts || []);
      setOrders(orderData.getOrders || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId || !productId || quantity < 1) {
      setError("Select a user, product, and quantity before submitting.");
      return;
    }

    try {
      setLoading(true);
      await fetchGraphQL(queries.createOrder, {
        user_id: userId,
        product_id: productId,
        quantity: Number(quantity),
        status,
      });
      setError("");
      setQuantity(1);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/30">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold">TS GraphQL PSQL</h1>
          <p className="mt-2 text-slate-600">
            Connected frontend to backend with GraphQL queries and mutations.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold">Create Order</h2>
              <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
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
                        {product.name} — ${product.price}
                      </option>
                    ))}
                  </select>
                </label>

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

                <button
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-700"
                  type="submit"
                >
                  {loading ? "Saving..." : "Create Order"}
                </button>
              </form>
              {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold">Backend status</h2>
              <p className="mt-2 text-sm text-slate-600">
                GraphQL endpoint: <span className="font-semibold">{GRAPHQL_URL}</span>
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Loaded {users.length} users, {products.length} products, and {orders.length} orders.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold">Orders</h2>
              <div className="mt-4 space-y-4">
                {orders.length === 0 ? (
                  <p className="text-sm text-slate-600">No orders found.</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-500">Order #{order.id}</p>
                          <p className="text-base font-semibold">
                            {userLookup[order.user_id] ?? "Unknown user"} ordered {productLookup[order.product_id] ?? "Unknown product"}
                          </p>
                        </div>
                        <p className="text-sm font-semibold uppercase text-slate-700">{order.status}</p>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                        <span>Qty: {order.quantity}</span>
                        <span>Total: ${Number(order.total_price).toFixed(2)}</span>
                        <span>Date: {new Date(order.order_date).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
