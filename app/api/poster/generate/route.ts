import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateProductionPoster } from '@/lib/posterService';
import { sendEmail } from '@/lib/email';
import type { PosterGenerationParams } from '@/types/poster';

// hApItech Production Suite API route
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Please sign in to generate posters' }, { status: 401 });
    }

    // Parse multipart form data
    const form = await request.formData();
    const productImage = form.get('productImage');
    if (!productImage || !(productImage instanceof File)) {
      return NextResponse.json({ error: 'Product image is required.' }, { status: 400 });
    }
    const brandLogo = form.get('brandLogo');
    const industry = form.get('industry')?.toString() || '';
    const description = form.get('description')?.toString() || '';
    const headline = form.get('headline')?.toString() || '';
    const tagline = form.get('tagline')?.toString() || '';

    if (!industry || !description || !headline || !tagline) {
      return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 });
    }

    // Call geminiService
    let posterUrl: string;
    try {
      posterUrl = await generateProductionPoster({ productImage, brandLogo: brandLogo instanceof File ? brandLogo : null, industry, description, headline, tagline });
      if (!posterUrl || posterUrl.trim() === '') {
        return NextResponse.json({ success: false, message: 'Poster generation failed. Please try again.' }, { status: 400 });
      }
    } catch (err: any) {
      return NextResponse.json({ success: false, message: err?.message || 'Poster generation failed.' }, { status: 400 });
    }

    // (Optional: Save poster record, deduct credits, send email, etc. as before)

    return NextResponse.json({ success: true, posterUrl, message: 'Poster generated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}