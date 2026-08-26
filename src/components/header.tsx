"use client";

import Image from "next/image";
import Link from "next/link";
import { ClipboardList, MessageCircleMore } from "lucide-react";

import { flWhatsAppMessage, flWhatsAppNumber } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";

const navItems = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#como-funciona", label: "Como funciona" },
];

export function Header() {
  const whatsappHref = buildWhatsAppUrl(
    flWhatsAppNumber,
    flWhatsAppMessage
  );

  return (
    <header className="sticky top-0 z-50 border-b border-fl-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 lg:h-[4.5rem]">
          <Link href="/" className="flex items-center" aria-label="Ir para o início">
            <Image
              src="/images/logo/logo-fl.png"
              alt="F&L Locações"
              width={100}
              height={40}
              className="h-auto w-12 sm:w-16"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-fl-gray-600 transition hover:bg-fl-gray-100 hover:text-fl-blue-dark"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#1fa855] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#188a46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 sm:px-4"
            >
              <MessageCircleMore className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <Link
              href="/orcamento"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-fl-blue px-3 py-2 text-sm font-semibold text-white transition hover:bg-fl-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-blue sm:px-4"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Orçamento</span>
            </Link>
          </div>
        </div>

        <nav className="hidden grid-cols-3 border-t border-fl-gray-100 sm:grid lg:hidden" aria-label="Atalhos da página inicial">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center justify-center px-1 py-2 text-center text-xs font-medium text-fl-gray-600 transition hover:bg-fl-gray-50 hover:text-fl-blue"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-fl-gray-200 bg-white/95 p-2 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1fa855] px-3 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            <MessageCircleMore className="h-5 w-5" />
            WhatsApp
          </a>
          <Link
            href="/orcamento"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-fl-blue px-3 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-blue"
          >
            <ClipboardList className="h-5 w-5" />
            Orçamento
          </Link>
        </div>
      </div>
    </header>
  );
}
