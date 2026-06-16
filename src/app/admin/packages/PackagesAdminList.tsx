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

type Package = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  startingPrice: number;
  featured: boolean;
  active: boolean;
};

export default function PackagesAdminList() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await adminFetch<Package[]>("/packages");
    if (result.ok) {
      setPackages(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Holiday Packages"
        description="Manage holiday package listings."
        actionHref="/admin/packages/new"
        actionLabel="Add Package"
      />

      {error && <AdminAlert type="error" message={error} />}

      {loading ? (
        <AdminListSkeleton />
      ) : packages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No packages yet. Create your first holiday package.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{pkg.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/packages/${pkg.id}/edit`}>
                      <Button variant="ghost" size="sm" aria-label="Edit package">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteButton
                      endpoint={`/packages/${pkg.id}`}
                      itemName={pkg.title}
                      onDeleted={loadPackages}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <span className="text-gray-500">Destination:</span>{" "}
                    {pkg.destination}
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>{" "}
                    {pkg.duration}
                  </div>
                  <div>
                    <span className="text-gray-500">From:</span> £
                    {pkg.startingPrice}
                  </div>
                  <div className="flex gap-2">
                    {pkg.featured && (
                      <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                        Featured
                      </span>
                    )}
                    {pkg.active ? (
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
