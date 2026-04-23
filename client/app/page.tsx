"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "./components/NavBar";
import { fetchGraphQL } from "./lib/graphql";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const GET_STATS = `
  query GetStats {
    getDashboardStats {
      totalUsers
      totalProducts
      totalOrders
      totalRevenue
      recentActivity {
        date
        orders
        revenue
      }
    }
  }
`;

export default function Home() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGraphQL<any>(GET_STATS)
      .then((data) => setStats(data.getDashboardStats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            Real-time analytics and management for your organization.
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Users" value={stats?.totalUsers || 0} icon="👥" color="blue" />
          <StatCard title="Total Products" value={stats?.totalProducts || 0} icon="📦" color="purple" />
          <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon="🛒" color="pink" />
          <StatCard title="Total Revenue" value={`$${(stats?.totalRevenue || 0).toLocaleString()}`} icon="💰" color="rose" />
        </div>

        {/* Charts Section */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Revenue Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-6 text-lg font-semibold">Revenue Trend</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.recentActivity || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-6 text-lg font-semibold">Order Volume</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.recentActivity || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink title="Manage Users" href="/users" description="Add, remove or edit team members." />
          <QuickLink title="Product Catalog" href="/products" description="Inventory and pricing management." />
          <QuickLink title="Sales Orders" href="/orders" description="Track and fulfill customer orders." />
          <QuickLink title="Categories" href="/categories" description="Organize your product hierarchy." />
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    pink: "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ title, href, description }: any) {
  return (
    <Link href={href} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-900 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-100">
      <h3 className="text-lg font-bold group-hover:text-slate-900 dark:group-hover:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      <div className="mt-4 flex items-center text-sm font-semibold text-slate-900 dark:text-slate-100">
        Go to Module
        <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
