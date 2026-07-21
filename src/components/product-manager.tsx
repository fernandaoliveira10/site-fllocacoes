"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { productCategoryLabels, type Product, type ProductCategory } from "@/lib/types";

const CATEGORIES: ProductCategory[] = [
  "PLATAFORMA_360",
  "CAMA_ELASTICA",
  "FOTOGRAFIA",
  "PISCINA_BOLINHA",
  "MESAS_CADEIRAS",
];

interface ProductForm {
  name: string;
  description: string;
  category: ProductCategory;
  isOutsourced: boolean;
  priceConfirmed: boolean;
}

export function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    category: "PLATAFORMA_360",
    isOutsourced: false,
    priceConfirmed: true,
  });

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
        setShowForm(false);
        setForm({
          name: "",
          description: "",
          category: "PLATAFORMA_360",
          isOutsourced: false,
          priceConfirmed: true,
        });
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: false } : p)));
      }
    } catch {}
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 rounded-xl border border-fl-gray-200 bg-white px-5 py-3 text-sm font-medium text-fl-gray-700 shadow-soft transition hover:bg-fl-gray-50"
      >
        <Plus className="h-4 w-4" />
        Novo produto
      </button>

      {showForm && (
        <div className="space-y-4 rounded-2xl border border-fl-gray-200 bg-white p-5 shadow-soft">
          <input
            placeholder="Nome do produto"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-fl-gray-200 bg-fl-gray-50 px-4 py-2.5 text-sm text-fl-gray-900 outline-none focus:border-fl-blue"
          />
          <input
            placeholder="Descrição"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl border border-fl-gray-200 bg-fl-gray-50 px-4 py-2.5 text-sm text-fl-gray-900 outline-none focus:border-fl-blue"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
            className="w-full rounded-xl border border-fl-gray-200 bg-fl-gray-50 px-4 py-2.5 text-sm text-fl-gray-900 outline-none focus:border-fl-blue"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {productCategoryLabels[cat]}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-fl-gray-600">
            <input
              type="checkbox"
              checked={form.isOutsourced}
              onChange={(e) => setForm({ ...form, isOutsourced: e.target.checked })}
              className="rounded"
            />
            Terceirizado
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="rounded-xl bg-fl-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark"
            >
              Criar
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-fl-gray-300 px-5 py-2.5 text-sm text-fl-gray-600 transition hover:text-fl-blue-dark"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {products.map((product) => (
        <div
          key={product.id}
          className={cn(
            "flex items-center justify-between rounded-2xl border p-4",
            product.isActive
              ? "border-fl-gray-200 bg-white shadow-soft"
              : "border-fl-gray-100 bg-fl-gray-50 opacity-50",
          )}
        >
          <div>
            <p className="font-medium text-fl-blue-dark">{product.name}</p>
            <p className="text-xs text-fl-gray-500">{productCategoryLabels[product.category]}</p>
            <p className="text-sm text-fl-gray-600">
              {product.priceConfirmed ? "Preço confirmado" : "Sob consulta"}
              {product.isOutsourced && " · Terceirizado"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-xl border px-3 py-1.5 text-xs font-medium",
                product.isActive
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-fl-gray-200 text-fl-gray-500",
              )}
            >
              {product.isActive ? "Ativo" : "Inativo"}
            </span>
            <button
              onClick={() => handleDelete(product.id)}
              className="rounded-xl border border-red-200 px-3 py-1.5 text-xs text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
