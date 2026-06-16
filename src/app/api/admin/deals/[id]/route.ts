import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { dealSchema } from "@/types";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const deal = await prisma.deal.findUnique({ where: { id: params.id } });

  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  return NextResponse.json(deal);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const validated = dealSchema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      { error: "Invalid deal data", details: validated.error.issues },
      { status: 400 }
    );
  }

  try {
    const deal = await prisma.deal.update({
      where: { id: params.id },
      data: validated.data,
    });

    revalidatePath("/admin/deals");
    return NextResponse.json(deal);
  } catch {
    return NextResponse.json(
      { error: "Failed to update deal" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.deal.delete({ where: { id: params.id } });
    revalidatePath("/admin/deals");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete deal" },
      { status: 500 }
    );
  }
}
