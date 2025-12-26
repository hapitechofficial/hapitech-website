import type { SizeOption } from '@/types/poster';

export const SIZE_OPTIONS: SizeOption[] = [
  {
    id: 'instagram-post',
    title: 'Instagram Post',
    dimensions: '1080 × 1080 px',
    aspectRatio: '1:1',
    iconType: 'square',
    description: 'Perfect square for feed posts.'
  },
  {
    id: 'instagram-story',
    title: 'Instagram Story',
    dimensions: '1080 × 1920 px',
    aspectRatio: '9:16',
    iconType: 'tall',
    description: 'Full screen vertical for stories & reels.'
  },
  {
    id: 'poster-portrait',
    title: 'Poster (Portrait)',
    dimensions: '18 × 24 in',
    aspectRatio: '3:4',
    iconType: 'portrait',
    description: 'Classic vertical print format.'
  },
  {
    id: 'youtube-thumbnail',
    title: 'YouTube Thumbnail',
    dimensions: '1280 × 720 px',
    aspectRatio: '16:9',
    iconType: 'wide',
    description: 'Standard widescreen video cover.'
  },
  {
    id: 'facebook-poster',
    title: 'Facebook Poster',
    dimensions: '1200 × 1500 px',
    aspectRatio: '3:4', // 4:5 mapped to closest supported 3:4
    iconType: 'portrait',
    description: 'Optimized vertical feed visibility.'
  },
  {
    id: 'phone-wallpaper',
    title: 'Phone Wallpaper',
    dimensions: '1080 × 1920 px',
    aspectRatio: '9:16',
    iconType: 'tall',
    description: 'Lock screen & background designs.'
  },
  {
    id: 'book-cover',
    title: 'Book Cover',
    dimensions: '6 × 9 in',
    aspectRatio: '3:4',
    iconType: 'portrait',
    description: 'Standard trade paperback ratio.'
  },
  {
    id: 'magazine-cover',
    title: 'Magazine Cover',
    dimensions: '8.5 × 11 in',
    aspectRatio: '3:4',
    iconType: 'portrait',
    description: 'Professional editorial layout.'
  },
  {
    id: 'instagram-ad',
    title: 'Instagram Ad (4:5)',
    dimensions: '1080 × 1350 px',
    aspectRatio: '3:4', // Closest API support for 4:5
    iconType: 'portrait',
    description: 'Maximize screen real estate in feeds.'
  },
  {
    id: 'linkedin-post',
    title: 'LinkedIn Post',
    dimensions: '1200 × 1200 px',
    aspectRatio: '1:1',
    iconType: 'square',
    description: 'Professional square update format.'
  }
];