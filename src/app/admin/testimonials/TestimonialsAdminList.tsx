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

type Testimonial = {
  id: string;
  name: string;
  location: string | null;
  rating: number;
  featured: boolean;
};

export default function TestimonialsAdminList() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTestimonials = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await adminFetch<Testimonial[]>("/testimonials");
    if (result.ok) {
      setTestimonials(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Testimonials"
        description="Manage customer reviews and testimonials."
        actionHref="/admin/testimonials/new"
        actionLabel="Add Testimonial"
      />

      {error && <AdminAlert type="error" message={error} />}

      {loading ? (
        <AdminListSkeleton />
      ) : testimonials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No testimonials yet. Add your first customer review.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/testimonials/${item.id}/edit`}>
                      <Button variant="ghost" size="sm" aria-label="Edit testimonial">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteButton
                      endpoint={`/testimonials/${item.id}`}
                      itemName={item.name}
                      onDeleted={loadTestimonials}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                  {item.location && (
                    <div>
                      <span className="text-gray-500">Location:</span>{" "}
                      {item.location}
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Rating:</span> {item.rating}
                    /5
                  </div>
                  <div>
                    {item.featured ? (
                      <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                        Featured
                      </span>
                    ) : (
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-800">
                        Standard
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
