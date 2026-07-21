import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProductById, updateProduct } from "@/server/services/products";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Produto nao encontrado." }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  try {
    const product = await updateProduct(id, body);
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar produto." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  const { id } = await params;

  try {
    await updateProduct(id, { isActive: false });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao desativar produto." }, { status: 500 });
  }
}
