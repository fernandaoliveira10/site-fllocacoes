import { bookingDepositRate, bookingDiscountRate } from "@/lib/constants";

export interface BookingPricingItem {
  productId: string;
  price: number;
  quantity: number;
  extraPricePerHour?: number | null;
}

export interface BookingPricingInput {
  items: BookingPricingItem[];
  extraHours?: number;
}

export interface BookingPricingResult {
  subtotalAmount: number;
  discountAmount: number;
  extraTotal: number;
  totalAmount: number;
  depositAmount: number;
  extraHours: number;
  itemCount: number;
}

export function calculateBookingPricing({
  items,
  extraHours = 0,
}: BookingPricingInput): BookingPricingResult {
  const normalizedItems = items.filter((item) => Number.isFinite(item.price) && item.quantity > 0);
  const normalizedExtraHours = Math.max(0, extraHours);
  const subtotalAmount = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = normalizedItems.length;
  const discountAmount = itemCount >= 2 ? Math.round(subtotalAmount * bookingDiscountRate) : 0;
  const eligibleExtraBase = normalizedItems.reduce(
    (sum, item) => sum + Math.max(0, item.extraPricePerHour ?? 0) * item.quantity,
    0,
  );
  const extraTotal = eligibleExtraBase > 0 ? normalizedExtraHours * eligibleExtraBase : 0;
  const totalAmount = subtotalAmount - discountAmount + extraTotal;

  return {
    subtotalAmount,
    discountAmount,
    extraTotal,
    totalAmount,
    depositAmount: Math.round(totalAmount * bookingDepositRate),
    extraHours: normalizedExtraHours,
    itemCount,
  };
}
