import Link from "next/link";

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
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <Link href="/" className="text-xl font-semibold text-slate-900">
            TS GraphQL PSQL
          </Link>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm font-medium text-slate-700">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
