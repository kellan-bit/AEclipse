/**
 * Minima Brand Animations
 *
 * Motion design that reflects the brand's refined, intentional aesthetic.
 * Animations should feel: deliberate, smooth, understated, elegant.
 *
 * "Where design meets discipline, and every detail earns its place."
 */

import { Easing } from 'remotion';

/**
 * Brand Animation Principles:
 * 1. Never rushed - movements are deliberate and confident
 * 2. Subtle over dramatic - quiet elegance, not flashy
 * 3. Purposeful - every animation serves a function
 * 4. Consistent rhythm - maintain visual harmony
 */

// Duration presets (in frames at 30fps)
export const durations = {
  instant: 6,      // 0.2s - Micro interactions
  fast: 12,        // 0.4s - Quick transitions
  normal: 18,      // 0.6s - Standard animations
  slow: 30,        // 1.0s - Emphasized reveals
  elegant: 45,     // 1.5s - Luxurious, deliberate movements
  dramatic: 60,    // 2.0s - Hero moments
} as const;

// Convert frames to seconds (for reference)
export const toSeconds = (frames: number, fps = 30) => frames / fps;

// Easing functions - refined, smooth curves
export const easings = {
  // Standard easing - smooth and professional
  default: Easing.bezier(0.4, 0, 0.2, 1),

  // Elegant entrance - slow start, confident finish
  elegantIn: Easing.bezier(0.6, 0, 0.4, 1),

  // Smooth exit - graceful departure
  elegantOut: Easing.bezier(0.4, 0, 0.6, 1),

  // Refined ease in-out - balanced, sophisticated
  refined: Easing.bezier(0.45, 0, 0.15, 1),

  // Subtle spring-like feel without bounce
  gentle: Easing.bezier(0.34, 1.2, 0.64, 1),

  // Linear for specific uses (opacity, progress)
  linear: Easing.linear,
} as const;

// Spring configurations (for spring() function)
export const springs = {
  // Gentle, refined movement
  gentle: {
    mass: 1,
    damping: 20,
    stiffness: 100,
  },

  // Smooth, no overshoot
  smooth: {
    mass: 1,
    damping: 28,
    stiffness: 170,
  },

  // Subtle response
  subtle: {
    mass: 1,
    damping: 30,
    stiffness: 200,
  },

  // Elegant slow movement
  elegant: {
    mass: 1.5,
    damping: 25,
    stiffness: 80,
  },
} as const;

// Pre-built animation configs
export const animations = {
  // Fade in - simple opacity
  fadeIn: {
    property: 'opacity' as const,
    from: 0,
    to: 1,
    duration: durations.normal,
    easing: easings.default,
  },

  // Fade out
  fadeOut: {
    property: 'opacity' as const,
    from: 1,
    to: 0,
    duration: durations.normal,
    easing: easings.default,
  },

  // Slide up reveal (elegant entrance)
  slideUpReveal: {
    property: 'translateY' as const,
    from: 40,
    to: 0,
    duration: durations.slow,
    easing: easings.elegantIn,
  },

  // Slide down exit
  slideDownExit: {
    property: 'translateY' as const,
    from: 0,
    to: 40,
    duration: durations.normal,
    easing: easings.elegantOut,
  },

  // Scale reveal (subtle grow)
  scaleReveal: {
    property: 'scale' as const,
    from: 0.95,
    to: 1,
    duration: durations.slow,
    easing: easings.refined,
  },

  // Mask reveal (for text/images)
  maskReveal: {
    property: 'clipPath' as const,
    from: 'inset(0 100% 0 0)',
    to: 'inset(0 0% 0 0)',
    duration: durations.elegant,
    easing: easings.refined,
  },
} as const;

// Stagger delay calculator
export const getStaggerDelay = (
  index: number,
  baseDelay: number = 4 // frames
) => index * baseDelay;

// Scene timing helpers
export const sceneTiming = {
  // Standard scene structure
  intro: {
    start: 0,
    duration: durations.elegant,
  },

  // Pause between elements
  breathingRoom: durations.fast,

  // Time before scene exit
  holdBeforeExit: durations.normal,
} as const;
