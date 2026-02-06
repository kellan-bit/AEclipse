/**
 * Stonecrest Animation Timeline - v0.30
 *
 * Declarative phase definitions for the Stonecrest property reveal.
 * Maps the 5-act story structure to typed, queryable phases.
 *
 * Usage:
 *   import { stonecrestTimeline } from './stonecrest-timeline';
 *   const t = useTimeline(stonecrestTimeline);
 *   t.progress('photoBurst')  // 0-1 progress through burst phase
 *   t.startOf('filter')       // frame 115
 */

import { createTimeline } from './motion/index';

// ============================================
// PHASE NAMES (typed union for autocomplete)
// ============================================

export const STONECREST_PHASES = [
  'mouseApproach', 'hesitation', 'firstClick', 'secondClick',
  'folderOpen', 'photoPeek', 'photoBurst', 'photoSettle', 'photoHold',
  'filter',
  'formation', 'searchEmerge', 'merge', 'searchGrow', 'typing',
  'expand', 'websiteReveal', 'hold',
] as const;

export type StonecrestPhase = typeof STONECREST_PHASES[number];

// ============================================
// TIMELINE DEFINITION
// ============================================

export const stonecrestTimeline = createTimeline<StonecrestPhase>({
  // Act 1: The Folder
  // Mouse approaches from right, hesitates, double-clicks
  mouseApproach:  { start: 0,   duration: 12 },
  hesitation:     { start: 12,  duration: 10 },
  firstClick:     { start: 26,  duration: 6 },
  secondClick:    { start: 32,  duration: 2 },

  // Act 2: The Reveal
  // Folder opens, photos peek out, burst to grid, settle
  folderOpen:     { start: 34,  duration: 10 },
  photoPeek:      { start: 44,  duration: 16 },
  photoBurst:     { start: 60,  duration: 40 },
  photoSettle:    { start: 100, duration: 10 },
  photoHold:      { start: 110, duration: 5 },

  // Act 3: The Filter
  // Top/bottom rows slide out, middle row remains
  filter:         { start: 115, duration: 60 },

  // Act 4: The Transform
  // v0.33: Tightened morph timing — faster, more fluid
  // Middle row forms strip, merges into search bar, typing
  formation:      { start: 178, duration: 18 },    // was 22 — snappier strip
  searchEmerge:   { start: 193, duration: 23 },    // overlaps merge (3fr head start)
  merge:          { start: 196, duration: 20 },    // was 25 — tighter compression
  searchGrow:     { start: 216, duration: 18 },    // was 23 — quicker bar growth
  typing:         { start: 238, duration: 48 },

  // Act 5: The Website
  // Bar expands to browser viewport, website content revealed
  expand:         { start: 281, duration: 32 },    // was 40 — snappier expand
  websiteReveal:  { start: 313, duration: 10 },
  hold:           { start: 323, duration: 75 },
});
