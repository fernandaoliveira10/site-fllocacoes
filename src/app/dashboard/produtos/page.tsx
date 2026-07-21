import { getAllProducts } from "@/server/services/products";
import { ProductManager } from "@/components/product-manager";

export default async function ProdutosPage() {
  const products = await getAllProducts();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-fl-gray-200 bg-white p-6 shadow-soft">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-fl-blue">Administrativo</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-fl-blue-dark">Produtos</h1>
        </div>
      </div>

      <ProductManager initialProducts={products} />
    </section>
  );
}
