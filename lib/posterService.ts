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

  try {
    console.log('Calling Google AI API with model gemini-3-pro-image');
    
    // Use gemini-3-pro-image model with generate_images for image generation
    const response = await ai.models.generateImages({
      model: 'models/gemini-3-pro-image',
      prompt: textPrompt,
    });
    console.log('AI API response received');

    // SAFETY CHECK: Check if response was blocked by safety filters
    if (response.finishReason === 'SAFETY') {
      console.error('Poster generation blocked by safety filters');
      throw new Error('Prompt blocked by safety filters. Please try with different content.');
    }

    // SAFE VALIDATION: Check if response exists
    if (!response) {
      throw new Error('Empty response from API');
    }

    // SAFE VALIDATION: Check if images exist in the response
    if (!response.images || response.images.length === 0) {
      console.error('No images generated by the API');
      throw new Error('No image was generated by the API');
    }

    const generatedImage = response.images[0];
    
    // SAFE VALIDATION: Ensure image data exists
    if (!generatedImage || !generatedImage.data) {
      throw new Error('Generated image data is empty');
    }

    // Return the base64 image data with proper data URI format
    const mimeType = 'image/jpeg';
    return `data:${mimeType};base64,${generatedImage.data}`;
  } catch (apiError) {
    console.error('Google AI API Error:', apiError);
    const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown API error';
    throw new Error(`AI API Error: ${errorMessage}`);
  }
};