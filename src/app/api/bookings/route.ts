import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBookings, createBooking } from "@/server/services/bookings";
import { bookingSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const bookings = await getBookings();
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const booking = await createBooking(parsed.data);
    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar reserva." }, { status: 500 });
  }
}
