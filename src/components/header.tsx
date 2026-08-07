"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, MessageCircleMore, X } from "lucide-react";

import { flWhatsAppMessage, flWhatsAppNumber } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#contato", label: "Contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const whatsappHref = buildWhatsAppUrl(flWhatsAppNumber, flWhatsAppMessage);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-fl-gray-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-soft">
            <Image src="/images/logo/logo-fl.png" alt="F&L Locações" width={40} height={40} className="h-full w-full object-contain" />
          </span>
        </Link>

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

        <div className="hidden items-center gap-3 sm:flex">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-fl-gray-300 px-4 py-2 text-sm font-medium text-fl-gray-700 transition hover:border-fl-blue hover:text-fl-blue"
          >
            WhatsApp
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-fl-blue px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark"
          >
            <MessageCircleMore className="h-4 w-4" />
            Pedir orçamento
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center rounded-lg p-2 text-fl-gray-600 transition hover:bg-fl-gray-100 md:hidden"
          aria-label="Abrir menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-fl-gray-200 bg-white md:hidden">
          <nav className="flex flex-col gap-1 px-4 pb-6 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-fl-gray-600 transition hover:bg-fl-gray-100 hover:text-fl-blue-dark"
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-fl-gray-200" />
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-fl-gray-300 px-4 py-3 text-center text-sm font-medium text-fl-gray-700 transition hover:border-fl-blue hover:text-fl-blue"
            >
              WhatsApp
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-fl-blue px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark"
            >
              <MessageCircleMore className="h-4 w-4" />
              Pedir orçamento
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
