import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[CONTACT] Invalid JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = body;

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Send email - sendEmail handles missing config gracefully
    await sendEmail('support@hapitech.in', `New Contact: ${subject.substring(0, 100)}`, html);

    return NextResponse.json({ success: true, message: 'Thank you for contacting us. We will get back to you soon.' }, { status: 200 });
  } catch (error) {
    console.error('[CONTACT] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}