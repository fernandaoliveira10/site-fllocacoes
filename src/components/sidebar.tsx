import Link from "next/link";
import { LogOut, Package, LayoutDashboard } from "lucide-react";

import { dashboardNavigation } from "@/lib/constants";

interface SidebarProps {
  name?: string | null;
}

export function Sidebar({ name }: SidebarProps) {
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-fl-gray-200 bg-white p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fl-blue">Painel</p>
        <h2 className="mt-2 font-display text-xl font-bold text-fl-blue-dark">{name ?? "F&L Locações"}</h2>
        <p className="mt-1 text-sm text-fl-gray-500">Equipe administrativa</p>
      </div>

      <nav className="space-y-1 rounded-2xl border border-fl-gray-200 bg-white p-3 shadow-soft">
        {dashboardNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-fl-gray-600 transition hover:bg-fl-gray-100 hover:text-fl-blue-dark"
          >
            {item.label === "Resumo" && <LayoutDashboard className="h-4 w-4" />}
            {item.label === "Produtos" && <Package className="h-4 w-4" />}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="rounded-2xl border border-fl-gray-200 bg-white p-3 shadow-soft">
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </Link>
      </div>
    </aside>
  );
}
