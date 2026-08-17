"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Minus, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { calculateBookingPricing } from "@/lib/booking-pricing";
import { supportedCities } from "@/lib/constants";

interface ProductInfo {
  id: string;
  name: string;
  category: string;
  priceTiers: { id: string; durationHours: number; price: number; label?: string; isComboPrice: boolean }[];
  extraPricePerHour: number | null;
}

interface SelectedProduct {
  productId: string;
  productName: string;
  tierId: string;
  durationHours: number;
  price: number;
  quantity: number;
  extraPricePerHour: number | null;
}

const EXTRA_HOURS_NOTE = "R$ 100 por hora extra para os produtos que permitem extensão.";

export function BookingExperience() {
  const searchParams = useSearchParams();
  const preselectedProductId = searchParams.get("product");

  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [extraHours, setExtraHours] = useState(0);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventNeighborhood, setEventNeighborhood] = useState("");
  const [eventCity, setEventCity] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setProducts(list);

        if (preselectedProductId) {
          const prod = list.find((p: ProductInfo) => p.id === preselectedProductId);
          const firstTier = prod?.priceTiers?.[0];
          if (prod && firstTier) {
            setSelectedProducts([
              {
                productId: prod.id,
                productName: prod.name,
                tierId: firstTier.id,
                durationHours: firstTier.durationHours,
                price: firstTier.price,
                quantity: 1,
                extraPricePerHour: prod.extraPricePerHour,
              },
            ]);
          }
        }
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [preselectedProductId]);

  const pricing = useMemo(
    () => calculateBookingPricing({
      items: selectedProducts.map((sp) => ({
        productId: sp.productId,
        price: sp.price,
        quantity: sp.quantity,
        extraPricePerHour: sp.extraPricePerHour,
      })),
      extraHours,
    }),
    [selectedProducts, extraHours],
  );

  const canSubmit = clientName.length >= 3
    && clientPhone.length >= 8
    && eventDate.length > 0
    && eventTime.length > 0
    && eventNeighborhood.length >= 2
    && eventCity.length > 0
    && selectedProducts.length > 0;

  const hasExtraEligibleProducts = selectedProducts.some((product) => (product.extraPricePerHour ?? 0) > 0);

  const setProductTier = (productId: string, tierId: string) => {
    setSelectedProducts((prev) => prev.map((sp) => {
      if (sp.productId !== productId) return sp;
      const product = products.find((p) => p.id === productId);
      const tier = product?.priceTiers.find((t) => t.id === tierId);
      if (!tier) return sp;
      return { ...sp, tierId, durationHours: tier.durationHours, price: tier.price };
    }));
  };

  const toggleProduct = (product: ProductInfo) => {
    setSelectedProducts((prev) => {
      const found = prev.find((sp) => sp.productId === product.id);
      if (found) return prev.filter((sp) => sp.productId !== product.id);
      const firstTier = product.priceTiers[0];
      if (!firstTier) return prev;
      return [...prev, {
        productId: product.id,
        productName: product.name,
        tierId: firstTier.id,
        durationHours: firstTier.durationHours,
        price: firstTier.price,
        quantity: 1,
        extraPricePerHour: product.extraPricePerHour,
      }];
    });
  };

  const changeQty = (productId: string, delta: number) => {
    setSelectedProducts((prev) => prev.map((sp) => sp.productId === productId ? { ...sp, quantity: Math.max(1, sp.quantity + delta) } : sp));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientPhone,
          eventDate,
          eventTime,
          eventNeighborhood,
          eventCity,
          notes: notes || undefined,
          extraHours,
          items: selectedProducts.map((sp) => ({
            productId: sp.productId,
            quantity: sp.quantity,
            durationHours: sp.durationHours,
            price: sp.price,
          })),
        }),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.error ?? "Não foi possível enviar seu orçamento.");
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar orçamento.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-fl-gray-200 bg-fl-gray-50 p-12 text-center shadow-soft-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-fl-gray-200 bg-white shadow-soft">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="mt-6 font-display text-3xl font-bold text-fl-blue-dark">Pedido enviado com sucesso!</h2>
        <p className="mx-auto mt-4 max-w-2xl text-fl-gray-600">
          Recebemos seu formulário e vamos responder com o preço final do evento. O sinal de 30% é pago na reserva e pode ser feito via Pix ou cartão com taxa da maquininha.
        </p>
        <p className="mt-3 text-sm text-fl-gray-500">A taxa de deslocamento será confirmada na análise do endereço.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-fl-gray-200 bg-white p-6 shadow-soft-lg sm:p-10">

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">1. Escolha os produtos</p>
            <div className="mt-4 space-y-4">
              {loading ? (
                <p className="text-center text-fl-gray-500">Carregando produtos...</p>
              ) : products.filter((p) => p.priceTiers.length > 0).map((product) => {
                const selected = selectedProducts.find((sp) => sp.productId === product.id);
                const isSelected = Boolean(selected);
                return (
                  <div key={product.id} className={cn("rounded-2xl border p-5 transition", isSelected ? "border-fl-blue bg-fl-blue/5 shadow-soft" : "border-fl-gray-200 bg-white")}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-lg font-bold text-fl-blue-dark">{product.name}</h3>
                        <p className="text-sm text-fl-gray-500">{product.category.replace(/_/g, " ")}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleProduct(product)}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition",
                          isSelected
                            ? "border-green-400 bg-green-50 text-green-700"
                            : "border-fl-blue bg-fl-blue text-white shadow-fl-blue/20 hover:bg-fl-blue-dark",
                        )}
                        aria-label={isSelected ? `Produto ${product.name} adicionado` : `Adicionar ${product.name}`}
                      >
                        {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        <span>{isSelected ? "Adicionado" : "Adicionar"}</span>
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {product.priceTiers.map((tier) => (
                        <button key={tier.id} type="button" disabled={!isSelected} onClick={() => setProductTier(product.id, tier.id)} className={cn("rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40", selected?.tierId === tier.id ? "border-fl-blue bg-fl-blue text-white" : "border-fl-gray-300 text-fl-gray-600 hover:border-fl-blue hover:text-fl-blue")}>
                          {tier.label ?? `${tier.durationHours}h`}
                        </button>
                      ))}
                    </div>

                    {selected && (
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-fl-gray-500">Qtd:</span>
                          <button type="button" onClick={() => changeQty(product.id, -1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-fl-gray-300 text-fl-gray-500 hover:text-fl-blue-dark"><Minus className="h-3 w-3" /></button>
                          <span className="w-6 text-center text-sm font-medium text-fl-blue-dark">{selected.quantity}</span>
                          <button type="button" onClick={() => changeQty(product.id, 1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-fl-gray-300 text-fl-gray-500 hover:text-fl-blue-dark"><Plus className="h-3 w-3" /></button>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-sm text-fl-gray-500">{selected.durationHours}h</p>
                          <p className="font-bold text-fl-blue-dark">{formatCurrency(selected.price)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {hasExtraEligibleProducts && (
              <div className="mt-6 rounded-xl border border-fl-gray-200 bg-fl-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-fl-blue">Horas extras</p>
                <p className="mt-1 text-sm text-fl-gray-500">{EXTRA_HOURS_NOTE}</p>
                <div className="mt-3 flex items-center gap-3">
                  <button type="button" onClick={() => setExtraHours(Math.max(0, extraHours - 1))} className="flex h-9 w-9 items-center justify-center rounded-xl border border-fl-gray-300 text-fl-gray-500 transition hover:border-fl-blue hover:text-fl-blue"><Minus className="h-4 w-4" /></button>
                  <span className="w-10 text-center text-lg font-bold text-fl-blue-dark">{extraHours}h</span>
                  <button type="button" onClick={() => setExtraHours(Math.min(6, extraHours + 1))} className="flex h-9 w-9 items-center justify-center rounded-xl border border-fl-gray-300 text-fl-gray-500 transition hover:border-fl-blue hover:text-fl-blue"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Nome</label>
              <input value={clientName} onChange={(e) => setClientName(e.target.value)} className="mt-2 w-full rounded-xl border border-fl-gray-200 bg-white px-4 py-3 text-fl-gray-900 outline-none transition focus:border-fl-blue" placeholder="Seu nome" required />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Telefone</label>
              <input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="mt-2 w-full rounded-xl border border-fl-gray-200 bg-white px-4 py-3 text-fl-gray-900 outline-none transition focus:border-fl-blue" placeholder="(11) 99999-9999" required />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Data do evento</label>
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} className="mt-2 w-full rounded-xl border border-fl-gray-200 bg-white px-4 py-3 text-fl-gray-900 outline-none transition focus:border-fl-blue" required />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Cidade</label>
              <select value={eventCity} onChange={(e) => setEventCity(e.target.value)} className="mt-2 w-full rounded-xl border border-fl-gray-200 bg-white px-4 py-3 text-fl-gray-900 outline-none transition focus:border-fl-blue" required>
                <option value="">Selecione...</option>
                {supportedCities.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-fl-gray-200 bg-fl-gray-50 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Resumo</p>
            {selectedProducts.length > 0 ? (
              <div className="mt-4 space-y-3">
                {selectedProducts.map((sp) => (
                  <div key={sp.productId} className="flex items-start justify-between gap-3 text-sm text-fl-gray-700">
                    <div>
                      <p className="font-medium text-fl-blue-dark">{sp.productName}</p>
                      <p className="text-xs text-fl-gray-500">{sp.quantity}x • {sp.durationHours}h</p>
                    </div>
                    <span className="font-semibold text-fl-blue-dark">{formatCurrency(sp.price * sp.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-fl-gray-200 pt-3">
                  <div className="flex justify-between text-sm text-fl-gray-600"><span>Subtotal dos produtos</span><span>{formatCurrency(pricing.subtotalAmount)}</span></div>
                  {pricing.discountAmount > 0 && <div className="mt-2 flex justify-between text-sm text-green-700"><span>Desconto de pacote</span><span>- {formatCurrency(pricing.discountAmount)}</span></div>}
                  <div className="mt-2 flex justify-between text-sm text-fl-gray-600"><span>Taxa de deslocamento</span><span>Sob consulta</span></div>
                  <div className="mt-2 flex justify-between text-sm text-fl-gray-600"><span>Pagamento na reserva</span><span>30%</span></div>
                  <p className="mt-3 text-xs leading-5 text-fl-gray-500">30% é pago na hora da reserva, com opção de Pix ou crédito com taxa da maquininha.</p>
                </div>
              </div>
            ) : <p className="mt-4 text-sm text-fl-gray-500">Selecione pelo menos um produto para ver o resumo do orçamento.</p>}
          </div>

          {pricing.totalAmount > 0 && (
            <div className="rounded-2xl border border-fl-blue/20 bg-fl-blue/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-fl-blue">Valor parcial dos produtos</p>
              <p className="mt-2 font-display text-3xl font-bold text-fl-blue-dark">{formatCurrency(pricing.totalAmount)}</p>
              <p className="mt-2 text-sm leading-6 text-fl-gray-600">A taxa de deslocamento será confirmada por nós no WhatsApp.</p>
            </div>
          )}

          {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          <button type="submit" disabled={!canSubmit || submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-fl-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark disabled:cursor-not-allowed disabled:opacity-40">
            {submitting ? "Enviando..." : "Enviar pedido de orçamento"}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-xs leading-5 text-fl-gray-500">Vamos te responder com o preço final. O cliente pode reservar com 30% de sinal via Pix ou crédito com taxa da maquininha.</p>
        </div>
      </div>
    </form>
  );
}






