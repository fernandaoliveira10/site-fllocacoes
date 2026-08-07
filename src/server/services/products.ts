import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils";
import { mockProducts } from "@/mocks/data";
import { runWithFallback } from "@/server/services/fallback";
import type { Product, ProductCategory, ProductMediaType } from "@/lib/types";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];

function resolveMediaType(url: string, typeValue: unknown): ProductMediaType {
  const normalizedType = typeof typeValue === "string" ? typeValue.toUpperCase() : "";
  if (normalizedType === "VIDEO" || normalizedType === "IMAGE") {
    return normalizedType;
  }

  const lowerUrl = url.toLowerCase();
  if (VIDEO_EXTENSIONS.some((extension) => lowerUrl.includes(extension))) {
    return "VIDEO";
  }

  return "IMAGE";
}

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
    media: product.media?.map((media: any) => ({
      id: media.id,
      url: media.url,
      alt: media.alt ?? undefined,
      type: resolveMediaType(media.url, media.type),
    })) ?? [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    priceTiers: product.priceTiers?.map((tier: any) => ({
      id: tier.id,
      durationHours: tier.durationHours,
      price: tier.price,
      label: tier.label ?? undefined,
      isComboPrice: tier.isComboPrice,
    })) ?? [],
  };
}

function readMedia(input: Record<string, unknown>) {
  if (!Object.prototype.hasOwnProperty.call(input, "media")) {
    return undefined;
  }

  const rawMedia = input.media;
  if (!Array.isArray(rawMedia)) {
    return [];
  }

  return rawMedia
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const mediaItem = item as { url?: unknown; alt?: unknown; type?: unknown };
      const url = typeof mediaItem.url === "string" ? mediaItem.url.trim() : "";
      if (!url) return null;

      return {
        url,
        alt: typeof mediaItem.alt === "string" && mediaItem.alt.trim() ? mediaItem.alt.trim() : null,
        type: resolveMediaType(url, mediaItem.type),
      };
    })
    .filter((item): item is { url: string; alt: string | null; type: ProductMediaType } => item !== null);
}

export async function getActiveProducts() {
  return runWithFallback(
    async () => {
      if (!isDatabaseConfigured()) return mockProducts.filter((product) => product.isActive);
      const products = await prisma.product.findMany({
        where: { isActive: true },
        include: { media: true, priceTiers: true },
        orderBy: { createdAt: "desc" },
      });
      return products.map(mapDbProduct);
    },
    () => mockProducts.filter((product) => product.isActive),
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
  if (!isDatabaseConfigured()) {
    return mockProducts.find((product) => product.id === id && product.isActive) ?? null;
  }

  const product = await prisma.product.findFirst({
    where: { id, isActive: true },
    include: { media: true, priceTiers: true },
  });

  return product ? mapDbProduct(product) : null;
}

export async function createProduct(input: Record<string, unknown>) {
  if (!isDatabaseConfigured()) {
    throw new Error("Banco nao configurado para persistir produtos.");
  }

  const media = readMedia(input);

  return prisma.product.create({
    data: {
      name: String(input.name),
      description: input.description ? String(input.description) : null,
      category: input.category as ProductCategory,
      extraPricePerHour:
        input.extraPricePerHour !== undefined && input.extraPricePerHour !== null
          ? Number(input.extraPricePerHour)
          : null,
      isOutsourced: Boolean(input.isOutsourced ?? false),
      priceConfirmed: Boolean(input.priceConfirmed ?? true),
      isActive: Boolean(input.isActive ?? true),
      media: media && media.length > 0 ? { create: media } : undefined,
    },
    include: { media: true, priceTiers: true },
  });
}

export async function updateProduct(id: string, input: Record<string, unknown>) {
  if (!isDatabaseConfigured()) {
    throw new Error("Banco nao configurado para persistir produtos.");
  }

  const data: Record<string, unknown> = {};

  if (input.name !== undefined) data.name = String(input.name);
  if (input.description !== undefined) {
    data.description = input.description === null || input.description === "" ? null : String(input.description);
  }
  if (input.category !== undefined) data.category = input.category as ProductCategory;
  if (input.extraPricePerHour !== undefined) {
    data.extraPricePerHour = input.extraPricePerHour === null ? null : Number(input.extraPricePerHour);
  }
  if (input.isOutsourced !== undefined) data.isOutsourced = Boolean(input.isOutsourced);
  if (input.priceConfirmed !== undefined) data.priceConfirmed = Boolean(input.priceConfirmed);
  if (input.isActive !== undefined) data.isActive = Boolean(input.isActive);

  const media = readMedia(input);
  if (media !== undefined) {
    data.media = {
      deleteMany: {},
      ...(media.length > 0 ? { create: media } : {}),
    };
  }

  return prisma.product.update({
    where: { id },
    data,
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
