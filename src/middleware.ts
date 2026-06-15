import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/tokens"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const path = request.nextUrl.pathname

  console.log(`[Middleware] Path: ${path}, Token present: ${!!token}`)

  // Only protect /admin routes
  if (path.startsWith("/admin")) {
    // Allow access to login page
    if (path === "/admin/login") {
      // If already logged in, redirect to dashboard
      if (token) {
        try {
          const decoded = await verifyToken(token)
          console.log(`[Middleware] Token valid, decoded:`, decoded)
          return NextResponse.redirect(new URL("/admin", request.url))
        } catch (err) {
          console.log(`[Middleware] Token invalid:`, err)
        }
      }
      return NextResponse.next()
    }

    // All other admin routes require auth
    if (!token) {
      console.log("[Middleware] No token, redirecting to login")
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      const decoded = await verifyToken(token)
      console.log(`[Middleware] Token valid:`, decoded)
      return NextResponse.next()
    } catch (err) {
      console.log("[Middleware] Token invalid:", err)
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
