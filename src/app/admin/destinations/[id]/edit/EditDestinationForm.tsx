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

export default function EditDestinationForm({ id }: { id: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch, reset } = useForm();

  const watchedFeatured = watch("featured", false);
  const watchedActive = watch("active", true);
  const watchedImage = watch("image", "");

  useEffect(() => {
    async function load() {
      const result = await adminFetch(`/destinations/${id}`);
      if (result.ok) reset(result.data as Record<string, unknown>);
      else setError(result.error);
      setIsFetching(false);
    }
    load();
  }, [id, reset]);

  async function onSubmit(data: Record<string, unknown>) {
    setIsLoading(true);
    setError(null);
    const result = await adminFetch(`/destinations/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...data,
        featured: data.featured || false,
        active: data.active !== undefined ? data.active : true,
        startingFare: Number(data.startingFare),
      }),
    });
    setIsLoading(false);
    if (result.ok) router.push("/admin/destinations");
    else setError(result.error);
  }

  if (isFetching) return <AdminFormSkeleton />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Destination</h1>
      {error && <AdminAlert type="error" message={error} />}
      <Card>
        <CardHeader><CardTitle>Destination Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div><Label>Name</Label><Input {...register("name", { required: true })} /></div>
              <div><Label>Country</Label><Input {...register("country", { required: true })} /></div>
              <div><Label>Slug</Label><Input {...register("slug", { required: true })} /></div>
            </div>
            <ImageUrlField label="Image URL" name="image" register={register} value={watchedImage} />
            <div><Label>Description</Label><Textarea {...register("description", { required: true })} rows={4} /></div>
            <div><Label>Starting Fare</Label><Input type="number" step="0.01" {...register("startingFare", { required: true })} /></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><Checkbox id="featured" checked={watchedFeatured} onCheckedChange={(c) => setValue("featured", !!c)} /><Label htmlFor="featured">Featured</Label></div>
              <div className="flex items-center gap-2"><Checkbox id="active" checked={watchedActive} onCheckedChange={(c) => setValue("active", !!c)} /><Label htmlFor="active">Active</Label></div>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Destination"}</Button>
              <Button type="button" variant="ghost" onClick={() => router.push("/admin/destinations")}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
