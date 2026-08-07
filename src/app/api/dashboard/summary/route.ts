import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDashboardSummary } from "@/server/services/dashboard";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 403 });
  }

  const summary = await getDashboardSummary();
  return NextResponse.json(summary);
}
