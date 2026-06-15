import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-for-development-only"
)

export async function createToken(userId: string, role: string) {
  return await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET, {
    algorithms: ["HS256"],
  })
  return payload as { userId: string; role: string }
}
