/**
 * Core Motion Primitives - v0.26
 *
 * Foundation classes for the fluid motion system:
 * - Transition: Describes HOW a value changes
 * - MotionValue: A value that can be animated
 *
 * Philosophy: Declarative motion > imperative interpolation
 */

import { spring as remotionSpring } from 'remotion';
import { CurveFunction, CurveName, getCurve, CURVES } from './curves';

// ============================================
// TRANSITION TYPES
// ============================================

/**
 * Spring transition - physics-based with natural overshoot
 */
export interface SpringTransition {
  type: 'spring';
  stiffness?: number;   // Spring constant (default: 170)
  damping?: number;     // Friction (default: 26)
  mass?: number;        // Mass (default: 1)
  restDelta?: number;   // Completion threshold (default: 0.01)
  delay?: number;       // Delay in frames
}

/**
 * Tween transition - duration-based with easing curve
 */
export interface TweenTransition {
  type: 'tween';
  duration: number;     // Duration in frames
  ease?: CurveName | CurveFunction;  // Easing curve (default: 'ease')
  delay?: number;       // Delay in frames
}

/**
 * Physics transition - velocity-based with friction
 */
export interface PhysicsTransition {
  type: 'physics';
  velocity?: number;    // Initial velocity (default: 0)
  friction?: number;    // Deceleration rate (default: 0.9)
  restSpeed?: number;   // Completion threshold (default: 0.01)
  delay?: number;       // Delay in frames
}

export type Transition = SpringTransition | TweenTransition | PhysicsTransition;

// ============================================
// SPRING PRESETS (Named configurations)
// ============================================

export const SPRING_PRESETS = {
  /** Gentle - soft landing, minimal overshoot */
  gentle: { stiffness: 100, damping: 28, mass: 1 },

  /** Responsive - snappy UI feel */
  responsive: { stiffness: 180, damping: 30, mass: 0.8 },

  /** Bouncy - energetic with overshoot */
  bouncy: { stiffness: 140, damping: 22, mass: 1 },

  /** Stiff - very fast, almost instant */
  stiff: { stiffness: 300, damping: 30, mass: 0.8 },

  /** Slow - deliberate, cinematic */
  slow: { stiffness: 80, damping: 40, mass: 1.5 },

  /** Folder - mechanical hinge feel */
  folder: { stiffness: 100, damping: 26, mass: 1.2 },

  /** Photo burst - energetic pop */
  photoBurst: { stiffness: 140, damping: 22, mass: 1 },

  /** Search bar - responsive UI */
  searchBar: { stiffness: 180, damping: 30, mass: 0.8 },

  /** Website reveal - dramatic entrance */
  websiteReveal: { stiffness: 120, damping: 20, mass: 1 },

  /** Settle - natural landing */
  settle: { stiffness: 150, damping: 25, mass: 1 },

  /** Float - suspended, dreamy */
  float: { stiffness: 60, damping: 35, mass: 1.2 },
} as const;

export type SpringPreset = keyof typeof SPRING_PRESETS;

// ============================================
// DURATION PRESETS
// ============================================

export const DURATION = {
  /** Instant - micro-interactions (100ms at 30fps) */
  instant: 3,

  /** Fast - quick responses (300ms) */
  fast: 9,

  /** Normal - standard transitions (500ms) */
  normal: 15,

  /** Slow - deliberate movements (800ms) */
  slow: 24,

  /** Dramatic - major transitions (1200ms) */
  dramatic: 36,

  /** Cinematic - long reveals (2000ms) */
  cinematic: 60,
} as const;

// ============================================
// TRANSITION HELPERS
// ============================================

/**
 * Create a spring transition from preset or config
 */
export function springTransition(
  presetOrConfig: SpringPreset | Omit<SpringTransition, 'type'>,
  delay?: number
): SpringTransition {
  if (typeof presetOrConfig === 'string') {
    const preset = SPRING_PRESETS[presetOrConfig];
    return { type: 'spring', ...preset, delay };
  }
  return { type: 'spring', ...presetOrConfig, delay };
}

/**
 * Create a tween transition
 */
export function tweenTransition(
  duration: number,
  ease: CurveName | CurveFunction = 'ease',
  delay?: number
): TweenTransition {
  return { type: 'tween', duration, ease, delay };
}

/**
 * Create a physics transition
 */
export function physicsTransition(
  velocity: number = 0,
  friction: number = 0.9,
  delay?: number
): PhysicsTransition {
  return { type: 'physics', velocity, friction, delay };
}

// ============================================
// MOTION VALUE CLASS
// ============================================

/**
 * MotionValue - Core animation primitive
 *
 * Represents a value that can be animated from A to B
 * using various transition types (spring, tween, physics).
 */
export class MotionValue {
  private from: number;
  private to: number;
  private transition: Transition;
  private startFrame: number;

  constructor(
    from: number,
    to: number,
    startFrame: number,
    transition: Transition
  ) {
    this.from = from;
    this.to = to;
    this.startFrame = startFrame;
    this.transition = transition;
  }

  /**
   * Get the value at a given frame
   */
  get(frame: number, fps: number): number {
    const delay = this.transition.delay || 0;
    const effectiveFrame = frame - this.startFrame - delay;

    // Before animation starts
    if (effectiveFrame < 0) {
      return this.from;
    }

    switch (this.transition.type) {
      case 'spring':
        return this.getSpring(effectiveFrame, fps);
      case 'tween':
        return this.getTween(effectiveFrame);
      case 'physics':
        return this.getPhysics(effectiveFrame, fps);
      default:
        return this.to;
    }
  }

  private getSpring(frame: number, fps: number): number {
    const config = this.transition as SpringTransition;
    const progress = remotionSpring({
      frame,
      fps,
      config: {
        stiffness: config.stiffness ?? 170,
        damping: config.damping ?? 26,
        mass: config.mass ?? 1,
      },
    });
    return this.from + (this.to - this.from) * progress;
  }

  private getTween(frame: number): number {
    const config = this.transition as TweenTransition;
    const duration = config.duration;
    const ease = config.ease ? getCurve(config.ease) : CURVES.ease;

    if (frame >= duration) {
      return this.to;
    }

    const linearProgress = frame / duration;
    const easedProgress = ease(linearProgress);
    return this.from + (this.to - this.from) * easedProgress;
  }

  private getPhysics(frame: number, fps: number): number {
    const config = this.transition as PhysicsTransition;
    const friction = config.friction ?? 0.9;
    const restSpeed = config.restSpeed ?? 0.01;

    // Simulate physics
    let position = this.from;
    let velocity = config.velocity ?? 0;
    const target = this.to;
    const dt = 1 / fps;

    for (let i = 0; i < frame; i++) {
      // Spring force toward target
      const force = (target - position) * 0.1;
      velocity = velocity * friction + force;

      // Check if at rest
      if (Math.abs(velocity) < restSpeed && Math.abs(target - position) < 0.01) {
        return target;
      }

      position += velocity;
    }

    return position;
  }

  /**
   * Check if animation is complete at frame
   */
  isComplete(frame: number, fps: number): boolean {
    const value = this.get(frame, fps);
    const threshold = 0.001;
    return Math.abs(value - this.to) < threshold;
  }

  /**
   * Get the target value
   */
  getTarget(): number {
    return this.to;
  }

  /**
   * Get the initial value
   */
  getFrom(): number {
    return this.from;
  }
}

// ============================================
// FACTORY FUNCTIONS
// ============================================

/**
 * Create a MotionValue with spring transition
 */
export function motionSpring(
  from: number,
  to: number,
  startFrame: number,
  preset: SpringPreset = 'responsive',
  delay: number = 0
): MotionValue {
  return new MotionValue(from, to, startFrame, springTransition(preset, delay));
}

/**
 * Create a MotionValue with tween transition
 */
export function motionTween(
  from: number,
  to: number,
  startFrame: number,
  duration: number,
  ease: CurveName | CurveFunction = 'ease',
  delay: number = 0
): MotionValue {
  return new MotionValue(from, to, startFrame, tweenTransition(duration, ease, delay));
}

// ============================================
// MULTI-VALUE MOTION
// ============================================

/**
 * Animate multiple values together
 */
export interface MotionState {
  [key: string]: MotionValue;
}

/**
 * Create a motion state from initial values
 */
export function createMotionState<T extends Record<string, number>>(
  from: T,
  to: T,
  startFrame: number,
  transition: Transition
): MotionState {
  const state: MotionState = {};
  for (const key in from) {
    if (Object.prototype.hasOwnProperty.call(from, key)) {
      state[key] = new MotionValue(from[key], to[key], startFrame, transition);
    }
  }
  return state;
}

/**
 * Get all values from a motion state at a frame
 */
export function getMotionStateValues<T extends Record<string, number>>(
  state: MotionState,
  frame: number,
  fps: number
): T {
  const result: Record<string, number> = {};
  for (const key in state) {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      result[key] = state[key].get(frame, fps);
    }
  }
  return result as T;
}

// ============================================
// STAGGER UTILITIES
// ============================================

/**
 * Create staggered delays for multiple elements
 */
export function staggerDelays(
  count: number,
  delayPerItem: number,
  baseDelay: number = 0
): number[] {
  return Array.from({ length: count }, (_, i) => baseDelay + i * delayPerItem);
}

/**
 * Create staggered delays based on distance from center
 */
export function staggerFromCenter(
  count: number,
  delayPerStep: number,
  baseDelay: number = 0
): number[] {
  const center = (count - 1) / 2;
  return Array.from({ length: count }, (_, i) => {
    const distanceFromCenter = Math.abs(i - center);
    return baseDelay + distanceFromCenter * delayPerStep;
  });
}

/**
 * Create staggered delays from edges (center last)
 */
export function staggerToCenter(
  count: number,
  delayPerStep: number,
  baseDelay: number = 0
): number[] {
  const center = (count - 1) / 2;
  const maxDistance = center;
  return Array.from({ length: count }, (_, i) => {
    const distanceFromCenter = Math.abs(i - center);
    return baseDelay + (maxDistance - distanceFromCenter) * delayPerStep;
  });
}
