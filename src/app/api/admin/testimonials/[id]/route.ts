import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { testimonialSchema } from "@/types";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const testimonial = await prisma.testimonial.findUnique({
    where: { id: params.id },
  });

  if (!testimonial) {
    return NextResponse.json(
      { error: "Testimonial not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(testimonial);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const validated = testimonialSchema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      { error: "Invalid testimonial data", details: validated.error.issues },
      { status: 400 }
    );
  }

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: validated.data,
    });

    revalidatePath("/admin/testimonials");
    return NextResponse.json(testimonial);
  } catch {
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.testimonial.delete({ where: { id: params.id } });
    revalidatePath("/admin/testimonials");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
