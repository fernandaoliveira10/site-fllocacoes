"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Minus, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { calculateBookingPricing } from "@/lib/booking-pricing";
import { supportedCities } from "@/lib/constants";
import { productCategoryLabels } from "@/lib/types";
import type { ProductCategory } from "@/lib/types";

interface ProductInfo {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  priceTiers: {
    id: string;
    durationHours: number;
    price: number;
    label?: string;
    extraPricePerHour?: number | null;
    isComboPrice: boolean;
  }[];
  extraPricePerHour: number | null;
}

interface SelectedProduct {
  productId: string;
  productName: string;
  tierId: string;
  durationHours: number;
  durationLabel: string;
  price: number;
  quantity: number;
  extraPricePerHour: number | null;
  isComboPrice: boolean;
}

const EXTRA_HOURS_NOTE = "A hora extra segue o valor da opção selecionada.";
const COMBO_CATEGORY = "COMBO_PROMOCIONAL";

function getComboDisplayName(name: string) {
  return name.replace(/^Combo Promocional\s*/i, "");
}

function getTierExtraPricePerHour(product: ProductInfo, tier: ProductInfo["priceTiers"][number]) {
  return tier.extraPricePerHour ?? product.extraPricePerHour;
}

const fieldClass =
  "mt-2 w-full rounded-xl border border-fl-gray-200 bg-white px-4 py-3 text-fl-gray-900 outline-none transition focus:border-fl-blue focus:ring-4 focus:ring-fl-blue/10";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-fl-gray-500";

function StepHeading({ step, title, hint }: { step: number; title: string; hint?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fl-blue text-sm font-bold text-white">
        {step}
      </span>
      <div>
        <p className="font-display text-lg font-bold text-fl-blue-dark">{title}</p>
        {hint && <p className="mt-0.5 text-sm text-fl-gray-500">{hint}</p>}
      </div>
    </div>
  );
}

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
  const [eventCity, setEventCity] = useState("");
  const [notes] = useState("");
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
                durationLabel: firstTier.label ?? `${firstTier.durationHours}h`,
                price: firstTier.price,
                quantity: 1,
                extraPricePerHour: getTierExtraPricePerHour(prod, firstTier),
                isComboPrice: firstTier.isComboPrice,
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
    () =>
      calculateBookingPricing({
        items: selectedProducts.map((sp) => ({
          productId: sp.productId,
          price: sp.price,
          quantity: sp.quantity,
          extraPricePerHour: sp.extraPricePerHour,
          isComboPrice: sp.isComboPrice,
        })),
        extraHours,
      }),
    [selectedProducts, extraHours],
  );

  const canSubmit =
    clientName.length >= 3 &&
    clientPhone.length >= 8 &&
    eventDate.length > 0 &&
    eventCity.length > 0 &&
    selectedProducts.length > 0;

  const hasExtraEligibleProducts = selectedProducts.some((product) => (product.extraPricePerHour ?? 0) > 0);
  const pricedProducts = useMemo(() => products.filter((product) => product.priceTiers.length > 0), [products]);
  const comboProducts = useMemo(
    () => pricedProducts.filter((product) => product.category === COMBO_CATEGORY),
    [pricedProducts],
  );
  const regularProducts = useMemo(
    () => pricedProducts.filter((product) => product.category !== COMBO_CATEGORY),
    [pricedProducts],
  );

  const setProductTier = (productId: string, tierId: string) => {
    setSelectedProducts((prev) =>
      prev.map((sp) => {
        if (sp.productId !== productId) return sp;
        const product = products.find((p) => p.id === productId);
        const tier = product?.priceTiers.find((t) => t.id === tierId);
        if (!product || !tier) return sp;
        return {
          ...sp,
          tierId,
          durationHours: tier.durationHours,
          durationLabel: tier.label ?? `${tier.durationHours}h`,
          price: tier.price,
          extraPricePerHour: getTierExtraPricePerHour(product, tier),
          isComboPrice: tier.isComboPrice,
        };
      }),
    );
  };

  const toggleProduct = (product: ProductInfo) => {
    setSelectedProducts((prev) => {
      const found = prev.find((sp) => sp.productId === product.id);
      if (found) return prev.filter((sp) => sp.productId !== product.id);
      const firstTier = product.priceTiers[0];
      if (!firstTier) return prev;
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          tierId: firstTier.id,
          durationHours: firstTier.durationHours,
          durationLabel: firstTier.label ?? `${firstTier.durationHours}h`,
          price: firstTier.price,
          quantity: 1,
          extraPricePerHour: getTierExtraPricePerHour(product, firstTier),
          isComboPrice: firstTier.isComboPrice,
        },
      ];
    });
  };

  const changeQty = (productId: string, delta: number) => {
    setSelectedProducts((prev) =>
      prev.map((sp) => (sp.productId === productId ? { ...sp, quantity: Math.max(1, sp.quantity + delta) } : sp)),
    );
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
          eventCity,
          notes: notes || undefined,
          extraHours,
          items: selectedProducts.map((sp) => ({
            productId: sp.productId,
            tierId: sp.tierId,
            quantity: sp.quantity,
            durationHours: sp.durationHours,
            durationLabel: sp.durationLabel,
            price: sp.price,
            extraPricePerHour: sp.extraPricePerHour,
            isComboPrice: sp.isComboPrice,
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
      <div className="rounded-2xl border border-fl-gray-200 bg-white p-10 text-center shadow-soft-lg sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-200 bg-green-50">
          <Check className="h-10 w-10 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="mt-6 font-display text-3xl font-bold text-fl-blue-dark">Pedido enviado com sucesso!</h2>
        <p className="mx-auto mt-4 max-w-2xl text-fl-gray-600">
          Recebemos seu formulário e vamos responder com o preço final do evento. O sinal de 30% é pago na reserva e
          pode ser feito via Pix ou cartão com taxa da maquininha.
        </p>
        <p className="mt-3 text-sm text-fl-gray-500">A taxa de deslocamento será confirmada na análise do endereço.</p>
      </div>
    );
  }

  const renderProductCard = (product: ProductInfo, isCombo = false) => {
    const selected = selectedProducts.find((sp) => sp.productId === product.id);
    const isSelected = Boolean(selected);
    const firstTier = product.priceTiers[0];
    const productName = isCombo ? getComboDisplayName(product.name) : product.name;
    const showTierSelector = !isCombo || product.priceTiers.length > 1;

    return (
      <div
        key={product.id}
        className={cn(
          "rounded-2xl border p-5 transition",
          isCombo ? "border-amber-200 bg-amber-50/70" : "border-fl-gray-200 bg-white",
          isSelected &&
            (isCombo
              ? "border-amber-500 bg-amber-100/70 shadow-soft"
              : "border-fl-blue bg-fl-blue-50 shadow-soft"),
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h4 className="font-display text-lg font-bold text-fl-blue-dark">{productName}</h4>
            {isCombo
              ? firstTier && (
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-amber-900">
                    <span>{firstTier.label ?? `${firstTier.durationHours}h`}</span>
                    <span className="font-bold tabular-nums text-fl-blue-dark">{formatCurrency(firstTier.price)}</span>
                  </p>
                )
              : (
                  <>
                    <p className="text-sm text-fl-gray-500">
                      {productCategoryLabels[product.category as ProductCategory] ??
                        product.category.replace(/_/g, " ")}
                    </p>
                    {product.description && (
                      <p className="mt-1 text-sm leading-5 text-fl-gray-600">{product.description}</p>
                    )}
                  </>
                )}
          </div>
          <button
            type="button"
            onClick={() => toggleProduct(product)}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition",
              isSelected
                ? "border-green-400 bg-green-50 text-green-700"
                : "border-fl-blue bg-fl-blue text-white shadow-fl-blue/20 hover:bg-fl-blue-dark",
            )}
            aria-pressed={isSelected}
            aria-label={isSelected ? `Remover ${product.name}` : `Adicionar ${product.name}`}
          >
            {isSelected ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
            <span>{isSelected ? "Adicionado" : "Adicionar"}</span>
          </button>
        </div>

        {showTierSelector && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {product.priceTiers.map((tier) => (
              <button
                key={tier.id}
                type="button"
                disabled={!isSelected}
                onClick={() => setProductTier(product.id, tier.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
                  selected?.tierId === tier.id
                    ? "border-fl-blue bg-fl-blue text-white"
                    : "border-fl-gray-300 text-fl-gray-600 hover:border-fl-blue hover:text-fl-blue",
                )}
              >
                {tier.label ?? `${tier.durationHours}h`}
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-fl-gray-200/70 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-fl-gray-500">Qtd:</span>
              <button
                type="button"
                onClick={() => changeQty(product.id, -1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-fl-gray-300 text-fl-gray-500 hover:text-fl-blue-dark"
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <span className="w-6 text-center text-sm font-semibold tabular-nums text-fl-blue-dark">
                {selected.quantity}
              </span>
              <button
                type="button"
                onClick={() => changeQty(product.id, 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-fl-gray-300 text-fl-gray-500 hover:text-fl-blue-dark"
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="ml-auto text-right">
              {!isCombo && <p className="text-sm text-fl-gray-500">{selected.durationLabel}</p>}
              {selected.extraPricePerHour ? (
                <p className="text-xs text-fl-gray-500">Hora extra: {formatCurrency(selected.extraPricePerHour)}</p>
              ) : null}
              <p className="font-bold tabular-nums text-fl-blue-dark">{formatCurrency(selected.price)}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-[1.75rem] border border-fl-gray-200 bg-white p-5 shadow-soft-lg sm:p-8 lg:grid-cols-[1.4fr_0.9fr]"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <StepHeading step={1} title="Escolha os produtos" hint="Selecione uma ou mais atrações e ajuste o período." />

          {loading ? (
            <p className="rounded-xl bg-fl-gray-50 p-6 text-center text-fl-gray-500">Carregando produtos...</p>
          ) : (
            <div className="space-y-4">
              {comboProducts.length > 0 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
                      <Sparkles className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        Combos promocionais
                      </p>
                      <p className="mt-1 text-sm text-amber-900">
                        Ofertas fechadas para as combinações mais procuradas.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {comboProducts.map((product) => renderProductCard(product, true))}
                  </div>
                </div>
              )}

              <div>
                {comboProducts.length > 0 && (
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-fl-gray-500">
                    Produtos avulsos
                  </p>
                )}
                <div className="space-y-3">{regularProducts.map((product) => renderProductCard(product))}</div>
              </div>
            </div>
          )}

          {hasExtraEligibleProducts && (
            <div className="rounded-xl border border-fl-gray-200 bg-fl-gray-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-fl-blue">Horas extras</p>
              <p className="mt-1 text-sm text-fl-gray-500">{EXTRA_HOURS_NOTE}</p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setExtraHours(Math.max(0, extraHours - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-fl-gray-300 text-fl-gray-500 transition hover:border-fl-blue hover:text-fl-blue"
                  aria-label="Diminuir horas extras"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="w-12 text-center text-lg font-bold tabular-nums text-fl-blue-dark">{extraHours}h</span>
                <button
                  type="button"
                  onClick={() => setExtraHours(Math.min(6, extraHours + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-fl-gray-300 text-fl-gray-500 transition hover:border-fl-blue hover:text-fl-blue"
                  aria-label="Aumentar horas extras"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <StepHeading step={2} title="Dados do evento" hint="Para confirmarmos disponibilidade e deslocamento." />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="clientName" className={labelClass}>
                Nome
              </label>
              <input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={fieldClass}
                placeholder="Seu nome"
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label htmlFor="clientPhone" className={labelClass}>
                Telefone / WhatsApp
              </label>
              <input
                id="clientPhone"
                type="tel"
                inputMode="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className={fieldClass}
                placeholder="(12) 99999-9999"
                autoComplete="tel"
                required
              />
            </div>
            <div>
              <label htmlFor="eventDate" className={labelClass}>
                Data do evento
              </label>
              <input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                className={fieldClass}
                required
              />
            </div>
            <div>
              <label htmlFor="eventCity" className={labelClass}>
                Cidade
              </label>
              <select
                id="eventCity"
                value={eventCity}
                onChange={(e) => setEventCity(e.target.value)}
                className={fieldClass}
                required
              >
                <option value="">Selecione...</option>
                {supportedCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-fl-gray-200 bg-fl-gray-50 p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Resumo do orçamento</p>
          {selectedProducts.length > 0 ? (
            <div className="mt-4 space-y-3">
              {selectedProducts.map((sp) => (
                <div key={sp.productId} className="flex items-start justify-between gap-3 text-sm text-fl-gray-700">
                  <div>
                    <p className="font-medium text-fl-blue-dark">
                      {sp.isComboPrice ? getComboDisplayName(sp.productName) : sp.productName}
                    </p>
                    <p className="text-xs text-fl-gray-500">
                      {sp.quantity}x • {sp.durationLabel}
                    </p>
                  </div>
                  <span className="font-semibold tabular-nums text-fl-blue-dark">
                    {formatCurrency(sp.price * sp.quantity)}
                  </span>
                </div>
              ))}
              <div className="space-y-2 border-t border-fl-gray-200 pt-3 text-sm">
                <div className="flex justify-between text-fl-gray-600">
                  <span>Subtotal dos produtos</span>
                  <span className="tabular-nums">{formatCurrency(pricing.subtotalAmount)}</span>
                </div>
                {pricing.discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Desconto de pacote</span>
                    <span className="tabular-nums">- {formatCurrency(pricing.discountAmount)}</span>
                  </div>
                )}
                {pricing.extraTotal > 0 && (
                  <div className="flex justify-between text-fl-gray-600">
                    <span>Horas extras ({pricing.extraHours}h)</span>
                    <span className="tabular-nums">{formatCurrency(pricing.extraTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-fl-gray-600">
                  <span>Taxa de deslocamento</span>
                  <span>Sob consulta</span>
                </div>
                <div className="flex justify-between text-fl-gray-600">
                  <span>Pagamento na reserva</span>
                  <span>30%</span>
                </div>
              </div>
              <p className="text-xs leading-5 text-fl-gray-500">
                30% é pago na hora da reserva, com opção de Pix ou crédito com taxa da maquininha.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-fl-gray-500">
              Selecione pelo menos um produto para ver o resumo do orçamento.
            </p>
          )}
        </div>

        {pricing.totalAmount > 0 && (
          <div className="rounded-2xl border border-fl-blue/20 bg-fl-blue-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-fl-blue">Valor parcial dos produtos</p>
            <p className="mt-2 font-display text-3xl font-bold tabular-nums text-fl-blue-dark">
              {formatCurrency(pricing.totalAmount)}
            </p>
            <p className="mt-2 text-sm leading-6 text-fl-gray-600">
              A taxa de deslocamento será confirmada por nós no WhatsApp.
            </p>
          </div>
        )}

        {error && (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-fl-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-fl-blue/20 transition hover:bg-fl-blue-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Enviando..." : "Enviar pedido de orçamento"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <p className="text-xs leading-5 text-fl-gray-500">
          Vamos te responder com o preço final. A reserva é feita com 30% de sinal via Pix ou crédito com taxa da
          maquininha.
        </p>
      </aside>
    </form>
  );
}
