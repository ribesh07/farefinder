import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AdminListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="h-4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AdminFormSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-9 w-64 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
        <div className="mb-6 h-6 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-9 w-72 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border bg-white p-6 dark:bg-gray-800"
          >
            <div className="mb-4 h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
