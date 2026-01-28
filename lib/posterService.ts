import { GoogleGenAI, Type } from '@google/genai';
import type { PosterGenerationParams, PosterType } from '@/types/poster';

interface AdStrategy {
  headline: string;
  subtext: string;
  cta: string;
  visualConcept: string;
  colorPalette: string[];
  layoutType: string;
}

/**
 * Analyze brand and create ad strategy using Gemini
 */
const analyzeBrand = async (
  brandName: string,
  description: string,
  industry: string,
  language: string = 'English'
): Promise<AdStrategy> => {
  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

  const prompt = `
    Act as a Senior Creative Director at a top advertising agency. 
    Analyze the following brand info and create a professional advertising strategy for a high-impact poster.
    
    Brand Name: ${brandName}
    Industry: ${industry}
    Brand Description: ${description}
    Target Language: ${language}
    
    The strategy must include:
    1. A powerful, short headline (max 5 words).
    2. A supporting subtext (max 10 words).
    3. A clear Call to Action in ${language}.
    4. A visual concept description for a professional poster.
    5. A professional color palette (3-4 hex codes).
    6. Layout type (Minimal, Cinematic, Corporate, Lifestyle, etc.).

    Ensure the tone is sophisticated and matches the industry standards.
    Focus on creating a premium, high-end advertising strategy.
  `;

  const response = await ai.models.generateContent({
    model: 'models/gemini-2.0-flash',
    contents: [{
      role: 'user',
      parts: [{ text: prompt }]
    }],
  } as any);

  if (!response.candidates || response.candidates.length === 0) {
    throw new Error('Failed to analyze brand strategy');
  }

  const responseText = (response.candidates[0].content?.parts?.[0] as any)?.text || '';
  
  // Parse JSON response
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    return JSON.parse(jsonMatch[0]) as AdStrategy;
  } catch (parseError) {
    console.error('Failed to parse strategy response:', responseText);
    // Fallback strategy
    return {
      headline: brandName,
      subtext: description.substring(0, 50),
      cta: 'Discover Now',
      visualConcept: `A premium, professional representation of ${brandName} in a cinematic setting`,
      colorPalette: ['#1a1a2e', '#16213e', '#0f3460', '#e94560'],
      layoutType: 'Cinematic'
    };
  }
};

/**
 * Create poster image using Gemini with visual concept
 */
const createPosterImage = async (
  brandName: string,
  strategy: AdStrategy,
  productImages: string[],
  brandLogo: string | null
): Promise<string> => {
  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

  const prompt = `
    Create a professional, agency-grade commercial advertising poster.
    
    VISUAL CONCEPT: ${strategy.visualConcept}
    HEADLINE: "${strategy.headline}" 
    SUBTEXT: "${strategy.subtext}"
    CTA: "${strategy.cta}"
    LAYOUT STYLE: ${strategy.layoutType}
    COLOR PALETTE: ${strategy.colorPalette.join(', ')}
    
    STRICT TYPOGRAPHY REQUIREMENTS:
    - You MUST render the following literal text exactly as written:
      1. Headline: "${strategy.headline}"
      2. Subtext: "${strategy.subtext}"
      3. CTA: "${strategy.cta}"
    - Integrate the text elegantly with premium, high-end typography.
    - Keep the product from the uploaded image as the center focus.
    
    STRICT VISUAL REQUIREMENTS:
    - Keep the product visible and do not distort it.
    - The environment should look realistic, high-end, and cinematic.
    - Lighting must be dramatic and premium.
    - The final output must look like a real magazine or billboard ad.
    - High resolution, commercial quality.
    - Aspect ratio: 3:4 (vertical poster format).
  `;

  const parts: any[] = [];

  // Add product images
  if (productImages && productImages.length > 0) {
    for (const base64 of productImages) {
      const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '');
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg',
        }
      });
    }
  }

  // Add brand logo if available
  if (brandLogo) {
    const base64Data = brandLogo.replace(/^data:image\/[a-z]+;base64,/, '');
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: 'image/png',
      }
    });
  }

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'models/gemini-2.0-flash',
    contents: [{
      role: 'user',
      parts: parts,
    }],
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  } as any);

  if (!response.candidates || response.candidates.length === 0) {
    throw new Error('No candidates in API response');
  }

  const content = response.candidates[0].content;
  if (!content || !content.parts || content.parts.length === 0) {
    throw new Error('No content in API response');
  }

  const firstPart = content.parts[0];
  if ('inlineData' in firstPart && firstPart.inlineData) {
    const base64ImageBytes = firstPart.inlineData.data;
    if (!base64ImageBytes) {
      throw new Error('Image data is empty');
    }
    const mimeType = firstPart.inlineData.mimeType || 'image/jpeg';
    return `data:${mimeType};base64,${base64ImageBytes}`;
  }

  throw new Error('No image was generated by the API');
};

/**
 * Simple canvas-based poster generator as fallback
 */
const generateCanvasPoster = async (params: PosterGenerationParams): Promise<string> => {
  const {
      brandName,
      description,
      aspectRatio,
      contactPhone,
      website,
      address,
  } = params;

  const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
  const baseHeight = 800;
  const baseWidth = Math.round((baseHeight * widthRatio) / heightRatio);

  const svgPoster = `
    <svg width="${baseWidth}" height="${baseHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${baseWidth}" height="${baseHeight}" fill="url(#grad1)"/>
      <text x="${baseWidth / 2}" y="${baseHeight * 0.3}" font-size="64" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial">
        ${brandName}
      </text>
      <text x="${baseWidth / 2}" y="${baseHeight * 0.5}" font-size="32" text-anchor="middle" fill="#e0e0e0" font-family="Arial" word-spacing="10">
        ${description.substring(0, 60)}${description.length > 60 ? '...' : ''}
      </text>
      ${contactPhone ? `<text x="${baseWidth / 2}" y="${baseHeight * 0.85}" font-size="20" text-anchor="middle" fill="#b0b0b0" font-family="Arial">${contactPhone}</text>` : ''}
      ${website ? `<text x="${baseWidth / 2}" y="${baseHeight * 0.92}" font-size="18" text-anchor="middle" fill="#b0b0b0" font-family="Arial">${website}</text>` : ''}
    </svg>
  `;

  const svgBase64 = Buffer.from(svgPoster).toString('base64');
  return `data:image/svg+xml;base64,${svgBase64}`;
};

export const generatePoster = async (params: PosterGenerationParams): Promise<string> => {
  const {
      brandName,
      description,
      productImages,
      brandLogo,
      posterType,
      festivalName,
  } = params;

  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY environment variable not set");
  }

  try {
    console.log('Step 1: Analyzing brand strategy...');
    
    // Step 1: Analyze brand and get strategy
    const industry = posterType === 'Festival' && festivalName ? `Festival & Events (${festivalName})` : 'Professional Services';
    const strategy = await analyzeBrand(
      brandName,
      description,
      industry,
      'English'
    );

    console.log('Step 2: Creating poster with strategy...');
    
    // Step 2: Create poster image
    const productImagesBase64 = productImages && productImages.length > 0 
      ? productImages.map(img => typeof img === 'string' ? img : (img as any).base64)
      : [];

    const posterUrl = await createPosterImage(
      brandName,
      strategy,
      productImagesBase64,
      typeof brandLogo === 'string' ? brandLogo : (brandLogo as any)?.base64 || null
    );

    console.log('Poster generated successfully');
    return posterUrl;
    
  } catch (apiError) {
    console.error('API generation error:', apiError);
    console.warn('Falling back to canvas-based poster generator');
    
    try {
      return await generateCanvasPoster(params);
    } catch (fallbackError) {
      console.error('Canvas fallback also failed:', fallbackError);
      const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown API error';
      throw new Error(`AI API Error: ${errorMessage}`);
    }
  }
};