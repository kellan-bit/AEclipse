# Fluid Motion Infrastructure Improvement Plan

**Version**: v0.26+ (Infrastructure Milestone)
**Status**: IN PROGRESS
**Started**: 2026-02-06
**Philosophy**: Fluidity = seamlessness, not effects

---

## Executive Summary

This document outlines a multi-session infrastructure improvement focused on making **all motion fluid**. The goal is to transform the current ad-hoc animation code into a systematic, reusable motion framework that ensures seamless transitions throughout the Stonecrest animation and all future projects.

---

## Current State Analysis

### What Works Well (v0.25)
- Spring physics system (`createSpring`, `createStaggeredSpring`, `springTo`)
- Depth system (elevation shadows, focus blur, parallax)
- Phase overlapping for metamorphosis (Photo→SearchBar)
- Brand color consistency

### Pain Points Identified
1. **Fragmented Motion Logic**: Mix of `interpolate()`, springs, and manual calculations
2. **Magic Numbers**: Timeline uses hardcoded frame numbers throughout
3. **Complex State Chains**: PhotoGrid has 5+ phases with nested if/else logic
4. **Curve Inconsistency**: Different curves used ad-hoc across components
5. **No Motion Composition**: Can't easily combine motion behaviors
6. **Hard-to-Tune Timing**: Changing one timeline event cascades through all calculations

---

## Infrastructure Phases

### Phase 1: Unified Motion Primitives (v0.26)
**Status**: COMPLETE
**Completed**: 2026-02-06
**Goal**: Single source of truth for all motion calculations

#### Deliverables
1. **MotionValue class** - Reactive value with interpolation
2. **Curve library** - Named easing presets with Apple-matching curves
3. **Transition types** - spring, tween, physics-based
4. **Motion hooks** - `useMotion()`, `useSpring()`, `useTransition()`

#### Files to Create/Modify
- `motion/core.ts` - MotionValue, Transition classes
- `motion/curves.ts` - Full curve library
- `motion/hooks.ts` - React hooks for motion
- `motion/index.ts` - Unified exports (replaces motion.ts)

---

### Phase 2: Timeline Architecture (v0.30)
**Status**: COMPLETE
**Completed**: 2026-02-06
**Goal**: Declarative, composable timeline system

#### Deliverables
1. **Phase system** - Named phases with typed queries ✓
2. **createTimeline() factory** - Converts phase configs into frozen Timeline ✓
3. **useTimeline() hook** - Binds Timeline to current Remotion frame ✓
4. **Typed interfaces** - PhaseConfig, Phase, Timeline\<T\>, TimelineContext\<T\> ✓

#### Actual API (implemented)
```tsx
const timeline = createTimeline<StonecrestPhase>({
  photoPeek:  { start: 44,  duration: 16 },
  photoBurst: { start: 60,  duration: 40 },
  filter:     { start: 115, duration: 60 },
  // ... 18 phases total
});

// Usage in component
const t = useTimeline(timeline);
const progress = t.progress('photoPeek', 'easeOut');
const isFiltering = t.isIn('filter');
const burstFrame = t.startOf('photoBurst');
```

#### Files Created/Modified
- NEW: `motion/timeline.ts` — interfaces, createTimeline(), useTimeline()
- NEW: `stonecrest-timeline.ts` — 18 named phases
- MODIFIED: `motion/index.ts` — exports timeline system
- MODIFIED: `StonecrestReveal.tsx` — uses useTimeline(), no flat TIMELINE
- MODIFIED: `Root.tsx` — uses stonecrestTimeline.total

---

### Phase 3: Animation State Machine (v0.28)
**Status**: PLANNED
**Goal**: Clean state transitions for complex multi-phase animations

#### Deliverables
1. **State machine pattern** - Replace if/else chains
2. **State transitions** - Automatic blending between states
3. **State debugging** - Visual state inspector

#### Example Target API
```tsx
const photoStates = createAnimationStateMachine({
  states: {
    hidden: { scale: 0, opacity: 0, y: 'inside-folder' },
    peeking: { scale: 0.85, opacity: 1, y: 'above-folder' },
    bursting: { scale: 1, opacity: 1, y: 'grid-position' },
    breathing: { scale: 'breathe(1, 0.005)', opacity: 1 },
    disappearing: { scale: 0.9, opacity: 0, blur: 2, y: '-15' },
    forming: { scale: 0.85, x: 'strip-position' },
    merging: { scale: 0.5, opacity: 0, blur: 'curve(0,3,0)', desaturation: 0.8 }
  },
  transitions: {
    'hidden->peeking': { spring: 'gentle', duration: 20 },
    'peeking->bursting': { spring: 'bouncy', stagger: 3 },
    // ...
  }
});
```

---

### Phase 4: Motion Presets Library (v0.29)
**Status**: PLANNED
**Goal**: Reusable motion recipes for common patterns

#### Deliverables
1. **Preset system** - Named motion configurations
2. **Apple Motion Curves** - Exact replicas of iOS/macOS curves
3. **Composition operators** - Combine presets
4. **Documentation** - Visual curve previewer

#### Example Presets
```tsx
PRESETS = {
  // Apple system animations
  appleSpring: { type: 'spring', tension: 210, friction: 20 },
  appleEaseIn: { type: 'bezier', curve: [0.42, 0, 1, 1] },
  appleEaseOut: { type: 'bezier', curve: [0, 0, 0.58, 1] },
  appleEaseInOut: { type: 'bezier', curve: [0.42, 0, 0.58, 1] },

  // Project-specific
  folderOpen: { type: 'spring', tension: 120, friction: 14 },
  photoBurst: { type: 'spring', tension: 180, friction: 12 },
  searchBarGrow: { type: 'spring', tension: 250, friction: 18 },

  // Effect modifiers
  withAnticipation: (preset, amount) => {...},
  withOvershoot: (preset, amount) => {...},
  withSettleWiggle: (preset) => {...},
}
```

---

### Phase 5: Component Refactor (v0.30)
**Status**: PLANNED
**Goal**: Apply new infrastructure to all components

#### Components to Refactor
1. `PhotoGrid.tsx` - Use state machine, timeline phases
2. `SearchBar.tsx` - Use motion primitives
3. `MacFolderLayers.tsx` - Use motion presets
4. `WebsiteUI.tsx` - Use timeline system
5. `MouseCursor.tsx` - Use motion hooks
6. `StonecrestReveal.tsx` - Use declarative timeline

---

## Agent Documentation

### Agents Used in This Infrastructure Work

When working on this infrastructure, the following agent patterns apply:

#### Explore Agent
- **Use for**: Finding existing patterns, understanding component relationships
- **Example prompt**: "Find all places where interpolate() is used for position animation"

#### Plan Agent
- **Use for**: Designing new system architectures before implementation
- **Example prompt**: "Design the API for the MotionValue class"

#### Bash Agent
- **Use for**: Running tests, style checks, builds
- **Commands**: `bun run dev`, `turbo run lint`, `bun run stylecheck`

### Session Handoff Protocol

When ending a session:
1. Update this file with current status
2. Update CLAUDE_CONTEXT.md with version bump
3. Update LESSONS.md with any new patterns learned
4. Commit all changes with descriptive message
5. Push to branch

When starting a session:
1. Read CLAUDE_CONTEXT.md first
2. Read this INFRASTRUCTURE_PLAN.md
3. Read LESSONS.md for patterns
4. Check git status for any uncommitted work
5. Continue from the last marked phase

---

## Phase 1 Detailed Specification

### 1.1 MotionValue Class

```typescript
/**
 * MotionValue - Core animation primitive
 *
 * A reactive value that can be animated using various transition types.
 * Supports springs, tweens, and physics-based animations.
 */
class MotionValue<T extends number | number[]> {
  private value: T;
  private velocity: T;
  private target: T;
  private transition: Transition;

  // Get current value at frame
  get(frame: number): T;

  // Set target with transition
  to(target: T, transition?: Transition): this;

  // Get velocity at frame
  getVelocity(frame: number): T;

  // Check if animation complete
  isComplete(frame: number): boolean;
}
```

### 1.2 Curve Library

```typescript
/**
 * Comprehensive curve library with named presets
 */
export const CURVES = {
  // Standard easing (CSS spec)
  linear: (t: number) => t,
  ease: bezier(0.25, 0.1, 0.25, 1),
  easeIn: bezier(0.42, 0, 1, 1),
  easeOut: bezier(0, 0, 0.58, 1),
  easeInOut: bezier(0.42, 0, 0.58, 1),

  // Apple ecosystem curves (measured from actual iOS/macOS)
  appleDefault: bezier(0.25, 0.1, 0.25, 1),
  appleKeyboard: bezier(0.1, 0.9, 0.2, 1),
  appleSheet: bezier(0.33, 1, 0.68, 1),
  appleModal: bezier(0.32, 0.72, 0, 1),

  // Material Design curves
  materialStandard: bezier(0.4, 0, 0.2, 1),
  materialDecelerate: bezier(0, 0, 0.2, 1),
  materialAccelerate: bezier(0.4, 0, 1, 1),

  // Emphasis curves (overshoot)
  overshootSmall: bezier(0.34, 1.2, 0.64, 1),
  overshootMedium: bezier(0.34, 1.4, 0.64, 1),
  overshootLarge: bezier(0.34, 1.56, 0.64, 1),

  // Anticipation curves (pull back before)
  anticipateSmall: bezier(0.38, -0.1, 0.69, 0.88),
  anticipateMedium: bezier(0.38, -0.2, 0.69, 0.88),

  // Custom project curves
  folderOpen: bezier(0.2, 0.9, 0.3, 1),
  photoBurst: bezier(0.18, 0.89, 0.32, 1.15),
  searchGrow: bezier(0.22, 0.61, 0.36, 1),
};
```

### 1.3 Transition System

```typescript
/**
 * Transition types for MotionValue
 */
type Transition =
  | SpringTransition
  | TweenTransition
  | PhysicsTransition;

interface SpringTransition {
  type: 'spring';
  stiffness: number;  // Spring constant (default: 100)
  damping: number;    // Friction (default: 10)
  mass: number;       // Mass (default: 1)
  restDelta?: number; // Threshold for completion
  delay?: number;     // Delay in frames
}

interface TweenTransition {
  type: 'tween';
  duration: number;   // Duration in frames
  ease: CurveFunction | keyof typeof CURVES;
  delay?: number;
}

interface PhysicsTransition {
  type: 'physics';
  velocity: number;   // Initial velocity
  friction: number;   // Deceleration rate
  acceleration?: number;
}
```

### 1.4 React Hooks

```typescript
/**
 * useMotion - Primary hook for animations
 */
function useMotion(
  initial: number,
  target: number,
  transition: Transition
): number;

/**
 * useSpring - Shorthand for spring animations
 */
function useSpring(
  target: number,
  config?: keyof typeof SPRING_PRESETS | SpringConfig
): number;

/**
 * useTransition - Multi-value transitions
 */
function useTransition<T extends Record<string, number>>(
  values: T,
  transition: Transition
): T;

/**
 * useTimeline - Access timeline phases
 */
function useTimeline(
  timeline: Timeline,
  phaseName: string
): { progress: number; isActive: boolean; frame: number };
```

---

## Success Criteria

### Phase 1 Complete When:
- [x] MotionValue class implemented and tested
- [x] Curve library complete with 20+ named curves (40+ delivered)
- [x] Transition system supports spring, tween, physics
- [x] React hooks working: useMotion, useSpring, useTransition (and more)
- [x] One component (SearchBar) refactored to use new primitives (SearchBarV2.tsx)
- [x] Documentation updated in LESSONS.md (Lessons 15-18 added)
- [ ] All existing functionality preserved (no visual regressions) - PENDING TESTING

### Full Infrastructure Complete When:
- [ ] All 5 phases implemented
- [ ] All components use new motion system
- [ ] Timeline is fully declarative
- [ ] State machine replaces if/else chains
- [ ] Motion presets library documented
- [ ] Visual curve previewer available
- [ ] Performance benchmarked (no regression)

---

## Rollback Strategy

If new infrastructure introduces regressions:
1. New code lives in `motion/` directory (parallel to existing `motion.ts`)
2. Components can import from either location
3. Gradual migration: one component at a time
4. Old `motion.ts` preserved until all components migrated
5. Easy rollback: revert component imports

---

## Appendix: Motion Glossary

| Term | Definition |
|------|------------|
| **MotionValue** | A reactive value that can be animated |
| **Transition** | How a value changes from A to B |
| **Spring** | Physics-based transition with overshoot/settle |
| **Tween** | Duration-based transition with easing curve |
| **Curve** | Function mapping progress (0-1) to value (0-1+) |
| **Phase** | Named section of timeline with start/duration |
| **State** | Snapshot of all animated properties |
| **Composition** | Combining multiple animations |

---

**Last Updated**: 2026-02-06
**Phase 1 Completed**: 2026-02-06

---

## Session Log

### Session 2026-02-06: Phase 1 Complete
**Agent**: Claude Opus 4.5
**Branch**: claude/analyze-program-functionality-gb52b

**Completed:**
1. Created INFRASTRUCTURE_PLAN.md with full multi-session roadmap
2. Created motion/ directory with new infrastructure:
   - curves.ts: 40+ named easing curves (bezier implementation, Apple, Material, custom)
   - core.ts: MotionValue class, Transition types, SpringPresets, factory functions
   - hooks.ts: useSpring, useTween, useSpringMulti, usePhaseProgress, useBreathe, etc.
   - index.ts: Unified exports with backward compatibility
3. Created SearchBarV2.tsx as proof of concept
4. Updated CLAUDE_CONTEXT.md with v0.26 milestone
5. Updated LESSONS.md with 4 new lessons (15-18)

**Next Session Should:**
1. Test SearchBarV2 visually (swap in StonecrestReveal.tsx)
2. Verify no regressions
3. Begin Phase 2: Timeline Architecture OR
4. Refactor more components with new motion system

**Files Modified:**
- NEW: packages/template-minima-title/src/projects/stonecrest/INFRASTRUCTURE_PLAN.md
- NEW: packages/template-minima-title/src/projects/stonecrest/motion/curves.ts
- NEW: packages/template-minima-title/src/projects/stonecrest/motion/core.ts
- NEW: packages/template-minima-title/src/projects/stonecrest/motion/hooks.ts
- NEW: packages/template-minima-title/src/projects/stonecrest/motion/index.ts
- NEW: packages/template-minima-title/src/projects/stonecrest/components/SearchBarV2.tsx
- MODIFIED: packages/template-minima-title/src/projects/stonecrest/CLAUDE_CONTEXT.md
- MODIFIED: packages/template-minima-title/src/projects/stonecrest/LESSONS.md
