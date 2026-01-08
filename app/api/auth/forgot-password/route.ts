import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    console.log("Password reset request for:", email)

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      return NextResponse.json({
        message: "If an account exists with this email, a password reset link will be sent."
      }, { status: 200 })
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Store reset token in database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiry,
      }
    })

    // Send email with reset link
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    
    try {
      await sendPasswordResetEmail(email, user.name || "User", resetUrl)
      console.log("Password reset email sent to:", email)
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json({
      message: "If an account exists with this email, a password reset link will be sent."
    }, { status: 200 })

  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    )
  }
}
