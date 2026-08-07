import { z } from "zod";

const productCategorySchema = z.enum([
  "PLATAFORMA_360",
  "CAMA_ELASTICA",
  "FOTOGRAFIA",
  "PISCINA_BOLINHA",
  "MESAS_CADEIRAS",
]);

const bookingStatusValueSchema = z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]);
const supportedCitySchema = z.enum(["São José dos Campos", "Caçapava", "Taubaté", "Jacareí"]);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const productSchema = z
  .object({
    name: z.string().min(2),
    description: z.string().optional(),
    category: productCategorySchema,
    extraPricePerHour: z.coerce.number().int().positive().optional().nullable(),
    isOutsourced: z.boolean().optional(),
    priceConfirmed: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const productUpdateSchema = productSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "Informe ao menos um campo para atualizacao." },
);

export const bookingItemInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive().default(1),
  durationHours: z.coerce.number().int().positive(),
  price: z.coerce.number().int().min(0),
});

export const leadSchema = z
  .object({
    clientName: z.string().min(3),
    clientPhone: z.string().min(8),
    eventDate: z.string().min(1),
    eventTime: z.string().min(1),
    eventNeighborhood: z.string().min(2, "Informe o bairro"),
    eventCity: supportedCitySchema,
    items: z.array(bookingItemInputSchema).min(1),
    extraHours: z.coerce.number().int().min(0).default(0),
    notes: z.string().optional(),
  })
  .strict();

export const bookingSchema = leadSchema;

export const bookingStatusSchema = z
  .object({
    status: bookingStatusValueSchema,
    notes: z.string().optional().nullable(),
  })
  .strict();

export const bookingNotesSchema = z
  .object({
    notes: z.string().optional().nullable(),
  })
  .strict();
