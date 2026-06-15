import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/tokens"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const path = request.nextUrl.pathname

  // Only protect /admin routes
  if (path.startsWith("/admin")) {
    // Allow access to login page
    if (path === "/admin/login") {
      // If already logged in, redirect to dashboard
      if (token) {
        try {
          verifyToken(token)
          return NextResponse.redirect(new URL("/admin", request.url))
        } catch {
          // Invalid token, allow access to login
        }
      }
      return NextResponse.next()
    }

    // All other admin routes require auth
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      verifyToken(token)
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
