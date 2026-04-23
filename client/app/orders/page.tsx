"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "../components/NavBar";
import { fetchGraphQL } from "../lib/graphql";
import type { Order } from "../lib/types";

const GET_ORDERS = `query GetOrders { getOrders { id user_id product_id quantity total_price status order_date } }`;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchGraphQL<{ getOrders: Order[] }>(GET_ORDERS);
        setOrders(data.getOrders || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Orders</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Review orders and order status from the backend.</p>
          </div>
          <Link
            href="/orders/new"
            className="inline-flex items-center justify-center rounded bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Create New Order
          </Link>
        </div>

        <section className="mt-8 space-y-4">
          {loading ? (
            <div className="rounded border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">Loading orders…</div>
          ) : error ? (
            <div className="rounded border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/50">{error}</div>
          ) : orders.length === 0 ? (
            <div className="rounded border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">No orders found.</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Order #{order.id}</p>
                      <p className="text-xl font-semibold">{order.status}</p>
                    </div>
                    <div className="grid gap-2 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-3">
                      <span>User ID: {order.user_id}</span>
                      <span>Product ID: {order.product_id}</span>
                      <span>Qty: {order.quantity}</span>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2">
                    <span>Total: ${order.total_price.toFixed(2)}</span>
                    <span>Date: {new Date(order.order_date).toLocaleString()}</span>
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
