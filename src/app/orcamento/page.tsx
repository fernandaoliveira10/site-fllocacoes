import { Metadata } from "next";
import { Suspense } from "react";
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
        <div className="mt-12">
          <Suspense fallback={<p className="text-center text-fl-gray-500">Carregando...</p>}>
            <BookingExperience />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
