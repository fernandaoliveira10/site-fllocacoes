import { getBookings } from "@/server/services/bookings";
import { computeDashboardSummary } from "@/lib/calculations";
import type { DashboardSummary } from "@/lib/types";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const bookings = await getBookings();
  return computeDashboardSummary(bookings);
}
