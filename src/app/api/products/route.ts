import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getActiveProducts, getAllProducts, createProduct } from "@/server/services/products";
import { productSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  if (isAdmin) {
    const products = await getAllProducts();
    return NextResponse.json(products);
  }

  const products = await getActiveProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const product = await createProduct(parsed.data);
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar produto." }, { status: 500 });
  }
}
