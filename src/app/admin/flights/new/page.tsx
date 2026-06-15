"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createFlight } from "@/actions"

export default function NewFlightPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, setValue, watch } = useForm()

  const watchedFeatured = watch("featured", false)
  const watchedActive = watch("active", true)

  async function onSubmit(data: any) {
    setIsLoading(true)
    setError(null)
    console.log("Submitting flight data:", data)
    try {
      const result = await createFlight({
        ...data,
        featured: data.featured || false,
        active: data.active !== undefined ? data.active : true,
        stops: Number(data.stops),
        farePrice: Number(data.farePrice),
        oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
      })
      console.log("Create flight result:", result)
      if (result.success) {
        router.push("/admin/flights")
      } else {
        setError(result.error || "Something went wrong")
      }
    } catch (err) {
      console.error("Error creating flight:", err)
      setError("An unexpected error occurred")
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Flight</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Flight Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Airline</Label>
                <Input {...register("airline", { required: true })} />
              </div>
              <div>
                <Label>Flight Number</Label>
                <Input {...register("flightNumber", { required: true })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>From Airport</Label>
                <Input {...register("fromAirport", { required: true })} placeholder="e.g. LHR" />
              </div>
              <div>
                <Label>To Airport</Label>
                <Input {...register("toAirport", { required: true })} placeholder="e.g. DXB" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Departure Time</Label>
                <Input type="datetime-local" {...register("departureTime", { required: true })} />
              </div>
              <div>
                <Label>Arrival Time</Label>
                <Input type="datetime-local" {...register("arrivalTime", { required: true })} />
              </div>
              <div>
                <Label>Duration</Label>
                <Input {...register("duration", { required: true })} placeholder="e.g. 8h 30m" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Stops</Label>
                <Input type="number" {...register("stops", { required: true })} defaultValue="0" />
              </div>
              <div>
                <Label>Cabin Class</Label>
                <Select onValueChange={(value) => setValue("cabinClass", value)} defaultValue="Economy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="First Class">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Baggage Info</Label>
                <Input {...register("baggageInfo")} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Fare Price</Label>
                <Input type="number" step="0.01" {...register("farePrice", { required: true })} />
              </div>
              <div>
                <Label>Old Price (optional)</Label>
                <Input type="number" step="0.01" {...register("oldPrice")} />
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
                {isLoading ? "Saving..." : "Save Flight"}
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
