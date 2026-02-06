/**
 * Motion Constants - v0.17
 *
 * Single source of truth for all animation timing.
 * Professional UI animation requires CONSISTENCY.
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
 */
export const SPRING = {
  // Gentle settle (photos landing in grid, website reveal)
  gentle: {
    damping: 15,
    stiffness: 100,
    mass: 1,
  },
  // Responsive (UI elements, search bar)
  responsive: {
    damping: 20,
    stiffness: 200,
    mass: 0.8,
  },
  // Bouncy (photo burst, emphasis moments)
  bouncy: {
    damping: 10,
    stiffness: 150,
    mass: 1,
  },
  // v0.17: Folder lid (mechanical hinge feel)
  folder: {
    damping: 18,
    stiffness: 120,
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
