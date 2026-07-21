import { Banknote, CalendarDays, DollarSign, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { getDashboardSummary } from "@/server/services/dashboard";
import { getBookings } from "@/server/services/bookings";
import { bookingStatusLabels } from "@/lib/constants";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const bookings = await getBookings();

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-fl-gray-200 bg-white p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wider text-fl-blue">Dashboard</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-fl-blue-dark">Resumo financeiro</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Receita total"
          value={formatCurrency(summary.totalRevenue)}
          hint="Todas as reservas"
          icon={<Banknote className="h-5 w-5" />}
        />
        <MetricCard
          label="Faturamento no mês"
          value={formatCurrency(summary.monthlyRevenue)}
          hint="Mês atual"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          label="Ticket médio"
          value={formatCurrency(summary.avgTicket)}
          hint="Por reserva"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          label="Próximos eventos"
          value={String(summary.upcomingBookings)}
          hint="Reservas futuras"
          icon={<CalendarDays className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-fl-gray-200 bg-white p-4 text-center shadow-soft">
          <p className="text-3xl font-bold text-fl-blue-dark">{summary.confirmedCount}</p>
          <p className="text-sm text-fl-gray-500">Confirmados</p>
        </div>
        <div className="rounded-2xl border border-fl-gray-200 bg-white p-4 text-center shadow-soft">
          <p className="text-3xl font-bold text-green-700">{summary.completedCount}</p>
          <p className="text-sm text-fl-gray-500">Realizados</p>
        </div>
        <div className="rounded-2xl border border-fl-gray-200 bg-white p-4 text-center shadow-soft">
          <p className="text-3xl font-bold text-red-600">{summary.cancelledCount}</p>
          <p className="text-sm text-fl-gray-500">Cancelados</p>
        </div>
      </div>

      <div className="rounded-2xl border border-fl-gray-200 bg-white p-6 shadow-soft">
        <h2 className="font-display text-2xl font-bold text-fl-blue-dark">Reservas</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-fl-gray-200 text-fl-gray-500">
                <th className="py-3 pr-4 font-medium">Cliente</th>
                <th className="py-3 pr-4 font-medium">Data</th>
                <th className="py-3 pr-4 font-medium">Valor</th>
                <th className="py-3 pr-4 font-medium">Pagamento</th>
                <th className="py-3 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-fl-gray-400">
                    Nenhuma reserva encontrada.
                  </td>
                </tr>
              )}
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-fl-gray-100 text-fl-gray-700">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-fl-blue-dark">{booking.clientName}</p>
                    <p className="text-xs text-fl-gray-500">{booking.clientEmail}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <p>{formatDate(booking.eventDate)}</p>
                    <p className="text-xs text-fl-gray-500">{booking.eventTime}h · {booking.durationHours}h</p>
                  </td>
                  <td className="py-3 pr-4 font-medium text-fl-blue-dark">
                    {formatCurrency(booking.totalAmount)}
                  </td>
                  <td className="py-3 pr-4 text-xs">
                    <p className="capitalize">{booking.paymentMethod}</p>
                    <p className="text-fl-gray-500">
                      {booking.paymentPlan === "deposit" ? "30% entrada" : "À vista"}
                    </p>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        booking.status === "CONFIRMED"
                          ? "bg-blue-50 text-blue-700"
                          : booking.status === "COMPLETED"
                            ? "bg-green-50 text-green-700"
                            : booking.status === "CANCELLED"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {bookingStatusLabels[booking.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
