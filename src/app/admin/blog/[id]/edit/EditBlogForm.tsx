"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateBlogPost } from "@/actions"

export default function EditBlogForm({ post }: { post: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue, watch, reset } = useForm()

  useEffect(() => {
    reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      category: post.category,
      author: post.author,
      published: post.published,
      seoTitle: post.seoTitle || "",
      seoDescription: post.seoDescription || "",
    })
  }, [post, reset])

  const watchedPublished = watch("published", false)

  async function onSubmit(data: any) {
    setIsLoading(true)
    const result = await updateBlogPost(post.id, {
      ...data,
      published: data.published || false,
    })
    if (result.success) {
      router.push("/admin/blog")
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Blog Post</h1>
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input {...register("title", { required: true })} />
            </div>

            <div>
              <Label>Slug</Label>
              <Input {...register("slug", { required: true })} />
            </div>

            <div>
              <Label>Excerpt</Label>
              <Textarea {...register("excerpt", { required: true })} rows={2} />
            </div>

            <div>
              <Label>Content</Label>
              <Textarea {...register("content", { required: true })} rows={8} />
            </div>

            <div>
              <Label>Featured Image URL</Label>
              <Input {...register("featuredImage", { required: true })} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Input {...register("category", { required: true })} />
              </div>
              <div>
                <Label>Author</Label>
                <Input {...register("author", { required: true })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>SEO Title (optional)</Label>
                <Input {...register("seoTitle")} />
              </div>
              <div>
                <Label>SEO Description (optional)</Label>
                <Input {...register("seoDescription")} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="published"
                checked={watchedPublished}
                onCheckedChange={(checked) => setValue("published", checked)}
              />
              <Label htmlFor="published">Published</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Post"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => router.push("/admin/blog")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
