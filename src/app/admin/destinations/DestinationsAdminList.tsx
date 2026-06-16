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

type Destination = {
  id: string;
  name: string;
  slug: string;
  country: string;
  startingFare: number;
  featured: boolean;
  active: boolean;
};

export default function DestinationsAdminList() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await adminFetch<Destination[]>("/destinations");
    if (result.ok) {
      setDestinations(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Destinations"
        description="Manage travel destinations."
        actionHref="/admin/destinations/new"
        actionLabel="Add Destination"
      />

      {error && <AdminAlert type="error" message={error} />}

      {loading ? (
        <AdminListSkeleton />
      ) : destinations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No destinations yet. Add your first destination.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {destinations.map((dest) => (
            <Card key={dest.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{dest.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/destinations/${dest.id}/edit`}>
                      <Button variant="ghost" size="sm" aria-label="Edit destination">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteButton
                      endpoint={`/destinations/${dest.id}`}
                      itemName={dest.name}
                      onDeleted={loadDestinations}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <span className="text-gray-500">Country:</span>{" "}
                    {dest.country}
                  </div>
                  <div>
                    <span className="text-gray-500">Slug:</span> {dest.slug}
                  </div>
                  <div>
                    <span className="text-gray-500">From:</span> £
                    {dest.startingFare}
                  </div>
                  <div className="flex gap-2">
                    {dest.featured && (
                      <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                        Featured
                      </span>
                    )}
                    {dest.active ? (
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
