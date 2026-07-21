import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function EmptyState({ title, description, ctaHref, ctaLabel }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-fl-gray-300 bg-fl-gray-50 px-6 py-12 text-center">
      <h3 className="font-display text-3xl font-bold text-fl-blue-dark">{title}</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-fl-gray-600">{description}</p>
      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="mt-6 inline-flex rounded-xl bg-fl-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-fl-blue-dark"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
