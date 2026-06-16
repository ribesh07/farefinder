import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { dealSchema } from "@/types";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(deals);
}

export async function POST(request: Request) {
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
    const deal = await prisma.deal.create({ data: validated.data });
    revalidatePath("/admin/deals");
    return NextResponse.json(deal, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create deal" },
      { status: 500 }
    );
  }
}
