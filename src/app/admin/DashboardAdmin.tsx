import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plane, 
  Package, 
  MapPin, 
  FileText, 
  Star, 
  Tag, 
  Mail, 
  Settings,
  Users
} from "lucide-react";

export default function DashboardAdmin() {
  const quickActions = [
    { label: "Manage Flights", href: "/admin/flights", icon: <Plane className="w-5 h-5" />, color: "text-blue-600 bg-blue-50" },
    { label: "Manage Packages", href: "/admin/packages", icon: <Package className="w-5 h-5" />, color: "text-green-600 bg-green-50" },
    { label: "Destinations", href: "/admin/destinations", icon: <MapPin className="w-5 h-5" />, color: "text-purple-600 bg-purple-50" },
    { label: "Blog Posts", href: "/admin/blog", icon: <FileText className="w-5 h-5" />, color: "text-orange-600 bg-orange-50" },
    { label: "Testimonials", href: "/admin/testimonials", icon: <Star className="w-5 h-5" />, color: "text-yellow-600 bg-yellow-50" },
    { label: "Deals", href: "/admin/deals", icon: <Tag className="w-5 h-5" />, color: "text-pink-600 bg-pink-50" },
    { label: "Leads", href: "/admin/leads", icon: <Users className="w-5 h-5" />, color: "text-indigo-600 bg-indigo-50" },
    { label: "Inquiries", href: "/admin/inquiries", icon: <Mail className="w-5 h-5" />, color: "text-cyan-600 bg-cyan-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero/Banner Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-700 to-blue-900 text-white rounded-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <img
            src="/cover.png"
            alt="Admin Dashboard Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to FareFinderUK Admin</h1>
              <p className="text-xl opacity-90">Manage your travel business from one place</p>
            </div>
            <Link href="/admin/settings">
              <Button className="bg-white text-primary hover:bg-gray-100">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link href={action.href} key={action.label}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    {action.icon}
                  </div>
                  <span className="font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
