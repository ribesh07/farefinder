"use client";

import { useEffect, useState } from "react";
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
import { AdminFormSkeleton } from "@/components/admin/AdminSkeleton";
import { ImageUrlField } from "@/components/admin/ImageUrlField";
import { adminFetch } from "@/lib/admin-fetch";

export default function EditTestimonialForm({ id }: { id: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const watchedFeatured = watch("featured", false);
  const watchedImage = watch("image", "");

  useEffect(() => {
    async function load() {
      const result = await adminFetch(`/testimonials/${id}`);
      if (result.ok) {
        const data = result.data as Record<string, unknown>;
        reset({
          ...data,
          location: data.location || "",
          image: data.image || "",
        });
      } else {
        setError(result.error);
      }
      setIsFetching(false);
    }
    load();
  }, [id, reset]);

  async function onSubmit(data: Record<string, unknown>) {
    setIsLoading(true);
    setError(null);
    const result = await adminFetch(`/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...data,
        featured: data.featured || false,
        rating: Number(data.rating),
        image: data.image || undefined,
      }),
    });
    setIsLoading(false);
    if (result.ok) router.push("/admin/testimonials");
    else setError(result.error);
  }

  if (isFetching) return <AdminFormSkeleton />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Testimonial</h1>
      {error && <AdminAlert type="error" message={error} />}
      <Card>
        <CardHeader><CardTitle>Testimonial Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><Label>Name</Label><Input {...register("name", { required: true })} /></div>
              <div><Label>Location (optional)</Label><Input {...register("location")} /></div>
            </div>
            <ImageUrlField label="Image URL (optional)" name="image" register={register} value={watchedImage} required={false} />
            <div><Label>Rating</Label><Input type="number" min="1" max="5" {...register("rating", { required: true })} /></div>
            <div><Label>Review</Label><Textarea {...register("review", { required: true })} rows={4} /></div>
            <div className="flex items-center gap-2">
              <Checkbox id="featured" checked={watchedFeatured} onCheckedChange={(c) => setValue("featured", !!c)} />
              <Label htmlFor="featured">Featured</Label>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Testimonial"}</Button>
              <Button type="button" variant="ghost" onClick={() => router.push("/admin/testimonials")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
