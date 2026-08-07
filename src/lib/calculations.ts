import type { DashboardSummary } from "@/lib/types";

export function computeDashboardSummary(
  bookings: { totalAmount: number; status: string; eventDate: string }[],
): DashboardSummary {
  const now = new Date();

  const realizedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const pendingBookings = bookings.filter((b) => b.status === "PENDING" || b.status === "CONFIRMED");
  const activeBookings = bookings.filter((b) => b.status !== "CANCELLED");

  const realizedRevenue = realizedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingRevenue = pendingBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const thisMonthRealized = realizedBookings.filter((b) => {
    const date = new Date(b.eventDate);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const monthlyRevenue = thisMonthRealized.reduce((sum, b) => sum + b.totalAmount, 0);
  const upcomingBookings = activeBookings.filter((b) => {
    const date = new Date(b.eventDate);
    return date >= now && (b.status === "PENDING" || b.status === "CONFIRMED");
  }).length;

  const avgTicket = realizedBookings.length > 0
    ? Math.round(realizedRevenue / realizedBookings.length)
    : 0;

  return {
    realizedRevenue,
    pendingRevenue,
    monthlyRevenue,
    totalBookings: bookings.length,
    upcomingBookings,
    avgTicket,
    confirmedCount: bookings.filter((b) => b.status === "CONFIRMED").length,
    completedCount: realizedBookings.length,
    cancelledCount: bookings.filter((b) => b.status === "CANCELLED").length,
  };
}
