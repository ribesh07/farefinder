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
import { updateDestination } from "@/actions"

export default function EditDestinationForm({ dest }: { dest: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue, watch, reset } = useForm()

  useEffect(() => {
    reset({
      name: dest.name,
      country: dest.country,
      slug: dest.slug,
      image: dest.image,
      description: dest.description,
      startingFare: dest.startingFare,
      featured: dest.featured,
      active: dest.active,
    })
  }, [dest, reset])

  const watchedFeatured = watch("featured", false)
  const watchedActive = watch("active", true)

  async function onSubmit(data: any) {
    setIsLoading(true)
    const result = await updateDestination(dest.id, {
      ...data,
      featured: data.featured || false,
      active: data.active !== undefined ? data.active : true,
      startingFare: Number(data.startingFare),
    })
    if (result.success) {
      router.push("/admin/destinations")
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Destination</h1>
      <Card>
        <CardHeader>
          <CardTitle>Destination Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Name</Label>
                <Input {...register("name", { required: true })} />
              </div>
              <div>
                <Label>Country</Label>
                <Input {...register("country", { required: true })} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input {...register("slug", { required: true })} />
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

            <div>
              <Label>Starting Fare</Label>
              <Input type="number" step="0.01" {...register("startingFare", { required: true })} />
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
                {isLoading ? "Saving..." : "Save Destination"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => router.push("/admin/destinations")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
