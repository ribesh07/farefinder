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
import { updateTestimonial } from "@/actions"

export default function EditTestimonialForm({ testimonial }: { testimonial: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue, watch, reset } = useForm()

  useEffect(() => {
    reset({
      name: testimonial.name,
      location: testimonial.location || "",
      image: testimonial.image || "",
      rating: testimonial.rating,
      review: testimonial.review,
      featured: testimonial.featured,
    })
  }, [testimonial, reset])

  const watchedFeatured = watch("featured", false)

  async function onSubmit(data: any) {
    setIsLoading(true)
    const result = await updateTestimonial(testimonial.id, {
      ...data,
      featured: data.featured || false,
      rating: Number(data.rating),
    })
    if (result.success) {
      router.push("/admin/testimonials")
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Testimonial</h1>
      <Card>
        <CardHeader>
          <CardTitle>Testimonial Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input {...register("name", { required: true })} />
              </div>
              <div>
                <Label>Location (optional)</Label>
                <Input {...register("location")} />
              </div>
            </div>

            <div>
              <Label>Image URL (optional)</Label>
              <Input {...register("image")} />
            </div>

            <div>
              <Label>Rating</Label>
              <Input type="number" min="1" max="5" {...register("rating", { required: true })} />
            </div>

            <div>
              <Label>Review</Label>
              <Textarea {...register("review", { required: true })} rows={4} />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="featured"
                checked={watchedFeatured}
                onCheckedChange={(checked) => setValue("featured", checked)}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Testimonial"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => router.push("/admin/testimonials")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
