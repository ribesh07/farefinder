import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { flightSchema } from "@/types";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const flights = await prisma.flight.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(flights);
}

export async function POST(request: Request) {
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
    const flight = await prisma.flight.create({
      data: {
        ...rest,
        departureTime: departureTime ? new Date(departureTime) : null,
        arrivalTime: arrivalTime ? new Date(arrivalTime) : null,
      },
    });

    revalidatePath("/admin/flights");
    return NextResponse.json(flight, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create flight" },
      { status: 500 }
    );
  }
}
