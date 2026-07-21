import type { DashboardSummary } from "@/lib/types";

export function computeDashboardSummary(bookings: { totalAmount: number; status: string; eventDate: string }[]): DashboardSummary {
  const now = new Date();

  const totalRevenue = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const thisMonth = bookings.filter((b) => {
    const d = new Date(b.eventDate);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && b.status !== "CANCELLED";
  });
  const monthlyRevenue = thisMonth.reduce((sum, b) => sum + b.totalAmount, 0);

  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING");
  const upcomingBookings = confirmedBookings.filter((b) => new Date(b.eventDate) >= now).length;

  const completedBookings = bookings.filter((b) => b.status === "COMPLETED" || b.status === "CONFIRMED");
  const avgTicket = completedBookings.length > 0
    ? Math.round(totalRevenue / completedBookings.length)
    : 0;

  return {
    totalRevenue,
    monthlyRevenue,
    totalBookings: bookings.length,
    upcomingBookings,
    avgTicket,
    confirmedCount: bookings.filter((b) => b.status === "CONFIRMED").length,
    completedCount: bookings.filter((b) => b.status === "COMPLETED").length,
    cancelledCount: bookings.filter((b) => b.status === "CANCELLED").length,
  };
}
