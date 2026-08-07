import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBookings } from "@/server/services/bookings";
import { sendLeadRequestEmail } from "@/server/services/leads";
import { bookingSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 403 });
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
    await sendLeadRequestEmail(parsed.data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao enviar orçamento.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
