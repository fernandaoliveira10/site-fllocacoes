export function formatCurrency(value?: number | null) {
  if (value === undefined || value === null) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("pt-BR");
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}
