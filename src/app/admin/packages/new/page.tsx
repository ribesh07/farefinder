"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createHolidayPackage } from "@/actions"

export default function NewPackagePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue, watch } = useForm()

  const watchedFeatured = watch("featured", false)
  const watchedActive = watch("active", true)

  async function onSubmit(data: any) {
    setIsLoading(true)
    const result = await createHolidayPackage({
      ...data,
      featured: data.featured || false,
      active: data.active !== undefined ? data.active : true,
      hotelRating: Number(data.hotelRating),
      startingPrice: Number(data.startingPrice),
    })
    if (result.success) {
      router.push("/admin/packages")
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Package</h1>
      <Card>
        <CardHeader>
          <CardTitle>Package Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input {...register("title", { required: true })} />
              </div>
              <div>
                <Label>Destination</Label>
                <Input {...register("destination", { required: true })} />
              </div>
            </div>

            <div>
              <Label>Image URL</Label>
              <Input {...register("image", { required: true })} />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea {...register("description", { required: true })} rows={4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Duration</Label>
                <Input {...register("duration", { required: true })} placeholder="e.g. 7 Nights" />
              </div>
              <div>
                <Label>Hotel Rating</Label>
                <Input type="number" min="1" max="5" {...register("hotelRating", { required: true })} />
              </div>
              <div>
                <Label>Starting Price</Label>
                <Input type="number" step="0.01" {...register("startingPrice", { required: true })} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="featured"
                  checked={watchedFeatured}
                  onCheckedChange={(checked) => setValue("featured", checked)}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="active"
                  checked={watchedActive}
                  onCheckedChange={(checked) => setValue("active", checked)}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Package"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
