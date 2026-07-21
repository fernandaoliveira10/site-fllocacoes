import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils";
import { mockCombos, mockProducts } from "@/mocks/data";
import { runWithFallback } from "@/server/services/fallback";
import type { Combo, Product } from "@/lib/types";

function getProductById(productId: string): Product | undefined {
  return mockProducts.find((p) => p.id === productId);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbCombo(combo: any): Combo {
  return {
    id: combo.id,
    name: combo.name,
    description: combo.description,
    totalPrice: combo.totalPrice,
    durationHours: combo.durationHours,
    discountPct: combo.discountPct,
    isActive: combo.isActive,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: combo.items?.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      product: getProductById(item.productId) ?? {
        id: item.productId,
        name: "Produto",
        description: null,
        category: "PLATAFORMA_360",
        extraPricePerHour: null,
        isOutsourced: false,
        priceConfirmed: false,
        isActive: true,
        media: [],
        priceTiers: [],
      },
      quantity: item.quantity,
      durationHours: item.durationHours ?? undefined,
    })) ?? [],
  };
}

export async function getActiveCombos() {
  return runWithFallback(
    async () => {
      if (!isDatabaseConfigured()) return mockCombos.filter((c) => c.isActive);
      const combos = await prisma.combo.findMany({
        where: { isActive: true },
        include: {
          items: { include: { product: { include: { media: true, priceTiers: true } } } },
        },
        orderBy: { createdAt: "desc" },
      });
      return combos.map(mapDbCombo);
    },
    () => mockCombos.filter((c) => c.isActive),
  );
}

export async function getAllCombos() {
  return runWithFallback(
    async () => {
      if (!isDatabaseConfigured()) return mockCombos;
      const combos = await prisma.combo.findMany({
        include: {
          items: { include: { product: { include: { media: true, priceTiers: true } } } },
        },
        orderBy: { createdAt: "desc" },
      });
      return combos.map(mapDbCombo);
    },
    () => mockCombos,
  );
}

export async function getComboById(id: string) {
  const combos = await getAllCombos();
  return combos.find((c) => c.id === id) ?? null;
}

export async function createCombo(input: {
  name: string;
  description?: string;
  totalPrice: number;
  durationHours: number;
  discountPct?: number | null;
  items: { productId: string; quantity: number; durationHours?: number }[];
}) {
  if (!isDatabaseConfigured()) {
    throw new Error("Banco nao configurado para persistir combos.");
  }

  return prisma.combo.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      totalPrice: input.totalPrice,
      durationHours: input.durationHours,
      discountPct: input.discountPct ?? null,
      items: {
        create: input.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          durationHours: item.durationHours ?? undefined,
        })),
      },
    },
    include: { items: { include: { product: { include: { media: true, priceTiers: true } } } } },
  });
}

export async function updateCombo(id: string, input: Record<string, unknown>) {
  if (!isDatabaseConfigured()) {
    throw new Error("Banco nao configurado para persistir combos.");
  }

  return prisma.combo.update({
    where: { id },
    data: input,
    include: { items: { include: { product: { include: { media: true, priceTiers: true } } } } },
  });
}

export async function deleteCombo(id: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("Banco nao configurado para persistir combos.");
  }

  return prisma.combo.update({
    where: { id },
    data: { isActive: false },
  });
}
