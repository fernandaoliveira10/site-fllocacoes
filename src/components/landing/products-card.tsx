import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import { flWhatsAppMessage, flWhatsAppNumber } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";

interface ProductsCardProps {
  productCount: number;
  serviceArea: string;
}

const points = [
  "Tabela fixa e simples.",
  "5% off em 2+ produtos.",
  "Taxa de deslocamento sob consulta.",
  "30% na reserva.",
];

export function ProductsCard({ productCount, serviceArea }: ProductsCardProps) {
  const whatsappHref = buildWhatsAppUrl(flWhatsAppNumber, flWhatsAppMessage);

  return (
    <div className="rounded-3xl border border-fl-gray-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fl-blue">
        Próximo passo
      </p>

      <h3 className="mt-2 font-display text-xl font-bold text-fl-blue-dark">
        Monte seu orçamento
      </h3>

      <p className="mt-2 text-sm leading-6 text-fl-gray-600">
        Comece com {productCount} produtos ativos.
      </p>

      <ul className="mt-6 space-y-3">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-3">
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
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-fl-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-fl-blue-dark"
        >
          Orçamento
          <ArrowRight className="h-4 w-4" />
        </Link>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-xl border border-fl-gray-300 px-5 py-3 text-sm font-semibold text-fl-gray-700 transition hover:border-fl-blue hover:text-fl-blue"
        >
          WhatsApp
        </a>
      </div>

      <p className="mt-4 text-xs leading-5 text-fl-gray-500">
        Atendemos {serviceArea}.
      </p>
    </div>
  );
}