import { GoogleGenAI, Modality } from '@google/genai';
import type { PosterGenerationParams, PosterType } from '@/types/poster';

const buildSystemPrompt = (
    brandName: string,
    description: string,
    productUrl: string | undefined,
    imageCount: number,
    hasLogo: boolean,
    posterType: PosterType,
    festivalName: string | undefined,
    contactPhone: string | undefined,
    website: string | undefined,
    address: string | undefined,
    isEditing: boolean,
    aspectRatio: string
): string => {

    const sourceContext = productUrl
        ? `A product URL was provided: ${productUrl}. Use this to infer context about the product style if needed.`
        : "";

    const imageInstruction = imageCount > 0
        ? `Use the ${imageCount} provided product image(s) as the central focus. Arrange them in a clean, professional grid or hero composition.`
        : `NO product images were uploaded. You MUST generate a high-quality, photorealistic representation of the product based on the description: "${description}" and the brand name "${brandName}".`;

    const logoInstruction = hasLogo
        ? `Seamlessly integrate the provided brand logo.`
        : `Create a professional typographic treatment for the brand name "${brandName}".`;

    const themeInstruction = posterType === 'Festival' && festivalName
        ? `This is a SPECIAL FESTIVAL THEMED POSTER for "${festivalName}".
           - Integrate specific colors, symbols, and lighting associated with ${festivalName}.
           - The mood should be celebratory and vibrant.`
        : `The style should be a modern, clean, and high-end professional commercial advertisement. Focus on minimalism and elegance.`;

    const contactInstruction = (contactPhone || website || address)
        ? `
    **Contact Details Placement:**
    You MUST include the following contact information, placed professionally (e.g., in a footer, bottom strip, or corner) so it is clearly readable:
    ${contactPhone ? `- Phone: ${contactPhone}` : ''}
    ${website ? `- Website: ${website}` : ''}
    ${address ? `- Address: ${address}` : ''}
    ` : '';

    return `
You are a world-class advertising agency designer. ${isEditing ? 'Your task is to EDIT the provided poster image.' : 'Create a photorealistic, professional advertisement poster.'}
The final output must look like a real photograph and professional design.

**Technical Requirements:**
- **Aspect Ratio:** Generate the image with an aspect ratio of ${aspectRatio} (width:height).

**Input Details:**
- Brand Name: ${brandName}
- Description: ${description}
- ${sourceContext}
- Mode: ${posterType} ${festivalName ? `(${festivalName})` : ''}

**Instructions:**
1.  **LANGUAGE:** **IMPORTANT:** ALL generated text, taglines, slogans, and offers MUST BE IN ENGLISH ONLY. Do not use any other language.
2.  ${isEditing ? 'Keep the existing background, composition, and product placement of the input image EXACTLY as they are. ONLY modify the text overlays to match the new details provided.' : imageInstruction}
3.  ${isEditing ? 'Ensure the logo remains visible in its current position.' : logoInstruction}
4.  ${isEditing ? 'Maintain the current theme.' : themeInstruction}
5.  Create a catchy short **ENGLISH** tagline based on the description${posterType === 'Festival' ? ` and the theme "${festivalName}"` : ''}. Place it elegantly.
6.  ${contactInstruction}
7.  **Crucially, avoid any over-saturated, artificial, or "uncanny valley" AI look. The goal is premium realism.**
`;
};

export const generatePoster = async (params: PosterGenerationParams): Promise<string> => {
  const {
      brandName,
      description,
      productImages,
      productUrl,
      brandLogo,
      aspectRatio,
      posterType,
      festivalName,
      contactPhone,
      website,
      address,
      baseImage
  } = params;

  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
  const isEditing = !!baseImage;

  const textPrompt = buildSystemPrompt(
      brandName,
      description,
      productUrl,
      productImages.length,
      !!brandLogo,
      posterType,
      festivalName,
      contactPhone,
      website,
      address,
      isEditing,
      aspectRatio
  );

  const parts: any[] = [];

  // If editing, input the base image first
  if (baseImage) {
      const base64Data = baseImage.split(',')[1]; // Remove data:image/png;base64,
      const mimeType = baseImage.substring(baseImage.indexOf(':') + 1, baseImage.indexOf(';'));

      parts.push({
          inlineData: {
              data: base64Data,
              mimeType: mimeType,
          }
      });
  }

  parts.push({ text: textPrompt });

  // Only add product images/logo if we are NOT editing (creating from scratch)
  // If we are editing, the model sees them in the baseImage.
  if (!isEditing) {
      for (const base64 of productImages) {
        const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '');
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg', // Assume jpeg
          },
        });
      }

      if (brandLogo) {
        const base64Data = brandLogo.replace(/^data:image\/[a-z]+;base64,/, '');
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: 'image/png', // Assume png
          },
        });
      }
  }

  try {
    console.log('Calling Google AI API with model gemini-2.0-flash');
    const response = await ai.models.generateContent({
      model: 'models/gemini-2.0-flash',
      contents: [{
        role: 'user',
        parts: parts,
      }],
      generationConfig: {
        responseModalities: ['image'],
      },
    });
    console.log('AI API response received');

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('No response from API');
    }

    const content = response.candidates[0].content;
    if (!content || !content.parts || content.parts.length === 0) {
      throw new Error('No content in API response');
    }

    const firstPart = content.parts[0];
    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
      const base64ImageBytes = firstPart.inlineData.data;
      const mimeType = firstPart.inlineData.mimeType || 'image/jpeg';
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }

    throw new Error('No image was generated by the API.');
  } catch (apiError) {
    console.error('Google AI API Error:', apiError);
    const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown API error';
    throw new Error(`AI API Error: ${errorMessage}`);
  }
};