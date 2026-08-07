import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils";
import { mockBookings, mockProducts } from "@/mocks/data";
import { runWithFallback } from "@/server/services/fallback";
import { calculateBookingPricing, getTransportFeeForCity } from "@/lib/booking-pricing";
import { getProductById } from "@/server/services/products";
import type { Booking, Product } from "@/lib/types";

function getFallbackProduct(productId: string): Product {
  return (
    mockProducts.find((product) => product.id === productId) ?? {
      id: productId,
      name: "Produto",
      description: null,
      category: "PLATAFORMA_360",
      extraPricePerHour: null,
      isOutsourced: false,
      priceConfirmed: false,
      isActive: true,
      media: [],
      priceTiers: [],
    }
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbBooking(booking: any): Booking {
  return {
    id: booking.id,
    clientName: booking.clientName,
    clientEmail: booking.clientEmail,
    clientPhone: booking.clientPhone,
    eventDate: booking.eventDate instanceof Date ? booking.eventDate.toISOString() : booking.eventDate,
    eventTime: booking.eventTime,
    durationHours: booking.durationHours,
    extraHours: booking.extraHours ?? 0,
    totalAmount: booking.totalAmount,
    depositAmount: booking.depositAmount,
    paymentPlan: booking.paymentPlan,
    paymentMethod: booking.paymentMethod,
    status: booking.status,
    notes: booking.notes ?? null,
    eventType: booking.eventType ?? null,
    eventAddress: booking.eventAddress ?? null,
    eventCity: booking.eventCity ?? null,
    eventNotes: booking.eventNotes ?? null,
    transportFee: booking.transportFee ?? null,
    hasTransportFee: booking.hasTransportFee ?? false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: booking.items?.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      product: item.product ?? getFallbackProduct(item.productId),
      quantity: item.quantity,
      price: item.price,
      durationHours: item.durationHours,
    })) ?? [],
    createdAt: booking.createdAt instanceof Date ? booking.createdAt.toISOString() : booking.createdAt,
  };
}

async function resolveInputItems(
  items: {
    productId: string;
    quantity: number;
    durationHours: number;
    price: number;
  }[],
) {
  const resolved = [] as {
    productId: string;
    quantity: number;
    durationHours: number;
    price: number;
    extraPricePerHour: number | null;
    product: Product;
  }[];

  for (const item of items) {
    const product = (await getProductById(item.productId)) ?? getFallbackProduct(item.productId);
    const tier = product.priceTiers.find((priceTier) => priceTier.durationHours === item.durationHours && !priceTier.isComboPrice);

    if (!tier) {
      throw new Error(`Prazo indisponível para ${product.name}.`);
    }

    resolved.push({
      productId: product.id,
      quantity: item.quantity,
      durationHours: item.durationHours,
      price: tier.price,
      extraPricePerHour: product.extraPricePerHour,
      product,
    });
  }

  return resolved;
}

export async function getBookings() {
  return runWithFallback(
    async () => {
      if (!isDatabaseConfigured()) return mockBookings;
      const bookings = await prisma.booking.findMany({
        include: {
          items: { include: { product: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return bookings.map(mapDbBooking);
    },
    () => mockBookings,
  );
}

export async function getBookingById(id: string) {
  const bookings = await getBookings();
  return bookings.find((b) => b.id === id) ?? null;
}

export async function createBooking(input: {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  eventTime: string;
  extraHours?: number;
  items: {
    productId: string;
    quantity: number;
    durationHours: number;
    price: number;
  }[];
  eventType: string;
  eventAddress: string;
  eventCity: string;
  eventNotes?: string;
}) {
  const extraHours = input.extraHours ?? 0;
  const resolvedItems = await resolveInputItems(input.items);
  const pricing = calculateBookingPricing({
    items: resolvedItems.map((item) => ({
      productId: item.productId,
      price: item.price,
      quantity: item.quantity,
      extraPricePerHour: item.extraPricePerHour,
    })),
    extraHours,
    eventCity: input.eventCity,
  });
  const durationHours = Math.max(...resolvedItems.map((item) => item.durationHours));
  const transportFee = getTransportFeeForCity(input.eventCity);

  if (!isDatabaseConfigured()) {
    return {
      id: `booking-mock-${Date.now()}`,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      eventDate: input.eventDate,
      eventTime: input.eventTime,
      durationHours,
      extraHours: pricing.extraHours,
      totalAmount: pricing.totalAmount,
      depositAmount: pricing.depositAmount,
      paymentPlan: "deposit",
      paymentMethod: "pix",
      status: "PENDING",
      notes: null,
      eventType: input.eventType,
      eventAddress: input.eventAddress,
      eventCity: input.eventCity,
      eventNotes: input.eventNotes ?? null,
      transportFee,
      hasTransportFee: transportFee > 0,
      items: resolvedItems.map((item) => ({
        id: `bi-mock-${Date.now()}-${item.productId}`,
        productId: item.productId,
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        durationHours: item.durationHours,
      })),
      createdAt: new Date().toISOString(),
    } as Booking;
  }

  return prisma.booking.create({
    data: {
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      eventDate: new Date(input.eventDate),
      eventTime: input.eventTime,
      durationHours,
      extraHours: pricing.extraHours,
      totalAmount: pricing.totalAmount,
      depositAmount: pricing.depositAmount,
      paymentPlan: "deposit",
      paymentMethod: "pix",
      status: "PENDING",
      eventType: input.eventType,
      eventAddress: input.eventAddress,
      eventCity: input.eventCity,
      eventNotes: input.eventNotes,
      transportFee,
      hasTransportFee: transportFee > 0,
      items: {
        create: resolvedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          durationHours: item.durationHours,
        })),
      },
    },
    include: {
      items: { include: { product: true } },
    },
  });
}

export async function updateBookingStatus(id: string, status: string, notes?: string | null) {
  if (!isDatabaseConfigured()) {
    throw new Error("Banco nao configurado.");
  }

  const data: Record<string, unknown> = { status };
  if (notes !== undefined) data.notes = notes;

  return prisma.booking.update({
    where: { id },
    data,
    include: {
      items: { include: { product: true } },
    },
  });
}

export async function updateBookingNotes(id: string, notes: string | null) {
  if (!isDatabaseConfigured()) {
    throw new Error("Banco nao configurado.");
  }

  return prisma.booking.update({
    where: { id },
    data: { notes },
  });
}
