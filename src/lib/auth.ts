import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { prisma } from "./prisma"
import { createToken, verifyToken } from "./tokens"

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
    const decoded = verifyToken(token)
    const user = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
    })
    return user
  } catch {
    return null
  }
}

export function setAuthCookie(token: string) {
  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export function removeAuthCookie() {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAME)
}
