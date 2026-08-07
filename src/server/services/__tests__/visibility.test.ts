import { describe, expect, it, vi } from "vitest";

vi.mock("@/mocks/data", () => ({
  mockProducts: [
    {
      id: "active-product",
      name: "Produto Ativo",
      description: null,
      category: "PLATAFORMA_360",
      extraPricePerHour: null,
      isOutsourced: false,
      priceConfirmed: true,
      isActive: true,
      media: [],
      priceTiers: [],
    },
    {
      id: "inactive-product",
      name: "Produto Inativo",
      description: null,
      category: "PLATAFORMA_360",
      extraPricePerHour: null,
      isOutsourced: false,
      priceConfirmed: true,
      isActive: false,
      media: [],
      priceTiers: [],
    },
  ],
  mockBookings: [],
}));

describe("public record lookup", () => {
  it("hides inactive products by id", async () => {
    const { getProductById } = await import("@/server/services/products");

    await expect(getProductById("active-product")).resolves.toMatchObject({ id: "active-product" });
    await expect(getProductById("inactive-product")).resolves.toBeNull();
  });
});
