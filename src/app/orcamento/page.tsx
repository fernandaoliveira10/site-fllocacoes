import { Metadata } from "next";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { BookingExperience } from "@/components/booking-experience";

export const metadata: Metadata = {
  title: "Orçamento | F&L Locações",
};

export default function OrcamentoPage() {
  return (
    <main className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">Orçamento</p>
        <h1 className="mt-4 text-center font-display text-4xl font-bold text-fl-blue-dark sm:text-5xl">
          Monte seu orçamento
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-fl-gray-600">
          Escolha os produtos, selecione o tempo de locação e veja o valor do seu orçamento na hora. A taxa de deslocamento será confirmada via WhatsApp.
        </p>
        <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold">Combos promocionais ativos</p>
              <p className="mt-1 text-sm leading-6 text-amber-900">
                Plataforma 360 + Cama Elástica com monitor por R$ 520,00 ou Plataforma 360 + Fotografia Profissional por R$ 600,00.
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700 shadow-sm">
            3 horas
          </span>
        </div>
        <div className="mt-12">
          <Suspense fallback={<p className="text-center text-fl-gray-500">Carregando...</p>}>
            <BookingExperience />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
