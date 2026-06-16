"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plane, Users, Package, MapPin, FileText, Star, Tag, Mail, Settings, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/actions"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Flights", href: "/admin/flights", icon: <Plane className="w-5 h-5" /> },
  { label: "Leads", href: "/admin/leads", icon: <Users className="w-5 h-5" /> },
  { label: "Packages", href: "/admin/packages", icon: <Package className="w-5 h-5" /> },
  { label: "Destinations", href: "/admin/destinations", icon: <MapPin className="w-5 h-5" /> },
  { label: "Blog", href: "/admin/blog", icon: <FileText className="w-5 h-5" /> },
  { label: "Testimonials", href: "/admin/testimonials", icon: <Star className="w-5 h-5" /> },
  { label: "Deals", href: "/admin/deals", icon: <Tag className="w-5 h-5" /> },
  { label: "Inquiries", href: "/admin/inquiries", icon: <Mail className="w-5 h-5" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return children
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">FareFinderUK Admin</h2>
        </div>
        <nav className="px-4 space-y-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <form action={logout}>
            <Button variant="ghost" className="w-full flex items-center space-x-2">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
