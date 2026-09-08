import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { StructuredData } from "@/components/structured-data";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

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
  metadataBase: new URL(siteUrl),
  title: {
    default: "F&L Locações | Aluguel de Atrações para Festas e Eventos",
    template: "%s | F&L Locações",
  },
  description: siteDescription,
  keywords: [
    "aluguel de plataforma 360",
    "aluguel de cama elástica",
    "totem fotográfico para festa",
    "fotografia para eventos",
    "atrações para festa São José dos Campos",
    "locação de brinquedos Vale do Paraíba",
    "aluguel de atrações Jacareí",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "F&L Locações | Aluguel de Atrações para Festas e Eventos",
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/images/capa1.png", width: 1717, height: 916, alt: "Atrações da F&L Locações para festas e eventos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "F&L Locações | Aluguel de Atrações para Festas e Eventos",
    description: siteDescription,
    images: ["/images/capa1.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="no-js" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${sansFont.variable}`}>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.remove('no-js');",
          }}
        />
        <StructuredData />
        <Header />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
