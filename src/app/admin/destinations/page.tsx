import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { deleteDestination } from "@/actions"
import { Plus, Edit, Trash2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Destinations</h1>
        <Link href="/admin/destinations/new">
          <Button><Plus className="w-4 h-4 mr-2" />Add Destination</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {destinations.map((dest) => (
          <Card key={dest.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{dest.name}, {dest.country}</CardTitle>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/destinations/${dest.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <form action={deleteDestination.bind(null, dest.id)}>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Slug:</span> {dest.slug}
                </div>
                <div>
                  <span className="text-gray-500">From:</span> £{dest.startingFare}
                </div>
                <div className="md:col-span-2 flex gap-2">
                  {dest.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Featured</span>
                  )}
                  {dest.active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Inactive</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
