"use client";

import { ArrowRight, Check, ChevronRight } from "lucide-react";
import Link from "next/link";

import { flWhatsAppMessage, flWhatsAppNumber } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";
import { FloatingProducts } from "./floating-products";
import { ProductsCard } from "./products-card";

const benefits = [
  "Segurança",
  "Qualidade",
  "Preço justo",
  "Atendimento rápido",
];

export function Hero() {
  const whatsappHref = buildWhatsAppUrl(flWhatsAppNumber, flWhatsAppMessage);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-fl-gray-50 to-white pt-28">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-fl-yellow/30 bg-fl-yellow/10 px-4 py-1.5 text-xs font-semibold text-amber-700">
              <span className="text-sm" role="img" aria-hidden>
                🎉
              </span>
              Brinquedos para festas e eventos
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-fl-blue-dark sm:text-5xl lg:text-6xl">
              Diversão e memórias
              <br />
              <span className="text-fl-blue">para seu evento</span>
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-fl-gray-600 sm:text-lg">
              Aluguel de brinquedos e atrações para festas, empresas e eventos em São José dos Campos, Jacareí e região.
            </p>

            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
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
                Solicitar orçamento
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/produtos"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-fl-gray-300 px-7 py-3.5 text-sm font-semibold text-fl-gray-700 transition hover:border-fl-blue hover:text-fl-blue sm:w-auto"
              >
                Ver produtos
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <FloatingProducts />
            <ProductsCard />
          </div>
        </div>
      </div>
    </section>
  );
}
