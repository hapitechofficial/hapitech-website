import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  if ((session.user as any).role !== "ADMIN") {
    redirect("/admin/forbidden")
  }

  return session
}

export async function getAdminSession() {
  const session = await getServerSession(authOptions)
  return session
}

export function isAdmin(role?: string): boolean {
  return role === "ADMIN"
}
