import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { holidayPackageSchema } from "@/types";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const pkg = await prisma.holidayPackage.findUnique({
    where: { id: params.id },
  });

  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  return NextResponse.json(pkg);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const validated = holidayPackageSchema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      { error: "Invalid package data", details: validated.error.issues },
      { status: 400 }
    );
  }

  try {
    const pkg = await prisma.holidayPackage.update({
      where: { id: params.id },
      data: validated.data,
    });

    revalidatePath("/admin/packages");
    return NextResponse.json(pkg);
  } catch {
    return NextResponse.json(
      { error: "Failed to update package" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.holidayPackage.delete({ where: { id: params.id } });
    revalidatePath("/admin/packages");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}
