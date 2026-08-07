import { mockBookings, mockProducts } from "@/mocks/data";
import { calculateBookingPricing, getTransportFeeForCity } from "@/lib/booking-pricing";
import { getProductById } from "@/server/services/products";
import type { Booking, Product } from "@/lib/types";

const bookingState = mockBookings;

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

function normalizeBooking(booking: Booking) {
  return booking;
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
      throw new Error(`Prazo indisponivel para ${product.name}.`);
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

function findBookingIndex(id: string) {
  return bookingState.findIndex((booking) => booking.id === id);
}

export async function getBookings() {
  return bookingState
    .slice()
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .map(normalizeBooking);
}

export async function getBookingById(id: string) {
  const bookings = await getBookings();
  return bookings.find((booking) => booking.id === id) ?? null;
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
  const now = new Date().toISOString();

  const booking: Booking = {
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
    items: resolvedItems.map((item, index) => ({
      id: `bi-mock-${Date.now()}-${index}`,
      productId: item.productId,
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      durationHours: item.durationHours,
    })),
    createdAt: now,
  };

  bookingState.unshift(booking);
  return booking;
}

export async function updateBookingStatus(id: string, status: string, notes?: string | null) {
  const bookingIndex = findBookingIndex(id);
  if (bookingIndex === -1) {
    throw new Error("Reserva nao encontrada.");
  }

  bookingState[bookingIndex].status = status as Booking["status"];
  if (notes !== undefined) {
    bookingState[bookingIndex].notes = notes;
  }

  return bookingState[bookingIndex];
}

export async function updateBookingNotes(id: string, notes: string | null) {
  const bookingIndex = findBookingIndex(id);
  if (bookingIndex === -1) {
    throw new Error("Reserva nao encontrada.");
  }

  bookingState[bookingIndex].notes = notes;
  return bookingState[bookingIndex];
}
