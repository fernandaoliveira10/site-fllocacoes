import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getComboById, updateCombo, deleteCombo } from "@/server/services/combos";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const combo = await getComboById(id);
  if (!combo) {
    return NextResponse.json({ error: "Combo nao encontrado." }, { status: 404 });
  }
  return NextResponse.json(combo);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  try {
    const combo = await updateCombo(id, body);
    return NextResponse.json(combo);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar combo." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteCombo(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao desativar combo." }, { status: 500 });
  }
}
