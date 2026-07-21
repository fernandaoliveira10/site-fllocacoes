import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils";
import { mockBookings, mockProducts, mockCombos } from "@/mocks/data";
import { runWithFallback } from "@/server/services/fallback";
import type { Booking, Product, Combo } from "@/lib/types";

function getProductById(productId: string): Product | undefined {
  return mockProducts.find((p) => p.id === productId);
}

function getComboById(comboId: string): Combo | undefined {
  return mockCombos.find((c) => c.id === comboId);
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
    combo: booking.combo ? { id: booking.combo.id, name: booking.combo.name } : null,
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
      price: item.price,
      durationHours: item.durationHours,
    })) ?? [],
    createdAt: booking.createdAt instanceof Date ? booking.createdAt.toISOString() : booking.createdAt,
  };
}

export async function getBookings() {
  return runWithFallback(
    async () => {
      if (!isDatabaseConfigured()) return mockBookings;
      const bookings = await prisma.booking.findMany({
        include: {
          combo: { select: { id: true, name: true } },
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
  comboId?: string | null;
  items?: {
    productId: string;
    quantity: number;
    durationHours: number;
    price: number;
  }[];
  eventType: string;
  eventAddress: string;
  eventCity?: string;
  eventNotes?: string;
}) {
  const extraHours = input.extraHours ?? 0;

  if (!isDatabaseConfigured()) {
    // Mock mode: create booking in memory
    let totalAmount = 0;
    let durationHours = 3;
    let comboInfo: { id: string; name: string } | null = null;
    let bookingItems: {
      productId: string;
      quantity: number;
      price: number;
      durationHours: number;
      productName: string;
    }[] = [];

    if (input.comboId) {
      const combo = getComboById(input.comboId);
      if (!combo) throw new Error("Combo nao encontrado.");
      totalAmount = combo.totalPrice;
      durationHours = combo.durationHours;
      comboInfo = { id: combo.id, name: combo.name };
      bookingItems = combo.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: 0,
        durationHours: item.durationHours ?? combo.durationHours,
        productName: item.product.name,
      }));
      totalAmount += extraHours * 5000 * combo.items.length;
    } else if (input.items && input.items.length > 0) {
      totalAmount = input.items.reduce((sum, item) => sum + item.price, 0);
      durationHours = Math.max(...input.items.map((i) => i.durationHours));
      bookingItems = input.items.map((item) => {
        const product = getProductById(item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          durationHours: item.durationHours,
          productName: product?.name ?? "Produto",
        };
      });
      totalAmount += extraHours * 5000 * input.items.length;
    }

    const depositAmount = Math.round(totalAmount * 0.3);

    return {
      id: `booking-mock-${Date.now()}`,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      eventDate: input.eventDate,
      eventTime: input.eventTime,
      durationHours,
      extraHours,
      combo: comboInfo,
      totalAmount,
      depositAmount,
      paymentPlan: "deposit",
      paymentMethod: "pix",
      status: "PENDING",
      notes: null,
      eventType: input.eventType,
      eventAddress: input.eventAddress,
      eventCity: input.eventCity ?? null,
      eventNotes: input.eventNotes ?? null,
      transportFee: null,
      hasTransportFee: true,
      items: bookingItems.map((bi) => ({
        id: `bi-mock-${Date.now()}-${bi.productId}`,
        productId: bi.productId,
        product: getProductById(bi.productId) ?? {
          id: bi.productId,
          name: bi.productName,
          description: null,
          category: "PLATAFORMA_360",
          extraPricePerHour: null,
          isOutsourced: false,
          priceConfirmed: false,
          isActive: true,
          media: [],
          priceTiers: [],
        },
        quantity: bi.quantity,
        price: bi.price,
        durationHours: bi.durationHours,
      })),
      createdAt: new Date().toISOString(),
    } as Booking;
  }

  // Database mode
  if (input.comboId) {
    const combo = await prisma.combo.findUnique({
      where: { id: input.comboId },
      include: { items: true },
    });
    if (!combo) throw new Error("Combo nao encontrado.");

    let totalAmount = combo.totalPrice;
    if (extraHours > 0) {
      totalAmount += extraHours * 5000 * combo.items.length;
    }
    const depositAmount = Math.round(totalAmount * 0.3);

    return prisma.booking.create({
      data: {
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        clientPhone: input.clientPhone,
        eventDate: new Date(input.eventDate),
        eventTime: input.eventTime,
        durationHours: combo.durationHours,
        extraHours,
        comboId: combo.id,
        totalAmount,
        depositAmount,
        paymentPlan: "deposit",
        paymentMethod: "pix",
        status: "PENDING",
        eventType: input.eventType,
        eventAddress: input.eventAddress,
        eventCity: input.eventCity,
        eventNotes: input.eventNotes,
        hasTransportFee: true,
        items: {
          create: combo.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: 0,
            durationHours: item.durationHours ?? combo.durationHours,
          })),
        },
      },
      include: {
        combo: { select: { id: true, name: true } },
        items: { include: { product: true } },
      },
    });
  }

  // Individual items
  if (input.items && input.items.length > 0) {
    const totalAmount = input.items.reduce((sum, item) => sum + item.price, 0) +
      extraHours * 5000 * input.items.length;
    const durationHours = Math.max(...input.items.map((i) => i.durationHours));
    const depositAmount = Math.round(totalAmount * 0.3);

    return prisma.booking.create({
      data: {
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        clientPhone: input.clientPhone,
        eventDate: new Date(input.eventDate),
        eventTime: input.eventTime,
        durationHours,
        extraHours,
        totalAmount,
        depositAmount,
        paymentPlan: "deposit",
        paymentMethod: "pix",
        status: "PENDING",
        eventType: input.eventType,
        eventAddress: input.eventAddress,
        eventCity: input.eventCity,
        eventNotes: input.eventNotes,
        hasTransportFee: true,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            durationHours: item.durationHours,
          })),
        },
      },
      include: {
        combo: { select: { id: true, name: true } },
        items: { include: { product: true } },
      },
    });
  }

  throw new Error("Informe um combo ou ao menos um produto.");
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
      combo: { select: { id: true, name: true } },
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
