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

export const supportedCities = [
  "São José dos Campos",
  "Caçapava",
  "Taubaté",
  "Jacareí",
] as const;

export const transportFeeByCity: Record<(typeof supportedCities)[number], number> = {
  "São José dos Campos": 1500,
  Caçapava: 4000,
  Taubaté: 6000,
  Jacareí: 5000,
};

export const coverageInfo = {
  cities: supportedCities.join(", "),
  transportFeeByCity,
};

export const extraHourRate = 10000;
export const bookingDiscountRate = 0.05;
export const bookingDepositRate = 0.3;
