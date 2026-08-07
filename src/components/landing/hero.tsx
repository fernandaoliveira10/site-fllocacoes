"use client";

import Link from "next/link";
import { Check, ChevronRight, MessageCircleMore, Sparkles } from "lucide-react";

import { flWhatsAppMessage, flWhatsAppNumber } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";
import { FloatingProducts } from "./floating-products";
import { ProductsCard } from "./products-card";

interface HeroProps {
  productCount: number;
  serviceArea: string;
}

const benefits = [
  "Tabela de preços clara",
  "Desconto automático no pacote",
  "Taxa por cidade já informada",
  "Contrato formal e suporte humano",
];

export function Hero({ productCount, serviceArea }: HeroProps) {
  const whatsappHref = buildWhatsAppUrl(flWhatsAppNumber, flWhatsAppMessage);

  const stats = [
    {
      value: `${productCount}+`,
      label: "produtos ativos",
      note: "Oferta enxuta para decidir mais rápido.",
    },
    {
      value: "5%",
      label: "desconto no pacote",
      note: "Quando fechar 2 ou mais produtos.",
    },
    {
      value: serviceArea,
      label: "atendimento local",
      note: "Taxa de deslocamento por cidade.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-fl-gray-50 via-white to-fl-gray-50 pt-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(253,224,71,0.18),_transparent_35%)]" />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-fl-blue/20 bg-fl-blue/10 px-4 py-1.5 text-xs font-semibold text-fl-blue-dark">
              <Sparkles className="h-3.5 w-3.5" />
              Orçamento rápido com preço fixo
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-fl-blue-dark sm:text-5xl lg:text-6xl">
              Atrações que deixam
              <br />
              <span className="text-fl-blue">o seu evento pronto para fechar</span>
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-fl-gray-600 sm:text-lg">
              Aluguel de brinquedos e atrações para festas e eventos em {serviceArea}, com valores claros,
              desconto automático no pacote, 30% na reserva e pagamento via Pix ou crédito com taxa da maquininha.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-fl-gray-200 bg-white p-4 shadow-soft">
                  <p className="font-display text-2xl font-bold text-fl-blue-dark">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-fl-gray-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-fl-gray-500">{stat.note}</p>
                </div>
              ))}
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-fl-blue/10">
                    <Check className="h-3 w-3 text-fl-blue" />
                  </span>
                  <span className="text-sm font-medium text-fl-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-fl-blue px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark sm:w-auto"
              >
                <MessageCircleMore className="h-4 w-4" />
                Pedir orçamento no WhatsApp
              </a>
              <Link
                href="/orcamento"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-fl-gray-300 px-7 py-3.5 text-sm font-semibold text-fl-gray-700 transition hover:border-fl-blue hover:text-fl-blue sm:w-auto"
              >
                Montar meu orçamento
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-4 text-sm text-fl-gray-500">
              Atendimento para aniversários, escolas, empresas e eventos familiares em {serviceArea}.
            </p>
          </div>

          <div className="space-y-6">
            <FloatingProducts />
            <ProductsCard productCount={productCount} serviceArea={serviceArea} />
          </div>
        </div>
      </div>
    </section>
  );
}

