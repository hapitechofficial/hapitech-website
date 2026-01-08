import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Validate email configuration
    if (!process.env.EMAIL_USER) {
      console.error('EMAIL_USER not configured');
      return NextResponse.json(
        { error: 'Email service not configured', message: 'Please try again later' },
        { status: 503 }
      );
    }

    const { name, email, subject, message } = await request.json();

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required', missing: [!name && 'name', !email && 'email', !subject && 'subject', !message && 'message'].filter(Boolean) },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Sanitize message to prevent XSS
    const sanitizedMessage = message.replace(/[<>]/g, '').substring(0, 5000);

    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name.substring(0, 200)}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject.substring(0, 200)}</p>
      <p><strong>Message:</strong></p>
      <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
    `;

    await sendEmail(process.env.EMAIL_USER, `New Contact: ${subject.substring(0, 100)}`, html);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Contact API Error:', error);

    // Differentiate between different error types
    let statusCode = 500;
    let errorMessage = 'Failed to send email';

    if (error instanceof Error) {
      if (error.message.includes('EAUTH')) {
        statusCode = 503;
        errorMessage = 'Email authentication failed. Please try again later.';
      } else if (error.message.includes('timeout')) {
        statusCode = 504;
        errorMessage = 'Email service timeout. Please try again.';
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: statusCode }
    );
  }
}