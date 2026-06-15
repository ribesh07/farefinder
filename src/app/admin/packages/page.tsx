import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { deleteHolidayPackage } from "@/actions"
import { Plus, Edit, Trash2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PackagesPage() {
  const packages = await prisma.holidayPackage.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Holiday Packages</h1>
        <Link href="/admin/packages/new">
          <Button><Plus className="w-4 h-4 mr-2" />Add Package</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{pkg.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/packages/${pkg.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <form action={deleteHolidayPackage.bind(null, pkg.id)}>
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
                  <span className="text-gray-500">Destination:</span> {pkg.destination}
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span> {pkg.duration}
                </div>
                <div>
                  <span className="text-gray-500">From:</span> £{pkg.startingPrice}
                </div>
                <div className="flex gap-2">
                  {pkg.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Featured</span>
                  )}
                  {pkg.active ? (
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
