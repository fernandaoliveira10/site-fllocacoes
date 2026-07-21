import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-fl-gray-200 bg-white p-10 shadow-soft-lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-fl-blue">404</p>
        <h1 className="mt-4 font-display text-5xl font-bold text-fl-blue-dark">Página não encontrada</h1>
        <p className="mt-4 text-sm leading-6 text-fl-gray-600">
          Essa página não existe na F&L Locações.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-fl-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark"
        >
          Voltar ao início
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
