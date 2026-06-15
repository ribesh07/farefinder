import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { deleteTestimonial } from "@/actions"
import { Plus, Edit, Trash2, Star } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <Link href="/admin/testimonials/new">
          <Button><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/testimonials/${t.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <form action={deleteTestimonial.bind(null, t.id)}>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Rating:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                </div>
                {t.location && <div><span className="text-gray-500">Location:</span> {t.location}</div>}
                <div><span className="text-gray-500">Review:</span> {t.review}</div>
                {t.featured && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Featured</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
