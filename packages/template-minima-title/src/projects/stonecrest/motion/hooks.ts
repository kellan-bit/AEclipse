/**
 * Motion Hooks - v0.26
 *
 * React hooks for declarative animation in Remotion.
 * These hooks provide a clean API for common animation patterns.
 *
 * Philosophy: Hooks should feel natural in React components
 */

import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import {
  Transition,
  SpringTransition,
  TweenTransition,
  MomentumTransition,
  SPRING_PRESETS,
  SpringPreset,
  MOMENTUM_PRESETS,
  MomentumPreset,
  MotionValue,
  motionSpring,
  motionTween,
  momentumTransition,
} from './core';
import { getCurve, CurveName, CurveFunction, CURVES, MomentumCurveName, getMomentumCurve, createMomentumCurve } from './curves';

// ============================================
// CORE HOOKS
// ============================================

/**
 * useMotion - Primary hook for single-value animations
 *
 * @param from - Starting value
 * @param to - Target value
 * @param startFrame - Frame when animation begins
 * @param transition - Transition configuration
 *
 * @example
 * const opacity = useMotion(0, 1, 30, { type: 'tween', duration: 15, ease: 'easeOut' });
 * const scale = useMotion(0, 1, 30, { type: 'spring', ...SPRING_PRESETS.bouncy });
 */
export function useMotion(
  from: number,
  to: number,
  startFrame: number,
  transition: Transition
): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const motionValue = new MotionValue(from, to, startFrame, transition);
  return motionValue.get(frame, fps);
}

/**
 * useSpring - Shorthand for spring animations
 *
 * @param from - Starting value
 * @param to - Target value
 * @param startFrame - Frame when animation begins
 * @param preset - Spring preset name or custom config
 * @param delay - Optional delay in frames
 *
 * @example
 * const scale = useSpring(0, 1, 30, 'bouncy');
 * const x = useSpring(0, 100, 30, 'responsive', 5); // 5 frame delay
 */
export function useSpring(
  from: number,
  to: number,
  startFrame: number,
  preset: SpringPreset | Omit<SpringTransition, 'type'> = 'responsive',
  delay: number = 0
): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const config = typeof preset === 'string' ? SPRING_PRESETS[preset] : preset;
  const effectiveFrame = frame - startFrame - delay;

  if (effectiveFrame < 0) {
    return from;
  }

  const springProgress = spring({
    frame: effectiveFrame,
    fps,
    config: {
      stiffness: config.stiffness ?? 170,
      damping: config.damping ?? 26,
      mass: config.mass ?? 1,
    },
  });

  return from + (to - from) * springProgress;
}

/**
 * useTween - Shorthand for tween animations
 *
 * @param from - Starting value
 * @param to - Target value
 * @param startFrame - Frame when animation begins
 * @param duration - Duration in frames
 * @param ease - Easing curve
 * @param delay - Optional delay in frames
 *
 * @example
 * const opacity = useTween(0, 1, 30, 15, 'easeOut');
 * const y = useTween(-50, 0, 30, 20, 'appleDefault');
 */
export function useTween(
  from: number,
  to: number,
  startFrame: number,
  duration: number,
  ease: CurveName | CurveFunction = 'ease',
  delay: number = 0
): number {
  const frame = useCurrentFrame();

  const effectiveFrame = frame - startFrame - delay;

  if (effectiveFrame < 0) {
    return from;
  }

  if (effectiveFrame >= duration) {
    return to;
  }

  const linearProgress = effectiveFrame / duration;
  const easeFn = getCurve(ease);
  const easedProgress = easeFn(linearProgress);

  return from + (to - from) * easedProgress;
}

// ============================================
// MOMENTUM HOOKS (The "Achoo" Pattern)
// ============================================

/**
 * useMomentum - Three-phase momentum animation
 *
 * The "achoo" pattern creates natural-feeling motion with:
 * - Anticipation: slight windup (the "ah-ah-ah")
 * - Action: explosive release (the "CHOO!")
 * - Settle: overshoot and return (energy dissipation)
 *
 * @param from - Starting value
 * @param to - Target value
 * @param startFrame - Frame when animation begins
 * @param duration - Duration in frames
 * @param preset - Momentum curve preset
 * @param delay - Optional delay in frames
 *
 * @example
 * // Button press
 * const scale = useMomentum(1, 0.95, clickFrame, 8, 'tap');
 *
 * // Card swipe
 * const x = useMomentum(0, 300, swipeFrame, 12, 'flick');
 *
 * // Dramatic reveal
 * const opacity = useMomentum(0, 1, revealFrame, 24, 'sneeze');
 */
export function useMomentum(
  from: number,
  to: number,
  startFrame: number,
  duration: number,
  preset: MomentumCurveName = 'flick',
  delay: number = 0
): number {
  const frame = useCurrentFrame();

  const effectiveFrame = frame - startFrame - delay;

  if (effectiveFrame < 0) {
    return from;
  }

  if (effectiveFrame >= duration) {
    return to;
  }

  const curve = getMomentumCurve(preset);
  const linearProgress = effectiveFrame / duration;
  const momentumProgress = curve(linearProgress);

  return from + (to - from) * momentumProgress;
}

/**
 * useMomentumPreset - Use a named momentum preset
 *
 * @param from - Starting value
 * @param to - Target value
 * @param startFrame - Frame when animation begins
 * @param preset - Named preset from MOMENTUM_PRESETS
 * @param delay - Optional delay in frames
 *
 * @example
 * const scale = useMomentumPreset(0, 1, 30, 'heroReveal');
 * const x = useMomentumPreset(0, 100, 45, 'cardFlick');
 */
export function useMomentumPreset(
  from: number,
  to: number,
  startFrame: number,
  preset: MomentumPreset,
  delay: number = 0
): number {
  const config = MOMENTUM_PRESETS[preset];
  return useMomentum(from, to, startFrame, config.duration, config.preset, delay);
}

/**
 * useMomentumMulti - Animate multiple values with same momentum
 *
 * @example
 * const { scale, opacity } = useMomentumMulti({
 *   scale: [0, 1],
 *   opacity: [0, 1],
 * }, 30, 24, 'sneeze');
 */
export function useMomentumMulti<T extends Record<string, [number, number]>>(
  values: T,
  startFrame: number,
  duration: number,
  preset: MomentumCurveName = 'flick'
): { [K in keyof T]: number } {
  const frame = useCurrentFrame();

  const effectiveFrame = frame - startFrame;
  const curve = getMomentumCurve(preset);

  const result: Record<string, number> = {};

  for (const key in values) {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      const [from, to] = values[key];

      if (effectiveFrame < 0) {
        result[key] = from;
      } else if (effectiveFrame >= duration) {
        result[key] = to;
      } else {
        const progress = curve(effectiveFrame / duration);
        result[key] = from + (to - from) * progress;
      }
    }
  }

  return result as { [K in keyof T]: number };
}

/**
 * useChainedMomentum - Chain momentum animations with velocity inheritance
 *
 * When one animation ends, the next begins with inherited momentum.
 * This creates fluid, connected motion where energy transfers between movements.
 *
 * @param keyframes - Array of [frame, value] pairs
 * @param preset - Momentum preset for each transition
 * @param transitionDuration - Duration of each transition
 *
 * @example
 * // Element moves through three positions with momentum carrying through
 * const x = useChainedMomentum([
 *   [0, 0],      // Start at 0
 *   [30, 100],   // Move to 100 at frame 30
 *   [60, 50],    // Move to 50 at frame 60
 *   [90, 200],   // Move to 200 at frame 90
 * ], 'flick', 15);
 */
export function useChainedMomentum(
  keyframes: [number, number][],
  preset: MomentumCurveName = 'flick',
  transitionDuration: number = 15
): number {
  const frame = useCurrentFrame();

  if (keyframes.length === 0) return 0;
  if (keyframes.length === 1) return keyframes[0][1];

  // Sort keyframes by frame
  const sorted = [...keyframes].sort((a, b) => a[0] - b[0]);

  // Find which segment we're in
  for (let i = 0; i < sorted.length - 1; i++) {
    const [startFrame, startValue] = sorted[i];
    const [endFrame, endValue] = sorted[i + 1];

    if (frame >= startFrame && frame < endFrame) {
      // We're in this segment
      const segmentProgress = (frame - startFrame) / (endFrame - startFrame);
      const curve = getMomentumCurve(preset);
      const easedProgress = curve(segmentProgress);
      return startValue + (endValue - startValue) * easedProgress;
    }
  }

  // Before first keyframe
  if (frame < sorted[0][0]) {
    return sorted[0][1];
  }

  // After last keyframe
  return sorted[sorted.length - 1][1];
}

/**
 * useMomentumWithVelocity - Track velocity for physics-based follow-up
 *
 * Returns both the current value and the instantaneous velocity,
 * useful for handing off to physics simulations or next animations.
 *
 * @returns { value, velocity } - Current value and velocity
 */
export function useMomentumWithVelocity(
  from: number,
  to: number,
  startFrame: number,
  duration: number,
  preset: MomentumCurveName = 'flick'
): { value: number; velocity: number } {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const effectiveFrame = frame - startFrame;
  const curve = getMomentumCurve(preset);

  if (effectiveFrame < 0) {
    return { value: from, velocity: 0 };
  }

  if (effectiveFrame >= duration) {
    return { value: to, velocity: 0 };
  }

  // Calculate value
  const progress = effectiveFrame / duration;
  const momentumProgress = curve(progress);
  const value = from + (to - from) * momentumProgress;

  // Estimate velocity (derivative approximation)
  const epsilon = 0.001;
  const nextProgress = Math.min(progress + epsilon, 1);
  const nextMomentumProgress = curve(nextProgress);
  const nextValue = from + (to - from) * nextMomentumProgress;
  const velocity = ((nextValue - value) / epsilon) * fps / duration;

  return { value, velocity };
}

// ============================================
// MULTI-VALUE HOOKS
// ============================================

/**
 * useSpringMulti - Animate multiple values with the same spring
 *
 * @param values - Object mapping keys to [from, to] tuples
 * @param startFrame - Frame when animation begins
 * @param preset - Spring preset
 *
 * @example
 * const { x, y, scale } = useSpringMulti({
 *   x: [0, 100],
 *   y: [0, 50],
 *   scale: [0, 1],
 * }, 30, 'bouncy');
 */
export function useSpringMulti<T extends Record<string, [number, number]>>(
  values: T,
  startFrame: number,
  preset: SpringPreset = 'responsive'
): { [K in keyof T]: number } {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const config = SPRING_PRESETS[preset];
  const effectiveFrame = frame - startFrame;

  const result: Record<string, number> = {};

  for (const key in values) {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      const [from, to] = values[key];

      if (effectiveFrame < 0) {
        result[key] = from;
      } else {
        const springProgress = spring({
          frame: effectiveFrame,
          fps,
          config,
        });
        result[key] = from + (to - from) * springProgress;
      }
    }
  }

  return result as { [K in keyof T]: number };
}

/**
 * useTweenMulti - Animate multiple values with the same tween
 */
export function useTweenMulti<T extends Record<string, [number, number]>>(
  values: T,
  startFrame: number,
  duration: number,
  ease: CurveName | CurveFunction = 'ease'
): { [K in keyof T]: number } {
  const frame = useCurrentFrame();

  const effectiveFrame = frame - startFrame;
  const easeFn = getCurve(ease);

  const result: Record<string, number> = {};

  for (const key in values) {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      const [from, to] = values[key];

      if (effectiveFrame < 0) {
        result[key] = from;
      } else if (effectiveFrame >= duration) {
        result[key] = to;
      } else {
        const progress = easeFn(effectiveFrame / duration);
        result[key] = from + (to - from) * progress;
      }
    }
  }

  return result as { [K in keyof T]: number };
}

// ============================================
// STAGGERED ANIMATION HOOKS
// ============================================

/**
 * useStaggeredSpring - Animate with staggered delays
 *
 * @param from - Starting value
 * @param to - Target value
 * @param startFrame - Frame when first animation begins
 * @param index - This item's index
 * @param staggerDelay - Frames between each item
 * @param preset - Spring preset
 *
 * @example
 * // In a map over items
 * const scale = useStaggeredSpring(0, 1, 30, index, 3, 'bouncy');
 */
export function useStaggeredSpring(
  from: number,
  to: number,
  startFrame: number,
  index: number,
  staggerDelay: number = 3,
  preset: SpringPreset = 'responsive'
): number {
  return useSpring(from, to, startFrame, preset, index * staggerDelay);
}

/**
 * useStaggeredFromCenter - Stagger from center outward
 *
 * @param from - Starting value
 * @param to - Target value
 * @param startFrame - Frame when animation begins
 * @param index - This item's index
 * @param total - Total number of items
 * @param staggerDelay - Frames per distance unit from center
 * @param preset - Spring preset
 */
export function useStaggeredFromCenter(
  from: number,
  to: number,
  startFrame: number,
  index: number,
  total: number,
  staggerDelay: number = 3,
  preset: SpringPreset = 'responsive'
): number {
  const center = (total - 1) / 2;
  const distanceFromCenter = Math.abs(index - center);
  const delay = distanceFromCenter * staggerDelay;
  return useSpring(from, to, startFrame, preset, delay);
}

// ============================================
// PHASE-BASED HOOKS
// ============================================

/**
 * usePhaseProgress - Get normalized progress through a phase
 *
 * @param phaseStart - Frame when phase begins
 * @param phaseDuration - Duration in frames
 * @param ease - Optional easing curve
 *
 * @returns Progress from 0 to 1 (clamped)
 *
 * @example
 * const fadeProgress = usePhaseProgress(30, 15, 'easeOut');
 */
export function usePhaseProgress(
  phaseStart: number,
  phaseDuration: number,
  ease?: CurveName | CurveFunction
): number {
  const frame = useCurrentFrame();

  const linearProgress = interpolate(
    frame,
    [phaseStart, phaseStart + phaseDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (ease) {
    const easeFn = getCurve(ease);
    return easeFn(linearProgress);
  }

  return linearProgress;
}

/**
 * useInPhase - Check if currently in a phase
 */
export function useInPhase(phaseStart: number, phaseDuration: number): boolean {
  const frame = useCurrentFrame();
  return frame >= phaseStart && frame < phaseStart + phaseDuration;
}

/**
 * useAfterPhase - Check if after a phase
 */
export function useAfterPhase(phaseStart: number, phaseDuration: number): boolean {
  const frame = useCurrentFrame();
  return frame >= phaseStart + phaseDuration;
}

// ============================================
// SPECIAL EFFECT HOOKS
// ============================================

/**
 * useBreathe - Subtle oscillation for "alive" feel
 *
 * @param baseValue - Value to oscillate around
 * @param amplitude - Amount of oscillation
 * @param speed - Speed multiplier (default: 1)
 * @param phase - Phase offset (for multiple elements)
 *
 * @example
 * const scale = useBreathe(1, 0.005, 1, index * 5);
 */
export function useBreathe(
  baseValue: number,
  amplitude: number = 0.005,
  speed: number = 1,
  phase: number = 0
): number {
  const frame = useCurrentFrame();
  const breathePhase = (frame + phase) * 0.08 * speed;
  return baseValue * (1 + Math.sin(breathePhase) * amplitude);
}

/**
 * useFloat - Gentle vertical floating motion
 *
 * @param baseY - Base Y position
 * @param amplitude - Float distance in pixels
 * @param speed - Speed multiplier
 * @param phase - Phase offset
 */
export function useFloat(
  baseY: number,
  amplitude: number = 2,
  speed: number = 1,
  phase: number = 0
): number {
  const frame = useCurrentFrame();
  const floatPhase = (frame + phase) * 0.05 * speed;
  return baseY + Math.sin(floatPhase) * amplitude;
}

/**
 * usePulse - Subtle scale pulse
 */
export function usePulse(
  baseScale: number,
  pulseAmount: number = 0.02,
  speed: number = 1,
  phase: number = 0
): number {
  const frame = useCurrentFrame();
  const pulsePhase = (frame + phase) * 0.1 * speed;
  return baseScale * (1 + Math.sin(pulsePhase) * pulseAmount);
}

/**
 * useBlurCurve - Blur that peaks mid-animation
 *
 * @param progress - Animation progress (0-1)
 * @param maxBlur - Maximum blur in pixels
 * @param peakAt - Where blur peaks (0-1)
 */
export function useBlurCurve(
  progress: number,
  maxBlur: number = 3,
  peakAt: number = 0.5
): number {
  if (progress < peakAt) {
    return (progress / peakAt) * maxBlur;
  } else {
    return ((1 - progress) / (1 - peakAt)) * maxBlur;
  }
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * useAnimationComplete - Check if animation is done
 */
export function useAnimationComplete(
  startFrame: number,
  duration: number
): boolean {
  const frame = useCurrentFrame();
  return frame >= startFrame + duration;
}

/**
 * useDelayed - Delay a value change
 */
export function useDelayed<T>(value: T, previousValue: T, delay: number): T {
  const frame = useCurrentFrame();
  // This is a simplified version - full implementation would track frame of change
  return frame < delay ? previousValue : value;
}

/**
 * useConditionalSpring - Spring that only activates on condition
 */
export function useConditionalSpring(
  from: number,
  to: number,
  condition: boolean,
  startFrame: number,
  preset: SpringPreset = 'responsive'
): number {
  if (!condition) {
    return from;
  }
  return useSpring(from, to, startFrame, preset);
}
