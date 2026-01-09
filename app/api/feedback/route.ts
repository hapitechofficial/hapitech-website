import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all user feedback
export async function GET(request: NextRequest) {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        message: true,
        rating: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch feedbacks',
      },
      { status: 500 }
    );
  }
}

// POST - Create new feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message, rating } = body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, email, and message are required',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    // Validate rating if provided
    const validRating = rating ? Math.min(Math.max(parseInt(rating), 1), 5) : 5;

    // Create feedback in database
    const feedback = await prisma.feedback.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: company?.trim() || null,
        message: message.trim(),
        rating: validRating,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your feedback!',
        data: {
          id: feedback.id,
          name: feedback.name,
          email: feedback.email,
          company: feedback.company,
          message: feedback.message,
          rating: feedback.rating,
          createdAt: feedback.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit feedback. Please try again later.',
      },
      { status: 500 }
    );
  }
}
