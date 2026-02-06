/**
 * Motion Constants - v0.14
 *
 * Single source of truth for all animation timing.
 * Professional UI animation requires CONSISTENCY.
 *
 * Lesson 7: "Professional Animation = Consistency Over Effects"
 * Lesson 8: "Transitions Are Everything"
 */

import { Easing } from 'remotion';

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
 */
export const SPRING = {
  // Gentle settle (photos landing in grid)
  gentle: {
    damping: 15,
    stiffness: 100,
    mass: 1,
  },
  // Responsive (UI elements)
  responsive: {
    damping: 20,
    stiffness: 200,
    mass: 0.8,
  },
  // Bouncy (emphasis moments)
  bouncy: {
    damping: 10,
    stiffness: 150,
    mass: 1,
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
