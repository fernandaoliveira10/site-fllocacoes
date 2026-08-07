import { mockProducts } from "@/mocks/data";
import type { Product, ProductCategory, ProductMediaType } from "@/lib/types";

type MediaInput = {
  url: string;
  alt: string | undefined;
  type: ProductMediaType;
};

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
const productState = mockProducts;

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

function readMedia(input: Record<string, unknown>) {
  if (!Object.prototype.hasOwnProperty.call(input, "media")) {
    return undefined;
  }

  const rawMedia = input.media;
  if (!Array.isArray(rawMedia)) {
    return [];
  }

  return rawMedia
    .map((item): MediaInput | null => {
      if (!item || typeof item !== "object") return null;
      const mediaItem = item as { url?: unknown; alt?: unknown; type?: unknown };
      const url = typeof mediaItem.url === "string" ? mediaItem.url.trim() : "";
      if (!url) return null;

      return {
        url,
        alt: typeof mediaItem.alt === "string" && mediaItem.alt.trim() ? mediaItem.alt.trim() : undefined,
        type: resolveMediaType(url, mediaItem.type),
      };
    })
    .filter((item): item is MediaInput => item !== null);
}

function buildMediaIds(productId: string, media: MediaInput[]) {
  return media.map((item, index) => ({
    id: `media-${productId}-${index}-${Date.now()}`,
    url: item.url,
    alt: item.alt,
    type: item.type,
  }));
}

function findProductIndex(id: string) {
  return productState.findIndex((product) => product.id === id);
}

export async function getActiveProducts() {
  return productState.filter((product) => product.isActive);
}

export async function getAllProducts() {
  return productState;
}

export async function getProductById(id: string) {
  return productState.find((product) => product.id === id && product.isActive) ?? null;
}

export async function createProduct(input: Record<string, unknown>) {
  const media = readMedia(input);
  const productId = `product-mock-${Date.now()}`;
  const product: Product = {
    id: productId,
    name: String(input.name),
    description: input.description ? String(input.description) : null,
    category: input.category as ProductCategory,
    extraPricePerHour:
      input.extraPricePerHour !== undefined && input.extraPricePerHour !== null ? Number(input.extraPricePerHour) : null,
    isOutsourced: Boolean(input.isOutsourced ?? false),
    priceConfirmed: Boolean(input.priceConfirmed ?? true),
    isActive: Boolean(input.isActive ?? true),
    media: media ? buildMediaIds(productId, media) : [],
    priceTiers: [],
  };

  productState.unshift(product);
  return product;
}

export async function updateProduct(id: string, input: Record<string, unknown>) {
  const productIndex = findProductIndex(id);
  if (productIndex === -1) {
    throw new Error("Produto nao encontrado.");
  }

  const product = productState[productIndex];

  if (input.name !== undefined) product.name = String(input.name);
  if (input.description !== undefined) {
    product.description = input.description === null || input.description === "" ? null : String(input.description);
  }
  if (input.category !== undefined) product.category = input.category as ProductCategory;
  if (input.extraPricePerHour !== undefined) {
    product.extraPricePerHour = input.extraPricePerHour === null ? null : Number(input.extraPricePerHour);
  }
  if (input.isOutsourced !== undefined) product.isOutsourced = Boolean(input.isOutsourced);
  if (input.priceConfirmed !== undefined) product.priceConfirmed = Boolean(input.priceConfirmed);
  if (input.isActive !== undefined) product.isActive = Boolean(input.isActive);

  const media = readMedia(input);
  if (media !== undefined) {
    product.media = buildMediaIds(id, media);
  }

  return product;
}

export async function deleteProduct(id: string) {
  const productIndex = findProductIndex(id);
  if (productIndex === -1) {
    throw new Error("Produto nao encontrado.");
  }

  productState[productIndex].isActive = false;
  return productState[productIndex];
}
