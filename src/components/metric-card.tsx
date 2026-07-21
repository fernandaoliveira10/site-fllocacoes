import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
}

export function MetricCard({ label, value, hint, icon }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-fl-gray-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-fl-gray-500">{label}</p>
        <span className="text-fl-blue">{icon}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-fl-blue-dark">{value}</p>
      <p className="mt-1 text-xs text-fl-gray-500">{hint}</p>
    </div>
  );
}
