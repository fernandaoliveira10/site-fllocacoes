import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  FileText,
  HeartHandshake,
  Instagram,
  MapPin,
  MessageCircleMore,
  PackageSearch,
  PartyPopper,
  Truck,
} from "lucide-react";

import { Hero } from "@/components/landing/hero";
import {
  coverageInfo,
  flInstagramUrl,
  flWhatsAppMessage,
  flWhatsAppNumber,
} from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";
import { getAllProducts } from "@/server/services/products";

const steps = [
  {
    step: "01",
    icon: PackageSearch,
    title: "Escolha",
    description: "Acesse Produtos e escolha as atrações ideais para o seu evento.",
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Monte o orçamento",
    description: "Informe a data, a cidade e os itens desejados para calcular sua reserva.",
  },
  {
    step: "03",
    icon: PartyPopper,
    title: "Aproveite o evento",
    description: "Confirmamos os detalhes e cuidamos da entrega, montagem e retirada.",
  },
];

const highlights = [
  {
    icon: Truck,
    title: "Montagem e retirada",
    description: "A equipe cuida da logística para você aproveitar o evento.",
  },
  {
    icon: FileText,
    title: "Reserva formalizada",
    description: "Condições, valores e detalhes do serviço apresentados com clareza.",
  },
  {
    icon: HeartHandshake,
    title: "Atendimento próximo",
    description: "Suporte humano desde a escolha até a realização da festa.",
  },
];

export default async function HomePage() {
  const products = await getAllProducts();
  const activeProductCount = products.filter((product) => product.isActive).length;
  const whatsappHref = buildWhatsAppUrl(flWhatsAppNumber, flWhatsAppMessage);
  const serviceArea = "São José dos Campos, Jacareí e região";

  return (
    <main>
      <Hero productCount={activeProductCount} serviceArea={serviceArea} />

      <section id="como-funciona" className="scroll-mt-24 border-y border-fl-gray-100 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">Como funciona</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-fl-blue-dark sm:text-4xl">
              Do orçamento à festa em três passos
            </h2>
            <p className="mt-4 text-base leading-7 text-fl-gray-600">
              Um fluxo simples para escolher, reservar e receber tudo com tranquilidade.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map(({ step, icon: Icon, title, description }) => (
              <article key={step} className="rounded-3xl border border-fl-gray-200 bg-fl-gray-50 p-7 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fl-blue/10">
                    <Icon className="h-6 w-6 text-fl-blue" />
                  </span>
                  <span className="font-display text-3xl font-bold text-fl-gray-200">{step}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-bold text-fl-blue-dark">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-fl-gray-600">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 rounded-xl bg-fl-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark"
            >
              Ver produtos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">Por que escolher a F&amp;L</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-fl-blue-dark sm:text-4xl">
              Tudo organizado para o seu evento
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-fl-gray-200 bg-white p-7 text-center shadow-soft">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-fl-blue/10">
                  <Icon className="h-6 w-6 text-fl-blue" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-fl-blue-dark">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-fl-gray-600">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-fl-gray-200 bg-fl-gray-50 p-8 shadow-soft lg:flex lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-fl-blue" />
                <h2 className="font-display text-2xl font-bold text-fl-blue-dark">Área de atendimento</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-fl-gray-600">
                Atendemos {coverageInfo.cities}. A taxa de deslocamento é apresentada no orçamento conforme a cidade.
              </p>
            </div>
            <Link
              href="/orcamento"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-fl-gray-300 bg-white px-5 py-3 text-sm font-semibold text-fl-gray-700 transition hover:border-fl-blue hover:text-fl-blue lg:mt-0"
            >
              Montar orçamento
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="contato" className="scroll-mt-24 border-t border-fl-gray-100 bg-fl-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">Contato</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-fl-blue-dark sm:text-4xl">
              Vamos planejar o seu evento?
            </h2>
            <p className="mt-4 text-base leading-7 text-fl-gray-600">
              Fale com a equipe pelo WhatsApp ou acompanhe as novidades no Instagram.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-fl-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark"
              >
                <MessageCircleMore className="h-5 w-5" />
                Falar no WhatsApp
              </a>
              <a
                href={flInstagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-fl-gray-300 bg-white px-6 py-3 text-sm font-semibold text-fl-gray-700 transition hover:border-fl-blue hover:text-fl-blue"
              >
                <Instagram className="h-5 w-5" />
                @fl_locacoesvale
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-fl-gray-200 py-10 text-center text-sm text-fl-gray-500">
        <p>&copy; {new Date().getFullYear()} F&amp;L Locações. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
