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
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session && session.user && token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
    async signIn({ user, account, profile, email, credentials }) {
      try {
        if (!user.email) {
          console.error("SignIn: No email provided")
          return false
        }

        // For OAuth providers (Google)
        if (account?.provider === "google") {
          console.log("SignIn: Processing Google OAuth for email:", user.email)
          
          // Check if user exists
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email }
          })

          // If user doesn't exist, create them
          if (!dbUser) {
            console.log("SignIn: Creating new user from Google OAuth")
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "",
                image: user.image,
                emailVerified: new Date(),
                credits: 2, // Default free credits
              }
            })
            console.log("SignIn: User created successfully:", dbUser.id)
          } else {
            console.log("SignIn: User already exists:", dbUser.id)
            // Update user image if new one provided
            if (user.image && user.image !== dbUser.image) {
              await prisma.user.update({
                where: { id: dbUser.id },
                data: { image: user.image }
              })
            }
          }

          return true
        }

        // For Credentials provider
        if (credentials) {
          return true
        }

        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return false
      }
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
}