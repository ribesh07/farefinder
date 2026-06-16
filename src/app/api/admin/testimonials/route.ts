import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { testimonialSchema } from "@/types";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
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
    const testimonial = await prisma.testimonial.create({
      data: validated.data,
    });
    revalidatePath("/admin/testimonials");
    return NextResponse.json(testimonial, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
