import { getAllCombos } from "@/server/services/combos";
import { ComboManager } from "@/components/combo-manager";

export default async function CombosPage() {
  const combos = await getAllCombos();

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-fl-gray-200 bg-white p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wider text-fl-blue">Administrativo</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-fl-blue-dark">Combos</h1>
      </div>

      <ComboManager initialCombos={combos} />
    </section>
  );
}
