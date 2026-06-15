import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { prisma } from "./prisma"
import { createToken, verifyToken } from "./tokens"
import { NextResponse } from "next/server"

const COOKIE_NAME = "auth-token"

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export { createToken, verifyToken }

export async function getSession() {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  
  try {
    const decoded = await verifyToken(token)
    const user = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
    })
    return user
  } catch {
    return null
  }
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export function removeAuthCookie(response: NextResponse) {
  response.cookies.delete(COOKIE_NAME)
}
