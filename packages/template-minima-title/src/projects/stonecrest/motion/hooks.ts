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
  SPRING_PRESETS,
  SpringPreset,
  MotionValue,
  motionSpring,
  motionTween,
} from './core';
import { getCurve, CurveName, CurveFunction, CURVES } from './curves';

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
