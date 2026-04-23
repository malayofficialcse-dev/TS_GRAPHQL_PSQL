"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "./AuthProvider";

export default function NavBar() {
  const { user, logout } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/users", label: "Users" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/orders", label: "Orders" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            DASHBOARD
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-400 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                {link.label}
              </Link>
            ))}
            {(user?.role === "CEO" || user?.role === "ADMIN") && (
              <Link href="/audit" className="rounded-lg px-3 py-2 text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                Audit Logs
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-slate-800">
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden text-sm font-semibold sm:inline">{user.name}</span>
              </Link>
              <button 
                onClick={logout}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
