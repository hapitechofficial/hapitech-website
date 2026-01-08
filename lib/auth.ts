import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
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
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials")
            return null
          }

          console.log("Authorizing user:", credentials.email)

          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() }
          })

          if (!user) {
            console.log("User not found:", credentials.email)
            return null
          }

          if (!user.password) {
            console.log("User has no password set:", credentials.email)
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log("Password mismatch for user:", credentials.email)
            return null
          }

          console.log("User authorized successfully:", credentials.email)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("Authorization error:", error)
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
      // Always redirect to poster generator after successful signin
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/tools/poster-generator`
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
}