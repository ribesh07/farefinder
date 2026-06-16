import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { flightSchema } from "@/types";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const flight = await prisma.flight.findUnique({ where: { id: params.id } });

  if (!flight) {
    return NextResponse.json({ error: "Flight not found" }, { status: 404 });
  }

  return NextResponse.json(flight);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const validated = flightSchema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      { error: "Invalid flight data", details: validated.error.issues },
      { status: 400 }
    );
  }

  const { departureTime, arrivalTime, ...rest } = validated.data;

  try {
    const flight = await prisma.flight.update({
      where: { id: params.id },
      data: {
        ...rest,
        departureTime: departureTime ? new Date(departureTime) : null,
        arrivalTime: arrivalTime ? new Date(arrivalTime) : null,
      },
    });

    revalidatePath("/admin/flights");
    return NextResponse.json(flight);
  } catch {
    return NextResponse.json(
      { error: "Failed to update flight" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.flight.delete({ where: { id: params.id } });
    revalidatePath("/admin/flights");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete flight" },
      { status: 500 }
    );
  }
}
