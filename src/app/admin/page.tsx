import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminChart from "@/components/AdminChart"

export default async function DashboardPage() {
  const [
    totalFlightLeads,
    totalPackageLeads,
    totalInquiries,
    totalSubscribers,
    totalFlights,
    totalPackages,
    totalBlogPosts,
  ] = await Promise.all([
    prisma.flightBookingLead.count(),
    prisma.packageLead.count(),
    prisma.contactInquiry.count(),
    prisma.newsletterSubscriber.count(),
    prisma.flight.count(),
    prisma.holidayPackage.count(),
    prisma.blogPost.count(),
  ])

  // Mock chart data for demonstration
  const chartData = [
    { name: "Jan", leads: 40 },
    { name: "Feb", leads: 30 },
    { name: "Mar", leads: 50 },
    { name: "Apr", leads: 45 },
    { name: "May", leads: 60 },
    { name: "Jun", leads: 55 },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Flight Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFlightLeads}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Package Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackageLeads}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInquiries}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFlights}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackages}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBlogPosts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leads by Month</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <AdminChart chartData={chartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
