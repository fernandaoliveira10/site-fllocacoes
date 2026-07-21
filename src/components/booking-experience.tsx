"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { addDays, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isBefore, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, Check, Clock, Minus, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";

interface ProductInfo {
  id: string;
  name: string;
  category: string;
  priceTiers: { id: string; durationHours: number; price: number; label?: string; isComboPrice: boolean }[];
  extraPricePerHour: number | null;
}

interface ComboInfo {
  id: string;
  name: string;
  description: string | null;
  totalPrice: number;
  durationHours: number;
  discountPct: number | null;
  items: { productId: string; product: { name: string }; quantity: number; durationHours?: number }[];
}

interface SelectedProduct {
  productId: string;
  productName: string;
  tierId: string;
  durationHours: number;
  price: number;
  quantity: number;
}

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00", "20:00",
];

export function BookingExperience() {
  const searchParams = useSearchParams();
  const preselectedComboId = searchParams.get("combo");
  const preselectedProductId = searchParams.get("product");

  const [step, setStep] = useState(0);
  const [combos, setCombos] = useState<ComboInfo[]>([]);
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"combo" | "individual">(
    preselectedProductId ? "individual" : "combo",
  );

  const [selectedComboId, setSelectedComboId] = useState<string | null>(preselectedComboId);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [extraHours, setExtraHours] = useState(0);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [eventTime, setEventTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [eventCity, setEventCity] = useState("");
  const [eventNotes, setEventNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [combosRes, productsRes] = await Promise.all([
          fetch("/api/combos"),
          fetch("/api/products"),
        ]);
        const combosData = await combosRes.json();
        const productsData = await productsRes.json();
        setCombos(Array.isArray(combosData) ? combosData.filter((c: ComboInfo) => c.id !== "combo-personalizado") : []);
        setProducts(Array.isArray(productsData) ? productsData : []);

        if (preselectedProductId && Array.isArray(productsData)) {
          const prod = productsData.find((p: ProductInfo) => p.id === preselectedProductId);
          if (prod) {
            const normalTiers = prod.priceTiers.filter((t: { isComboPrice: boolean }) => !t.isComboPrice);
            if (normalTiers.length > 0) {
              setSelectedProducts([{
                productId: prod.id,
                productName: prod.name,
                tierId: normalTiers[0].id,
                durationHours: normalTiers[0].durationHours,
                price: normalTiers[0].price,
                quantity: 1,
              }]);
            }
          }
        }
      } catch {
        setCombos([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [preselectedProductId]);

  const selectedCombo = combos.find((c) => c.id === selectedComboId) ?? null;

  const comboTotal = selectedCombo ? selectedCombo.totalPrice : 0;
  const comboItemsCount = selectedCombo ? selectedCombo.items.length : 0;
  const individualTotal = selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const productsCount = mode === "combo" ? comboItemsCount : selectedProducts.length;
  const extraTotal = extraHours * 5000 * productsCount;
  const totalAmount = (mode === "combo" ? comboTotal : individualTotal) + extraTotal;
  const depositAmount = Math.round(totalAmount * 0.3);

  const canContinue = () => {
    if (step === 0) {
      if (mode === "combo") return !!selectedComboId;
      return selectedProducts.length > 0;
    }
    if (step === 1) return !!eventDate && !!eventTime;
    if (step === 2) return clientName.length >= 3 && clientEmail.includes("@") && clientPhone.length >= 8 && eventType.length >= 1 && eventAddress.length >= 5;
    return true;
  };

  const handleTierChange = (productId: string, tierId: string) => {
    setSelectedProducts((prev) =>
      prev.map((sp) => {
        if (sp.productId !== productId) return sp;
        const product = products.find((p) => p.id === productId);
        const tier = product?.priceTiers.find((t) => t.id === tierId);
        if (!tier) return sp;
        return { ...sp, tierId, durationHours: tier.durationHours, price: tier.price };
      }),
    );
  };

  const handleProductQuantity = (productId: string, delta: number) => {
    setSelectedProducts((prev) =>
      prev.map((sp) => {
        if (sp.productId !== productId) return sp;
        return { ...sp, quantity: Math.max(1, sp.quantity + delta) };
      }),
    );
  };

  const toggleProductSelection = (product: ProductInfo) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((sp) => sp.productId === product.id);
      if (exists) return prev.filter((sp) => sp.productId !== product.id);
      const normalTiers = product.priceTiers.filter((t) => !t.isComboPrice);
      if (normalTiers.length === 0) return prev;
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          tierId: normalTiers[0].id,
          durationHours: normalTiers[0].durationHours,
          price: normalTiers[0].price,
          quantity: 1,
        },
      ];
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const body: Record<string, unknown> = {
        clientName,
        clientEmail,
        clientPhone,
        eventDate: eventDate?.toISOString() ?? "",
        eventTime: eventTime ?? "",
        extraHours,
        eventType,
        eventAddress,
        eventCity: eventCity || undefined,
        eventNotes: eventNotes || undefined,
      };

      if (mode === "combo" && selectedComboId) {
        body.comboId = selectedComboId;
      } else if (mode === "individual" && selectedProducts.length > 0) {
        body.items = selectedProducts.map((sp) => ({
          productId: sp.productId,
          quantity: sp.quantity,
          durationHours: sp.durationHours,
          price: sp.price,
        }));
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const err = await res.json();
        alert(`Erro: ${err.error ?? "Tente novamente."}`);
      }
    } catch {
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-fl-gray-200 bg-fl-gray-50 p-16 text-center shadow-soft">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-fl-gray-200 bg-white shadow-soft">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="mt-6 font-display text-3xl font-bold text-fl-blue-dark">Orçamento enviado!</h2>
        <p className="mx-auto mt-4 max-w-md text-fl-gray-600">
          Recebemos seu pedido. Entraremos em contato em breve para confirmar e acertar os detalhes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-fl-gray-200 bg-white p-6 shadow-soft-lg sm:p-10">
      <div className="flex items-center justify-center gap-8">
        {["Escolha", "Data", "Dados"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition",
                i < step
                  ? "bg-fl-blue text-white"
                  : i === step
                    ? "border-2 border-fl-blue text-fl-blue"
                    : "border-2 border-fl-gray-300 text-fl-gray-400",
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn("hidden text-sm sm:inline", i === step ? "font-semibold text-fl-blue-dark" : "text-fl-gray-500")}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-10">
        {step === 0 && (
          <div>
            <div className="mb-8 flex items-center justify-center gap-2 rounded-xl border border-fl-gray-200 bg-fl-gray-50 p-1.5">
              <button
                onClick={() => { setMode("combo"); setSelectedComboId(null); }}
                className={cn(
                  "rounded-xl px-5 py-2 text-sm font-medium transition",
                  mode === "combo" ? "bg-white text-fl-blue-dark shadow-soft" : "text-fl-gray-500 hover:text-fl-blue-dark",
                )}
              >
                Pacotes
              </button>
              <button
                onClick={() => { setMode("individual"); setSelectedComboId(null); }}
                className={cn(
                  "rounded-xl px-5 py-2 text-sm font-medium transition",
                  mode === "individual" ? "bg-white text-fl-blue-dark shadow-soft" : "text-fl-gray-500 hover:text-fl-blue-dark",
                )}
              >
                Produtos individuais
              </button>
            </div>

            {loading ? (
              <p className="text-center text-fl-gray-500">Carregando...</p>
            ) : mode === "combo" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {combos.map((combo) => (
                  <button
                    key={combo.id}
                    onClick={() => setSelectedComboId(combo.id)}
                    className={cn(
                      "rounded-2xl border p-6 text-left transition shadow-soft hover:shadow-soft-lg",
                      selectedComboId === combo.id
                        ? "border-fl-blue bg-fl-blue/5"
                        : "border-fl-gray-200 bg-white hover:border-fl-blue/30",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-fl-blue" />
                      <span className="font-display text-xl font-bold text-fl-blue-dark">{combo.name}</span>
                    </div>
                    {combo.description && (
                      <p className="mt-2 text-sm text-fl-gray-500">{combo.description}</p>
                    )}
                    {combo.durationHours > 0 && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-fl-gray-500">
                        <Clock className="h-3 w-3" />
                        {combo.items.map((item) => `${item.product.name}${item.durationHours ? ` (${item.durationHours}h)` : ""}`).join(", ")}
                      </p>
                    )}
                    {combo.discountPct && (
                      <span className="mt-3 inline-block rounded-full bg-green-50 px-3 py-0.5 text-xs font-medium text-green-700">
                        {combo.discountPct}% de desconto
                      </span>
                    )}
                    <p className="mt-3 font-display text-2xl font-bold text-fl-blue-dark">
                      {formatCurrency(combo.totalPrice)}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">
                  Selecione os produtos e a duração
                </p>
                {products
                  .filter((p) => p.priceTiers.some((t) => !t.isComboPrice))
                  .map((product) => {
                    const normalTiers = product.priceTiers.filter((t) => !t.isComboPrice);
                    const isSelected = selectedProducts.some((sp) => sp.productId === product.id);
                    const selected = selectedProducts.find((sp) => sp.productId === product.id);
                    return (
                      <div
                        key={product.id}
                        className={cn(
                          "rounded-2xl border p-5 transition",
                          isSelected ? "border-fl-blue bg-fl-blue/5 shadow-soft" : "border-fl-gray-200 bg-white",
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-display text-lg font-bold text-fl-blue-dark">{product.name}</h3>
                            <p className="text-sm text-fl-gray-500">{product.category.replace("_", " ")}</p>
                          </div>
                          <button
                            onClick={() => toggleProductSelection(product)}
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-lg border text-sm transition",
                              isSelected
                                ? "border-green-400 bg-green-50 text-green-600"
                                : "border-fl-gray-300 text-fl-gray-500 hover:border-fl-blue hover:text-fl-blue",
                            )}
                          >
                            {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </button>
                        </div>

                        {isSelected && selected && (
                          <div className="mt-4 flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-fl-gray-500">Duração:</span>
                              <div className="flex gap-1.5">
                                {normalTiers.map((tier) => (
                                  <button
                                    key={tier.id}
                                    onClick={() => handleTierChange(product.id, tier.id)}
                                    className={cn(
                                      "rounded-lg border px-3 py-1 text-xs font-medium transition",
                                      selected.tierId === tier.id
                                        ? "border-fl-blue bg-fl-blue text-white"
                                        : "border-fl-gray-300 text-fl-gray-600 hover:border-fl-blue hover:text-fl-blue",
                                    )}
                                  >
                                    {tier.durationHours}h
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-fl-gray-500">Qtd:</span>
                              <button
                                onClick={() => handleProductQuantity(product.id, -1)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-fl-gray-300 text-fl-gray-500 hover:text-fl-blue-dark"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-medium text-fl-blue-dark">{selected.quantity}</span>
                              <button
                                onClick={() => handleProductQuantity(product.id, 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-fl-gray-300 text-fl-gray-500 hover:text-fl-blue-dark"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
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
            )}

            <div className="mt-8 rounded-xl border border-fl-gray-200 bg-fl-gray-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-fl-blue">Horas extras</p>
              <p className="mt-1 text-sm text-fl-gray-500">
                R$ 50 por produto por hora extra
              </p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => setExtraHours(Math.max(0, extraHours - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-fl-gray-300 text-fl-gray-500 transition hover:border-fl-blue hover:text-fl-blue"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-lg font-bold text-fl-blue-dark">{extraHours}h</span>
                <button
                  onClick={() => setExtraHours(Math.min(6, extraHours + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-fl-gray-300 text-fl-gray-500 transition hover:border-fl-blue hover:text-fl-blue"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {(mode === "combo" && selectedCombo) || (mode === "individual" && selectedProducts.length > 0) ? (
              <div className="mt-6 space-y-2 rounded-xl border border-fl-gray-200 bg-fl-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Resumo do orçamento</p>
                <div className="flex justify-between text-sm text-fl-gray-600">
                  <span>Valor base</span>
                  <span>{formatCurrency(mode === "combo" ? comboTotal : individualTotal)}</span>
                </div>
                {extraHours > 0 && (
                  <div className="flex justify-between text-sm text-fl-gray-600">
                    <span>{extraHours}h extra(s) x {productsCount} produto(s)</span>
                    <span>{formatCurrency(extraTotal)}</span>
                  </div>
                )}
                <div className="border-t border-fl-gray-200 pt-2">
                  <div className="flex justify-between font-bold text-fl-blue-dark">
                    <span>Total estimado</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-fl-blue">
                    <span>Sinal de reserva (30% — pago agora)</span>
                    <span>{formatCurrency(depositAmount)}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-fl-gray-500">
                    O sinal de 30% é pago no momento da reserva para garantir sua data.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Data do evento</p>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-fl-gray-300 text-fl-gray-500 transition hover:text-fl-blue-dark disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="text-lg">&#8249;</span>
              </button>
              <span className="font-display text-lg font-bold text-fl-blue-dark">
                {format(currentMonth, "MMMM yyyy", { locale: ptBR }).replace(/^(\w)/, (c) => c.toUpperCase())}
              </span>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-fl-gray-300 text-fl-gray-500 transition hover:text-fl-blue-dark"
              >
                <span className="text-lg">&#8250;</span>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
                <div key={day} className="py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-fl-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const monthStart = startOfMonth(currentMonth);
                const monthEnd = endOfMonth(currentMonth);
                const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
                const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
                const days = eachDayOfInterval({ start: calStart, end: calEnd });
                const today = startOfToday();
                const tomorrow = addDays(today, 1);

                return days.map((day, i) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isSelected = eventDate && day.toDateString() === eventDate.toDateString();
                  const isDisabled = isBefore(day, tomorrow);

                  return (
                    <button
                      key={i}
                      disabled={isDisabled || !isCurrentMonth}
                      onClick={() => setEventDate(day)}
                      className={cn(
                        "flex flex-col items-center rounded-xl border py-2 text-sm transition",
                        isSelected
                          ? "border-fl-blue bg-fl-blue text-white"
                          : isDisabled || !isCurrentMonth
                            ? "border-transparent text-fl-gray-300 cursor-default"
                            : "border-fl-gray-200 text-fl-gray-600 hover:border-fl-blue hover:text-fl-blue",
                      )}
                    >
                      <span className="font-bold">{format(day, "d")}</span>
                    </button>
                  );
                });
              })()}
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Horário</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  onClick={() => setEventTime(time)}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm font-medium transition",
                    eventTime === time
                      ? "border-fl-blue bg-fl-blue text-white"
                      : "border-fl-gray-300 text-fl-gray-600 hover:border-fl-blue hover:text-fl-blue",
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            {(selectedCombo || selectedProducts.length > 0) && (
              <div className="rounded-xl border border-fl-gray-200 bg-fl-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Resumo</p>
                {selectedCombo ? (
                  <>
                    <p className="mt-2 font-bold text-fl-blue-dark">{selectedCombo.name}</p>
                    <p className="text-sm text-fl-gray-600">{selectedCombo.description}</p>
                  </>
                ) : (
                  selectedProducts.map((sp) => (
                    <p key={sp.productId} className="mt-1 text-sm text-fl-gray-600">
                      {sp.quantity}x {sp.productName} - {sp.durationHours}h
                    </p>
                  ))
                )}
                <p className="mt-2 text-lg font-bold text-fl-blue-dark">{formatCurrency(totalAmount)}</p>
                {extraHours > 0 && (
                  <p className="text-sm text-fl-gray-500">{extraHours}h extra(s)</p>
                )}
                <p className="mt-1 text-sm font-medium text-fl-blue">
                  Sinal de reserva (30%): {formatCurrency(depositAmount)}
                </p>
                <p className="text-xs text-fl-gray-500 mt-0.5">
                  Pago agora para garantir sua data
                </p>
                {eventDate && (
                  <p className="text-sm text-fl-gray-500">
                    {format(eventDate, "dd/MM/yyyy")} às {eventTime}
                  </p>
                )}
              </div>
            )}

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">
                A taxa de locomoção será calculada com base na distância do seu evento e enviada separadamente após análise da sua solicitação.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Tipo de evento</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-fl-gray-200 bg-white px-4 py-3 text-fl-gray-900 outline-none transition focus:border-fl-blue"
              >
                <option value="">Selecione...</option>
                <option value="aniversario">Aniversário</option>
                <option value="aniversario-15">Aniversário de 15 anos</option>
                <option value="casamento">Casamento</option>
                <option value="cha-bebe">Chá de bebê</option>
                <option value="festa-infantil">Festa infantil</option>
                <option value="corporativo">Corporativo</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Nome</label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-fl-gray-200 bg-white px-4 py-3 text-fl-gray-900 outline-none transition focus:border-fl-blue"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Email</label>
              <input
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-fl-gray-200 bg-white px-4 py-3 text-fl-gray-900 outline-none transition focus:border-fl-blue"
                placeholder="seu@email.com"
                type="email"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Telefone / WhatsApp</label>
              <input
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="mt-2 w-full rounded-xl border border-fl-gray-200 bg-white px-4 py-3 text-fl-gray-900 outline-none transition focus:border-fl-blue"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Endereço do evento</label>
              <textarea
                value={eventAddress}
                onChange={(e) => setEventAddress(e.target.value)}
                className="mt-2 w-full rounded-xl border border-fl-gray-200 bg-white px-4 py-3 text-fl-gray-900 outline-none transition focus:border-fl-blue"
                placeholder="Rua, número, bairro, complemento"
                rows={3}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Cidade do evento</label>
              <input
                value={eventCity}
                onChange={(e) => setEventCity(e.target.value)}
                className="mt-2 w-full rounded-xl border border-fl-gray-200 bg-white px-4 py-3 text-fl-gray-900 outline-none transition focus:border-fl-blue"
                placeholder="Cidade onde será o evento"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Observações / detalhes adicionais</label>
              <textarea
                value={eventNotes}
                onChange={(e) => setEventNotes(e.target.value)}
                className="mt-2 w-full rounded-xl border border-fl-gray-200 bg-white px-4 py-3 text-fl-gray-900 outline-none transition focus:border-fl-blue"
                placeholder="Horário de montagem, pedidos especiais, etc. (opcional)"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={cn(
            "rounded-xl border border-fl-gray-300 px-5 py-2.5 text-sm font-medium text-fl-gray-600 transition hover:text-fl-blue-dark",
            step === 0 && "invisible",
          )}
        >
          Voltar
        </button>

        {step < 2 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canContinue()}
            className="inline-flex items-center gap-2 rounded-xl bg-fl-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-fl-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Enviando..." : "Solicitar orçamento"}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
