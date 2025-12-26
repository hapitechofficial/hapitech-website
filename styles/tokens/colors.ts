export const colors = {
  primary: {
    orange: '#FF6B35',
    magenta: '#9B1C31',
    teal: '#008080',
  },
  neutral: {
    beige: '#F5F5DC',
    charcoal: '#36454F',
  },
} as const;

export type Colors = typeof colors;