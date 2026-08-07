import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBookingById, updateBookingStatus, updateBookingNotes } from "@/server/services/bookings";
import { bookingStatusSchema, bookingNotesSchema } from "@/lib/validations";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 403 });
  }

  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) {
    return NextResponse.json({ error: "Reserva nao encontrada." }, { status: 404 });
  }
  return NextResponse.json(booking);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const statusParsed = bookingStatusSchema.safeParse(body);
  if (statusParsed.success) {
    try {
      const booking = await updateBookingStatus(id, statusParsed.data.status, statusParsed.data.notes);
      return NextResponse.json(booking);
    } catch {
      return NextResponse.json({ error: "Erro ao atualizar reserva." }, { status: 500 });
    }
  }

  const notesParsed = bookingNotesSchema.safeParse(body);
  if (notesParsed.success) {
    try {
      const booking = await updateBookingNotes(id, notesParsed.data.notes ?? null);
      return NextResponse.json(booking);
    } catch {
      return NextResponse.json({ error: "Erro ao atualizar notas." }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Dados invalidos." }, { status: 400 });
}
