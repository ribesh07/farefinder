"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminListSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { adminFetch } from "@/lib/admin-fetch";

type Flight = {
  id: string;
  airline: string;
  logo:string,
  flightNumber: string;
  fromAirport: string;
  toAirport: string;
  farePrice: number;
  featured: boolean;
  active: boolean;
};

export default function FlightsAdminList() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFlights = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await adminFetch<Flight[]>("/flights");
    if (result.ok) {
      setFlights(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFlights();
  }, [loadFlights]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Flights"
        description="Manage flight listings and pricing."
        actionHref="/admin/flights/new"
        actionLabel="Add Flight"
      />

      {error && <AdminAlert type="error" message={error} />}

      {loading ? (
        <AdminListSkeleton />
      ) : flights.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No flights yet. Add your first flight listing.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {flights.map((flight) => (
            <Card key={flight.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <img src={flight.logo} alt={`${flight.airline} logo`} className="h-8 w-8 rounded-full" />
                  <CardTitle className="text-lg">
                    {flight.airline} {flight.flightNumber}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/flights/${flight.id}/edit`}>
                      <Button variant="ghost" size="sm" aria-label="Edit flight">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteButton
                      endpoint={`/flights/${flight.id}`}
                      itemName={`${flight.airline} ${flight.flightNumber}`}
                      onDeleted={loadFlights}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <span className="text-gray-500">From:</span>{" "}
                    {flight.fromAirport}
                  </div>
                  <div>
                    <span className="text-gray-500">To:</span> {flight.toAirport}
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span> £
                    {flight.farePrice}
                  </div>
                  <div className="flex gap-2">
                    {flight.featured && (
                      <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                        Featured
                      </span>
                    )}
                    {flight.active ? (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
