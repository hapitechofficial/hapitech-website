import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("[SIGNUP] Invalid JSON:", parseError)
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      )
    }

    const { name, email, password } = body

    console.log("[SIGNUP] Attempt for:", email)

    // Validate input
    if (!name || !email || !password) {
      console.error("[SIGNUP] Missing fields:", { name: !!name, email: !!email, password: !!password })
      return NextResponse.json(
        { error: "Name, email, and password are required" },
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

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    let existingUser
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      })
    } catch (dbError) {
      console.error("[SIGNUP] Database error checking user:", dbError)
      return NextResponse.json(
        { error: "Database error. Please try again." },
        { status: 500 }
      )
    }

    if (existingUser) {
      console.log("[SIGNUP] User already exists:", email)
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(password, 12)
    } catch (hashError) {
      console.error("[SIGNUP] Bcrypt hash error:", hashError)
      return NextResponse.json(
        { error: "Password processing error" },
        { status: 500 }
      )
    }

    // Create user
    let user
    try {
      console.log("[SIGNUP] Creating user in database...")
      user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          credits: 2, // Default free credits
        }
      })
      console.log("[SIGNUP] User created successfully:", user.id)
    } catch (createError) {
      console.error("[SIGNUP] User creation error:", createError)
      if (createError instanceof Error && createError.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: "Failed to create account. Please try again." },
        { status: 500 }
      )
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: userWithoutPassword
    }, { status: 201 })

  } catch (error) {
    console.error("[SIGNUP] Unexpected error:", error)
    
    if (error instanceof Error) {
      console.error("[SIGNUP] Error details:", error.message)
      
      if (error.message.includes("Connection refused") || error.message.includes("ECONNREFUSED")) {
        return NextResponse.json(
          { error: "Database connection error. Please try again later." },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    )
  }
}