import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/users", label: "Users" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/orders", label: "Orders" },
  { href: "/orders/new", label: "Create Order" },
];

export default function NavBar() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <Link href="/" className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            TS GraphQL PSQL
          </Link>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
