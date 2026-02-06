/**
 * Stonecrest Animation Timeline - v0.40
 *
 * v0.40: Professional pacing overhaul — 391fr → 200fr (13s → 6.7s)
 * Every phase compressed 2-4x to match Apple/Material standards.
 */

import { createTimeline } from './motion/index';

export const STONECREST_PHASES = [
  'mouseApproach', 'hesitation', 'firstClick', 'secondClick',
  'folderOpen', 'photoPeek', 'photoBurst', 'photoSettle', 'photoHold',
  'filter',
  'formation', 'searchEmerge', 'merge', 'searchGrow', 'typing',
  'expand', 'websiteReveal', 'hold',
] as const;

export type StonecrestPhase = typeof STONECREST_PHASES[number];

export const stonecrestTimeline = createTimeline<StonecrestPhase>({
  // Act 1: Folder (kept — already snappy)
  mouseApproach:  { start: 0,   duration: 12 },
  hesitation:     { start: 12,  duration: 10 },
  firstClick:     { start: 26,  duration: 6 },
  secondClick:    { start: 32,  duration: 2 },

  // Act 2: Photo Reveal (was 81fr → 34fr)
  folderOpen:     { start: 34,  duration: 8 },
  photoPeek:      { start: 42,  duration: 8 },
  photoBurst:     { start: 50,  duration: 20 },
  photoSettle:    { start: 70,  duration: 4 },
  photoHold:      { start: 74,  duration: 2 },

  // Act 3: Filter (was 60fr → 15fr)
  filter:         { start: 76,  duration: 15 },

  // Act 4: Transform (was 89fr → 36fr)
  formation:      { start: 91,  duration: 10 },
  searchEmerge:   { start: 98,  duration: 14 },
  merge:          { start: 101, duration: 12 },
  searchGrow:     { start: 113, duration: 10 },
  typing:         { start: 123, duration: 15 },

  // Act 5: Website (was 117fr → 65fr)
  expand:         { start: 135, duration: 20 },
  websiteReveal:  { start: 155, duration: 5 },
  hold:           { start: 160, duration: 40 },
});
