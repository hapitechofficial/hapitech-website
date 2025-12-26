export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export type PosterType = 'Professional' | 'Festival';

export interface SizeOption {
  id: string;
  title: string;
  dimensions: string;
  aspectRatio: AspectRatio;
  iconType: 'square' | 'portrait' | 'landscape' | 'tall' | 'wide';
  description: string;
}

export interface PosterGenerationParams {
    brandName: string;
    description: string;
    productImages: string[]; // base64 strings
    productUrl?: string;
    brandLogo?: string | null; // base64 string
    aspectRatio: AspectRatio;
    posterType: PosterType;
    festivalName?: string;
    contactPhone?: string;
    website?: string;
    address?: string;
    baseImage?: string; // base64 string for editing existing poster
}