import Link from "next/link";
import { ClipboardList, MessageCircleMore } from "lucide-react";

import { flWhatsAppMessage, flWhatsAppNumber } from "@/lib/constants";
import { buildWhatsAppUrl, cn } from "@/lib/utils";

type Size = "md" | "lg";

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-sm sm:text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export function WhatsAppButton({
  className,
  size = "md",
  variant = "solid",
  children = "Falar no WhatsApp",
  message,
}: {
  className?: string;
  size?: Size;
  variant?: "solid" | "outline-light";
  children?: React.ReactNode;
  message?: string;
}) {
  const href = buildWhatsAppUrl(flWhatsAppNumber, message ?? flWhatsAppMessage);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        base,
        sizes[size],
        variant === "solid"
          ? "bg-[#1fa855] text-white shadow-sm hover:bg-[#188a46] focus-visible:outline-green-700"
          : "border border-white/70 bg-white/10 text-white backdrop-blur hover:bg-white/20 focus-visible:outline-white",
        className,
      )}
    >
      <MessageCircleMore className="h-5 w-5" aria-hidden="true" />
      {children}
    </a>
  );
}

export function QuoteButton({
  className,
  size = "md",
  variant = "solid",
  href = "/orcamento",
  children = "Montar orçamento",
}: {
  className?: string;
  size?: Size;
  variant?: "solid" | "light";
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        base,
        sizes[size],
        variant === "solid"
          ? "bg-fl-blue text-white shadow-lg shadow-fl-blue/20 hover:-translate-y-0.5 hover:bg-fl-blue-dark focus-visible:outline-fl-blue"
          : "bg-white text-fl-blue-dark hover:bg-fl-gray-100 focus-visible:outline-white",
        className,
      )}
    >
      <ClipboardList className="h-5 w-5" aria-hidden="true" />
      {children}
    </Link>
  );
}
