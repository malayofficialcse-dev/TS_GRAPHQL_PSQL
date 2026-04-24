"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import NavBar from "../components/NavBar";
import { fetchGraphQL } from "../lib/graphql";
import type { Order, User, Product } from "../lib/types";

const GET_ORDERS = `
  query GetOrders { 
    getOrders { 
      id 
      user_id 
      product_id 
      quantity 
      total_price 
      status 
      order_date 
    } 
  }
`;

const GET_USERS = `query GetUsers { getUsers { id name } }`;
const GET_PRODUCTS = `query GetProducts { getProducts { id name price } }`;

const UPDATE_ORDER = `
  mutation UpdateOrder($id: ID!, $user_id: ID!, $product_id: ID!, $quantity: Int!, $total_price: Float!, $status: String!) { 
    updateOrder(id: $id, user_id: $user_id, product_id: $product_id, quantity: $quantity, total_price: $total_price, status: $status) { 
      id status 
    } 
  }
`;

const DELETE_ORDER = `mutation DeleteOrder($id: ID!) { deleteOrder(id: $id) { id } }`;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [orderData, userData, productData] = await Promise.all([
        fetchGraphQL<{ getOrders: Order[] }>(GET_ORDERS),
        fetchGraphQL<{ getUsers: User[] }>(GET_USERS),
        fetchGraphQL<{ getProducts: Product[] }>(GET_PRODUCTS),
      ]);
      setOrders(orderData.getOrders || []);
      setUsers(userData.getUsers || []);
      setProducts(productData.getProducts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (order: Order, newStatus: string) => {
    try {
      await fetchGraphQL(UPDATE_ORDER, {
        id: order.id,
        user_id: order.user_id,
        product_id: order.product_id,
        quantity: order.quantity,
        total_price: order.total_price,
        status: newStatus,
      });
      setOrders(orders.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)));
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await fetchGraphQL(DELETE_ORDER, { id });
      setOrders(orders.filter((o) => o.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete order");
    }
  };

  const getUserName = (id: string) => users.find((u) => u.id === id)?.name || id;
  const getProductName = (id: string) => products.find((p) => p.id === id)?.name || id;

  const filteredOrders = useMemo(() => {
    return orders.filter((o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      getUserName(o.user_id).toLowerCase().includes(search.toLowerCase()) ||
      getProductName(o.product_id).toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search, users, products]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "CANCELLED": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "PROCESSING": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Manage customer orders and fulfillment status.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-slate-100 sm:w-64"
              />
              <Link
                href="/orders/new"
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Create Order
              </Link>
            </div>
          </div>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-800 dark:border-t-slate-100"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No orders found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Order ID</th>
                      <th className="px-6 py-4 font-semibold">Customer</th>
                      <th className="px-6 py-4 font-semibold">Product</th>
                      <th className="px-6 py-4 font-semibold text-center">Qty</th>
                      <th className="px-6 py-4 font-semibold">Total</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-slate-500">
                          #{order.id.slice(-6).toUpperCase()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          {getUserName(order.user_id)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {getProductName(order.product_id)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          {order.quantity}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-semibold">
                          ${order.total_price.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order, e.target.value)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold focus:outline-none ${getStatusColor(order.status)}`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
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
