import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

type RouteContext = { params: { id: string } };

export async function PATCH(request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { status, internalNotes } = body;

  if (!status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  try {
    const lead = await prisma.packageLead.update({
      where: { id: params.id },
      data: { status, internalNotes },
    });

    revalidatePath("/admin/leads");
    return NextResponse.json(lead);
  } catch {
    return NextResponse.json(
      { error: "Failed to update package lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.packageLead.delete({ where: { id: params.id } });
    revalidatePath("/admin/leads");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete package lead" },
      { status: 500 }
    );
  }
}
