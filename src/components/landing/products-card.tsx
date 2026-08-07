import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import { flWhatsAppMessage, flWhatsAppNumber } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";

interface ProductsCardProps {
  productCount: number;
  serviceArea: string;
}

const points = [
  "Tabela fixa para decidir sem ficar pedindo orçamento do zero.",
  "5% de desconto quando fechar 2 ou mais produtos no mesmo evento.",
  "Taxa de deslocamento sob consulta antes do envio.",
  "30% na reserva; Pix ou crédito com taxa da maquininha.",
];

export function ProductsCard({ productCount, serviceArea }: ProductsCardProps) {
  const whatsappHref = buildWhatsAppUrl(flWhatsAppNumber, flWhatsAppMessage);

  return (
    <div className="rounded-3xl border border-fl-gray-200 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fl-blue">Próximo passo</p>
          <h3 className="mt-2 font-display text-xl font-bold text-fl-blue-dark">Monte um orçamento sem esforço</h3>
          <p className="mt-2 text-sm leading-6 text-fl-gray-600">
            Comece com {productCount} produtos ativos e finalize em poucos cliques com regra de preço clara.
          </p>
        </div>
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          Preço direto
        </span>
      </div>

      <ul className="mt-5 space-y-3">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-3 rounded-2xl bg-fl-gray-50 px-4 py-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fl-blue/10">
              <Check className="h-3 w-3 text-fl-blue" />
            </span>
            <span className="text-sm leading-6 text-fl-gray-700">{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/orcamento"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-fl-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark"
        >
          Montar orçamento
          <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-fl-gray-300 px-5 py-3 text-sm font-semibold text-fl-gray-700 transition hover:border-fl-blue hover:text-fl-blue"
        >
          WhatsApp
        </a>
      </div>

      <p className="mt-4 text-xs leading-5 text-fl-gray-500">
        Atendemos {serviceArea} com suporte completo da escolha do produto até a confirmação da reserva.
      </p>
    </div>
  );
}

