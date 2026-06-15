import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { deleteFlight } from "@/actions"
import { Plus, Edit, Trash2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function FlightsPage() {
  const flights = await prisma.flight.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Flights</h1>
        <Link href="/admin/flights/new">
          <Button><Plus className="w-4 h-4 mr-2" />Add Flight</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {flights.map((flight) => (
          <Card key={flight.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {flight.airline} {flight.flightNumber}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/flights/${flight.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <form action={deleteFlight.bind(null, flight.id)}>
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
                  <span className="text-gray-500">From:</span> {flight.fromAirport}
                </div>
                <div>
                  <span className="text-gray-500">To:</span> {flight.toAirport}
                </div>
                <div>
                  <span className="text-gray-500">Price:</span> £{flight.farePrice}
                </div>
                <div className="flex gap-2">
                  {flight.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Featured</span>
                  )}
                  {flight.active ? (
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
