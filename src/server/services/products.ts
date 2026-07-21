import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils";
import { mockProducts } from "@/mocks/data";
import { runWithFallback } from "@/server/services/fallback";
import type { Product, ProductCategory } from "@/lib/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbProduct(product: any): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    extraPricePerHour: product.extraPricePerHour,
    isOutsourced: product.isOutsourced,
    priceConfirmed: product.priceConfirmed,
    isActive: product.isActive,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    media: product.media?.map((m: any) => ({
      id: m.id,
      url: m.url,
      alt: m.alt ?? undefined,
      type: m.type,
    })) ?? [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    priceTiers: product.priceTiers?.map((t: any) => ({
      id: t.id,
      durationHours: t.durationHours,
      price: t.price,
      label: t.label ?? undefined,
      isComboPrice: t.isComboPrice,
    })) ?? [],
  };
}

export async function getActiveProducts() {
  return runWithFallback(
    async () => {
      if (!isDatabaseConfigured()) return mockProducts.filter((p) => p.isActive);
      const products = await prisma.product.findMany({
        where: { isActive: true },
        include: { media: true, priceTiers: true },
        orderBy: { createdAt: "desc" },
      });
      return products.map(mapDbProduct);
    },
    () => mockProducts.filter((p) => p.isActive),
  );
}

export async function getAllProducts() {
  return runWithFallback(
    async () => {
      if (!isDatabaseConfigured()) return mockProducts;
      const products = await prisma.product.findMany({
        include: { media: true, priceTiers: true },
        orderBy: { createdAt: "desc" },
      });
      return products.map(mapDbProduct);
    },
    () => mockProducts,
  );
}

export async function getProductById(id: string) {
  const products = await getAllProducts();
  return products.find((p) => p.id === id) ?? null;
}

export async function createProduct(input: Record<string, unknown>) {
  if (!isDatabaseConfigured()) {
    throw new Error("Banco nao configurado para persistir produtos.");
  }

  return prisma.product.create({
    data: {
      name: String(input.name),
      description: input.description ? String(input.description) : null,
      category: input.category as ProductCategory,
      extraPricePerHour: input.extraPricePerHour ? Number(input.extraPricePerHour) : null,
      isOutsourced: Boolean(input.isOutsourced ?? false),
      priceConfirmed: Boolean(input.priceConfirmed ?? true),
    },
    include: { media: true, priceTiers: true },
  });
}

export async function updateProduct(id: string, input: Record<string, unknown>) {
  if (!isDatabaseConfigured()) {
    throw new Error("Banco nao configurado para persistir produtos.");
  }

  return prisma.product.update({
    where: { id },
    data: input,
    include: { media: true, priceTiers: true },
  });
}

export async function deleteProduct(id: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("Banco nao configurado para persistir produtos.");
  }

  return prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
}
