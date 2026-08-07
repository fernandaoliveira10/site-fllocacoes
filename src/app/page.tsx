import { Metadata } from "next";
import Link from "next/link";
import { Instagram, ArrowRight, Check, MapPin, MessageCircleMore, Package, ShieldCheck, Truck } from "lucide-react";

import { ImageCarousel } from "@/components/image-carousel";
import type { CarouselSlide } from "@/lib/types";
import { flWhatsAppMessage, flWhatsAppNumber } from "@/lib/constants";

import { formatCurrency } from "@/lib/formatters";
import { buildWhatsAppUrl } from "@/lib/utils";
import { getAllProducts } from "@/server/services/products";

export const metadata: Metadata = {
  title: "Produtos | F&L Locações",
};

const bannerSlides: CarouselSlide[] = [
  { src: "/images/capa1.png", alt: "Banner 1" },
  { src: "/images/capa2.png", alt: "Banner 2" },
];

const aboutCards = [
  {
    icon: Truck,
    title: "Entrega e montagem",
    description: "Levamos os itens até o local, montamos tudo e cuidamos da retirada no final.",
  },
  {
    icon: MapPin,
    title: "Atendimento na região",
    description: "Atendemos São José dos Campos, Jacareí, Caçapava, Taubaté e arredores.",
  },
  {
    icon: ShieldCheck,
    title: "Suporte confiável",
    description: "Você fala direto com a equipe e recebe orientação rápida para fechar o evento.",
  },
];

const categoryImages: Record<string, string> = {
  PLATAFORMA_360: "/images/produtos/plataforma-360.jpg",
  CAMA_ELASTICA: "/images/produtos/cama-elastica.jpg",
  FOTOGRAFIA: "/images/produtos/fotografia.jpg",
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
};

function buildProductSlides(product: { name: string; category: string; media: { url: string; alt?: string; type: string }[] }): CarouselSlide[] {
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
  const mainCategories = ["PLATAFORMA_360", "CAMA_ELASTICA", "FOTOGRAFIA"];
  const mainProducts = allProducts.filter((product) => mainCategories.includes(product.category) && product.isActive);
  const consultProducts = allProducts.filter((product) => !mainCategories.includes(product.category) && product.isActive && !product.priceConfirmed);
  const whatsappHref = buildWhatsAppUrl(flWhatsAppNumber, flWhatsAppMessage);

  return (
    <main className="bg-white">
<section id="banner" className="pt-6 pb-4 sm:py-10 lg:py-16">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="relative overflow-hidden rounded-[2.25rem] border border-white/60 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.12)] ring-1 ring-fl-gray-200/70">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fl-blue/5 via-transparent to-fl-gray-50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 to-transparent" />

      <ImageCarousel
        images={bannerSlides}
        className="relative w-full"
        imageClassName="aspect-[16/7] object-cover"
        emptyState={
          <div className="relative flex min-h-[380px] flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-fl-blue/10 bg-fl-blue/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-fl-blue">
                Banner ainda vazio
              </span>

              <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-fl-blue-dark sm:text-4xl lg:text-5xl">
                Adicione suas imagens ou vídeos no array{" "}
                <code className="rounded-lg bg-fl-gray-100 px-2 py-1 text-[0.9em] text-fl-blue-dark">
                  bannerSlides
                </code>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-fl-gray-600 sm:text-base">
                Quando os slides forem inseridos, este espaço vira um carrossel automático,
                com aparência mais sofisticada no topo da página de produtos.
              </p>
            </div>
          </div>
        }
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  </div>
</section>

<section className="pt-4 pb-12 sm:py-12 lg:py-16">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="grid place-items-center">
      <div className="relative w-full overflow-hidden rounded-2xl border border-fl-gray-200 bg-white p-5 shadow-soft sm:rounded-[2rem] sm:p-8 lg:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-fl-blue/5 via-transparent to-fl-blue/10" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">
            Sobre a F&L Locações
          </p>

          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-fl-blue-dark sm:text-4xl lg:text-5xl">
            Sua festa merece mais diversão e lembranças inesquecíveis
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-fl-gray-600 sm:text-lg">
            A F&L Locações leva entretenimento e registros de alta qualidade para eventos
            em São José dos Campos e todo o Vale do Paraíba. Nossa missão é proporcionar
            experiências únicas para você e seus convidados.
          </p>

<div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
  {aboutCards.map(({ icon: Icon, title, description }) => (
    <div
      key={title}
      className="rounded-2xl border border-fl-gray-200 bg-white p-5 text-left shadow-sm"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-fl-blue/10">
        <Icon className="h-5 w-5 text-fl-blue" />
      </div>

      <h3 className="font-semibold text-fl-blue-dark">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-fl-gray-500">
        {description}
      </p>
    </div>
  ))}
</div>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-6 text-fl-gray-500">
            Ideal para aniversários, casamentos, eventos corporativos e confraternizações.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

      <section id="produtos" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">
  Escolha a experiência ideal
</p>
<h2 className="mt-4 text-center font-display text-4xl font-bold text-fl-blue-dark sm:text-5xl">
  Soluções para o seu evento
</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-fl-gray-600">
            Veja os valores fixos, deixe o deslocamento sob consulta e monte seu orçamento com rapidez.
          </p>

          <div className="mt-10 space-y-14 sm:mt-14 sm:space-y-16 lg:mt-16 lg:space-y-24">
            {mainProducts.map((product, index) => {
              const includes = productIncludes[product.category] ?? [];
              const normalTiers = product.priceTiers.filter((tier) => !tier.isComboPrice);
              const slides = buildProductSlides(product);

              return (
                <div
  key={product.id}
  className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14"
>
<div className={index % 2 === 1 ? "lg:order-2" : ""}>
  <ImageCarousel
    images={slides}
    mediaFit="contain"
    imageClassName="aspect-[4/3]"
    className="shadow-soft-lg"
    emptyState={(
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-dashed border-fl-gray-300 bg-fl-gray-50">
        <Package className="h-16 w-16 text-fl-gray-400" />
      </div>
    )}
  />
</div>

                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display text-3xl font-bold text-fl-blue-dark">{product.name}</h3>
                        {product.description && <p className="mt-3 text-base leading-7 text-fl-gray-600">{product.description}</p>}
                      </div>
                    </div>

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
                      <div className="mt-5 rounded-2xl border border-fl-gray-200 bg-fl-gray-50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">Valores</p>
                        <div className="mt-3 space-y-2">
                          {normalTiers.map((tier) => (
                            <div key={tier.id} className="flex items-center justify-between text-sm">
                              <span className="text-fl-gray-600">{tier.label ?? `${tier.durationHours}h`}</span>
                              <span className="font-semibold text-fl-blue-dark">{formatCurrency(tier.price)}</span>
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
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-fl-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark"
                    >
                      Solicitar orçamento
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
                Estes produtos sao terceirizados. Consulte valores e disponibilidade.
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {consultProducts.map((product) => {
                  const slides = buildProductSlides(product);

                  return (
                    <div key={product.id} className="grid gap-4 rounded-2xl border border-fl-gray-200 bg-white p-4 shadow-soft sm:grid-cols-[88px_minmax(0,1fr)] sm:items-center">
                      <ImageCarousel
                        images={slides}
                        mediaFit="contain"
                        imageClassName="aspect-square"
                        className="overflow-hidden rounded-xl border-0 shadow-none"
                        emptyState={(
                          <div className="flex aspect-square items-center justify-center rounded-xl bg-fl-gray-100">
                            <Package className="h-8 w-8 text-fl-gray-400" />
                          </div>
                        )}
                      />
                      <div>
                        <h3 className="font-display text-xl font-bold text-fl-blue-dark">{product.name}</h3>
                        {product.description && <p className="mt-1 text-sm text-fl-gray-600">{product.description}</p>}
                        <span className="mt-2 inline-block rounded-full bg-amber-50 px-3 py-0.5 text-xs font-medium text-amber-700">
                          Consultar disponibilidade via Whatsapp
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

<section
  id="contato"
  className="mt-16 overflow-hidden rounded-3xl border border-fl-blue/10 bg-gradient-to-br from-fl-blue/5 via-white to-fl-gray-50 p-6 shadow-soft sm:p-8 lg:p-10"
>
  <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">
        Entre em contato
      </p>

      <h2 className="mt-2 font-display text-2xl font-bold text-fl-blue-dark sm:text-3xl">
        Vamos montar a decoração do seu evento?
      </h2>

      <p className="mt-3 text-sm leading-6 text-fl-gray-600 sm:text-base">
        Fale com a FL Locações para consultar disponibilidade, tirar dúvidas
        e solicitar seu orçamento. Atendemos São José dos Campos e região.
      </p>

      <div className="mt-5 flex flex-col gap-3 text-sm text-fl-gray-600 sm:flex-row sm:flex-wrap sm:gap-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-fl-blue" />
          <span>
            <strong className="font-semibold text-fl-gray-700">
              Onde atendemos:
            </strong>{" "}
            São José dos Campos e região
          </span>
        </div>

        <a
          href="https://www.instagram.com/fl_locacoesvale/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 transition hover:text-fl-blue"
        >
          <Instagram className="h-4 w-4 shrink-0 text-fl-blue" />
          <span>
            <strong className="font-semibold text-fl-gray-700">
              Instagram:
            </strong>{" "}
            @fl_locacoesvale
          </span>
        </a>
      </div>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row lg:min-w-[220px] lg:flex-col">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-fl-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark"
      >
        <MessageCircleMore className="h-4 w-4" />
        Falar no WhatsApp
      </a>

      <a
        href="https://www.instagram.com/fl_locacoesvale/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-fl-gray-300 bg-white px-5 py-3 text-sm font-semibold text-fl-gray-700 transition hover:border-fl-blue hover:text-fl-blue"
      >
        <Instagram className="h-4 w-4" />
        Ver Instagram
      </a>
    </div>
  </div>
</section>
        </div>
      </section>
    </main>
  );
}

