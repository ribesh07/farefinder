import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { holidayPackageSchema } from "@/types";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const packages = await prisma.holidayPackage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(packages);
}

export async function POST(request: Request) {
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
    const pkg = await prisma.holidayPackage.create({ data: validated.data });
    revalidatePath("/admin/packages");
    return NextResponse.json(pkg, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}
