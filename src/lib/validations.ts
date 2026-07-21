import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.enum(["PLATAFORMA_360", "CAMA_ELASTICA", "FOTOGRAFIA", "PISCINA_BOLINHA", "MESAS_CADEIRAS"]),
  extraPricePerHour: z.coerce.number().int().positive().optional().nullable(),
  isOutsourced: z.boolean().optional(),
  priceConfirmed: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const comboItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
});

export const comboSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  totalPrice: z.coerce.number().int().positive(),
  durationHours: z.coerce.number().int().positive().default(3),
  discountPct: z.coerce.number().int().min(0).max(100).optional().nullable(),
  items: z.array(comboItemSchema).min(1),
});

export const bookingItemInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive().default(1),
  durationHours: z.coerce.number().int().positive(),
  price: z.coerce.number().int().min(0),
});

export const bookingSchema = z.object({
  clientName: z.string().min(3),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(8),
  eventDate: z.string().min(1),
  eventTime: z.string().min(1),
  comboId: z.string().optional().nullable(),
  items: z.array(bookingItemInputSchema).optional(),
  extraHours: z.coerce.number().int().min(0).default(0),
  totalAmount: z.coerce.number().int().positive(),
  eventType: z.string().min(1, "Selecione o tipo de evento"),
  eventAddress: z.string().min(5, "Informe o endereço do evento"),
  eventCity: z.string().optional(),
  eventNotes: z.string().optional(),
});

export const bookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]),
  notes: z.string().optional().nullable(),
});

export const bookingNotesSchema = z.object({
  notes: z.string().optional().nullable(),
});
