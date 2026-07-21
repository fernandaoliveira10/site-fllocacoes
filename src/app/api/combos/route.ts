import { NextResponse } from "next/server";
import { getActiveCombos } from "@/server/services/combos";

export async function GET() {
  const combos = await getActiveCombos();
  return NextResponse.json(combos);
}
