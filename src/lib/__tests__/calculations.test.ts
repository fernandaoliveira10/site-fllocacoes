import { describe, it, expect } from "vitest";

import { computeDashboardSummary } from "@/lib/calculations";

describe("computeDashboardSummary", () => {
  const baseBooking = {
    id: "1",
    clientName: "Test",
    clientEmail: "test@test.com",
    clientPhone: "11999999999",
    eventDate: new Date().toISOString(),
    eventTime: "14:00",
    durationHours: 4,
    totalAmount: 100000,
    depositAmount: 40000,
    paymentPlan: "deposit",
    paymentMethod: "pix",
    status: "CONFIRMED" as const,
    notes: null,
    items: [],
    createdAt: new Date().toISOString(),
    eventType: null,
    eventAddress: null,
    eventCity: null,
    eventNotes: null,
    transportFee: null,
    hasTransportFee: false,
    extraHours: 0,
  };

  it("separates realized and pending revenue", () => {
    const bookings = [
      { ...baseBooking, id: "1", totalAmount: 100000, status: "COMPLETED" as const },
      { ...baseBooking, id: "2", totalAmount: 200000, status: "CONFIRMED" as const },
      { ...baseBooking, id: "3", totalAmount: 50000, status: "PENDING" as const },
      { ...baseBooking, id: "4", totalAmount: 75000, status: "CANCELLED" as const },
    ];

    const summary = computeDashboardSummary(bookings);
    expect(summary.realizedRevenue).toBe(100000);
    expect(summary.pendingRevenue).toBe(300000);
    expect(summary.totalBookings).toBe(4);
    expect(summary.cancelledCount).toBe(1);
    expect(summary.confirmedCount).toBe(1);
    expect(summary.completedCount).toBe(1);
    expect(summary.avgTicket).toBe(100000);
  });

  it("handles empty bookings", () => {
    const summary = computeDashboardSummary([]);
    expect(summary.realizedRevenue).toBe(0);
    expect(summary.pendingRevenue).toBe(0);
    expect(summary.totalBookings).toBe(0);
    expect(summary.avgTicket).toBe(0);
  });
});
