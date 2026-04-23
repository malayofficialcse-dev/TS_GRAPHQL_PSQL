"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { fetchGraphQL } from "../lib/graphql";
import { usePermissions } from "../hooks/usePermissions";

const GET_AUDIT_LOGS = `
  query GetAuditLogs {
    getAuditLogs {
      id
      user_name
      user_email
      action
      module
      details
      created_at
    }
  }
`;

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = usePermissions();

  useEffect(() => {
    fetchGraphQL<any>(GET_AUDIT_LOGS)
      .then(data => setLogs(data.getAuditLogs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (role !== "CEO" && role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">You do not have permission to view audit logs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">System Audit Logs</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Track all administrative actions across the platform.</p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Module</th>
                  <th className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center">Loading logs...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center">No logs found.</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                        {new Date(parseInt(log.created_at)).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{log.user_name || "System"}</div>
                        <div className="text-xs text-slate-500">{log.user_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          log.action === "DELETE" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                          log.action === "CREATE" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{log.module}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
