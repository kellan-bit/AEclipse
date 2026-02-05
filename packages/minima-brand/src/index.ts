/**
 * @minima/brand
 *
 * Global brand configuration for Minima video content.
 *
 * Usage:
 * ```tsx
 * import { colors, fonts, themes, animations } from '@minima/brand';
 * import { minimaBrand } from '@minima/brand';
 * ```
 */

// Colors
export { colors } from './colors';
export type { ColorKey, TextColorKey, BackgroundColorKey } from './colors';

// Typography
export {
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  textStyles,
} from './typography';

// Themes
export {
  themes,
  darkTheme,
  lightTheme,
  contrastTheme,
  warmTheme,
  defaultTheme,
  getTheme,
} from './themes';
export type { Theme, ThemeName } from './themes';

// Animations
export {
  durations,
  easings,
  springs,
  animations,
  getStaggerDelay,
  sceneTiming,
  toSeconds,
} from './animations';

// Brand configuration
export { brand, logo, videoSpecs, minimaBrand } from './brand';
export type { MinimaBrand } from './brand';

// Default export - complete brand
export { minimaBrand as default } from './brand';
