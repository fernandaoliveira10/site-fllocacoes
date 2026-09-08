"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, MapPin, MessageCircleMore } from "lucide-react";

import { flInstagramUrl, flWhatsAppMessage, flWhatsAppNumber, supportedCities } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";

/** Routes that belong to the admin app and should not show the marketing footer. */
const HIDDEN_PREFIXES = ["/dashboard", "/agenda", "/orcamentos", "/login"];

const navItems = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/orcamento", label: "Orçamento" },
  { href: "/#galeria", label: "Galeria" },
];

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname && HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  const whatsappHref = buildWhatsAppUrl(flWhatsAppNumber, flWhatsAppMessage);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-fl-blue-dark text-white">
      <div className="fl-shell grid gap-10 py-14 sm:py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Image
                src="/images/logo/logo-fl.png"
                alt="F&L Locações"
                width={48}
                height={48}
                className="h-8 w-8 object-contain"
              />
            </span>
            <span className="font-display text-lg font-bold">F&amp;L Locações</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
            Atrações, estrutura e fotografia para festas e eventos no Vale do Paraíba. Diversão de verdade e memórias
            que ficam.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1fa855] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#188a46]"
            >
              <MessageCircleMore className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href={flInstagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
              @fl_locacoesvale
            </a>
          </div>
        </div>

        <nav aria-label="Navegação do rodapé">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-yellow">Navegação</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-yellow">Onde atendemos</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            {supportedCities
              .filter((city) => city !== "Outro")
              .map((city) => (
                <li key={city} className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-fl-blue-200" aria-hidden="true" />
                  {city}
                </li>
              ))}
            <li className="text-white/55">e demais cidades da região.</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="fl-shell flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/55 sm:flex-row">
          <p>© {year} F&amp;L Locações. Todos os direitos reservados.</p>
          <p>São José dos Campos · Vale do Paraíba</p>
        </div>
      </div>
    </footer>
  );
}
