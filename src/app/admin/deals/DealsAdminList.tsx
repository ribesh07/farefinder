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

type Deal = {
  id: string;
  title: string;
  type: string;
  newPrice: number;
  oldPrice: number | null;
  active: boolean;
};

export default function DealsAdminList() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await adminFetch<Deal[]>("/deals");
    if (result.ok) {
      setDeals(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDeals();
  }, [loadDeals]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Deals"
        description="Manage promotional deals and special offers."
        actionHref="/admin/deals/new"
        actionLabel="Add Deal"
      />

      {error && <AdminAlert type="error" message={error} />}

      {loading ? (
        <AdminListSkeleton />
      ) : deals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No deals yet. Create your first deal to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {deals.map((deal) => (
            <Card key={deal.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{deal.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/deals/${deal.id}/edit`}>
                      <Button variant="ghost" size="sm" aria-label="Edit deal">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteButton
                      endpoint={`/deals/${deal.id}`}
                      itemName={deal.title}
                      onDeleted={loadDeals}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <span className="text-gray-500">Type:</span> {deal.type}
                  </div>
                  <div>
                    <span className="text-gray-500">New Price:</span> £
                    {deal.newPrice}
                  </div>
                  {deal.oldPrice != null && (
                    <div>
                      <span className="text-gray-500">Old Price:</span>{" "}
                      <span className="line-through">£{deal.oldPrice}</span>
                    </div>
                  )}
                  <div>
                    {deal.active ? (
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
