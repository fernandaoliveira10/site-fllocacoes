import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ClipboardList,
  MapPin,
  PackageCheck,
  PartyPopper,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

import { HeroVideo } from "@/components/landing/hero-video";
import { ImageCarousel } from "@/components/image-carousel";
import { Reveal } from "@/components/reveal";
import { QuoteButton, WhatsAppButton } from "@/components/cta";
import { formatCurrency } from "@/lib/formatters";
import type { CarouselSlide } from "@/lib/types";
import { getAllProducts } from "@/server/services/products";

export const metadata: Metadata = {
  title: { absolute: "F&L Locações | Diversão para festas no Vale do Paraíba" },
  description:
    "Plataforma 360, cama elástica, fotografia profissional e atrações para festas em São José dos Campos, Jacareí, Caçapava, Taubaté e região.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "F&L Locações | Diversão e memórias para o seu evento",
    description:
      "Atrações, brinquedos e fotografia para festas e eventos no Vale do Paraíba. Consulte disponibilidade e monte seu orçamento.",
  },
};

const categoryImages: Record<string, string> = {
  PLATAFORMA_360: "/images/produtos/plataforma-360.jpg",
  CAMA_ELASTICA: "/images/produtos/cama-elastica.jpg",
  FOTOGRAFIA: "/images/produtos/fotografia.jpg",
  TOTEM_FOTOGRAFICO: "/images/produtos/totem-1.jpeg",
  PISCINA_BOLINHA: "/images/produtos/piscina-bolinha.jpg",
  MESAS_CADEIRAS: "/images/produtos/mesas-cadeiras.jpg",
};

const productBenefits: Record<string, string[]> = {
  PLATAFORMA_360: ["Operador durante o evento", "Iluminação LED", "Vídeos via QR Code", "Moldura personalizada"],
  CAMA_ELASTICA: ["Montagem e desmontagem", "Equipamento higienizado", "Monitor opcional"],
  FOTOGRAFIA: ["Fotos em alta resolução", "Edição de cor", "Entrega digital"],
  TOTEM_FOTOGRAFICO: ["Fotos ilimitadas", "QR Code para convidados", "Moldura personalizada", "Opção com impressão"],
};

const heroHighlights = [
  "Plataforma 360",
  "Cama elástica 3m",
  "Fotografia profissional",
  "Totem fotográfico",
  "Combos promocionais",
];

const trustItems = [
  { icon: PackageCheck, label: "Montagem e desmontagem", note: "Cuidamos da estrutura para você." },
  { icon: MapPin, label: "Atendimento regional", note: "Vale do Paraíba e cidades próximas." },
  { icon: WalletCards, label: "Preços claros", note: "Escolha o período ideal para o evento." },
  { icon: ShieldCheck, label: "30% na reserva", note: "Pix ou cartão com taxa da maquininha." },
];

const galleryItems: Array<CarouselSlide & { label: string }> = [
  {
    src: "/images/plataforma_v.mp4",
    alt: "Plataforma 360 em funcionamento durante um evento",
    type: "VIDEO",
    poster: "/images/produtos/plataforma-360.jpg",
    label: "Plataforma 360 em ação",
  },
  {
    src: "/images/camaelastica_v.mp4",
    alt: "Cama elástica sendo utilizada durante um evento",
    type: "VIDEO",
    poster: "/images/produtos/cama-elastica.jpg",
    label: "Diversão na cama elástica",
  },
  {
    src: "/images/video.mp4",
    alt: "Experiência da F&L Locações registrada em vídeo",
    type: "VIDEO",
    poster: "/images/imagem.jpeg",
    label: "Experiência F&L em movimento",
  },
  {
    src: "/images/video2.mp4",
    alt: "Momento de evento registrado pela F&L Locações",
    type: "VIDEO",
    poster: "/images/imagem2.jpeg",
    label: "Momentos reais dos nossos eventos",
  },
  {
    src: "/images/video3.mp4",
    alt: "Diversão em evento atendido pela F&L Locações",
    type: "VIDEO",
    poster: "/images/imagem.jpeg",
    label: "Diversão registrada em vídeo",
  },
];

const galleryImages: Array<CarouselSlide & { label: string }> = [
  {
    src: "/images/imagem.jpeg",
    alt: "Estrutura iluminada da Plataforma 360",
    label: "Plataforma 360 pronta para o evento",
  },
  {
    src: "/images/produtos/cama-elastica.jpg",
    alt: "Cama elástica de três metros montada",
    label: "Estrutura pronta para a festa",
  },
  {
    src: "/images/produtos/foto2.jpeg",
    alt: "Registro fotográfico profissional durante um evento",
    label: "Fotografia profissional no seu evento",
  },
  {
    src: "/images/produtos/totem-1.jpeg",
    alt: "Totem fotográfico montado e pronto para os convidados",
    label: "Totem fotográfico pronto para os convidados",
  },
];

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Escolha as experiências",
    description: "Compare as opções e selecione o que combina com o seu evento.",
  },
  {
    icon: CalendarCheck,
    number: "02",
    title: "Informe data e endereço",
    description: "Confirmamos disponibilidade e possíveis taxas de deslocamento.",
  },
  {
    icon: PartyPopper,
    number: "03",
    title: "Confirme a reserva",
    description: "Com 30% de entrada, sua atração fica reservada para a data.",
  },
];

function buildProductSlides(product: {
  name: string;
  category: string;
  media: { url: string; alt?: string; type: string }[];
}): CarouselSlide[] {
  const slides = product.media
    .filter((media) => Boolean(media.url))
    .map((media) => ({
      src: media.url,
      alt: media.alt ?? product.name,
      type: media.type === "VIDEO" ? ("VIDEO" as const) : ("IMAGE" as const),
    }));

  if (slides.length > 0) return slides;

  const fallback = categoryImages[product.category];
  return fallback ? [{ src: fallback, alt: product.name, type: "IMAGE" }] : [];
}

export default async function HomePage() {
  const allProducts = await getAllProducts();
  const featuredCategories = ["PLATAFORMA_360", "CAMA_ELASTICA", "FOTOGRAFIA", "TOTEM_FOTOGRAFICO"];
  const featuredProducts = featuredCategories
    .map((category) => allProducts.find((product) => product.category === category && product.isActive))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
  const comboProducts = allProducts.filter((product) => product.category === "COMBO_PROMOCIONAL" && product.isActive);
  const consultProducts = allProducts.filter(
    (product) => product.isActive && !product.priceConfirmed && !featuredCategories.includes(product.category),
  );

  return (
    <main className="overflow-hidden bg-white">
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative isolate flex min-h-[88vh] items-end overflow-hidden bg-fl-blue-dark text-white sm:min-h-[92vh]">
        <HeroVideo src="/images/plataforma_v2.mp4" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-fl-blue-dark via-fl-blue-dark/80 to-fl-blue-dark/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-fl-blue-dark/70 to-transparent" />

        <div className="fl-shell relative z-10 py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <span className="fl-eyebrow text-fl-yellow">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Festas e eventos no Vale do Paraíba
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Sua festa com <span className="text-fl-yellow">movimento</span>, diversão e memórias.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
              Plataforma 360, totem fotográfico e cama elástica — estrutura completa para o seu evento!
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <QuoteButton size="lg">Montar orçamento agora</QuoteButton>
              <WhatsAppButton size="lg" variant="outline-light">
                Falar no WhatsApp
              </WhatsAppButton>
            </div>

            <p className="mt-5 flex items-center gap-2 text-sm text-white/70">
              <Check className="h-4 w-4 text-fl-yellow" aria-hidden="true" />
              Valores dos produtos na hora · deslocamento confirmado pelo endereço.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- MARQUEE */}
      <section aria-hidden="true" className="overflow-hidden border-y border-fl-gray-200 bg-fl-blue-dark py-4">
        <div className="flex w-max min-w-full animate-marquee-x">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-10 pr-10">
              {heroHighlights.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.18em] text-white/60"
                >
                  <PartyPopper className="h-4 w-4 text-fl-yellow" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- TRUST STRIP */}
      <section aria-label="Diferenciais da F&L Locações" className="bg-white py-12 sm:py-14">
        <div className="fl-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, label, note }, i) => (
            <Reveal
              key={label}
              index={i}
              className="flex items-start gap-3 rounded-2xl border border-fl-gray-200 bg-white p-4 shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fl-blue-50 text-fl-blue">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-fl-blue-dark">{label}</p>
                <p className="mt-1 text-xs leading-5 text-fl-gray-600">{note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- FEATURED */}
      <section id="servicos" className="scroll-mt-24 bg-fl-gray-50 py-20 sm:py-24">
        <div className="fl-shell">
          <Reveal className="max-w-3xl">
            <p className="fl-eyebrow">Escolha sua experiência</p>
            <h2 className="fl-heading mt-3 text-3xl sm:text-5xl">Os destaques para a sua festa</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-fl-gray-600">
              Confira o valor inicial de cada serviço e combine atrações para montar o evento perfeito.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product, i) => {
              const normalPrices = product.priceTiers.filter((tier) => !tier.isComboPrice).map((tier) => tier.price);
              const lowestPrice = normalPrices.length > 0 ? Math.min(...normalPrices) : null;
              const slides = buildProductSlides(product);
              const benefits = productBenefits[product.category] ?? [];

              return (
                <Reveal
                  key={product.id}
                  index={i}
                  as="article"
                  className="group flex flex-col overflow-hidden rounded-3xl border border-fl-gray-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-glow"
                >
                  <div className="relative overflow-hidden bg-fl-gray-100">
                    <ImageCarousel
                      images={slides}
                      imageClassName="aspect-[4/3]"
                      className="rounded-none border-0 shadow-none"
                      mediaFit="cover"
                    />
                    {lowestPrice !== null && (
                      <span className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-fl-blue-dark shadow-md backdrop-blur">
                        A partir de {formatCurrency(lowestPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-2xl font-bold text-fl-blue-dark">{product.name}</h3>
                    {product.description && (
                      <p className="mt-2 text-sm leading-6 text-fl-gray-600">{product.description}</p>
                    )}

                    <ul className="mt-5 flex-1 space-y-2.5">
                      {benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-sm text-fl-gray-700">
                          <Check className="h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/orcamento?product=${product.id}`}
                      className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-fl-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-fl-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-blue"
                    >
                      Escolher este serviço
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {comboProducts.length > 0 && (
            <Reveal className="mt-8 overflow-hidden rounded-3xl border border-fl-yellow/50 bg-fl-yellow/10 p-6 sm:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Combo promocional</p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-fl-blue-dark">
                      Economize combinando atrações por 3 horas
                    </h3>
                  </div>
                </div>
                <Link
                  href="/orcamento"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-fl-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-fl-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-blue"
                >
                  Ver combos no orçamento
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          )}

          <Reveal className="mt-8 flex flex-col items-start justify-between gap-5 rounded-3xl border border-fl-gray-200 bg-white p-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-bold text-fl-blue-dark">Também temos opções sob consulta</p>
              <p className="mt-1 text-sm text-fl-gray-600">
                {consultProducts.map((product) => product.name).join(" e ") ||
                  "Outras atrações para completar o evento"}
                . Consulte disponibilidade e valores.
              </p>
            </div>
            <WhatsAppButton className="shrink-0">Consultar no WhatsApp</WhatsAppButton>
          </Reveal>

          <p className="mt-5 text-sm text-fl-gray-500">
            Possíveis taxas de deslocamento são consultadas conforme o endereço do evento.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- GALLERY */}
      <section id="galeria" className="scroll-mt-24 py-20 sm:py-24">
        <div className="fl-shell">
          <Reveal className="max-w-3xl">
            <p className="fl-eyebrow">Eventos F&amp;L</p>
            <h2 className="fl-heading mt-3 text-3xl sm:text-5xl">Experiências reais dos nossos eventos</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-fl-gray-600">
              Estruturas preparadas, atrações em funcionamento e registros que ajudam cada celebração a ficar na memória.
            </p>
          </Reveal>

          <div className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
            {galleryItems.map((item, i) => (
              <Reveal
                key={item.src}
                index={i}
                as="figure"
                className="group flex w-[72vw] max-w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-fl-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft-lg sm:w-[40vw] lg:w-auto lg:max-w-none"
              >
                <div className="relative aspect-[9/16] overflow-hidden bg-fl-blue-dark">
                  <video
                    className="h-full w-full object-cover"
                    controls
                    preload="metadata"
                    playsInline
                    poster={item.poster}
                    aria-label={item.alt}
                  >
                    <source src={item.src} />
                    Seu navegador não suporta reprodução de vídeo.
                  </video>
                  <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                    <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    Vídeo
                  </span>
                </div>
                <figcaption className="px-4 py-3.5 text-sm font-semibold leading-5 text-fl-blue-dark">
                  {item.label}
                </figcaption>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((item, i) => (
              <Reveal
                key={item.src}
                index={i}
                as="figure"
                className="group relative overflow-hidden rounded-3xl border border-fl-gray-200 bg-fl-gray-100 shadow-sm"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 px-4 py-3 text-sm font-semibold text-white drop-shadow">
                  {item.label}
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- HOW IT WORKS */}
      <section id="como-funciona" className="scroll-mt-24 bg-fl-blue-dark py-20 text-white sm:py-24">
        <div className="fl-shell">
          <Reveal className="max-w-3xl">
            <p className="fl-eyebrow text-fl-yellow">Simples e transparente</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-balance sm:text-5xl">
              Seu evento reservado em três passos
            </h2>
          </Reveal>

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {steps.map(({ icon: Icon, number, title, description }, i) => (
              <Reveal key={number} index={i} as="li" className="relative rounded-3xl border border-white/15 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fl-blue text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="font-display text-5xl font-bold text-white/10">{number}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{description}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-10">
            <QuoteButton size="lg" variant="light">
              Começar meu orçamento
            </QuoteButton>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- ABOUT */}
      <section className="py-20 sm:py-24">
        <div className="fl-shell">
          <Reveal className="grid items-center gap-8 rounded-[2rem] border border-fl-gray-200 bg-gradient-to-br from-fl-blue-50 to-white p-6 shadow-soft sm:p-10 lg:grid-cols-[auto_1fr] lg:p-12">
            <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-3xl bg-fl-blue-dark shadow-soft-lg lg:mx-0">
              <Image src="/images/logo/logo-fl.png" alt="F&L Locações" fill sizes="128px" className="object-contain p-4" />
            </div>
            <div>
              <p className="fl-eyebrow">Sobre a F&amp;L Locações</p>
              <h2 className="fl-heading mt-3 text-3xl">Cuidado em cada detalhe do seu evento</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-fl-gray-600">
                Atendemos festas familiares, casamentos, escolas e empresas em São José dos Campos e região. Nossa
                equipe orienta a escolha, prepara a estrutura e acompanha você até a realização do evento.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------- FINAL CTA */}
      <section className="pb-20 sm:pb-24">
        <div className="fl-shell">
          <div className="relative overflow-hidden rounded-[2rem] bg-fl-blue px-6 py-14 text-center text-white shadow-glow sm:px-10">
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-fl-yellow/25 blur-2xl" />
            <div className="relative mx-auto max-w-3xl">
              <p className="fl-eyebrow justify-center text-white/75">Vamos montar seu evento?</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-balance sm:text-5xl">Escolha como prefere começar</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/80">
                Fale diretamente com a equipe ou monte uma estimativa com os produtos e períodos disponíveis.
              </p>
              <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
                <WhatsAppButton size="lg">Falar no WhatsApp</WhatsAppButton>
                <QuoteButton size="lg" variant="light">
                  Montar orçamento
                </QuoteButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
