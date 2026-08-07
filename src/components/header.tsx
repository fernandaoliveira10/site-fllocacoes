"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircleMore } from "lucide-react";

import { flWhatsAppMessage, flWhatsAppNumber } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/orcamentos", label: "Criar Orçamento" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const whatsappHref = buildWhatsAppUrl(
    flWhatsAppNumber,
    flWhatsAppMessage
  );

  return (
    <header className="sticky top-0 z-50 border-b border-fl-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Linha principal */}
        <div className="flex h-16 items-center justify-between">
          <Link href="/produtos" className="flex items-center">
            <Image
              src="/images/logo/logo-fl.png"
              alt="F&L Locações"
              width={100}
              height={40}
              className="h-auto w-12 sm:w-16"
              priority
            />
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden items-center gap-1 md:flex">
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

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-fl-gray-300 px-3 py-2 text-xs font-medium text-fl-gray-700 transition hover:border-fl-blue hover:text-fl-blue sm:px-4 sm:text-sm"
          >
            <MessageCircleMore className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>

        {/* Navegação mobile sempre visível */}
        <nav className="grid grid-cols-3 border-t border-fl-gray-100 md:hidden">
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
    </header>
  );
}