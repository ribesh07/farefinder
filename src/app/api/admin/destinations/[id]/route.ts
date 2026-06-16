import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { destinationSchema } from "@/types";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const destination = await prisma.destination.findUnique({
    where: { id: params.id },
  });

  if (!destination) {
    return NextResponse.json(
      { error: "Destination not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(destination);
}

export async function PUT(request: Request, { params }: RouteContext) {
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
    const destination = await prisma.destination.update({
      where: { id: params.id },
      data: validated.data,
    });

    revalidatePath("/admin/destinations");
    return NextResponse.json(destination);
  } catch {
    return NextResponse.json(
      { error: "Failed to update destination" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.destination.delete({ where: { id: params.id } });
    revalidatePath("/admin/destinations");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete destination" },
      { status: 500 }
    );
  }
}
