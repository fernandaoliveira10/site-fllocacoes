import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

import { Header } from "@/components/header";

const displayFont = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const sansFont = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "F&L Locações | Aluguel de Brinquedos para Festas e Eventos",
  description:
    "Aluguel de brinquedos e atrações para festas, empresas e eventos em São José dos Campos, Jacareí e região. Plataforma 360, cama elástica, piscina de bolinhas e mais.",
  openGraph: {
    title: "F&L Locações | Aluguel de Brinquedos para Festas e Eventos",
    description:
      "Aluguel de brinquedos e atrações para festas, empresas e eventos. Plataforma 360, cama elástica, piscina de bolinhas e muito mais.",
    siteName: "F&L Locações",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${displayFont.variable} ${sansFont.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
