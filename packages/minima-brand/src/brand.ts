/**
 * Minima Brand Configuration
 *
 * Complete brand identity for Minima - luxury home design & development.
 *
 * "Minimal homes crafted with intention, precision, and presence."
 */

import { colors } from './colors';
import { fonts, fontSizes, fontWeights, textStyles } from './typography';
import { themes, defaultTheme, type Theme } from './themes';
import { durations, easings, springs, animations } from './animations';

/**
 * Brand Information
 */
export const brand = {
  name: 'Minima',
  tagline: 'DESIGN • BUILD • DEVELOP',
  company: 'Minimal Living Concepts',
  website: 'minimalivingconcepts.com',

  // Key messages (use in videos)
  messages: {
    primary: 'Minimal homes crafted with intention, precision, and presence.',
    secondary: 'Where design meets discipline, and every detail earns its place.',
    luxury: 'Intentional architecture. Quiet luxury. Nothing extra.',
    refined: 'Your space. Refined.',
    elegant: 'Elegant homes with nothing extra—only what matters most.',
    artful: 'The art of simple living.',
    curated: "From slab to skyline, every inch is purposeful. Our homes aren't just built—they're curated.",
  },

  // Co-founders
  founders: ['Zander Diamont', 'Jared Amzallag'],

  // Location
  location: 'Scottsdale, Arizona',
} as const;

/**
 * Logo Specifications
 */
export const logo = {
  // Brand mark - the "M"
  mark: {
    name: 'M',
    minSize: 24,           // Minimum size in pixels
    clearSpace: 24,        // Minimum clear space around logo
  },

  // Wordmark - "MINIMA"
  wordmark: {
    text: 'MINIMA',
    trademark: '™',
    letterSpacing: 0.15,   // em units
    style: textStyles.wordmark,
  },

  // With tagline
  withTagline: {
    text: 'MINIMA',
    tagline: 'DESIGN • BUILD • DEVELOP',
  },
} as const;

/**
 * Video Specifications
 */
export const videoSpecs = {
  // Standard formats
  formats: {
    landscape: { width: 1920, height: 1080, name: '16:9 Landscape' },
    portrait: { width: 1080, height: 1920, name: '9:16 Portrait (TikTok/Reels)' },
    square: { width: 1080, height: 1080, name: '1:1 Square (Instagram)' },
    cinematic: { width: 1920, height: 800, name: '2.4:1 Cinematic' },
  },

  // Frame rates
  fps: {
    standard: 30,
    cinematic: 24,
    smooth: 60,
  },

  // Default video config
  default: {
    width: 1920,
    height: 1080,
    fps: 30,
  },
} as const;

/**
 * Complete Brand Export
 * Use this as the single import for all brand assets
 */
export const minimaBrand = {
  // Identity
  brand,
  logo,

  // Visual
  colors,
  fonts,
  fontSizes,
  fontWeights,
  textStyles,

  // Themes
  themes,
  defaultTheme,

  // Motion
  durations,
  easings,
  springs,
  animations,

  // Video
  videoSpecs,
} as const;

// Type exports
export type { Theme };
export type MinimaBrand = typeof minimaBrand;
