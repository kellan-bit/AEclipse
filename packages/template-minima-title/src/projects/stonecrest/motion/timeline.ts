/**
 * Timeline System - v0.30
 *
 * Declarative, typed timeline for multi-phase animations.
 *
 * Replaces flat TIMELINE objects (magic frame numbers) with a structured
 * system where phases have names, computed boundaries, and query methods.
 *
 * Philosophy: Declare intentions, not frame arithmetic.
 *
 * Usage:
 *   const timeline = createTimeline({ peek: { start: 44, duration: 16 }, ... });
 *   const t = useTimeline(timeline);
 *   const progress = t.progress('peek', 'easeOut');
 */

import { useCurrentFrame, interpolate } from 'remotion';
import { getCurve, type CurveName, type CurveFunction } from './curves';

// ============================================
// TYPES
// ============================================

/**
 * PhaseConfig - User-defined phase input
 */
export interface PhaseConfig {
  /** Start frame (absolute) */
  start: number;
  /** Duration in frames */
  duration: number;
  /** Default easing curve for this phase's progress */
  ease?: CurveName | CurveFunction;
}

/**
 * Phase - Computed, read-only phase with derived values
 */
export interface Phase {
  readonly name: string;
  readonly start: number;
  readonly end: number;
  readonly duration: number;
  readonly ease?: CurveName | CurveFunction;
}

/**
 * Timeline - Core data structure with query methods
 *
 * Generic over phase names for autocomplete:
 *   Timeline<'peek' | 'burst' | 'filter'>
 */
export interface Timeline<T extends string = string> {
  readonly phases: Record<T, Phase>;
  readonly total: number;

  getPhase(name: T): Phase;
  startOf(name: T): number;
  endOf(name: T): number;
  durationOf(name: T): number;

  progressAt(name: T, frame: number, ease?: CurveName | CurveFunction): number;
  isInAt(name: T, frame: number): boolean;
  isAfterAt(name: T, frame: number): boolean;
  isBeforeAt(name: T, frame: number): boolean;
}

/**
 * TimelineContext - Hook return type, bound to current frame
 */
export interface TimelineContext<T extends string = string> {
  progress(name: T, ease?: CurveName | CurveFunction): number;
  isIn(name: T): boolean;
  isAfter(name: T): boolean;
  isBefore(name: T): boolean;
  startOf(name: T): number;
  endOf(name: T): number;
  durationOf(name: T): number;
  frame: number;
  timeline: Timeline<T>;
}

// ============================================
// FACTORY
// ============================================

/**
 * createTimeline - Build a typed Timeline from phase configs
 *
 * @param phaseConfigs - Object mapping phase names to { start, duration, ease? }
 * @returns Frozen Timeline with query methods
 *
 * @example
 * const timeline = createTimeline({
 *   peek:   { start: 44,  duration: 16 },
 *   burst:  { start: 60,  duration: 40 },
 *   filter: { start: 115, duration: 60, ease: 'materialAccelerate' },
 * });
 *
 * timeline.startOf('burst')         // 60
 * timeline.endOf('filter')          // 175
 * timeline.progressAt('peek', 52)   // 0.5
 */
export function createTimeline<T extends string>(
  phaseConfigs: Record<T, PhaseConfig>
): Timeline<T> {
  const phases = {} as Record<T, Phase>;
  let maxEnd = 0;

  for (const name in phaseConfigs) {
    if (Object.prototype.hasOwnProperty.call(phaseConfigs, name)) {
      const config = phaseConfigs[name];
      const end = config.start + config.duration;
      phases[name] = {
        name,
        start: config.start,
        end,
        duration: config.duration,
        ease: config.ease,
      };
      if (end > maxEnd) {
        maxEnd = end;
      }
    }
  }

  const timeline: Timeline<T> = {
    phases,
    total: maxEnd,

    getPhase(name: T): Phase {
      return phases[name];
    },

    startOf(name: T): number {
      return phases[name].start;
    },

    endOf(name: T): number {
      return phases[name].end;
    },

    durationOf(name: T): number {
      return phases[name].duration;
    },

    progressAt(name: T, frame: number, ease?: CurveName | CurveFunction): number {
      const phase = phases[name];
      const linear = interpolate(
        frame,
        [phase.start, phase.end],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );

      const easeFn = ease ?? phase.ease;
      if (easeFn) {
        return getCurve(easeFn)(linear);
      }
      return linear;
    },

    isInAt(name: T, frame: number): boolean {
      const phase = phases[name];
      return frame >= phase.start && frame < phase.end;
    },

    isAfterAt(name: T, frame: number): boolean {
      return frame >= phases[name].end;
    },

    isBeforeAt(name: T, frame: number): boolean {
      return frame < phases[name].start;
    },
  };

  return Object.freeze(timeline) as Timeline<T>;
}

// ============================================
// HOOK
// ============================================

/**
 * useTimeline - Bind a Timeline to the current Remotion frame
 *
 * @param timeline - A Timeline created with createTimeline()
 * @returns TimelineContext with all query methods bound to current frame
 *
 * @example
 * const t = useTimeline(stonecrestTimeline);
 *
 * const peekProgress = t.progress('photoPeek', 'appleSheet');
 * const isFiltering = t.isIn('filter');
 * const burstFrame = t.startOf('photoBurst');
 */
export function useTimeline<T extends string>(timeline: Timeline<T>): TimelineContext<T> {
  const frame = useCurrentFrame();

  return {
    progress(name: T, ease?: CurveName | CurveFunction): number {
      return timeline.progressAt(name, frame, ease);
    },

    isIn(name: T): boolean {
      return timeline.isInAt(name, frame);
    },

    isAfter(name: T): boolean {
      return timeline.isAfterAt(name, frame);
    },

    isBefore(name: T): boolean {
      return timeline.isBeforeAt(name, frame);
    },

    startOf(name: T): number {
      return timeline.startOf(name);
    },

    endOf(name: T): number {
      return timeline.endOf(name);
    },

    durationOf(name: T): number {
      return timeline.durationOf(name);
    },

    frame,
    timeline,
  };
}
