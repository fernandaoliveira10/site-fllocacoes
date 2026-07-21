import Link from "next/link";
import type { ReactNode } from "react";

interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  emptyLabel?: string;
  rowHref?: (row: T) => string;
}

export function DataTable<T extends { id?: string }>({ rows, columns, emptyLabel, rowHref }: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-fl-gray-300 bg-fl-gray-50 p-8 text-sm text-fl-gray-500">
        {emptyLabel ?? "Nenhum dado encontrado."}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-fl-gray-200 bg-white shadow-soft">
      <table className="min-w-full divide-y divide-fl-gray-100 text-left text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-5 py-4 font-semibold text-fl-gray-600">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-fl-gray-100">
          {rows.map((row, index) => {
            const content = (
              <>
                {columns.map((column) => (
                  <td key={`${String(column.key)}-${index}`} className="px-5 py-4 text-fl-gray-700">
                    {column.render(row)}
                  </td>
                ))}
              </>
            );

            if (!rowHref) {
              return <tr key={row.id ?? index}>{content}</tr>;
            }

            return (
              <tr key={row.id ?? index} className="transition hover:bg-fl-gray-50">
                {columns.map((column) => (
                  <td key={`${String(column.key)}-${index}`} className="px-5 py-4 text-fl-gray-700">
                    <Link href={rowHref(row)} className="block">
                      {column.render(row)}
                    </Link>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
