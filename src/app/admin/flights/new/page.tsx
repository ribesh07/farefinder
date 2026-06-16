"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function NewFlightPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch } = useForm();
  const watchedFeatured = watch("featured", false);
  const watchedActive = watch("active", true);
  const watchedLogo = watch("logo", "");

  async function onSubmit(data: Record<string, unknown>) {
    setIsLoading(true);
    setError(null);
    const result = await adminFetch("/flights", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        featured: data.featured || false,
        active: data.active !== undefined ? data.active : true,
        stops: Number(data.stops),
        farePrice: Number(data.farePrice),
        oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
        departureTime: null,
        arrivalTime: null,
      }),
    });
    setIsLoading(false);
    if (result.ok) router.push("/admin/flights");
    else setError(result.error);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Flight</h1>
      {error && <AdminAlert type="error" message={error} />}
      <Card>
        <CardHeader><CardTitle>Flight Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><Label>Airline</Label><Input {...register("airline", { required: true })} /></div>
              <div><Label>Flight Number</Label><Input {...register("flightNumber", { required: true })} /></div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><Label>From Airport</Label><Input {...register("fromAirport", { required: true })} placeholder="e.g. LHR" /></div>
              <div><Label>To Airport</Label><Input {...register("toAirport", { required: true })} placeholder="e.g. DXB" /></div>
            </div>
            <ImageUrlField
              label="Logo URL"
              name="logo"
              register={register}
              value={watchedLogo}
              required={false}
              placeholder="https://example.com/logo.png"
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
              <div><Label>Duration</Label><Input {...register("duration", { required: true })} placeholder="e.g. 8h 30m" /></div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div><Label>Stops</Label><Input type="number" {...register("stops", { required: true })} defaultValue="0" /></div>
              <div>
                <Label>Cabin Class</Label>
                <Select onValueChange={(value) => setValue("cabinClass", value)} defaultValue="Economy">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="First Class">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Baggage Info</Label><Input {...register("baggageInfo")} /></div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><Label>Fare Price</Label><Input type="number" step="0.01" {...register("farePrice", { required: true })} /></div>
              <div><Label>Old Price (optional)</Label><Input type="number" step="0.01" {...register("oldPrice")} /></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><Checkbox id="featured" checked={watchedFeatured} onCheckedChange={(c) => setValue("featured", !!c)} /><Label htmlFor="featured">Featured</Label></div>
              <div className="flex items-center gap-2"><Checkbox id="active" checked={watchedActive} onCheckedChange={(c) => setValue("active", !!c)} /><Label htmlFor="active">Active</Label></div>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Flight"}</Button>
              <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
