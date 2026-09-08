import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ClipboardList,
  MapPin,
  MessageCircleMore,
  PackageCheck,
  PartyPopper,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

import { ImageCarousel } from "@/components/image-carousel";
import { flWhatsAppMessage, flWhatsAppNumber } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";
import type { CarouselSlide } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/utils";
import { getAllProducts } from "@/server/services/products";

export const metadata: Metadata = {
  title: "F&L Locações | Diversão para festas no Vale do Paraíba",
  description:
    "Plataforma 360, cama elástica, fotografia profissional e atrações para festas em São José dos Campos, Jacareí, Caçapava, Taubaté e região.",
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
  PLATAFORMA_360: ["Operador durante o evento", "Iluminação LED", "Vídeos via QR Code","Moldura personalizada"],
  CAMA_ELASTICA: ["Montagem e desmontagem", "Equipamento higienizado", "Monitor opcional"],
  FOTOGRAFIA: ["Fotos em alta resolução", "Edição de cor", "Entrega digital"],
  TOTEM_FOTOGRAFICO: ["Fotos ilimitadas", "QR Code para convidados", "Moldura personalizada", "Opcao com impressao"],
};

const trustItems = [
  { icon: PackageCheck, label: "Montagem e desmontagem", note: "Cuidamos da estrutura para você." },
  { icon: MapPin, label: "Atendimento regional", note: "Vale do Paraíba e cidades próximas." },
  { icon: WalletCards, label: "Preços claros", note: "Escolha o período ideal para o evento." },
  { icon: ShieldCheck, label: "30% na reserva", note: "Pix ou cartão com taxa da maquininha." },
];

const galleryItems: Array<CarouselSlide & { label: string; className: string }> = [

  {
    src: "/images/plataforma_v.mp4",
    alt: "Plataforma 360 em funcionamento durante um evento",
    type: "VIDEO",
    poster: "/images/produtos/plataforma-360.jpg",
    label: "Plataforma 360 em ação",
    className: "",
  },
  {
    src: "/images/camaelastica_v.mp4",
    alt: "Cama elástica sendo utilizada durante um evento",
    type: "VIDEO",
    poster: "/images/produtos/cama-elastica.jpg",
    label: "Diversão na cama elástica",
    className: "md:col-span-2",
  },
  {
    src: "/images/produtos/cama-elastica.jpg",
    alt: "Cama elástica de três metros montada",
    type: "IMAGE",
    label: "Estrutura pronta para a festa",
    className: "",
  },
  {
    src: "/images/video.mp4",
    alt: "Experiência da F&L Locações registrada em vídeo",
    type: "VIDEO",
    poster: "/images/imagem.jpeg",
    label: "Experiência F&L em movimento",
    className: "md:col-span-2",
  },
  {
    src: "/images/imagem.jpeg",
    alt: "Estrutura iluminada da Plataforma 360",
    type: "IMAGE",
    label: "Plataforma 360 pronta para o evento",
    className: "",
  },
  {
    src: "/images/video2.mp4",
    alt: "Momento de evento registrado pela F&L Locações",
    type: "VIDEO",
    poster: "/images/imagem2.jpeg",
    label: "Momentos reais dos nossos eventos",
    className: "",
  },
  {
    src: "/images/video3.mp4",
    alt: "Diversão em evento atendido pela F&L Locações",
    type: "VIDEO",
    poster: "/images/imagem.jpeg",
    label: "Diversão registrada em vídeo",
    className: "md:col-span-2",
  },
  {
    src: "/images/imagem2.jpeg",
    alt: "Acessórios divertidos disponíveis para a Plataforma 360",
    type: "IMAGE",
    label: "Acessórios para deixar o vídeo ainda mais divertido",
    className: "md:col-span-2",
  },
  {
    src: "/images/Molduras.png",
    alt: "Opções de molduras personalizadas da F&L Locações",
    type: "IMAGE",
    label: "Molduras personalizadas para cada celebração",
    className: "md:col-span-2",
  },
];

const galleryVideoPattern = /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i;
const galleryVideos = galleryItems.filter((item) => item.type === "VIDEO" || galleryVideoPattern.test(item.src));
const galleryImages = galleryItems.filter((item) => item.type !== "VIDEO" && !galleryVideoPattern.test(item.src));

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
  const whatsappHref = buildWhatsAppUrl(flWhatsAppNumber, flWhatsAppMessage);

  return (
    <main className="overflow-hidden bg-white">
      <section className="relative border-b border-fl-gray-100 bg-gradient-to-br from-fl-blue/10 via-white to-fl-yellow/10">
        <div className="pointer-events-none absolute -left-40 top-8 h-80 w-80 rounded-full bg-fl-blue/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-fl-yellow/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-fl-blue/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-fl-blue shadow-sm">
              <Sparkles className="h-4 w-4" />
              Festas e eventos no Vale do Paraíba
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-fl-blue-dark sm:text-5xl lg:text-6xl">
              Diversão e memórias para o seu evento, <span className="text-fl-blue">sem complicação.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-fl-gray-600 sm:text-lg">
              Plataforma 360, cama elástica, fotografia profissional e outras soluções para transformar aniversários,
              casamentos, confraternizações e eventos corporativos.
            </p>

            <div className="mt-8 flex">
              <Link
                href="/orcamento"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-fl-blue px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-fl-blue/15 transition hover:-translate-y-0.5 hover:bg-fl-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-blue sm:w-auto"
              >
                <ClipboardList className="h-5 w-5" />
                Montar orçamento
              </Link>
            </div>

            <p className="mt-4 flex items-center gap-2 text-sm text-fl-gray-500">
              <Check className="h-4 w-4 text-green-600" />
              Valores dos produtos na hora e deslocamento confirmado pelo endereço.
            </p>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-soft-xl">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/images/capa1.png"
                  alt="Experiências da F&L Locações em festas e eventos"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-soft-lg backdrop-blur sm:-left-6 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fl-blue">Tudo para o evento</p>
              <p className="mt-1 text-sm font-bold text-fl-blue-dark">Diversão, estrutura e lembranças</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Diferenciais da F&L Locações" className="relative z-10 -mt-px bg-white py-8">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trustItems.map(({ icon: Icon, label, note }) => (
            <div key={label} className="flex items-start gap-3 rounded-2xl border border-fl-gray-200 bg-white p-4 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fl-blue/10 text-fl-blue">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-fl-blue-dark">{label}</p>
                <p className="mt-1 text-xs leading-5 text-fl-gray-600">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="servicos" className="scroll-mt-28 bg-fl-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">Escolha sua experiência</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-fl-blue-dark sm:text-5xl">
              Os destaques para a sua festa
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-fl-gray-600">
              Confira o valor inicial de cada serviço e monte uma combinação para o seu evento.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => {
              const normalPrices = product.priceTiers.filter((tier) => !tier.isComboPrice).map((tier) => tier.price);
              const lowestPrice = normalPrices.length > 0 ? Math.min(...normalPrices) : null;
              const slides = buildProductSlides(product);
              const benefits = productBenefits[product.category] ?? [];

              return (
                <article key={product.id} className="group flex overflow-hidden rounded-3xl border border-fl-gray-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-soft-lg">
                  <div className="flex w-full flex-col">
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
                      {product.description && <p className="mt-2 text-sm leading-6 text-fl-gray-600">{product.description}</p>}

                      <ul className="mt-5 space-y-2.5">
                        {benefits.map((benefit) => (
                          <li key={benefit} className="flex items-center gap-2 text-sm text-fl-gray-700">
                            <Check className="h-4 w-4 shrink-0 text-green-600" />
                            {benefit}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={`/orcamento?product=${product.id}`}
                        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-fl-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-fl-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-blue"
                      >
                        Escolher este serviço
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {comboProducts.length > 0 && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Combo promocional</p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-fl-blue-dark">
                      Economize combinando atrações por 3 horas
                    </h3>
                    <div className="mt-3 flex flex-col gap-2 text-sm text-amber-950 sm:flex-row sm:flex-wrap">
                      {comboProducts.map((product) => {
                        const tier = product.priceTiers[0];
                        if (!tier) return null;

                        return (
                          <span key={product.id} className="font-semibold">
                            {product.name.replace("Combo Promocional ", "")}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <Link
                  href="/orcamento"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-fl-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-fl-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-blue"
                >
                  Ver combos no orçamento
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-fl-yellow/40 bg-fl-yellow/10 p-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-bold text-fl-blue-dark">Também temos opções sob consulta</p>
              <p className="mt-1 text-sm text-fl-gray-600">
                {consultProducts.map((product) => product.name).join(" e ") || "Outras atrações para completar o evento"}.
                Consulte disponibilidade e valores.
              </p>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1fa855] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#188a46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
            >
              <MessageCircleMore className="h-4 w-4" />
              Consultar no WhatsApp
            </a>
          </div>

          <p className="mt-5 text-center text-sm text-fl-gray-500">
            Possíveis taxas de deslocamento são consultadas conforme o endereço do evento.
          </p>
        </div>
      </section>

      <section id="galeria" className="scroll-mt-28 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">Eventos F&L</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-fl-blue-dark sm:text-5xl">
              Experiências que já fazem parte dos nossos eventos
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-fl-gray-600">
              Estruturas preparadas, atrações em funcionamento e registros que ajudam cada celebração a ficar na memória.
            </p>
          </div>

          <div className="-mx-4 mt-10 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
            {galleryVideos.map((item) => (
              <figure
                key={item.src}
                className="group flex w-[78vw] max-w-[320px] shrink-0 flex-col overflow-hidden rounded-3xl border border-fl-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft-lg sm:w-[42vw] lg:w-auto lg:max-w-none"
              >
                <div className="relative aspect-[9/16] overflow-hidden bg-fl-gray-900">
                  <video
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    controls
                    preload="metadata"
                    playsInline
                    poster={item.poster}
                    aria-label={item.alt}
                  >
                    <source src={item.src} />
                    Seu navegador não suporta reprodução de vídeo.
                  </video>
                  <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    <PlayCircle className="h-4 w-4" />
                    Vídeo
                  </span>
                </div>
                <figcaption className="px-5 py-4 text-sm font-semibold leading-5 text-fl-blue-dark">{item.label}</figcaption>
              </figure>
            ))}
          </div>

<div className="-mx-4 mt-10 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
  {galleryImages.map((item) => (
    <figure
      key={item.src}
      className="group flex w-[78vw] max-w-[320px] shrink-0 flex-col overflow-hidden rounded-3xl border border-fl-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft-lg sm:w-[42vw] lg:w-auto lg:max-w-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-fl-gray-100">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 42vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <figcaption className="px-5 py-4 text-sm font-semibold leading-5 text-fl-blue-dark">
        {item.label}
      </figcaption>
    </figure>
  ))}
</div>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-28 bg-fl-blue-dark py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-yellow">Simples e transparente</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">Seu evento reservado em três passos</h2>
          </div>

          <ol className="mt-10 grid gap-5 lg:grid-cols-3">
            {steps.map(({ icon: Icon, number, title, description }) => (
              <li key={number} className="relative rounded-3xl border border-white/15 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fl-blue text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-4xl font-bold text-white/15">{number}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 rounded-[2rem] border border-fl-gray-200 bg-gradient-to-br from-fl-gray-50 to-white p-6 shadow-soft sm:p-10 lg:grid-cols-[auto_1fr] lg:p-12">
            <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-3xl bg-fl-blue-dark shadow-soft-lg lg:mx-0">
              <Image src="/images/logo/logo-fl.png" alt="F&L Locações" fill sizes="128px" className="object-contain p-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">Sobre a F&L Locações</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-fl-blue-dark">Cuidado em cada detalhe do seu evento</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-fl-gray-600">
                Atendemos festas familiares, casamentos, escolas e empresas em São José dos Campos e região. Nossa equipe
                orienta a escolha, prepara a estrutura e acompanha você até a realização do evento.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-fl-blue px-6 py-12 text-center text-white shadow-soft-xl sm:px-10">
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-fl-yellow/25 blur-2xl" />
            <div className="relative mx-auto max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Vamos montar seu evento?</p>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">Escolha como prefere começar</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/80">
                Fale diretamente com a equipe ou monte uma estimativa com os produtos e períodos disponíveis.
              </p>
              <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1fa855] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#188a46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <MessageCircleMore className="h-5 w-5" />
                  Falar no WhatsApp
                </a>
                <Link
                  href="/orcamento"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-fl-blue-dark transition hover:bg-fl-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <ClipboardList className="h-5 w-5" />
                  Montar orçamento
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
