/**
 * Motion System - v0.26
 *
 * Unified motion infrastructure for fluid animations.
 *
 * This module provides:
 * - Curves: Comprehensive easing library
 * - Core: MotionValue class and transition system
 * - Hooks: React hooks for declarative animation
 *
 * Philosophy: Fluidity = seamlessness, not effects
 *
 * BACKWARD COMPATIBILITY:
 * This module re-exports everything from the legacy motion.ts
 * to ensure existing components continue to work.
 */

// ============================================
// NEW INFRASTRUCTURE (v0.26+)
// ============================================

// Curves - comprehensive easing library
export {
  bezier,
  CURVES,
  getCurve,
  reverseCurve,
  mirrorCurve,
  chainCurves,
  type CurveFunction,
  type CurveName,
} from './curves';

// Core - motion primitives
export {
  // Transition types
  type SpringTransition,
  type TweenTransition,
  type PhysicsTransition,
  type Transition,

  // Presets
  SPRING_PRESETS,
  DURATION,
  type SpringPreset,

  // Transition factories
  springTransition,
  tweenTransition,
  physicsTransition,

  // MotionValue class
  MotionValue,
  motionSpring,
  motionTween,

  // Multi-value utilities
  type MotionState,
  createMotionState,
  getMotionStateValues,

  // Stagger utilities
  staggerDelays,
  staggerFromCenter,
  staggerToCenter,
} from './core';

// Hooks - React integration
export {
  // Core hooks
  useMotion,
  useSpring,
  useTween,

  // Multi-value hooks
  useSpringMulti,
  useTweenMulti,

  // Staggered hooks
  useStaggeredSpring,
  useStaggeredFromCenter,

  // Phase hooks
  usePhaseProgress,
  useInPhase,
  useAfterPhase,

  // Effect hooks
  useBreathe,
  useFloat,
  usePulse,
  useBlurCurve,

  // Utility hooks
  useAnimationComplete,
  useDelayed,
  useConditionalSpring,
} from './hooks';

// ============================================
// BACKWARD COMPATIBILITY (Legacy motion.ts)
// Re-exports for existing components
// ============================================

// Legacy easing constants
export { EASE } from '../motion';

// Legacy spring system (still useful)
export {
  SPRING,
  createSpring,
  createStaggeredSpring,
  springTo,
} from '../motion';

// Legacy constants
export { OVERLAP, OPACITY, SCALE } from '../motion';

// Legacy depth system
export {
  ELEVATION,
  getElevationShadow,
  DEPTH_LAYER,
  FOCUS,
  getFocusBlur,
  PARALLAX,
  getParallaxFactor,
  applyParallax,
} from '../motion';
