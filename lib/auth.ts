import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV === 'production' ? undefined : 'dev-secret'),
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Validate input presence
          if (!credentials?.email || !credentials?.password) {
            console.log("[AUTH] Missing email or password")
            return null
          }

          const normalizedEmail = credentials.email.toLowerCase().trim()
          console.log("[AUTH] Attempting credentials login for:", normalizedEmail)

          // Query user by email
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              password: true,
              role: true,
            }
          })

          // User not found
          if (!user) {
            console.log("[AUTH] User not found:", normalizedEmail)
            return null
          }

          // User has no password (OAuth-only account)
          if (!user.password) {
            console.log("[AUTH] User has no password set (OAuth-only):", normalizedEmail)
            return null
          }

          // Compare password
          let isPasswordValid = false
          try {
            isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          } catch (bcryptError) {
            console.error("[AUTH] Bcrypt comparison error:", bcryptError)
            return null
          }

          // Password mismatch
          if (!isPasswordValid) {
            console.log("[AUTH] Password mismatch for user:", normalizedEmail)
            return null
          }

          // Success: return minimal user object (NextAuth requires id, email)
          console.log("[AUTH] Credentials login successful for:", normalizedEmail)
          return {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            image: user.image || undefined,
            role: user.role,
          }
        } catch (error) {
          console.error("[AUTH] Unexpected authorization error:", error)
          // Never throw in authorize() - always return null on error
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update token every 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = (user as any).role || "USER"
      }
      if (account) {
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        ;(session.user as any).role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // For Google OAuth - always allow signin
        if (account?.provider === "google") {
          console.log("SignIn: Processing Google OAuth for:", user.email)
          return true
        }

        // For Credentials provider (email/password)
        if (credentials) {
          console.log("SignIn: Processing credentials for:", user.email)
          return true
        }

        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return false
      }
    },
    async redirect({ url, baseUrl }) {
      // Prevent open redirect vulnerability
      if (!url) return `${baseUrl}/`
      
      // If it's an internal relative URL, redirect to it
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      
      // Check if URL is from the same origin
      try {
        const urlObj = new URL(url)
        if (urlObj.origin === baseUrl) {
          return url
        }
      } catch (e) {
        // Invalid URL, fall through to default
      }
      
      // Default redirect to home page
      return `${baseUrl}/`
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
}