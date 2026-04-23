import NavBar from "./components/NavBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <section className="rounded border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/50">
          <h1 className="text-4xl font-semibold tracking-tight">TS GraphQL PSQL</h1>
          <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
            Welcome to the frontend for your GraphQL + PostgreSQL stack. Use the navigation above to visit users, products, orders, and order creation pages.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">View users fetched from the backend API.</p>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
              <h2 className="text-xl font-semibold">Products</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Browse product details and prices.</p>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
              <h2 className="text-xl font-semibold">Categories</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Browse category names managed by the backend.</p>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
              <h2 className="text-xl font-semibold">Orders</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Review your existing orders and status.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
