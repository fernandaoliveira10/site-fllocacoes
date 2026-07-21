"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import type { Combo } from "@/lib/types";

export function ComboManager({ initialCombos }: { initialCombos: Combo[] }) {
  const [combos, setCombos] = useState(initialCombos);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    totalPrice: "",
    discountPct: "",
    items: [] as { productId: string; quantity: number }[],
  });

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/combos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          totalPrice: Number(form.totalPrice),
          discountPct: form.discountPct ? Number(form.discountPct) : null,
          items: form.items,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setCombos((prev) => [created, ...prev]);
        setShowForm(false);
        setForm({ name: "", description: "", totalPrice: "", discountPct: "", items: [] });
      }
    } catch {}
  };

  const handleToggle = async (id: string) => {
    const combo = combos.find((c) => c.id === id);
    if (!combo) return;
    try {
      const res = await fetch(`/api/combos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !combo.isActive }),
      });
      if (res.ok) {
        setCombos((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
        );
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
        Novo combo
      </button>

      {showForm && (
        <div className="rounded-2xl border border-fl-gray-200 bg-white p-5 shadow-soft space-y-4">
          <input
            placeholder="Nome do combo"
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
          <div className="flex gap-3">
            <input
              placeholder="Preço total (centavos)"
              value={form.totalPrice}
              onChange={(e) => setForm({ ...form, totalPrice: e.target.value })}
              className="flex-1 rounded-xl border border-fl-gray-200 bg-fl-gray-50 px-4 py-2.5 text-sm text-fl-gray-900 outline-none focus:border-fl-blue"
            />
            <input
              placeholder="% desconto"
              value={form.discountPct}
              onChange={(e) => setForm({ ...form, discountPct: e.target.value })}
              className="w-24 rounded-xl border border-fl-gray-200 bg-fl-gray-50 px-4 py-2.5 text-sm text-fl-gray-900 outline-none focus:border-fl-blue"
            />
          </div>
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

      {combos.map((combo) => (
        <div
          key={combo.id}
          className="rounded-2xl border border-fl-gray-200 bg-white p-5 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-bold text-fl-blue-dark">{combo.name}</p>
              {combo.description && (
                <p className="text-sm text-fl-gray-500">{combo.description}</p>
              )}
              <p className="mt-1 text-lg font-bold text-fl-blue-dark">
                {formatCurrency(combo.totalPrice)}
              </p>
              {combo.discountPct && (
                <p className="text-xs font-medium text-green-700">{combo.discountPct}% de desconto</p>
              )}
            </div>
            <button
              onClick={() => handleToggle(combo.id)}
              className="rounded-xl border border-fl-gray-300 px-3 py-1.5 text-xs text-fl-gray-600 transition hover:text-fl-blue-dark"
            >
              {combo.isActive ? "Ativo" : "Inativo"}
            </button>
          </div>
          {combo.items.length > 0 && (
            <div className="mt-3 space-y-1 border-t border-fl-gray-100 pt-3">
              <p className="text-xs font-medium text-fl-gray-500">Itens inclusos:</p>
              {combo.items.map((item) => (
                <p key={item.id} className="text-sm text-fl-gray-600">
                  {item.product?.name ?? "Produto"} x{item.quantity}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
