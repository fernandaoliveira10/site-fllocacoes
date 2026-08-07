import { Metadata } from "next";
import { Instagram, MapPin, MessageCircleMore } from "lucide-react";

import {
  flWhatsAppMessage,
  flWhatsAppNumber,
} from "@/lib/constants";

import { buildWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contato | F&L Locações",
};

export default function ContatoPage() {
  const whatsappHref = buildWhatsAppUrl(
    flWhatsAppNumber,
    flWhatsAppMessage
  );

  return (
    <main className="bg-white">
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">
              Fale com a gente
            </p>

            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-fl-blue-dark sm:text-4xl lg:text-5xl">
              Vamos planejar o seu evento?
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-fl-gray-600 sm:text-lg">
              Entre em contato com a F&L Locações para consultar disponibilidade,
              tirar dúvidas e solicitar seu orçamento.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-fl-gray-200 bg-white p-6 shadow-soft sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fl-blue/10">
                <MessageCircleMore className="h-6 w-6 text-fl-blue" />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-fl-blue-dark">
                WhatsApp
              </h2>

              <p className="mt-3 text-sm leading-6 text-fl-gray-600 sm:text-base">
                Fale diretamente com nossa equipe para consultar valores,
                disponibilidade e montar seu orçamento.
              </p>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-fl-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark"
              >
                <MessageCircleMore className="h-4 w-4" />
                Falar no WhatsApp
              </a>
            </div>

            <div className="rounded-3xl border border-fl-gray-200 bg-white p-6 shadow-soft sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fl-blue/10">
                <Instagram className="h-6 w-6 text-fl-blue" />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-fl-blue-dark">
                Instagram
              </h2>

              <p className="mt-3 text-sm leading-6 text-fl-gray-600 sm:text-base">
                Acompanhe nossos trabalhos, eventos e novidades pelo Instagram.
              </p>

              <a
                href="https://www.instagram.com/fl_locacoesvale/"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-fl-gray-300 bg-white px-5 py-3 text-sm font-semibold text-fl-gray-700 transition hover:border-fl-blue hover:text-fl-blue"
              >
                <Instagram className="h-4 w-4" />
                @fl_locacoesvale
              </a>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-fl-blue/10 bg-gradient-to-br from-fl-blue/5 via-white to-fl-gray-50 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-fl-blue/10">
                <MapPin className="h-5 w-5 text-fl-blue" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-fl-blue-dark">
                  Região de atendimento
                </h2>

                <p className="mt-2 text-sm leading-6 text-fl-gray-600 sm:text-base">
                  Atendemos São José dos Campos, Jacareí, Caçapava, Taubaté
                  e demais cidades da região do Vale do Paraíba.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-fl-blue-dark p-6 text-center text-white sm:p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Seu evento começa aqui
            </p>

            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              Conte para a gente o que você está planejando
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Informe a data, local e os serviços desejados. Nossa equipe retorna
              com as opções disponíveis para o seu evento.
            </p>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-fl-blue-dark transition hover:bg-fl-gray-100"
            >
              <MessageCircleMore className="h-4 w-4" />
              Solicitar orçamento
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}