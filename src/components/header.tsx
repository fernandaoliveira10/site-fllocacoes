"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipboardList, MessageCircleMore, Menu, X } from "lucide-react";

import { flWhatsAppMessage, flWhatsAppNumber } from "@/lib/constants";
import { buildWhatsAppUrl, cn } from "@/lib/utils";

const navItems = [
  { href: "/produtos", label: "Produtos" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/produtos#contato", label: "Contato" },
];

const HIDDEN_PREFIXES = ["/dashboard", "/agenda", "/orcamentos", "/login"];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (pathname && HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  const whatsappHref = buildWhatsAppUrl(flWhatsAppNumber, flWhatsAppMessage);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || menuOpen
          ? "border-fl-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
          : "border-transparent bg-white",
      )}
    >
      <div className="fl-shell">
        <div className="flex h-16 items-center justify-between gap-3 lg:h-20">
          <Link href="/" className="flex items-center gap-2.5" aria-label="F&L Locações — ir para o início">
            <Image
              src="/images/logo/logo-fl.png"
              alt="F&L Locações"
              width={120}
              height={48}
              className="h-9 w-auto sm:h-10"
              priority
            />
            <span className="hidden font-display text-base font-bold tracking-tight text-fl-blue-dark sm:block">
              F&amp;L Locações
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-fl-gray-600 transition hover:bg-fl-blue-50 hover:text-fl-blue-dark"
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
              <MessageCircleMore className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <Link
              href="/orcamento"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-fl-blue px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-fl-blue/20 transition hover:bg-fl-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-blue sm:px-4"
            >
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Orçamento</span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-fl-gray-200 text-fl-blue-dark transition hover:bg-fl-blue-50 lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <nav
          id="mobile-nav"
          className="border-t border-fl-gray-100 pb-3 lg:hidden"
          aria-label="Navegação"
          hidden={!menuOpen}
        >
          <ul className="grid gap-1 pt-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-fl-gray-700 transition hover:bg-fl-blue-50 hover:text-fl-blue-dark"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
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
            <MessageCircleMore className="h-5 w-5" aria-hidden="true" />
            WhatsApp
          </a>
          <Link
            href="/orcamento"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-fl-blue px-3 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fl-blue"
          >
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
            Orçamento
          </Link>
        </div>
      </div>
    </header>
  );
}
