import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: { email?: string }
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("[FORGOT_PW] Invalid JSON:", parseError)
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      )
    }

    const email = body?.email?.toLowerCase().trim()

    // Validate email presence
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      )
    }

    console.log("[FORGOT_PW] Password reset requested for:", email)

    // Find user by email
    let user
    try {
      user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, password: true }
      })
    } catch (dbError) {
      console.error("[FORGOT_PW] Database error:", dbError)
      // Return generic message for security
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a password reset link will be sent."
      }, { status: 200 })
    }

    // Security: Don't reveal if user exists or not
    if (!user) {
      console.log("[FORGOT_PW] User not found:", email)
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a password reset link will be sent."
      }, { status: 200 })
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Store hashed token in database
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: resetTokenHash,
          resetTokenExpiry,
        }
      })
      console.log("[FORGOT_PW] Reset token stored for:", email)
    } catch (updateError) {
      console.error("[FORGOT_PW] Failed to store reset token:", updateError)
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a password reset link will be sent."
      }, { status: 200 })
    }

    // Send password reset email (non-blocking)
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        await sendPasswordResetEmail(email, user.name || "User", resetUrl)
        console.log("[FORGOT_PW] Reset email sent to:", email)
      } catch (emailError) {
        console.error("[FORGOT_PW] Email send failed (non-blocking):", emailError)
        // Don't fail the entire request if email fails - user can retry
      }
    } else {
      console.warn("[FORGOT_PW] Email service not configured - skipping email send")
    }

    // Always return success (generic message for security)
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link will be sent."
    }, { status: 200 })

  } catch (error) {
    console.error("[FORGOT_PW] Unexpected error:", error)
    // Return generic message instead of exposing error details
    return NextResponse.json(
      { success: true, message: "If an account exists with this email, a password reset link will be sent." },
      { status: 200 }
    )
  }
}
