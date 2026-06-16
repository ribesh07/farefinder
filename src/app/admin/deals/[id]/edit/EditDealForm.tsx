"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminFormSkeleton } from "@/components/admin/AdminSkeleton";
import { ImageUrlField } from "@/components/admin/ImageUrlField";
import { adminFetch } from "@/lib/admin-fetch";

type DealFormData = {
  title: string;
  type: string;
  description: string;
  image: string;
  newPrice: number;
  oldPrice: string | number;
  active: boolean;
};

export default function EditDealForm({ id }: { id: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<DealFormData>();

  const watchedActive = watch("active", true);
  const watchedImage = watch("image", "");

  useEffect(() => {
    async function loadDeal() {
      const result = await adminFetch<DealFormData & { id: string }>(
        `/deals/${id}`
      );
      if (result.ok) {
        const deal = result.data;
        reset({
          title: deal.title,
          type: deal.type,
          description: deal.description || "",
          image: deal.image,
          newPrice: deal.newPrice,
          oldPrice: deal.oldPrice || "",
          active: deal.active,
        });
      } else {
        setError(result.error);
      }
      setIsFetching(false);
    }

    loadDeal();
  }, [id, reset]);

  async function onSubmit(data: DealFormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const result = await adminFetch(`/deals/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...data,
        active: data.active !== undefined ? data.active : true,
        newPrice: Number(data.newPrice),
        oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
      }),
    });

    setIsLoading(false);

    if (result.ok) {
      setSuccess("Deal updated successfully.");
      router.push("/admin/deals");
    } else {
      setError(result.error);
    }
  }

  if (isFetching) {
    return <AdminFormSkeleton />;
  }

  if (error && !watch("title")) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Edit Deal</h1>
        <AdminAlert type="error" message={error} />
        <Button variant="ghost" onClick={() => router.push("/admin/deals")}>
          Back to Deals
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Deal</h1>

      {error && <AdminAlert type="error" message={error} />}
      {success && <AdminAlert type="success" message={success} />}

      <Card>
        <CardHeader>
          <CardTitle>Deal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input {...register("title", { required: true })} />
            </div>

            <div>
              <Label>Type</Label>
              <Select
                value={watch("type")}
                onValueChange={(value) => setValue("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LAST_MINUTE">Last Minute</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="FAMILY">Family</SelectItem>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description (optional)</Label>
              <Textarea {...register("description")} rows={3} />
            </div>

            <ImageUrlField
              label="Image URL"
              name="image"
              register={register}
              value={watchedImage}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>New Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("newPrice", { required: true })}
                />
              </div>
              <div>
                <Label>Old Price (optional)</Label>
                <Input type="number" step="0.01" {...register("oldPrice")} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="active"
                checked={watchedActive}
                onCheckedChange={(checked) => setValue("active", !!checked)}
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Deal"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/admin/deals")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
