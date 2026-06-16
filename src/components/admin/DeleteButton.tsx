"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin-fetch";

export function DeleteButton({
  endpoint,
  itemName,
  onDeleted,
}: {
  endpoint: string;
  itemName?: string;
  onDeleted?: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const label = itemName ? `"${itemName}"` : "this item";
    if (!window.confirm(`Are you sure you want to delete ${label}?`)) {
      return;
    }

    setIsDeleting(true);
    const result = await adminFetch(endpoint, { method: "DELETE" });
    setIsDeleting(false);

    if (result.ok) {
      onDeleted?.();
    } else {
      window.alert(result.error);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-red-500 hover:text-red-600"
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label="Delete"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
