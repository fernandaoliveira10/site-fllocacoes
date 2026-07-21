import type { UserRole } from "@/lib/types";

export const appName = "F&L Locações";

export const roleLabels: Record<UserRole, string> = {
  ADMIN: "Equipe F&L",
};

export const publicNavigation = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/orcamento", label: "Orçamento" },
  { href: "/#contato", label: "Contato" },
];

export const dashboardNavigation = [
  { href: "/dashboard", label: "Resumo" },
  { href: "/dashboard/produtos", label: "Produtos" },
  { href: "/dashboard/combos", label: "Combos" },
];

export const flWhatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5512992328681";
export const flWhatsAppMessage = "Quero um orçamento da F&L Locações para meu evento.";
export const flInstagramUrl = "https://instagram.com/fl_locacoesvale";

export const demoCredentials = [
  { role: "Admin", email: "admin@flocacoes.com", password: "fl123456" },
];

export const bookingStatusLabels: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  COMPLETED: "Realizado",
  CANCELLED: "Cancelado",
};

export const coverageInfo = {
  cities: "São José dos Campos, Jacareí e região",
  freeKm: 20,
  extraKmRate: 1500,
  extraKmStep: 5,
};

export const extraHourRate = 5000; // R$50 per product per extra hour
