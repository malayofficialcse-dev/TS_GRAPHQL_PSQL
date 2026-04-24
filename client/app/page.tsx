"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "./components/NavBar";
import { fetchGraphQL } from "./lib/graphql";

export default function Home() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [u, p, o] = await Promise.all([
          fetchGraphQL(`query { getUsers { id } }`),
          fetchGraphQL(`query { getProducts { id } }`),
          fetchGraphQL(`query { getOrders { id } }`),
        ]);
        setStats({
          users: u.getUsers?.length || 0,
          products: p.getProducts?.length || 0,
          orders: o.getOrders?.length || 0,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 py-24 text-white dark:bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
                Modern GraphQL <br/>
                <span className="text-blue-400">Management System</span>
              </h1>
              <p className="mt-6 text-lg text-slate-400">
                A high-performance dashboard built with Next.js, GraphQL, and PostgreSQL. 
                Manage your users, products, and orders with ease and style.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/orders/new"
                  className="rounded-full bg-blue-600 px-8 py-4 text-sm font-bold transition hover:bg-blue-500 hover:scale-105 active:scale-95"
                >
                  Create New Order
                </Link>
                <Link
                  href="/products"
                  className="rounded-full bg-slate-800 px-8 py-4 text-sm font-bold border border-slate-700 transition hover:bg-slate-700 hover:scale-105 active:scale-95"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mx-auto max-w-7xl px-4 -mt-12 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { label: "Active Users", value: stats.users, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", color: "text-blue-500" },
              { label: "Products Catalog", value: stats.products, icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "text-purple-500" },
              { label: "Total Orders", value: stats.orders, icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", color: "text-green-500" },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation Cards */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Quick Management</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Users", desc: "Manage accounts and roles", href: "/users", color: "from-blue-500 to-blue-600" },
              { title: "Products", desc: "Edit catalog and prices", href: "/products", color: "from-purple-500 to-purple-600" },
              { title: "Categories", desc: "Organize product groups", href: "/categories", color: "from-pink-500 to-pink-600" },
              { title: "Orders", desc: "Track and fulfill orders", href: "/orders", color: "from-orange-500 to-orange-600" },
            ].map((card, i) => (
              <Link key={i} href={card.href} className="group relative overflow-hidden rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-2xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90 transition-opacity group-hover:opacity-100`}></div>
                <div className="relative text-white">
                  <h3 className="text-xl font-bold">{card.title}</h3>
                  <p className="mt-2 text-white/80 text-sm">{card.desc}</p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    Manage Now
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
