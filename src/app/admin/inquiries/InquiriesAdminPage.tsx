"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminListSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { adminFetch } from "@/lib/admin-fetch";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
};

export default function InquiriesAdminPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await adminFetch<Inquiry[]>("/inquiries");
    if (result.ok) {
      setInquiries(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Inquiries"
        description="Manage contact form submissions."
      />

      {error && <AdminAlert type="error" message={error} />}

      {loading ? (
        <AdminListSkeleton />
      ) : inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No inquiries yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((inquiry) => (
            <InquiryCard
              key={inquiry.id}
              inquiry={inquiry}
              onUpdated={loadInquiries}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function InquiryCard({
  inquiry,
  onUpdated,
}: {
  inquiry: Inquiry;
  onUpdated: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(inquiry.status);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await adminFetch(`/inquiries/${inquiry.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setIsSaving(false);

    if (result.ok) {
      setIsEditing(false);
      onUpdated();
    } else {
      window.alert(result.error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{inquiry.name}</CardTitle>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Status
                </Button>
                <DeleteButton
                  endpoint={`/inquiries/${inquiry.id}`}
                  itemName={inquiry.name}
                  onDeleted={onUpdated}
                />
              </>
            ) : (
              <>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div>
            <span className="text-gray-500">Email:</span> {inquiry.email}
          </div>
          {inquiry.phone && (
            <div>
              <span className="text-gray-500">Phone:</span> {inquiry.phone}
            </div>
          )}
        </div>
        <div>
          <span className="text-gray-500">Message:</span> {inquiry.message}
        </div>

        {isEditing ? (
          <div className="mt-4">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="REPLIED">Replied</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-gray-500">Status:</span>
            <StatusBadge status={status} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    REPLIED: "bg-yellow-100 text-yellow-800",
    CLOSED: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`rounded px-2 py-1 text-xs font-semibold ${colors[status] ?? "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  );
}
