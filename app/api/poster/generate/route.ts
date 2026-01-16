import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generatePoster } from '@/lib/posterService';
import { sendEmail } from '@/lib/email';
import type { PosterGenerationParams } from '@/types/poster';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log('Poster API: User not authenticated');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please sign in to generate posters' },
        { status: 401 }
      );
    }

    // Check user credits and subscription status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        credits: true,
        subscription: {
          select: { status: true }
        }
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check daily limit for subscription users (15 posters per day)
    // Free users can only generate 5 posters per day
    const isSubscribed = user.subscription?.status === 'active';
    const dailyLimit = isSubscribed ? 15 : 5;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayGenerations = await prisma.posterGeneration.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        status: 'completed',
      },
    });

    if (todayGenerations >= dailyLimit) {
      const message = isSubscribed
        ? `You've reached your daily poster generation limit (15 posters). Please try again tomorrow.`
        : `You've reached your daily poster generation limit (5 posters). Upgrade to premium for up to 15 posters per day.`;
      
      return NextResponse.json({
        error: message,
        upgradeRequired: !isSubscribed,
        dailyLimit: dailyLimit,
        generatedToday: todayGenerations,
      }, { status: 402 });
    }

    const formData: PosterGenerationParams = await request.json();

    // Validate required fields
    const requiredFields: (keyof PosterGenerationParams)[] = ['brandName', 'description', 'aspectRatio', 'posterType'];
    const missingFields: string[] = requiredFields.filter(field => !formData[field]);

    // Check festival name requirement
    if (formData.posterType === 'Festival' && !formData.festivalName) {
      missingFields.push('festivalName (required for festival campaigns)');
    }

    if (missingFields.length > 0) {
      return NextResponse.json({
        error: `Please fill in all required fields: ${missingFields.join(', ')}`,
        missingFields
      }, { status: 400 });
    }

    // Convert base64 images back to File objects for the service
    const productImages: string[] = formData.productImages?.map((img: any) => {
      // Already base64
      return img.base64;
    }) || [];

    const brandLogo: string | null = formData.brandLogo ? (() => {
      const img = formData.brandLogo as any; // Type assertion for the base64 data
      return img.base64;
    })() : null;

    // Generate poster using AI service
    const posterParams: PosterGenerationParams = {
      brandName: formData.brandName,
      description: formData.description,
      productImages,
      productUrl: formData.productUrl,
      brandLogo,
      aspectRatio: formData.aspectRatio,
      posterType: formData.posterType,
      festivalName: formData.festivalName,
      contactPhone: formData.contactPhone,
      website: formData.website,
      address: formData.address,
      baseImage: formData.baseImage
    };

    // SAFE CALL: Wrap AI generation with try/catch for graceful error handling
    let imageBase64: string;
    try {
      imageBase64 = await generatePoster(posterParams);
      
      // SAFE VALIDATION: Ensure image was actually generated
      if (!imageBase64 || imageBase64.trim() === '') {
        console.error('Poster generation returned empty image');
        return NextResponse.json(
          {
            success: false,
            message: 'Poster generation failed. Please try again with different inputs.'
          },
          { status: 400 }
        );
      }
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      
      // Return controlled error instead of crashing
      return NextResponse.json(
        {
          success: false,
          message: 'Poster generation failed. Please try again with different inputs.'
        },
        { status: 400 }
      );
    }

    // Deduct credits for non-subscribed users
    if (!isSubscribed) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 1 } },
      });
    }

    // Save poster generation record
    await prisma.posterGeneration.create({
      data: {
        userId: session.user.id,
        canvasType: formData.aspectRatio,
        campaignMode: formData.posterType,
        brandName: formData.brandName,
        description: formData.description,
        phone: formData.contactPhone || null,
        website: formData.website || null,
        address: formData.address || null,
        productUrl: formData.productUrl || null,
        brandLogo: formData.brandLogo ? 'uploaded' : null,
        productImages: formData.productImages ? JSON.stringify(formData.productImages.map((img: any) => img.name || 'image')) : null,
        generatedPosterUrl: imageBase64,
        status: 'completed',
      },
    });

    // Send email notification
    const html = `
      <h2>New Poster Generation</h2>
      <p><strong>User ID:</strong> ${session.user.id}</p>
      <p><strong>Brand Name:</strong> ${formData.brandName}</p>
      <p><strong>Description:</strong> ${formData.description}</p>
      <p><strong>Poster Type:</strong> ${formData.posterType}</p>
      <p><strong>Aspect Ratio:</strong> ${formData.aspectRatio}</p>
      ${formData.contactPhone ? `<p><strong>Phone:</strong> ${formData.contactPhone}</p>` : ''}
      ${formData.website ? `<p><strong>Website:</strong> ${formData.website}</p>` : ''}
      ${formData.address ? `<p><strong>Address:</strong> ${formData.address}</p>` : ''}
    `;

    try {
      await sendEmail(process.env.EMAIL_USER!, `New Poster Order: ${formData.brandName}`, html);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      posterUrl: imageBase64,
      message: 'Poster generated successfully',
    });
  } catch (error) {
    console.error('Error generating poster:', error);

    // Provide more specific error messages
    let statusCode = 500;
    let errorMessage = 'Failed to generate poster';
    let details: string | undefined;

    if (error instanceof Error) {
      if (error.message.includes('credit')) {
        statusCode = 402;
        errorMessage = 'Insufficient credits. Please upgrade or buy credits.';
      } else if (error.message.includes('limit')) {
        statusCode = 429;
        errorMessage = 'Daily generation limit reached.';
      } else {
        details = process.env.NODE_ENV === 'development' ? error.message : undefined;
      }
    }

    return NextResponse.json({
      error: errorMessage,
      details,
      message: 'Please try again with different inputs.'
    }, { status: statusCode });
  }
}