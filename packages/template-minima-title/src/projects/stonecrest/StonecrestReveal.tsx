/**
 * Stonecrest v0.25 - Phase A: The Invisible Seam (Photo→SearchBar perfected)
 *
 * CHANGELOG:
 * - v0.25: Phase A complete - "The Invisible Seam"
 *   - v0.22: Gap Elimination - SEARCH_EMERGE moved to 297 (3 frames before merge)
 *   - v0.23: Opacity Orchestration - Photo fade [0.15, 0.65] for ~100% combined opacity
 *   - v0.24: Dimensional Precision - Bar starts at 340×86 (matches cluster)
 *   - v0.25: Detail Continuity - borderRadius 8→25, elevation shadows
 *
 * - v0.21: LEAP 2 - Photo-to-SearchBar Metamorphosis
 *   - Formation phase: middle row photos slide into horizontal strip
 *   - Blur-merge: photos blur + desaturate as they dissolve
 *   - Search bar emergence: bar grows FROM photo strip dimensions
 *   - Overlapping phases for seamless transformation
 *   - Photos BECOME the search bar, not disappear then bar appears
 *
 * - v0.20: DEPTH SYSTEM - Cinematic depth & weight
 *   - Elevation shadows: photos lift during burst, shadows respond to height
 *   - Focus blur: disappearing photos blur before fading (guides attention)
 *   - New utilities in motion.ts: ELEVATION, FOCUS, PARALLAX systems
 *   - Philosophy: "Invisible enhancement" - feel depth, don't see technique
 *   - Thresholds: Shadow Y-offset max 12px, blur max 3px, parallax max 15%
 *
 * - v0.19: Polish & Flow improvements
 *   - v0.19.1: Folder anticipation pulse (scale 1.025) before opening
 *   - v0.19.2: Photos "breathe" during settle (micro-oscillation)
 *   - v0.19.3: Disappearing photos tilt outward as they float away
 *
 * - v0.18.5: Overlap folder open + photo peek for seamless flow
 *   - PHOTOS_PEEK: 75 → 60 (photos start while lid still opening)
 *   - PHOTOS_BURST: 90 → 80 (tighter timing)
 *   - Creates continuous motion instead of sequential phases
 *
 * - v0.18.4: Split folder into body + lid for proper z-ordering
 *   - MacFolderBack renders BEHIND photos
 *   - MacFolderLid renders ABOVE photos
 *   - Photos now genuinely emerge FROM the folder, not on top
 *   - Removed clipping hack - proper layering instead
 *
 * - v0.18.3: Made photos larger during peek (0.5-0.85 scale)
 *
 * - v0.18.1: Fixed photo emergence timing (CRITICAL)
 *   - Photos now appear AFTER folder lid is visually open (frame 75, not 65)
 *   - Folder opens immediately after double-click (frame 48, not 52)
 *   - PhotoGrid updated to make photos rise FROM INSIDE folder
 *   - This fixes "photos appearing on top of closed folder" issue
 *
 * - v0.18: Cursor direction + faster pacing
 *   - Cursor now enters from RIGHT side (more natural for clicking)
 *   - Reduced hesitation time for snappier feel
 *   - Tightened Act 1 timing
 *
 * - v0.17: Spring physics for all major animations
 *   - MacFolder lid uses SPRING.folder profile
 *   - Passed openStartFrame to MacFolder for spring-based opening
 *   - Using createSpring() helpers from motion.ts
 *
 * - v0.15: White background, smooth tail transition
 *   - Changed from dark desktop to white background
 *   - Website reveal starts earlier (overlap with search bar)
 *   - Removed dead 10-frame gap between transitions
 *
 * - v0.14: Unified motion system, fixed photo timeline
 *   - Added peekProgress (frames 90-110)
 *   - Fixed burstProgress to start at frame 110
 *   - Use EASE constants from motion.ts
 *   - Wave-based photo disappear instead of sporadic
 *
 * - v0.12: Initial implementation
 *
 * LESSONS APPLIED:
 * - Lesson 3: Spring Physics is Non-Negotiable
 * - Lesson 7: Professional Animation = Consistency Over Effects
 * - Lesson 8: Transitions Are Everything
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

import { EASE } from './motion';
import { MacFolderBack, MacFolderLid } from './components/MacFolderLayers';
import {
  MouseCursor,
  getMousePositionWithHesitation,
  interpolateMousePosition,
} from './components/MouseCursor';
import { PhotoGrid, getVisibleIndicesForDisappear } from './components/PhotoGrid';
import { SearchBar, getTypingProgress } from './components/SearchBar';
import { WebsiteUI } from './components/WebsiteUI';

// ============================================
// ASSETS
// ============================================

const PHOTOS = [
  'assets/minima/Photos/Homes/Stonecrest/Basil_ex01_Final_2025-04-23.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basil_int1.1_Final_2025-04-24.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basin_int1.2_Final_2025-04-24.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basin_int1.3_Final_2025-04-24.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basin_int2.1_Final_2025-04-23.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basin_int3.1_Final_2025-04-24.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basin_int4.2_Final_2025-04-23.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basil_ex02_Final_2025-04-23.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basil_int1.1_Final_2025-04-24.jpg', // duplicate to fill 9
];

const BANNER_IMAGE = 'assets/minima/Photos/Homes/Stonecrest/Basil_ex01_Final_2025-04-23.jpg';

// ============================================
// TIMELINE (frames at 30fps)
// ============================================

const TIMELINE = {
  // Act 1: The Folder - v0.18: Tightened timing for snappier feel
  MOUSE_ENTER: 0,
  MOUSE_ARRIVE: 20,       // Was 30 - faster approach
  HESITATION_START: 20,
  HESITATION_END: 35,     // Was 55 - shorter hesitation (15 frames vs 25)
  FIRST_CLICK: 40,        // Was 60 - earlier click
  SECOND_CLICK: 46,       // Was 68 - tighter double-click

  // Act 2: The Reveal - v0.18.5: Overlapping phases for flow
  // Photos start peeking WHILE folder is still opening (overlap, not sequential)
  FOLDER_OPEN_START: 48,  // Immediate after double-click
  PHOTOS_PEEK: 60,        // v0.18.5: Earlier! Photos peek while lid is opening (was 75)
  PHOTOS_BURST: 80,       // v0.18.5: Earlier burst, tighter with peek (was 90)
  PHOTOS_SETTLE: 140,     // Spring settle (was 135)
  PHOTOS_HOLD: 170,       // Was 200

  // Act 3: The Filter - v0.18: Tightened
  DISAPPEAR_START: 180,   // Was 210
  DISAPPEAR_END: 250,     // Was 290
  MIDDLE_ROW_HOLD: 275,   // Was 320

  // Act 4: The Transform - v0.21: LEAP 2 Metamorphosis
  FORMATION_START: 275,   // NEW: Photos form horizontal strip
  MERGE_START: 300,       // CHANGED: Was 285 - merge starts after formation
  SEARCH_EMERGE: 297,     // v0.22: Bar ghost appears 3 frames BEFORE merge (was 310)
  MERGE_END: 325,         // CHANGED: Was 330 - tighter merge
  SEARCH_SOLIDIFIED: 325, // NEW: Bar fully opaque, photos gone
  SEARCH_BAR_READY: 350,  // NEW: Bar at full 500x50
  TYPING_START: 355,      // ADJUSTED: Was 340
  TYPING_END: 405,        // Was 390

  // Act 5: The Website - v0.21: Adjusted for new timing
  EXPAND_START: 420,      // ADJUSTED: Was 400
  EXPAND_END: 460,        // Was 510
  WEBSITE_REVEAL: 470,    // Was 520

  // End - v0.18: Shorter total (saved ~50 frames / 1.7s)
  TOTAL: 550,
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const StonecrestReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const centerX = width / 2;
  const centerY = height / 2;

  // ============================================
  // MOUSE ANIMATION
  // v0.18: Cursor enters from RIGHT (more natural approach angle)
  // ============================================

  const mouseStartX = width + 50;  // v0.18: Changed from -50 (left) to right side
  const mouseStartY = height / 2 - 80;
  const folderX = centerX;
  const folderY = centerY;

  // Mouse position calculation
  let mouseX: number;
  let mouseY: number;
  let isClicking = false;

  if (frame < TIMELINE.MOUSE_ARRIVE) {
    // Moving toward folder
    const pos = interpolateMousePosition(
      frame,
      TIMELINE.MOUSE_ENTER,
      TIMELINE.MOUSE_ARRIVE,
      mouseStartX, mouseStartY,
      folderX, folderY - 20
    );
    mouseX = pos.x;
    mouseY = pos.y;
  } else if (frame < TIMELINE.HESITATION_END) {
    // Hesitating over folder
    // v0.18: Simplified for shorter hesitation period (15 frames)
    const hesitationMid = (TIMELINE.HESITATION_START + TIMELINE.HESITATION_END) / 2;
    const hesitationIntensity = interpolate(
      frame,
      [TIMELINE.HESITATION_START, hesitationMid, TIMELINE.HESITATION_END],
      [0, 1, 0]
    );
    const pos = getMousePositionWithHesitation(frame, folderX, folderY - 20, hesitationIntensity);
    mouseX = pos.x;
    mouseY = pos.y;
  } else if (frame < TIMELINE.PHOTOS_BURST) {
    // Clicking position (slight adjustment)
    mouseX = folderX + 5;
    mouseY = folderY - 15;

    // Click states
    isClicking = (
      (frame >= TIMELINE.FIRST_CLICK && frame < TIMELINE.FIRST_CLICK + 4) ||
      (frame >= TIMELINE.SECOND_CLICK && frame < TIMELINE.SECOND_CLICK + 4)
    );
  } else {
    // Mouse fades out / moves away
    mouseX = folderX + 200;
    mouseY = folderY - 100;
  }

  const mouseVisible = frame < TIMELINE.PHOTOS_BURST + 30;

  // ============================================
  // FOLDER ANIMATION
  // v0.18.5: Folder hidden IMMEDIATELY when burst starts (no slow fade)
  // ============================================

  // Folder visible until burst starts + 5 frames (quick exit, not lingering)
  const folderVisible = frame < TIMELINE.PHOTOS_BURST + 5;
  const isHovered = frame >= TIMELINE.MOUSE_ARRIVE && frame < TIMELINE.PHOTOS_BURST;
  const isSelected = frame >= TIMELINE.SECOND_CLICK && frame < TIMELINE.PHOTOS_BURST + 5;

  // v0.17: Folder opening now uses spring physics in MacFolder component
  // We pass openStartFrame and the component handles the spring animation internally

  // v0.18.5: VERY fast fade - 5 frames only (was 20, still too slow)
  const folderOpacity = interpolate(
    frame,
    [TIMELINE.PHOTOS_BURST, TIMELINE.PHOTOS_BURST + 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ============================================
  // PHOTO GRID ANIMATION
  // v0.14: Fixed timeline - peek THEN burst
  // ============================================

  const photosVisible = frame >= TIMELINE.PHOTOS_PEEK && frame < TIMELINE.EXPAND_START;

  // Peek phase (90-110) - photos appear small at folder position
  const peekProgress = interpolate(
    frame,
    [TIMELINE.PHOTOS_PEEK, TIMELINE.PHOTOS_BURST],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE.enter }
  );

  // v0.17: Burst and merge now use spring physics (frame-based, not progress-based)
  // Pass start frames to PhotoGrid, spring calculations happen in component

  // Settle into grid (kept for compatibility)
  const settleProgress = interpolate(
    frame,
    [TIMELINE.PHOTOS_SETTLE, TIMELINE.PHOTOS_HOLD],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE.default }
  );

  // Filter - wave-based fade (not sporadic) - kept as interpolate (opacity)
  const filterProgress = interpolate(
    frame,
    [TIMELINE.DISAPPEAR_START, TIMELINE.DISAPPEAR_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE.default }
  );

  // Get visible photo indices - now wave-based (top row, then bottom row)
  const visibleIndices = frame < TIMELINE.DISAPPEAR_START
    ? [0, 1, 2, 3, 4, 5, 6, 7, 8]
    : getVisibleIndicesForDisappear(frame, TIMELINE.DISAPPEAR_START, TIMELINE.DISAPPEAR_END - TIMELINE.DISAPPEAR_START);

  // ============================================
  // SEARCH BAR ANIMATION
  // ============================================

  // v0.21: Search bar appears earlier (SEARCH_EMERGE), overlapping with photo merge
  const searchBarVisible = frame >= TIMELINE.SEARCH_EMERGE && frame < TIMELINE.WEBSITE_REVEAL + 30;

  const typingProgress = getTypingProgress(
    frame,
    TIMELINE.TYPING_START,
    'minimahomes.com',
    4
  );

  // v0.17: SearchBar expansion now uses spring physics internally
  // Pass start frame, spring calculations happen in component

  // ============================================
  // WEBSITE UI ANIMATION
  // v0.17: Spring physics for reveal
  // v0.15: Start EARLIER to overlap with search bar expansion
  // ============================================

  // Start website reveal 30 frames before search bar finishes (overlap)
  const websiteVisible = frame >= TIMELINE.EXPAND_START + 30;

  // v0.17: Website reveal now uses spring physics internally
  // Pass start frame, spring calculations happen in component
  const websiteRevealStart = TIMELINE.EXPAND_START + 40;

  // ============================================
  // BACKGROUND - v0.15: White/branded instead of dark desktop
  // ============================================

  // Clean white background throughout (user preference)
  const backgroundColor = '#FFFFFF';

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: 'hidden' }}>
      {/* v0.15: Removed dark desktop gradient - clean white background */}

      {/* v0.18.4: Folder BACK (body) - renders BEHIND photos */}
      {folderVisible && (
        <MacFolderBack
          label="Stonecrest (secret)"
          isHovered={isHovered}
          isClicking={isClicking}
          isSelected={isSelected}
          openStartFrame={TIMELINE.FOLDER_OPEN_START}
          x={folderX}
          y={folderY}
          opacity={folderOpacity}
        />
      )}

      {/* Photo Grid - renders BETWEEN folder body and lid */}
      {photosVisible && (
        <PhotoGrid
          photos={PHOTOS}
          visibleIndices={visibleIndices}
          peekProgress={peekProgress}
          burstStartFrame={TIMELINE.PHOTOS_BURST}
          settleProgress={settleProgress}
          filterProgress={filterProgress}
          formationStartFrame={TIMELINE.FORMATION_START}
          mergeStartFrame={TIMELINE.MERGE_START}
          centerX={centerX}
          centerY={centerY}
        />
      )}

      {/* v0.18.4: Folder LID - renders ABOVE photos for emergence effect */}
      {folderVisible && (
        <MacFolderLid
          label="Stonecrest (secret)"
          isHovered={isHovered}
          isClicking={isClicking}
          isSelected={isSelected}
          openStartFrame={TIMELINE.FOLDER_OPEN_START}
          x={folderX}
          y={folderY}
          opacity={folderOpacity}
        />
      )}

      {/* Search Bar - v0.21: Two-stage emergence from photo strip */}
      <SearchBar
        text="minimahomes.com"
        typingProgress={typingProgress}
        emergenceStartFrame={TIMELINE.SEARCH_EMERGE}
        photosFullyMergedFrame={TIMELINE.SEARCH_SOLIDIFIED}
        searchBarReadyFrame={TIMELINE.SEARCH_BAR_READY}
        expandStartFrame={TIMELINE.EXPAND_START}
        visible={searchBarVisible}
        centerX={centerX}
        centerY={centerY}
      />

      {/* Website UI */}
      <WebsiteUI
        bannerImage={BANNER_IMAGE}
        revealStartFrame={websiteRevealStart}
        visible={websiteVisible}
      />

      {/* Mouse Cursor (always on top) */}
      <MouseCursor
        x={mouseX}
        y={mouseY}
        isClicking={isClicking}
        visible={mouseVisible}
      />
    </AbsoluteFill>
  );
};
