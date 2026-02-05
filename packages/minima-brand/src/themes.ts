/**
 * Minima Brand Themes
 *
 * Pre-configured color themes for different video contexts.
 * All themes maintain Minima's quiet luxury aesthetic.
 */

import { colors } from './colors';

export type Theme = {
  name: string;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    border: string;
  };
  isDark: boolean;
};

/**
 * Dark Theme - Primary brand theme
 * Used for: Main marketing content, luxury presentations
 */
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: colors.black,
    surface: colors.darkGray,
    text: colors.white,
    textSecondary: colors.taupe,
    accent: colors.taupe,
    border: colors.darkGray,
  },
  isDark: true,
};

/**
 * Light Theme - Clean, airy feel
 * Used for: Interior showcases, lifestyle content
 */
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: colors.cream,
    surface: colors.white,
    text: colors.black,
    textSecondary: colors.darkGray,
    accent: colors.taupe,
    border: colors.lightGray,
  },
  isDark: false,
};

/**
 * Contrast Theme - High contrast
 * Used for: Bold statements, social media
 */
export const contrastTheme: Theme = {
  name: 'contrast',
  colors: {
    background: colors.black,
    surface: colors.white,
    text: colors.white,
    textSecondary: colors.lightGray,
    accent: colors.white,
    border: colors.white,
  },
  isDark: true,
};

/**
 * Warm Theme - Soft, inviting
 * Used for: Community content, warm messaging
 */
export const warmTheme: Theme = {
  name: 'warm',
  colors: {
    background: colors.lightGray,
    surface: colors.cream,
    text: colors.black,
    textSecondary: colors.darkGray,
    accent: colors.taupe,
    border: colors.taupe,
  },
  isDark: false,
};

// Default theme
export const defaultTheme = darkTheme;

// Theme map for easy access
export const themes = {
  dark: darkTheme,
  light: lightTheme,
  contrast: contrastTheme,
  warm: warmTheme,
} as const;

export type ThemeName = keyof typeof themes;

// Helper to get theme by name
export const getTheme = (name: ThemeName): Theme => themes[name];
