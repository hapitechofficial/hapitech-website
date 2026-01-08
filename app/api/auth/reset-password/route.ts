import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password, confirmPassword } = body

    console.log("Password reset attempt with token")

    // Validate input
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Token and passwords are required" },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex")

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: resetTokenHash,
        resetTokenExpiry: {
          gt: new Date() // Token not expired
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      }
    })

    console.log("Password reset successful for user:", user.id)

    return NextResponse.json({
      message: "Password reset successfully. Please sign in with your new password."
    }, { status: 200 })

  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    )
  }
}
