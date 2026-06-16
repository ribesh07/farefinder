"use client";

import { useState } from "react";
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

export default function NewDealPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch } = useForm<DealFormData>();

  const watchedActive = watch("active", true);
  const watchedImage = watch("image", "");

  async function onSubmit(data: DealFormData) {
    setIsLoading(true);
    setError(null);

    const result = await adminFetch("/deals", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        active: data.active !== undefined ? data.active : true,
        newPrice: Number(data.newPrice),
        oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
      }),
    });

    setIsLoading(false);

    if (result.ok) {
      router.push("/admin/deals");
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Deal</h1>

      {error && <AdminAlert type="error" message={error} />}

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
              <Select onValueChange={(value) => setValue("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select deal type" />
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
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
