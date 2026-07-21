"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-2 rounded-xl border border-fl-gray-300 bg-white px-4 py-2 text-sm font-medium text-fl-gray-700 shadow-soft transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </button>
  );
}
