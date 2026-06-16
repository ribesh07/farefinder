import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

type RouteContext = { params: { id: string } };

export async function PATCH(request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { status } = body;

  if (!status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  try {
    const inquiry = await prisma.contactInquiry.update({
      where: { id: params.id },
      data: { status },
    });

    revalidatePath("/admin/inquiries");
    return NextResponse.json(inquiry);
  } catch {
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.contactInquiry.delete({ where: { id: params.id } });
    revalidatePath("/admin/inquiries");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
