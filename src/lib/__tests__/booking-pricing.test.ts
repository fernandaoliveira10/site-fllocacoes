import { describe, expect, it } from "vitest";

import { calculateBookingPricing } from "@/lib/booking-pricing";

describe("calculateBookingPricing", () => {
  it("applies fixed price, city fee, discount and deposit for a single product", () => {
    const pricing = calculateBookingPricing({
      items: [
        { productId: "prod-plataforma-360", price: 32000, quantity: 1, extraPricePerHour: 10000 },
      ],
      extraHours: 0,
      eventCity: "São José dos Campos",
    });

    expect(pricing.subtotalAmount).toBe(32000);
    expect(pricing.discountAmount).toBe(0);
    expect(pricing.transportFee).toBe(1500);
    expect(pricing.totalAmount).toBe(33500);
    expect(pricing.depositAmount).toBe(10050);
  });

  it("applies the 5 percent discount when there are two products", () => {
    const pricing = calculateBookingPricing({
      items: [
        { productId: "prod-plataforma-360", price: 35000, quantity: 1, extraPricePerHour: 10000 },
        { productId: "prod-fotografia", price: 20000, quantity: 1, extraPricePerHour: null },
      ],
      extraHours: 0,
      eventCity: "Caçapava",
    });

    expect(pricing.subtotalAmount).toBe(55000);
    expect(pricing.discountAmount).toBe(2750);
    expect(pricing.transportFee).toBe(4000);
    expect(pricing.totalAmount).toBe(56250);
    expect(pricing.depositAmount).toBe(16875);
  });

  it("adds extra hours only for eligible products", () => {
    const pricing = calculateBookingPricing({
      items: [
        { productId: "prod-cama-elastica", price: 17000, quantity: 1, extraPricePerHour: 10000 },
        { productId: "prod-fotografia", price: 30000, quantity: 1, extraPricePerHour: null },
      ],
      extraHours: 2,
      eventCity: "Jacareí",
    });

    expect(pricing.extraTotal).toBe(20000);
    expect(pricing.totalAmount).toBe(72000);
    expect(pricing.depositAmount).toBe(21600);
  });
});
