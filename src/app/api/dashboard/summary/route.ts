import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDashboardSummary } from "@/server/services/dashboard";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const summary = await getDashboardSummary();
  return NextResponse.json(summary);
}
