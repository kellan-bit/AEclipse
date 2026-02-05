/**
 * Useful Animation Patterns from Opus Promo Experiment
 *
 * These patterns worked well and should be reused in future projects.
 */

import { interpolate, Easing, useCurrentFrame } from 'remotion';

// ============================================
// TEXT ANIMATIONS
// ============================================

/**
 * Word-by-word text reveal (typewriter effect)
 * Good for: Tweet text, quotes, descriptions
 */
export function getVisibleWords(
  text: string,
  frame: number,
  startFrame: number,
  framesPerWord: number = 3
): string {
  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return '';

  const words = text.split(' ');
  const wordsToShow = Math.min(
    Math.floor(relativeFrame / framesPerWord) + 1,
    words.length
  );
  return words.slice(0, wordsToShow).join(' ');
}

/**
 * Character-by-character reveal
 * Good for: Headlines, titles
 */
export function getVisibleChars(
  text: string,
  frame: number,
  startFrame: number,
  framesPerChar: number = 1
): string {
  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return '';

  const charsToShow = Math.min(
    Math.floor(relativeFrame / framesPerChar) + 1,
    text.length
  );
  return text.slice(0, charsToShow);
}

// ============================================
// TRANSITION PATTERNS
// ============================================

/**
 * Rectangular reveal from center
 * Good for: Scene transitions, dramatic reveals
 */
export function getRectangularClipPath(
  frame: number,
  startFrame: number,
  durationFrames: number = 10
): string {
  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return 'inset(50% 50%)';
  if (relativeFrame >= durationFrames) return 'inset(0% 0%)';

  const progress = interpolate(
    relativeFrame,
    [0, durationFrames],
    [0, 1],
    { easing: Easing.out(Easing.ease) }
  );

  const inset = (1 - progress) * 50;
  return `inset(${inset}% ${inset}%)`;
}

/**
 * Instant cut (no transition)
 * Good for: Quote carousels, rapid montages
 */
export function getInstantCutIndex(
  frame: number,
  framesPerItem: number,
  totalItems: number
): number {
  return Math.min(
    Math.floor(frame / framesPerItem),
    totalItems - 1
  );
}

// ============================================
// MOTION PATTERNS
// ============================================

/**
 * Ken Burns zoom effect
 * Good for: Static images, backgrounds
 */
export function getKenBurnsScale(
  frame: number,
  durationFrames: number,
  zoomAmount: number = 0.05,
  direction: 'in' | 'out' = 'in'
): number {
  const startScale = direction === 'in' ? 1 : 1 + zoomAmount;
  const endScale = direction === 'in' ? 1 + zoomAmount : 1;

  return interpolate(
    frame,
    [0, durationFrames],
    [startScale, endScale],
    { extrapolateRight: 'clamp' }
  );
}

/**
 * Fade in with optional slide
 * Good for: Cards appearing, elements entering
 */
export function getFadeSlideIn(
  frame: number,
  startFrame: number,
  fadeDuration: number = 10,
  slideDistance: number = 20
): { opacity: number; translateY: number } {
  const relativeFrame = frame - startFrame;

  const opacity = interpolate(
    relativeFrame,
    [0, fadeDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const translateY = interpolate(
    relativeFrame,
    [0, fadeDuration],
    [slideDistance, 0],
    {
      easing: Easing.out(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return { opacity, translateY };
}

/**
 * Scale bounce in
 * Good for: Emphasis, attention-grabbing elements
 */
export function getScaleBounceIn(
  frame: number,
  startFrame: number,
  duration: number = 15
): number {
  const relativeFrame = frame - startFrame;

  return interpolate(
    relativeFrame,
    [0, duration],
    [0.5, 1],
    {
      easing: Easing.out(Easing.back(1.5)),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
}

/**
 * Floating/breathing motion
 * Good for: Ambient movement, keeping scenes alive
 */
export function getFloatingOffset(
  frame: number,
  amplitude: number = 5,
  speed: number = 0.05
): number {
  return Math.sin(frame * speed) * amplitude;
}

// ============================================
// STAGGER PATTERNS
// ============================================

/**
 * Calculate staggered delay for multiple items
 * Good for: Lists, grids, multiple elements entering
 */
export function getStaggeredDelay(
  index: number,
  baseDelay: number = 0,
  staggerAmount: number = 5
): number {
  return baseDelay + index * staggerAmount;
}

/**
 * Check if an item should be visible with stagger
 */
export function isStaggeredItemVisible(
  frame: number,
  index: number,
  baseDelay: number = 0,
  staggerAmount: number = 5
): boolean {
  return frame >= getStaggeredDelay(index, baseDelay, staggerAmount);
}

// ============================================
// TIMING CONSTANTS (from analysis)
// ============================================

export const TIMING = {
  // Fast - snappy interactions
  CARD_FADE_IN: 3, // frames

  // Medium - readable but dynamic
  WORD_REVEAL: 3, // frames per word
  TRANSITION: 10, // frames for scene transition

  // Slow - ambient motion
  KEN_BURNS_ZOOM: 0.05, // 5% zoom over scene duration

  // Quote carousel
  QUOTE_DURATION: 30, // frames per quote (instant cut)
};
