import { describe, expect, it } from "vitest";

import { calculateBookingPricing } from "@/lib/booking-pricing";

describe("calculateBookingPricing", () => {
  it("applies fixed price and deposit for a single product", () => {
    const pricing = calculateBookingPricing({
      items: [
        { productId: "prod-plataforma-360", price: 32000, quantity: 1, extraPricePerHour: 10000 },
      ],
      extraHours: 0,
    });

    expect(pricing.subtotalAmount).toBe(32000);
    expect(pricing.discountAmount).toBe(0);
    expect(pricing.totalAmount).toBe(32000);
    expect(pricing.depositAmount).toBe(9600);
  });

  it("applies the 5 percent discount when there are two products", () => {
    const pricing = calculateBookingPricing({
      items: [
        { productId: "prod-plataforma-360", price: 35000, quantity: 1, extraPricePerHour: 10000 },
        { productId: "prod-fotografia", price: 20000, quantity: 1, extraPricePerHour: null },
      ],
      extraHours: 0,
    });

    expect(pricing.subtotalAmount).toBe(55000);
    expect(pricing.discountAmount).toBe(2750);
    expect(pricing.totalAmount).toBe(52250);
    expect(pricing.depositAmount).toBe(15675);
  });

  it("adds extra hours only for eligible products", () => {
    const pricing = calculateBookingPricing({
      items: [
        { productId: "prod-cama-elastica", price: 17000, quantity: 1, extraPricePerHour: 10000 },
        { productId: "prod-fotografia", price: 30000, quantity: 1, extraPricePerHour: null },
      ],
      extraHours: 2,
    });

    expect(pricing.extraTotal).toBe(20000);
    expect(pricing.totalAmount).toBe(64650);
    expect(pricing.depositAmount).toBe(19395);
  });

  it("does not apply package discount over promotional combo prices", () => {
    const pricing = calculateBookingPricing({
      items: [
        { productId: "prod-combo-totem-digital-p360", price: 75000, quantity: 1, isComboPrice: true },
        { productId: "prod-fotografia", price: 30000, quantity: 1 },
      ],
      extraHours: 0,
    });

    expect(pricing.subtotalAmount).toBe(105000);
    expect(pricing.discountAmount).toBe(0);
    expect(pricing.totalAmount).toBe(105000);
    expect(pricing.depositAmount).toBe(31500);
  });
});
