"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { ImageUrlField } from "@/components/admin/ImageUrlField";
import { adminFetch } from "@/lib/admin-fetch";

export default function NewBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch } = useForm();
  const watchedPublished = watch("published", false);
  const watchedImage = watch("featuredImage", "");

  async function onSubmit(data: Record<string, unknown>) {
    setIsLoading(true);
    setError(null);
    const result = await adminFetch("/blog", {
      method: "POST",
      body: JSON.stringify({ ...data, published: data.published || false }),
    });
    setIsLoading(false);
    if (result.ok) router.push("/admin/blog");
    else setError(result.error);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Blog Post</h1>
      {error && <AdminAlert type="error" message={error} />}
      <Card>
        <CardHeader><CardTitle>Post Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><Label>Title</Label><Input {...register("title", { required: true })} /></div>
            <div><Label>Slug</Label><Input {...register("slug", { required: true })} /></div>
            <div><Label>Excerpt</Label><Textarea {...register("excerpt", { required: true })} rows={2} /></div>
            <div><Label>Content</Label><Textarea {...register("content", { required: true })} rows={8} /></div>
            <ImageUrlField label="Featured Image URL" name="featuredImage" register={register} value={watchedImage} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><Label>Category</Label><Input {...register("category", { required: true })} /></div>
              <div><Label>Author</Label><Input {...register("author", { required: true })} /></div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><Label>SEO Title (optional)</Label><Input {...register("seoTitle")} /></div>
              <div><Label>SEO Description (optional)</Label><Input {...register("seoDescription")} /></div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="published" checked={watchedPublished} onCheckedChange={(c) => setValue("published", !!c)} />
              <Label htmlFor="published">Published</Label>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Post"}</Button>
              <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
