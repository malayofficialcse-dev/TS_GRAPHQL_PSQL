"use client";

import { useAuth } from "../components/AuthProvider";
import NavBar from "../components/NavBar";
import { usePermissions } from "../hooks/usePermissions";

export default function ProfilePage() {
  const { user } = useAuth();
  const { isSuperuser } = usePermissions();

  if (!user) return <div className="p-10">Please log in.</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-3xl font-bold text-white dark:bg-white dark:text-slate-900">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-slate-600 dark:text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 border-t border-slate-100 pt-10 dark:border-slate-800 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Account Role</h3>
              <p className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${
                isSuperuser ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              }`}>
                {user.role || "USER"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Account ID</h3>
              <p className="mt-2 text-lg font-mono text-slate-900 dark:text-slate-100">#{user.id}</p>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Your Permissions</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {user.permissions?.length ? (
                user.permissions.map((p) => (
                  <span key={p} className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {p}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">Basic User Access</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
