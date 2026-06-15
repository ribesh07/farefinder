"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateFlight } from "@/actions"

export default function EditFlightForm({ flight }: { flight: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue, watch, reset } = useForm()

  useEffect(() => {
    reset({
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      fromAirport: flight.fromAirport,
      toAirport: flight.toAirport,
      departureTime: flight.departureTime.toISOString().slice(0, 16),
      arrivalTime: flight.arrivalTime.toISOString().slice(0, 16),
      duration: flight.duration,
      stops: flight.stops,
      cabinClass: flight.cabinClass,
      baggageInfo: flight.baggageInfo || "",
      farePrice: flight.farePrice,
      oldPrice: flight.oldPrice || "",
      featured: flight.featured,
      active: flight.active,
    })
  }, [flight, reset])

  const watchedFeatured = watch("featured", false)
  const watchedActive = watch("active", true)

  async function onSubmit(data: any) {
    setIsLoading(true)
    const result = await updateFlight(flight.id, {
      ...data,
      featured: data.featured || false,
      active: data.active !== undefined ? data.active : true,
      stops: Number(data.stops),
      farePrice: Number(data.farePrice),
      oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
    })
    if (result.success) {
      router.push("/admin/flights")
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Flight</h1>
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
                <Input {...register("fromAirport", { required: true })} />
              </div>
              <div>
                <Label>To Airport</Label>
                <Input {...register("toAirport", { required: true })} />
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
                <Input {...register("duration", { required: true })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Stops</Label>
                <Input type="number" {...register("stops", { required: true })} />
              </div>
              <div>
                <Label>Cabin Class</Label>
                <Select defaultValue={flight.cabinClass} onValueChange={(value) => setValue("cabinClass", value)}>
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
              <Button type="button" variant="ghost" onClick={() => router.push("/admin/flights")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
