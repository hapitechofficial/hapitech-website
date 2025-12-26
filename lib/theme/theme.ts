import { colors } from '@/styles/tokens/colors';

export const theme = {
  colors,
} as const;

export type Theme = typeof theme;