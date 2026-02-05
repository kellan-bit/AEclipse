/**
 * Minima Brand Typography
 *
 * Primary: Neue Haas Unica - Refined geometry, balanced and modern
 * Accent: Honest - Softened edges, generous curves for emphasis
 *
 * "Minima's brand voice lives in the refined geometry of Neue Haas Unica.
 * Balanced and modern, it blends the functional clarity of a grotesk
 * with subtle human warmth—making it both precise and approachable."
 */

export const fonts = {
  // Font Families
  primary: 'Neue Haas Unica, Helvetica Neue, Arial, sans-serif',
  accent: 'Honest, Georgia, serif',
  fallback: 'Arial, Helvetica, sans-serif',

  // For Remotion - use these with @remotion/google-fonts or local fonts
  families: {
    neueHaasUnica: {
      name: 'Neue Haas Unica',
      weights: [300, 400, 500, 600, 700],
      fallback: 'Helvetica Neue, Arial, sans-serif',
    },
    honest: {
      name: 'Honest',
      weights: [400, 500, 600],
      style: ['normal', 'italic'],
      fallback: 'Georgia, serif',
    },
    gilroy: {
      name: 'Gilroy',
      weights: [400, 500, 600, 700],
      fallback: 'Arial, sans-serif',
    },
  },
} as const;

export const fontSizes = {
  // Display sizes (for headlines, hero text)
  display: {
    xl: 96,    // Hero headlines
    lg: 72,    // Major headlines
    md: 56,    // Section headlines
    sm: 42,    // Sub-headlines
  },

  // Heading sizes
  heading: {
    h1: 48,
    h2: 36,
    h3: 28,
    h4: 24,
    h5: 20,
    h6: 18,
  },

  // Body sizes
  body: {
    xl: 20,
    lg: 18,
    md: 16,    // Default body
    sm: 14,
    xs: 12,
  },

  // Caption/label sizes
  caption: {
    lg: 14,
    md: 12,
    sm: 10,
  },
} as const;

export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeights = {
  tight: 1.1,      // Headlines
  snug: 1.25,      // Sub-headlines
  normal: 1.5,     // Body copy
  relaxed: 1.75,   // Long-form text
} as const;

export const letterSpacing = {
  tight: -0.02,    // Headlines (em)
  normal: 0,       // Body
  wide: 0.05,      // All-caps, labels
  extraWide: 0.15, // MINIMA wordmark style
} as const;

// Pre-configured text styles
export const textStyles = {
  // Hero/Display
  heroTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.display.xl,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },

  // Section headline
  sectionTitle: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.display.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },

  // Accent/emphasis text (uses Honest font)
  accent: {
    fontFamily: fonts.accent,
    fontSize: fontSizes.heading.h3,
    fontWeight: fontWeights.regular,
    fontStyle: 'italic' as const,
    lineHeight: lineHeights.snug,
  },

  // Body copy
  body: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.body.md,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
  },

  // Caption/label
  caption: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.caption.md,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase' as const,
  },

  // Wordmark style (MINIMA)
  wordmark: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.heading.h4,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.extraWide,
    textTransform: 'uppercase' as const,
  },
} as const;
