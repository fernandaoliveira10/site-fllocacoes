import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  label?: string;
}

const styles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const labels: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  COMPLETED: "Realizado",
  CANCELLED: "Cancelado",
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={cn("inline-block rounded-full px-3 py-1 text-xs font-medium", styles[status] ?? "border border-fl-gray-300 text-fl-gray-600")}>
      {label ?? labels[status] ?? status}
    </span>
  );
}
