import { describe, expect, it } from "vitest";

import { bookingSchema, productUpdateSchema } from "@/lib/validations";

describe("validation schemas", () => {
  it("accepts partial product updates and rejects empty payloads", () => {
    expect(productUpdateSchema.safeParse({ isActive: false }).success).toBe(true);
    expect(productUpdateSchema.safeParse({}).success).toBe(false);
  });

  it("requires items, bairro and supported city for leads", () => {
    const commonFields = {
      clientName: "Cliente Teste",
      clientPhone: "11999999999",
      eventDate: new Date().toISOString(),
      eventTime: "14:00",
      eventNeighborhood: "Centro",
      eventCity: "São José dos Campos",
      extraHours: 0,
      notes: "",
      items: [
        {
          productId: "prod-plataforma-360",
          quantity: 1,
          durationHours: 2,
          price: 32000,
        },
      ],
    };

    expect(bookingSchema.safeParse(commonFields).success).toBe(true);
    expect(
      bookingSchema.safeParse({
        ...commonFields,
        eventCity: "Cidade inexistente",
      }).success,
    ).toBe(false);
    expect(
      bookingSchema.safeParse({
        ...commonFields,
        items: [],
      }).success,
    ).toBe(false);
  });
});
