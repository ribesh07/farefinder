import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { deleteDeal } from "@/actions"
import { Plus, Edit, Trash2 } from "lucide-react"

export default async function DealsPage() {
  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Deals</h1>
        <Link href="/admin/deals/new">
          <Button><Plus className="w-4 h-4 mr-2" />Add Deal</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {deals.map((deal) => (
          <Card key={deal.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{deal.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/deals/${deal.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <form action={deleteDeal.bind(null, deal.id)}>
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
                  <span className="text-gray-500">Type:</span> {deal.type}
                </div>
                <div>
                  <span className="text-gray-500">New Price:</span> £{deal.newPrice}
                </div>
                {deal.oldPrice && (
                  <div>
                    <span className="text-gray-500">Old Price:</span> <span className="line-through">£{deal.oldPrice}</span>
                  </div>
                )}
                <div>
                  {deal.active ? (
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
