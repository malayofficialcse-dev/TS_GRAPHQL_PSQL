"use client";

import { useEffect, useState, useMemo } from "react";
import NavBar from "../components/NavBar";
import { fetchGraphQL } from "../lib/graphql";
import type { Product } from "../lib/types";

const GET_PRODUCTS = `
  query GetProducts { 
    getProducts { 
      id 
      name 
      price 
      category_id 
    } 
  }
`;

const GET_CATEGORIES = `query GetCategories { getCategories { id name } }`;

const CREATE_PRODUCT = `
  mutation CreateProduct($name: String!, $price: Float!, $category_id: ID) { 
    createProduct(name: $name, price: $price, category_id: $category_id) { 
      id name price category_id 
    } 
  }
`;

const UPDATE_PRODUCT = `
  mutation UpdateProduct($id: ID!, $name: String!, $price: Float!, $category_id: ID) { 
    updateProduct(id: $id, name: $name, price: $price, category_id: $category_id) { 
      id name price category_id 
    } 
  }
`;

const DELETE_PRODUCT = `mutation DeleteProduct($id: ID!) { deleteProduct(id: $id) { id } }`;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: "", price: 0, category_id: "" });

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        fetchGraphQL<{ getProducts: Product[] }>(GET_PRODUCTS),
        fetchGraphQL<{ getCategories: { id: string; name: string }[] }>(GET_CATEGORIES)
      ]);
      setProducts(productsData.getProducts || []);
      setCategories(categoriesData.getCategories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: 0, category_id: "" });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.name, 
      price: product.price, 
      category_id: product.category_id || "" 
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const data = await fetchGraphQL<{ updateProduct: Product }>(UPDATE_PRODUCT, {
          id: editingProduct.id,
          ...formData,
          price: parseFloat(formData.price.toString())
        });
        setProducts(products.map(p => p.id === editingProduct.id ? data.updateProduct : p));
      } else {
        const data = await fetchGraphQL<{ createProduct: Product }>(CREATE_PRODUCT, {
          ...formData,
          price: parseFloat(formData.price.toString())
        });
        setProducts([...products, data.createProduct]);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetchGraphQL(DELETE_PRODUCT, { id });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const getCategoryName = (id?: string) => {
    return categories.find(c => c.id === id)?.name || "Uncategorized";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Manage your product catalog and pricing.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 pl-10 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:focus:border-slate-100 dark:focus:ring-slate-100 sm:w-64"
                />
                <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="12 4v16m8-8H4" />
                </svg>
                Add Product
              </button>
            </div>
          </div>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-800 dark:border-t-slate-100"></div>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">{error}</p>
                <button onClick={loadData} className="mt-4 text-sm font-semibold text-slate-900 hover:underline dark:text-slate-100">Try again</button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">No products found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Product</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{product.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                            {getCategoryName(product.category_id)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-600 dark:text-slate-400">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
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

      {/* Product Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
