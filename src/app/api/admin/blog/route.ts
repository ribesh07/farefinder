import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { blogPostSchema } from "@/types";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
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
    const post = await prisma.blogPost.create({ data: validated.data });
    revalidatePath("/admin/blog");
    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
