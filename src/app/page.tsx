import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  FileText,
  HeartHandshake,
  Instagram,
  MapPin,
  MessageCircleMore,
  Package,
  Truck,
  Users,
} from "lucide-react";

import { flWhatsAppMessage, flWhatsAppNumber, flInstagramUrl, coverageInfo } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";
import { getAllProducts } from "@/server/services/products";
import { getActiveCombos } from "@/server/services/combos";
import { formatCurrency } from "@/lib/formatters";
import { Hero } from "@/components/landing/hero";

const highlights = [
  { icon: Users, title: "Monitores", desc: "Profissionais dedicados durante todo o evento." },
  { icon: Truck, title: "Montagem e Desmontagem", desc: "Cuidamos de tudo. Você só aproveita." },
  { icon: FileText, title: "Contrato", desc: "Contrato formal para oficializar o processo." },
  { icon: HeartHandshake, title: "Atendimento Completo", desc: "Suporte do orçamento à finalização." },
];

const steps = [
  { step: "01", title: "Escolha", desc: "Selecione os brinquedos e atrações que deseja para seu evento." },
  { step: "02", title: "Orçamento", desc: "Solicite um orçamento pelo WhatsApp e receba uma proposta personalizada." },
  { step: "03", title: "Realização", desc: "Cuidamos da montagem e desmontagem. Você só aproveita a festa." },
];

const featuredCategories = ["PLATAFORMA_360", "CAMA_ELASTICA", "FOTOGRAFIA"];

const categoryImages: Record<string, string> = {
  PLATAFORMA_360: "/images/produtos/plataforma-360.jpg",
  CAMA_ELASTICA: "/images/produtos/cama-elastica.jpg",
  FOTOGRAFIA: "/images/produtos/fotografia.jpg",
};

export default async function HomePage() {
  const allProducts = await getAllProducts();
  const featured = allProducts.filter((p) => featuredCategories.includes(p.category) && p.isActive);
  const combos = await getActiveCombos();
  const whatsappHref = buildWhatsAppUrl(flWhatsAppNumber, flWhatsAppMessage);

  return (
    <main>
      <Hero />

      <section id="como-funciona" className="border-b border-fl-gray-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">Como funciona</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-fl-blue-dark sm:text-4xl">
              Simples e rápido
            </h2>
            <p className="mt-3 text-base text-fl-gray-600">
              Em três passos simples você garante a diversão do seu evento.
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-fl-blue/10 text-lg font-bold text-fl-blue">
                  {step}
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-fl-blue-dark">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-fl-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section id="produtos" className="border-b border-fl-gray-100 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">Nossos produtos</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-fl-blue-dark sm:text-4xl">
                O que oferecemos
              </h2>
              <p className="mt-3 text-base text-fl-gray-600">
                Conheça nossas atrações mais populares para festas e eventos.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => {
                const img = categoryImages[product.category] ?? "";
                return (
                  <div
                    key={product.id}
                    className="group overflow-hidden rounded-2xl border border-fl-gray-200 bg-white shadow-soft transition-shadow hover:shadow-soft-lg"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-fl-gray-100">
                      {img ? (
                        <div
                          className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${img})` }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-12 w-12 text-fl-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold text-fl-blue-dark">{product.name}</h3>
                      {product.description && (
                        <p className="mt-2 text-sm leading-6 text-fl-gray-600">{product.description}</p>
                      )}
                      <Link
                        href="/produtos"
                        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-fl-blue transition hover:text-fl-blue-dark"
                      >
                        Ver detalhes
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {combos.length > 0 && (
        <section className="border-b border-fl-gray-100 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">Combos</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-fl-blue-dark sm:text-4xl">
                Pacotes especiais
              </h2>
              <p className="mt-3 text-base text-fl-gray-600">
                Economize com nossos combos preparados para cada tipo de evento.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {combos.map((combo) => (
                <div
                  key={combo.id}
                  className="rounded-2xl border border-fl-gray-200 bg-white p-8 shadow-soft transition-shadow hover:shadow-soft-lg"
                >
                  {combo.discountPct ? (
                    <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {combo.discountPct}% de desconto
                    </span>
                  ) : (
                    <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Sob medida
                    </span>
                  )}
                  <h3 className="mt-5 font-display text-2xl font-bold text-fl-blue-dark">{combo.name}</h3>
                  {combo.description && (
                    <p className="mt-2 text-sm leading-6 text-fl-gray-600">{combo.description}</p>
                  )}
                  {combo.durationHours > 0 && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-fl-gray-500">
                      <Clock className="h-4 w-4" />
                      {combo.durationHours}h de evento
                    </p>
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
        </section>
      )}

      <section className="border-b border-fl-gray-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">Diferenciais</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-fl-blue-dark sm:text-4xl">
              Por que nos escolher
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-fl-gray-200 bg-white p-6 text-center shadow-soft transition-shadow hover:shadow-soft-lg"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-fl-blue/10">
                  <Icon className="h-6 w-6 text-fl-blue" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-fl-blue-dark">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-fl-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-fl-gray-200 bg-white p-10 text-center shadow-soft">
            <MapPin className="mx-auto h-8 w-8 text-fl-blue" />
            <h2 className="mt-4 font-display text-2xl font-bold text-fl-blue-dark sm:text-3xl">
              Área de atendimento
            </h2>
            <p className="mt-3 text-base text-fl-gray-600">
              Atendemos em <strong className="text-fl-blue-dark">{coverageInfo.cities}</strong>.
            </p>
            <ul className="mx-auto mt-6 max-w-xs space-y-3 text-left text-sm text-fl-gray-600">
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 shrink-0 text-green-600" />
                Até {coverageInfo.freeKm} km sem taxa adicional
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 shrink-0 text-green-600" />
                Acima de {coverageInfo.freeKm} km: {formatCurrency(coverageInfo.extraKmRate)} a cada{" "}
                {coverageInfo.extraKmStep} km extras
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 shrink-0 text-green-600" />
                Reserva mediante 30% do valor
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="contato" className="border-t border-fl-gray-100 bg-fl-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">Contato</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-fl-blue-dark sm:text-4xl">
              Vamos transformar seu evento?
            </h2>
            <p className="mt-3 text-base text-fl-gray-600">
              Entre em contato pelo WhatsApp ou Instagram e faça seu orçamento.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-fl-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark"
              >
                <MessageCircleMore className="h-5 w-5" />
                WhatsApp
              </a>
              <a
                href={flInstagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-fl-gray-300 px-6 py-3 text-sm font-semibold text-fl-gray-700 transition hover:border-fl-blue hover:text-fl-blue"
              >
                <Instagram className="h-5 w-5" />
                @fl_locacoesvale
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-fl-gray-200 py-10 text-center text-sm text-fl-gray-500">
        <p>&copy; {new Date().getFullYear()} F&L Locações. Todos os direitos reservados.</p>
        <p className="mt-1">Siga-nos no Instagram: @fl_locacoesvale</p>
      </footer>
    </main>
  );
}
