/**
 * Minima Brand Colors
 *
 * A refined palette reflecting quiet luxury and intentional design.
 * Use these colors consistently across all Minima video content.
 */

export const colors = {
  // Primary Colors
  black: '#141414',           // Primary text, dark backgrounds
  white: '#FFFFFF',           // Clean backgrounds, light text

  // Neutral Grays
  darkGray: '#4C4C4C',        // Secondary text, subtle elements
  lightGray: '#E3DEDA',       // Subtle backgrounds, borders
  cream: '#F4F2F0',           // Light backgrounds, cards

  // Warm Accents
  taupe: '#C7BEB4',           // Warm accent, elegant highlights

  // Semantic Colors
  text: {
    primary: '#141414',       // Main text on light backgrounds
    secondary: '#4C4C4C',     // Supporting text
    inverse: '#FFFFFF',       // Text on dark backgrounds
    muted: '#C7BEB4',         // Subtle text, captions
  },

  background: {
    dark: '#141414',          // Dark mode background
    light: '#F4F2F0',         // Light mode background
    white: '#FFFFFF',         // Pure white sections
    subtle: '#E3DEDA',        // Subtle contrast
  },

  accent: {
    warm: '#C7BEB4',          // Warm taupe accent
    cool: '#4C4C4C',          // Cool gray accent
  },

  border: {
    light: '#E3DEDA',         // Borders on light backgrounds
    dark: '#4C4C4C',          // Borders on dark backgrounds
  },
} as const;

// Type for accessing colors
export type ColorKey = keyof typeof colors;
export type TextColorKey = keyof typeof colors.text;
export type BackgroundColorKey = keyof typeof colors.background;
