import Link from "next/link";
import { ArrowRight, Check, Clock, MessageCircleMore, Package } from "lucide-react";

import { flWhatsAppMessage, flWhatsAppNumber } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";
import { getAllProducts } from "@/server/services/products";
import { getActiveCombos } from "@/server/services/combos";
import { formatCurrency } from "@/lib/formatters";

const mainCategories = ["PLATAFORMA_360", "CAMA_ELASTICA", "FOTOGRAFIA"];

const categoryImages: Record<string, string> = {
  PLATAFORMA_360: "/images/produtos/plataforma-360.jpg",
  CAMA_ELASTICA: "/images/produtos/cama-elastica.jpg",
  FOTOGRAFIA: "/images/produtos/fotografia.jpg",
  PISCINA_BOLINHA: "/images/produtos/piscina-bolinha.jpg",
  MESAS_CADEIRAS: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=1200&q=80",
};

const productIncludes: Record<string, string[]> = {
  PLATAFORMA_360: [
    "Equipamento completo",
    "Operador durante todo o evento",
    "Iluminação LED",
    "Vídeos enviados no mesmo dia",
  ],
  CAMA_ELASTICA: [
    "Monitor",
    "Montagem",
    "Desmontagem",
    "Equipamento higienizado",
  ],
  FOTOGRAFIA: [
    "Cobertura durante todo o período contratado",
    "Todas as fotos entregues",
    "Edição de cor",
    "Fotos em alta resolução (HD)",
    "Entrega digital",
  ],
};

function PricingTable({
  tiers,
  title,
}: {
  tiers: { durationHours: number; price: number; label?: string }[];
  title: string;
}) {
  if (tiers.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">{title}</p>
      <div className="mt-2 overflow-hidden rounded-xl border border-fl-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fl-gray-200 bg-fl-gray-50">
              <th className="px-4 py-3 text-left font-medium text-fl-gray-600">Tempo</th>
              <th className="px-4 py-3 text-left font-medium text-fl-gray-600">Valor</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier) => (
              <tr key={tier.durationHours + (tier.label ?? "")} className="border-b border-fl-gray-100">
                <td className="px-4 py-3 text-fl-gray-700">{tier.label ?? `${tier.durationHours}h`}</td>
                <td className="px-4 py-3 font-semibold text-fl-blue-dark">
                  {formatCurrency(tier.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function ProdutosPage() {
  const allProducts = await getAllProducts();
  const mainProducts = allProducts.filter((p) => mainCategories.includes(p.category) && p.isActive);
  const consultProducts = allProducts.filter(
    (p) => !mainCategories.includes(p.category) && p.isActive && !p.priceConfirmed,
  );
  const combos = await getActiveCombos();
  const whatsappHref = buildWhatsAppUrl(flWhatsAppNumber, flWhatsAppMessage);

  return (
    <main>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">Tabela de preços</p>
          <h1 className="mt-4 text-center font-display text-4xl font-bold text-fl-blue-dark sm:text-5xl">
            Nossos produtos
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-fl-gray-600">
            Confira os valores e escolha os melhores equipamentos para seu evento.
          </p>

          <div className="mt-16 space-y-20">
            {mainProducts.map((product) => {
              const img = categoryImages[product.category] ?? "";
              const includes = productIncludes[product.category] ?? [];
              const normalTiers = product.priceTiers.filter((t) => !t.isComboPrice);

              return (
                <div key={product.id} className="grid gap-10 lg:grid-cols-2 lg:items-center">
                  <div className="overflow-hidden rounded-2xl border border-fl-gray-200 shadow-soft">
                    {img ? (
                      <div
                        className="aspect-[4/3] bg-cover bg-center"
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-fl-gray-100">
                        <Package className="h-16 w-16 text-fl-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-display text-3xl font-bold text-fl-blue-dark">{product.name}</h2>
                    {product.description && (
                      <p className="mt-3 text-base leading-7 text-fl-gray-600">{product.description}</p>
                    )}

                    {includes.length > 0 && (
                      <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Incluso</p>
                        <ul className="mt-3 space-y-2">
                          {includes.map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-green-700">
                              <Check className="h-4 w-4 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {normalTiers.length > 0 && (
                      <PricingTable tiers={normalTiers} title="Valores" />
                    )}

                    {product.extraPricePerHour && (
                      <p className="mt-2 text-sm text-fl-gray-500">
                        Hora extra (por produto): {formatCurrency(product.extraPricePerHour)}
                      </p>
                    )}

                    <Link
                      href={`/orcamento?product=${product.id}`}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-fl-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark"
                    >
                      Reservar
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {consultProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="font-display text-3xl font-bold text-fl-blue-dark">Sob consulta</h2>
              <p className="mt-2 text-sm text-fl-gray-500">
                Estes produtos são terceirizados. Consulte valores e disponibilidade.
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {consultProducts.map((product) => {
                  const img = categoryImages[product.category] ?? "";
                  return (
                    <div
                      key={product.id}
                      className="flex items-center gap-6 rounded-2xl border border-fl-gray-200 bg-white p-6 shadow-soft"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                        {img ? (
                          <div
                            className="h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${img})` }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-fl-gray-100">
                            <Package className="h-8 w-8 text-fl-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-fl-blue-dark">{product.name}</h3>
                        {product.description && (
                          <p className="mt-1 text-sm text-fl-gray-600">{product.description}</p>
                        )}
                        <span className="mt-2 inline-block rounded-full bg-amber-50 px-3 py-0.5 text-xs font-medium text-amber-700">
                          Consulte valores
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-20">
            <h2 className="font-display text-3xl font-bold text-fl-blue-dark">Combos</h2>
            <p className="mt-2 text-sm text-fl-gray-500">
              Economize contratando um pacote completo.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {combos.map((combo) => (
                <div
                  key={combo.id}
                  className="group rounded-2xl border border-fl-gray-200 bg-white p-8 shadow-soft transition-shadow hover:shadow-soft-lg"
                >
                  {combo.discountPct ? (
                    <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      {combo.discountPct}% de desconto
                    </span>
                  ) : (
                    <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                      Sob medida
                    </span>
                  )}
                  <h3 className="mt-5 font-display text-2xl font-bold text-fl-blue-dark">{combo.name}</h3>
                  {combo.description && (
                    <p className="mt-2 text-sm leading-6 text-fl-gray-600">{combo.description}</p>
                  )}
                  {combo.durationHours > 0 && (
                    <p className="mt-2 flex items-center gap-1 text-sm text-fl-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      {combo.durationHours}h de evento
                    </p>
                  )}
                  {combo.items.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {combo.items.map((item) => (
                        <p key={item.id} className="text-sm text-fl-gray-500">
                          {item.quantity}x {item.product.name}
                        </p>
                      ))}
                    </div>
                  )}
                  {combo.totalPrice > 0 ? (
                    <p className="mt-4 font-display text-3xl font-bold text-fl-blue-dark">
                      {formatCurrency(combo.totalPrice)}
                    </p>
                  ) : (
                    <p className="mt-4 text-sm font-medium text-amber-600">Consulte valores</p>
                  )}
                  <div className="mt-6">
                    {combo.id === "combo-personalizado" ? (
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-fl-gray-300 px-5 py-2.5 text-sm font-semibold text-fl-gray-700 transition hover:border-fl-blue hover:text-fl-blue"
                      >
                        <MessageCircleMore className="h-4 w-4" />
                        Fale conosco
                      </a>
                    ) : (
                      <Link
                        href={`/orcamento?combo=${combo.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-fl-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark"
                      >
                        Reservar
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
