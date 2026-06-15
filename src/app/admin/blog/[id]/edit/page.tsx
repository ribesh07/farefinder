import { prisma } from "@/lib/prisma"
import EditBlogForm from "./EditBlogForm"

interface EditBlogPageProps {
  params: { id: string }
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  })

  if (!post) {
    return <div>Post not found</div>
  }

  return <EditBlogForm post={post} />
}
