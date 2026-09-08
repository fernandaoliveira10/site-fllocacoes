import { Metadata } from "next";
import { Suspense } from "react";
import { CalendarCheck, ClipboardList, Sparkles } from "lucide-react";

import { BookingExperience } from "@/components/booking-experience";

export const metadata: Metadata = {
  title: "Orçamento | F&L Locações",
  description:
    "Monte seu orçamento com a F&L Locações: escolha produtos, período e quantidade e veja o valor dos produtos na hora.",
};

const guideSteps = [
  { icon: ClipboardList, text: "Escolha os produtos e combos" },
  { icon: CalendarCheck, text: "Defina período, data e cidade" },
  { icon: Sparkles, text: "Envie e receba o valor final" },
];

export default function OrcamentoPage() {
  return (
    <main className="bg-fl-gray-50 pb-20">
      <section className="bg-fl-blue-dark py-14 text-white sm:py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="fl-eyebrow justify-center text-fl-yellow">Orçamento</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Monte seu orçamento
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/80">
            Escolha os produtos, selecione o tempo de locação e veja o valor dos produtos na hora. A taxa de
            deslocamento é confirmada pela nossa equipe no WhatsApp.
          </p>

          <ol className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {guideSteps.map(({ icon: Icon, text }, i) => (
              <li
                key={text}
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm text-white/85"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fl-blue text-xs font-bold">
                  {i + 1}
                </span>
                <Icon className="h-4 w-4 shrink-0 text-fl-yellow" aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="mx-auto -mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-fl-gray-200 bg-white p-10 text-center text-fl-gray-500 shadow-soft-lg">
              Carregando produtos...
            </div>
          }
        >
          <BookingExperience />
        </Suspense>
      </div>
    </main>
  );
}
