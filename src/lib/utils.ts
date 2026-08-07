import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildWhatsAppUrl(phone?: string, text?: string) {
  if (!phone) return "#";
  const message = encodeURIComponent(text ?? "Quero um orcamento da F&L Locacoes para meu evento.");
  return `https://wa.me/${phone}?text=${message}`;
}
