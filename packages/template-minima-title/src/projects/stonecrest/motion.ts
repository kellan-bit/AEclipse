/**
 * Motion Constants - v0.20
 *
 * Single source of truth for all animation timing.
 * Professional UI animation requires CONSISTENCY.
 *
 * v0.20: DEPTH SYSTEM - Cinematic depth & weight
 *   - ELEVATION: Shadows respond to element "height"
 *   - FOCUS: Selective blur guides attention
 *   - PARALLAX: Depth through differential motion
 *   - Philosophy: "Invisible enhancement" - feel depth, don't see technique
 *
 * v0.17: Added spring physics system
 *   - New `folder` profile for lid animation
 *   - createSpring() helper function
 *   - createStaggeredSpring() for multi-element animations
 *
 * Lesson 3: "Spring Physics is Non-Negotiable"
 * Lesson 7: "Professional Animation = Consistency Over Effects"
 * Lesson 8: "Transitions Are Everything"
 */

import { Easing, spring } from 'remotion';

/**
 * Easing curves - Use these EVERYWHERE for consistency
 */
export const EASE = {
  // Apple's standard easing - use for most movements
  default: Easing.bezier(0.25, 0.1, 0.25, 1),

  // For elements entering (appearing)
  enter: Easing.out(Easing.cubic),

  // For elements exiting (disappearing)
  exit: Easing.in(Easing.cubic),

  // For emphasis moments (subtle overshoot)
  emphasis: Easing.bezier(0.34, 1.3, 0.64, 1),
};

/**
 * Duration in frames (at 30fps)
 */
export const DURATION = {
  instant: 3,    // 0.1s - micro-interactions
  fast: 9,       // 0.3s - quick responses
  normal: 15,    // 0.5s - standard transitions
  slow: 24,      // 0.8s - deliberate movements
  dramatic: 36,  // 1.2s - major transitions
};

/**
 * Overlap between phases (frames)
 * Phases should crossfade, not cut
 */
export const OVERLAP = {
  small: 6,   // 0.2s
  medium: 12, // 0.4s
  large: 18,  // 0.6s
};

/**
 * Spring configurations for Remotion's spring()
 * v0.17: These are now USED (previously defined but unused)
 * v0.17.1: Increased damping for smoother motion (less bounce)
 */
export const SPRING = {
  // Gentle settle (photos landing in grid, website reveal)
  // High damping = smooth arrival, minimal overshoot
  gentle: {
    damping: 28,
    stiffness: 100,
    mass: 1,
  },
  // Responsive (UI elements, search bar)
  // Medium-high damping = snappy but controlled
  responsive: {
    damping: 30,
    stiffness: 180,
    mass: 0.8,
  },
  // Bouncy (photo burst) - still has energy but more controlled
  // Higher damping than before to avoid excessive oscillation
  bouncy: {
    damping: 22,
    stiffness: 140,
    mass: 1,
  },
  // Folder lid (mechanical hinge feel)
  // Smooth, deliberate movement
  folder: {
    damping: 26,
    stiffness: 100,
    mass: 1.2,
  },
};

/**
 * Opacity values for consistent transparency
 */
export const OPACITY = {
  hidden: 0,
  subtle: 0.3,
  medium: 0.6,
  visible: 1,
};

/**
 * Scale values for consistent sizing
 */
export const SCALE = {
  hidden: 0,
  small: 0.3,
  normal: 1,
  hover: 1.02,
  pressed: 0.98,
  emphasis: 1.05,
};

/**
 * v0.17: Spring helper functions
 * These wrap Remotion's spring() with our profiles
 */

/**
 * Create a spring animation with delay support
 * @param frame - Current frame (from useCurrentFrame or passed as prop)
 * @param fps - Frames per second (from useVideoConfig)
 * @param config - Spring config name ('gentle' | 'responsive' | 'bouncy' | 'folder')
 * @param delay - Delay in frames before animation starts (default: 0)
 * @returns Spring value from 0 to 1 (may overshoot based on config)
 */
export function createSpring(
  frame: number,
  fps: number,
  config: keyof typeof SPRING,
  delay: number = 0
): number {
  const delayedFrame = Math.max(0, frame - delay);
  return spring({
    frame: delayedFrame,
    fps,
    config: SPRING[config],
  });
}

/**
 * Create staggered spring for multi-element animations
 * @param frame - Current frame
 * @param fps - Frames per second
 * @param config - Spring config name
 * @param index - Element index in sequence
 * @param staggerDelay - Frames between each element (default: 2)
 * @param baseDelay - Initial delay before first element (default: 0)
 */
export function createStaggeredSpring(
  frame: number,
  fps: number,
  config: keyof typeof SPRING,
  index: number,
  staggerDelay: number = 2,
  baseDelay: number = 0
): number {
  const totalDelay = baseDelay + (index * staggerDelay);
  return createSpring(frame, fps, config, totalDelay);
}

/**
 * Map spring value (0-1+) to custom output range
 * Useful for converting existing interpolate() calls
 */
export function springTo(
  springValue: number,
  outputRange: [number, number]
): number {
  const [start, end] = outputRange;
  return start + (end - start) * springValue;
}

// ============================================
// DEPTH SYSTEM - v0.20
// Cinematic depth through elevation, focus, and parallax
// Philosophy: Invisible enhancement - viewers feel depth without noticing
// ============================================

/**
 * ELEVATION SYSTEM
 * Shadows respond to element "height" off the surface.
 * As elements "lift", shadows become longer, softer, and more diffused.
 */
export const ELEVATION = {
  resting: 0,      // On surface
  hover: 0.15,     // Slight lift on hover
  lifted: 0.4,     // During burst/motion
  floating: 0.7,   // Suspended animation
  highest: 1,      // Maximum elevation
};

/**
 * Get elevation-aware shadow
 * @param elevation - 0 (resting) to 1 (highest)
 * @returns CSS box-shadow string
 *
 * Mathematical model:
 * - Y-offset: increases (shadow moves down as element lifts)
 * - Blur: increases (shadow softens with distance)
 * - Opacity: DECREASES (counterintuitive but correct - shadow diffuses)
 */
export function getElevationShadow(elevation: number): string {
  // Y-offset: 2px (resting) to 12px (lifted)
  const yOffset = 2 + elevation * 10;

  // Blur: 8px (resting) to 40px (lifted)
  const blurRadius = 8 + elevation * 32;

  // Opacity: 0.18 (resting) to 0.12 (lifted)
  // Higher elements have more spread but less concentrated shadow
  const opacity = 0.18 - elevation * 0.06;

  return `0 ${yOffset}px ${blurRadius}px rgba(0,0,0,${opacity.toFixed(3)})`;
}

/**
 * FOCUS/DEPTH-OF-FIELD SYSTEM
 * Blur non-focal elements to guide viewer attention.
 * Max blur = 3px (anything over 4px looks artificial)
 */
export const DEPTH_LAYER = {
  background: 1.0,   // Furthest from camera
  midground: 0.5,    // Middle distance
  foreground: 0.0,   // Closest to camera
};

export const FOCUS = {
  narrow: 0.15,      // Only focal element sharp
  normal: 0.3,       // Moderate blur falloff
  wide: 0.5,         // Most things in focus
};

/**
 * Calculate focus blur based on element depth and focal plane
 * @param elementDepth - 0 (foreground) to 1 (background)
 * @param focalDepth - Depth of the focal plane (what's in focus)
 * @param aperture - How quickly blur falls off (smaller = shallower DOF)
 * @returns Blur amount in pixels (max 3px)
 */
export function getFocusBlur(
  elementDepth: number,
  focalDepth: number,
  aperture: number = FOCUS.normal
): number {
  const rawDistance = Math.abs(elementDepth - focalDepth);
  const focusDistance = Math.min(1, rawDistance / aperture);
  return focusDistance * 3; // Max 3px blur
}

/**
 * PARALLAX SYSTEM
 * Elements at different depths move at different rates.
 * Creates perceived depth through differential motion.
 */
export const PARALLAX = {
  subtle: 0.5,       // Barely perceptible (RECOMMENDED)
  normal: 1.0,       // Standard depth feel
  dramatic: 1.5,     // Noticeable (use sparingly)
};

/**
 * Get parallax multiplier for an element's motion
 * @param depth - 0 (closest, moves most) to 1 (furthest, moves least)
 * @param intensity - Parallax intensity (use PARALLAX.subtle for most cases)
 * @returns Multiplier for motion (e.g., 1.15 for foreground, 0.85 for background)
 *
 * At PARALLAX.subtle:
 * - depth 0 (foreground): factor = 1.075 (moves 7.5% more)
 * - depth 0.5 (mid): factor = 1.0 (baseline)
 * - depth 1 (background): factor = 0.925 (moves 7.5% less)
 */
export function getParallaxFactor(
  depth: number,
  intensity: number = PARALLAX.subtle
): number {
  const baseRange = 0.15 * intensity;
  return 1 + baseRange - (depth * baseRange * 2);
}

/**
 * Apply parallax to a motion delta
 * @param baseDelta - The base motion amount (e.g., x distance)
 * @param depth - Element depth (0 = closest, 1 = furthest)
 * @param intensity - Parallax intensity
 * @returns Adjusted delta with parallax applied
 */
export function applyParallax(
  baseDelta: number,
  depth: number,
  intensity: number = PARALLAX.subtle
): number {
  return baseDelta * getParallaxFactor(depth, intensity);
}
