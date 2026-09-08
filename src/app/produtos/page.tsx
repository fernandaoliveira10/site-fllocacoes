import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Instagram, MapPin, Package, Sparkles } from "lucide-react";

import { ImageCarousel } from "@/components/image-carousel";
import { Reveal } from "@/components/reveal";
import { WhatsAppButton } from "@/components/cta";
import { flInstagramUrl } from "@/lib/constants";
import type { CarouselSlide } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";
import { getAllProducts } from "@/server/services/products";

export const metadata: Metadata = {
  title: "Produtos e preços | F&L Locações",
  description:
    "Valores da Plataforma 360, cama elástica de 3 metros, fotografia profissional e totem fotográfico. Deslocamento sob consulta e reserva com 30% de sinal.",
};

const bannerSlides: CarouselSlide[] = [
  { src: "/images/capa1.png", alt: "Experiências da F&L Locações" },
  { src: "/images/capa2.png", alt: "Atrações da F&L Locações para festas" },
];

const categoryImages: Record<string, string> = {
  PLATAFORMA_360: "/images/produtos/plataforma-360.jpg",
  CAMA_ELASTICA: "/images/produtos/cama-elastica.jpg",
  FOTOGRAFIA: "/images/produtos/fotografia.jpg",
  TOTEM_FOTOGRAFICO: "/images/produtos/totem-1.jpeg",
  PISCINA_BOLINHA: "/images/produtos/piscina-bolinha.jpg",
  MESAS_CADEIRAS: "/images/produtos/mesas-cadeiras.jpg",
};

const productIncludes: Record<string, string[]> = {
  PLATAFORMA_360: [
    "Equipamento completo",
    "Operador durante todo o evento",
    "Iluminação LED",
    "Vídeos disponíveis automaticamente via QR Code",
    "Moldura personalizada e música escolhida pelo cliente",
  ],
  CAMA_ELASTICA: ["Montagem", "Desmontagem", "Equipamento higienizado", "Monitor (opcional)"],
  FOTOGRAFIA: [
    "Cobertura durante todo o período contratado",
    "Todas as fotos entregues",
    "Edição de cor",
    "Fotos em alta resolução (HD)",
    "Entrega digital",
  ],
  TOTEM_FOTOGRAFICO: [
    "Fotos ilimitadas durante o período contratado",
    "QR Code para convidados baixarem as fotos no celular",
    "Moldura/carrossel de fotos personalizado",
    "Monitor durante todo o evento",
    "Envio de todas as fotos digitais após o evento",
    "Impressão na hora nas opções com fotos impressas",
  ],
};

function buildProductSlides(product: {
  name: string;
  category: string;
  media: { url: string; alt?: string; type: string }[];
}): CarouselSlide[] {
  const explicitSlides: CarouselSlide[] = product.media
    .filter((media) => Boolean(media.url))
    .map((media) => ({
      src: media.url,
      alt: media.alt ?? product.name,
      type: media.type === "VIDEO" ? ("VIDEO" as const) : ("IMAGE" as const),
    }));

  if (explicitSlides.length > 0) {
    return explicitSlides;
  }

  const fallbackImage = categoryImages[product.category];
  return fallbackImage ? [{ src: fallbackImage, alt: product.name, type: "IMAGE" }] : [];
}

export default async function ProdutosPage() {
  const allProducts = await getAllProducts();
  const mainCategories = ["PLATAFORMA_360", "CAMA_ELASTICA", "FOTOGRAFIA", "TOTEM_FOTOGRAFICO"];
  const mainProducts = allProducts.filter(
    (product) => mainCategories.includes(product.category) && product.isActive,
  );
  const consultProducts = allProducts.filter(
    (product) => !mainCategories.includes(product.category) && product.isActive && !product.priceConfirmed,
  );

  return (
    <main className="bg-white">
      {/* --------------------------------------------------------------- HERO */}
      <section className="bg-fl-blue-dark py-12 text-white sm:py-16">
        <div className="fl-shell grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="fl-eyebrow text-fl-yellow">Produtos e preços</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight text-balance sm:text-5xl">
              Valores claros para montar o seu evento
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/80">
              Veja o que está incluso em cada atração, compare os períodos e reserve com 30% de sinal. O deslocamento é
              confirmado conforme o endereço do evento.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/orcamento"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-fl-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Montar orçamento
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <WhatsAppButton size="lg" variant="outline-light">
                Tirar dúvidas no WhatsApp
              </WhatsAppButton>
            </div>
          </Reveal>

          <Reveal index={1}>
            <ImageCarousel
              images={bannerSlides}
              className="border-white/10 shadow-glow"
              imageClassName="aspect-[16/10]"
              mediaFit="cover"
            />
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------------- INTRO */}
      <section className="py-16 sm:py-20">
        <div className="fl-shell max-w-3xl text-center">
          <Reveal>
            <p className="fl-eyebrow justify-center">Sobre a F&amp;L Locações</p>
            <h2 className="fl-heading mt-3 text-3xl sm:text-4xl">
              Sua festa merece mais diversão e lembranças inesquecíveis
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-fl-gray-600">
              Levamos entretenimento e registros de alta qualidade para eventos em São José dos Campos e todo o Vale do
              Paraíba. Ideal para aniversários, casamentos, eventos corporativos e confraternizações.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ PRODUCTS */}
      <section id="produtos" className="scroll-mt-24 bg-fl-gray-50 py-16 sm:py-20">
        <div className="fl-shell">
          <Reveal className="max-w-3xl">
            <p className="fl-eyebrow">Tabela de preços</p>
            <h2 className="fl-heading mt-3 text-3xl sm:text-5xl">Nossos produtos</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-fl-gray-600">
              Valores fixos por período. O deslocamento fica sob consulta e é confirmado pelo endereço.
            </p>
          </Reveal>

          <div className="mt-14 space-y-14">
            {mainProducts.map((product, i) => {
              const includes = productIncludes[product.category] ?? [];
              const normalTiers = product.priceTiers.filter((tier) => !tier.isComboPrice);
              const slides = buildProductSlides(product);
              const flip = i % 2 === 1;

              return (
                <Reveal
                  key={product.id}
                  as="article"
                  className="overflow-hidden rounded-[2rem] border border-fl-gray-200 bg-white shadow-soft"
                >
                  <div className="grid gap-0 lg:grid-cols-2">
                    <div className={`relative bg-fl-gray-100 ${flip ? "lg:order-2" : ""}`}>
                      <ImageCarousel
                        images={slides}
                        mediaFit="cover"
                        imageClassName="aspect-[4/3] lg:aspect-[5/4]"
                        className="rounded-none border-0 shadow-none"
                        emptyState={
                          <div className="flex aspect-[4/3] items-center justify-center bg-fl-gray-50">
                            <Package className="h-16 w-16 text-fl-gray-400" aria-hidden="true" />
                          </div>
                        }
                      />
                    </div>

                    <div className={`p-6 sm:p-8 lg:p-10 ${flip ? "lg:order-1" : ""}`}>
                      <h3 className="font-display text-2xl font-bold text-fl-blue-dark sm:text-3xl">{product.name}</h3>
                      {product.description && (
                        <p className="mt-3 text-base leading-7 text-fl-gray-600">{product.description}</p>
                      )}
                      {product.category === "CAMA_ELASTICA" && (
                        <p className="mt-2 text-sm leading-6 text-fl-gray-500">
                          Possíveis taxas de deslocamento são consultadas conforme o endereço.
                        </p>
                      )}

                      {includes.length > 0 && (
                        <div className="mt-6">
                          <p className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Incluso</p>
                          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                            {includes.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-sm text-fl-gray-700">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {normalTiers.length > 0 && (
                        <div className="mt-6 overflow-hidden rounded-2xl border border-fl-gray-200">
                          <p className="bg-fl-gray-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-fl-gray-500">
                            Valores fixos
                          </p>
                          <div className="divide-y divide-fl-gray-100">
                            {normalTiers.map((tier) => (
                              <div key={tier.id} className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
                                <div>
                                  <span className="text-fl-gray-700">{tier.label ?? `${tier.durationHours}h`}</span>
                                  {tier.extraPricePerHour ? (
                                    <p className="mt-0.5 text-xs text-fl-gray-500">
                                      Hora extra: {formatCurrency(tier.extraPricePerHour)}
                                    </p>
                                  ) : null}
                                </div>
                                <span className="shrink-0 font-bold tabular-nums text-fl-blue-dark">
                                  {formatCurrency(tier.price)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {product.extraPricePerHour ? (
                        <p className="mt-2 text-sm text-fl-gray-500">
                          Hora extra: {formatCurrency(product.extraPricePerHour)} por hora
                        </p>
                      ) : null}

                      <Link
                        href={`/orcamento?product=${product.id}`}
                        className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-fl-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-blue"
                      >
                        Reservar {product.name}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {consultProducts.length > 0 && (
            <div className="mt-16">
              <Reveal>
                <h2 className="fl-heading text-2xl sm:text-3xl">Sob consulta</h2>
                <p className="mt-2 text-sm text-fl-gray-500">
                  Estes produtos são terceirizados. Consulte valores e disponibilidade.
                </p>
              </Reveal>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {consultProducts.map((product, i) => {
                  const slides = buildProductSlides(product);

                  return (
                    <Reveal
                      key={product.id}
                      index={i}
                      className="grid gap-4 rounded-2xl border border-fl-gray-200 bg-white p-4 shadow-soft sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center"
                    >
                      <ImageCarousel
                        images={slides}
                        mediaFit="cover"
                        imageClassName="aspect-square"
                        className="overflow-hidden rounded-xl border-0 shadow-none"
                        emptyState={
                          <div className="flex aspect-square items-center justify-center rounded-xl bg-fl-gray-100">
                            <Package className="h-8 w-8 text-fl-gray-400" aria-hidden="true" />
                          </div>
                        }
                      />
                      <div>
                        <h3 className="font-display text-lg font-bold text-fl-blue-dark">{product.name}</h3>
                        {product.description && <p className="mt-1 text-sm text-fl-gray-600">{product.description}</p>}
                        <span className="mt-2 inline-block rounded-full bg-amber-50 px-3 py-0.5 text-xs font-medium text-amber-700">
                          Consulte valores
                        </span>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ CONTATO */}
      <section id="contato" className="scroll-mt-24 py-16 sm:py-20">
        <div className="fl-shell">
          <Reveal className="overflow-hidden rounded-[2rem] border border-fl-gray-200 bg-fl-gray-50 p-6 shadow-soft sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <p className="fl-eyebrow">Entre em contato</p>
                <h2 className="fl-heading mt-2 text-2xl sm:text-3xl">Vamos montar o seu evento?</h2>
                <p className="mt-3 text-sm leading-6 text-fl-gray-600 sm:text-base">
                  Fale com a F&amp;L Locações para consultar disponibilidade, tirar dúvidas e solicitar seu orçamento.
                  Atendemos São José dos Campos e região.
                </p>

                <div className="mt-5 flex flex-col gap-3 text-sm text-fl-gray-600 sm:flex-row sm:flex-wrap sm:gap-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-fl-blue" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-fl-gray-700">Onde atendemos:</strong> São José dos Campos e
                      região
                    </span>
                  </div>

                  <a
                    href={flInstagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 transition hover:text-fl-blue"
                  >
                    <Instagram className="h-4 w-4 shrink-0 text-fl-blue" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-fl-gray-700">Instagram:</strong> @fl_locacoesvale
                    </span>
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:min-w-[220px] lg:flex-col">
                <WhatsAppButton>Falar no WhatsApp</WhatsAppButton>
                <a
                  href={flInstagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-fl-gray-300 bg-white px-5 py-3 text-sm font-semibold text-fl-gray-700 transition hover:border-fl-blue hover:text-fl-blue"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                  Ver Instagram
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-8 flex items-center gap-3 rounded-2xl border border-fl-yellow/50 bg-fl-yellow/10 p-5 text-sm text-amber-950">
            <Sparkles className="h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
            Combinando 2 ou mais atrações avulsas você ganha desconto de pacote no orçamento.
          </Reveal>
        </div>
      </section>
    </main>
  );
}
