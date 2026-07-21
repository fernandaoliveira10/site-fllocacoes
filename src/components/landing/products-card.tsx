import { Check } from "lucide-react";

const products = [
  "Plataforma 360",
  "Cama Elástica",
  "Piscina de Bolinhas",
  "Fotografia Profissional",
  "Mesas e Cadeiras",
];

export function ProductsCard() {
  return (
    <div className="rounded-2xl border border-fl-gray-200 bg-white p-6 shadow-card">
      <h3 className="font-display text-lg font-bold text-fl-blue-dark">Nossos Produtos</h3>
      <ul className="mt-4 space-y-3">
        {products.map((product) => (
          <li key={product} className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-fl-blue/10">
              <Check className="h-3 w-3 text-fl-blue" />
            </span>
            <span className="text-sm font-medium text-fl-gray-700">{product}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
