import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { destinationSchema } from "@/types";

export const dynamic = "force-dynamic";
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(destinations);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const validated = destinationSchema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      { error: "Invalid destination data", details: validated.error.issues },
      { status: 400 }
    );
  }

  try {
    const destination = await prisma.destination.create({
      data: validated.data,
    });
    revalidatePath("/admin/destinations");
    return NextResponse.json(destination, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 }
    );
  }
}
