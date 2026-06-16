import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { blogPostSchema } from "@/types";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });

  if (!post) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const validated = blogPostSchema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      { error: "Invalid blog post data", details: validated.error.issues },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: validated.data,
    });

    revalidatePath("/admin/blog");
    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await prisma.blogPost.delete({ where: { id: params.id } });
    revalidatePath("/admin/blog");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
