/**
 * PhotoGrid Component - v0.25
 *
 * CHANGELOG:
 * - v0.23: Phase A - Opacity Orchestration
 *   - Fade range [0.5, 0.95] → [0.15, 0.65] for ~100% combined opacity with bar
 *   - Photos fade WHILE bar solidifies (no opacity competition)
 *
 * - v0.21: LEAP 2 - Photo-to-SearchBar Metamorphosis
 *   - Formation phase: middle row slides into horizontal strip (FORMATION_START)
 *   - Enhanced merge: blur peaks mid-animation, desaturation progressive
 *   - Photos start from strip position, not grid position
 *   - Blur curve: 0 → 3px (peak) → 0 as opacity fades
 *   - Desaturation: photos become grayscale as they dissolve
 *
 * - v0.20: DEPTH SYSTEM - Cinematic depth & weight
 *   - Elevation-aware shadows: lifted photos have softer, longer shadows
 *   - Focus blur: disappearing photos blur before fading (guides attention)
 *   - Depth layers: center photos = foreground, edges = midground
 *   - Philosophy: "Invisible enhancement" - feel depth, don't see technique
 *
 * - v0.19.2: Added subtle breathing during settle phase
 *   - Photos have micro-scale oscillation (0.995-1.005) after landing
 *   - Keeps grid feeling alive before disappear phase
 *   - Prevents "dead" feeling of static photos
 *
 * - v0.18.3: Photos DRAMATICALLY larger during peek (VISIBILITY FIX)
 *   - Scale: [0.15, 0.4] → [0.5, 0.85] - photos now 50-85% size, not tiny
 *   - Rise higher: folderLidY - 40 (well above folder)
 *   - Lower clip line so more of photo is visible
 *   - Burst starts from 0.85 scale (matching peek end)
 *   - Root cause: clipping worked, but tiny photos were invisible
 *
 * - v0.18.2: Photos CLIPPED to folder opening (CRITICAL FIX)
 *   - Added clipPath to hide portion of photos below folder lid
 *   - Photos now visually emerge THROUGH the folder opening
 *   - Only the portion above the lid line is visible during peek
 *   - Clipping removed once burst starts
 *
 * - v0.18.1: Photos emerge FROM INSIDE folder
 *   - Photos start at folderInsideY (inside folder body)
 *   - Rise upward to folderLidY during peek phase
 *   - Creates illusion of photos coming OUT of folder, not appearing on top
 *   - Critical fix for visual storytelling
 *
 * - v0.17: Spring physics for burst and merge
 *   - Burst uses SPRING.bouncy with staggered delay (center first)
 *   - Merge uses SPRING.gentle for smooth convergence
 *   - Position/scale now spring-based, opacity stays interpolate
 *   - Natural overshoot and settle on photo landing
 *
 * - v0.14: Added peek phase, coordinated motion
 *   - New peekProgress prop for frames 90-110
 *   - Photos appear at folder position during peek
 *   - Wave-based disappear (top→bottom) instead of sporadic
 *   - Removed chaotic scatter, more coordinated expansion
 *   - Using unified EASE constants
 *
 * - v0.12: Initial implementation with sporadic disappear
 *
 * LESSONS APPLIED:
 * - Lesson 3: Spring Physics is Non-Negotiable
 * - Lesson 7: Coordinated movement, not chaotic
 * - Lesson 8: Smooth transitions between phases
 */

import React from 'react';
import {
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import {
  createStaggeredSpring,
  createSpring,
  springTo,
  // v0.20: Depth system imports
  ELEVATION,
  getElevationShadow,
  getFocusBlur,
  FOCUS,
  DEPTH_LAYER,
} from '../motion';

interface PhotoState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  clipTop: number | null; // v0.18.2: Clip photos to simulate emerging from folder
  // v0.20: Depth system
  elevation: number;      // 0 (resting) to 1 (highest) - affects shadow
  blur: number;           // Focus blur in pixels (max 3)
  // v0.21: Metamorphosis
  desaturation: number;   // 0 (full color) to 1 (grayscale)
}

interface PhotoGridProps {
  photos: string[];
  visibleIndices: number[];
  peekProgress: number;      // 0 = hidden, 1 = peeking at folder
  burstStartFrame: number;   // v0.17: Frame when burst starts (for spring)
  settleProgress: number;    // 0 = arriving, 1 = settled (kept for compatibility)
  filterProgress: number;    // 0 = all visible, 1 = only middle row
  formationStartFrame: number; // v0.21: Frame when middle row forms strip
  mergeStartFrame: number;   // v0.17: Frame when merge starts (for spring)
  centerX: number;
  centerY: number;
}

// Grid layout for 9 photos (3x3)
const GRID_POSITIONS = [
  { row: 0, col: 0 }, // top-left
  { row: 0, col: 1 }, // top-center
  { row: 0, col: 2 }, // top-right
  { row: 1, col: 0 }, // middle-left
  { row: 1, col: 1 }, // middle-center
  { row: 1, col: 2 }, // middle-right
  { row: 2, col: 0 }, // bottom-left
  { row: 2, col: 1 }, // bottom-center
  { row: 2, col: 2 }, // bottom-right
];

// Middle row indices (these survive the filter)
const MIDDLE_ROW_INDICES = [3, 4, 5];

// Wave-based disappear: top row, then bottom row (coordinated, not sporadic)
const DISAPPEAR_ORDER = [0, 1, 2, 6, 7, 8];

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  visibleIndices,
  peekProgress,
  burstStartFrame,
  settleProgress,
  filterProgress,
  formationStartFrame,
  mergeStartFrame,
  centerX,
  centerY,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const photoWidth = 180;
  const photoHeight = 120;
  const gridGap = 16;

  // Calculate grid dimensions
  const gridWidth = 3 * photoWidth + 2 * gridGap;
  const gridHeight = 3 * photoHeight + 2 * gridGap;
  const gridStartX = centerX - gridWidth / 2;
  const gridStartY = centerY - gridHeight / 2;

  // Folder position (where photos emerge from)
  // v0.18.1: Photos emerge from INSIDE folder, moving UPWARD through lid opening
  const folderX = centerX;
  const folderInsideY = centerY + 20;   // Start position: INSIDE the folder body
  const folderLidY = centerY - 50;       // Exit position: just above the folder lid

  const getPhotoState = (index: number): PhotoState => {
    const gridPos = GRID_POSITIONS[index] || { row: 1, col: 1 };

    // Target grid position
    const gridX = gridStartX + gridPos.col * (photoWidth + gridGap) + photoWidth / 2;
    const gridY = gridStartY + gridPos.row * (photoHeight + gridGap) + photoHeight / 2;

    // Merged position (center for search bar transition)
    const mergedX = centerX;
    const mergedY = centerY;

    // ============================================
    // PHASE 1: PEEK (photos EMERGE from inside folder)
    // v0.18.3: Photos MUCH larger and higher - clearly visible emergence
    // ============================================
    let x = folderX;
    // Photos rise MUCH higher - well above folder (40px higher than before)
    let y = interpolate(peekProgress, [0, 1], [folderInsideY, folderLidY - 40]);
    // Scale from 0.5 to 0.85 - large enough to SEE clearly (was 0.15-0.4 = invisible)
    let scale = interpolate(peekProgress, [0, 1], [0.5, 0.85]);
    let rotation = 0;
    // Full opacity quickly (was [0, 0.2, 1] → [0, 0.8, 1] = slow fade)
    let opacity = interpolate(peekProgress, [0, 0.1], [0, 1]);
    // v0.18.3: Lower clip line so more of photo is visible during emergence
    // Clip line at centerY - 10 (was centerY - 30 = too aggressive)
    let clipTop: number | null = centerY - 10;

    // v0.20: Depth system - elevation and blur
    // Center photos (index 4) are foreground, edges are midground
    const distFromCenter = Math.abs(index - 4);
    const photoDepth = interpolate(distFromCenter, [0, 4], [DEPTH_LAYER.foreground, DEPTH_LAYER.midground]);
    let elevation = ELEVATION.resting;
    let blur = 0;
    // v0.21: Desaturation for metamorphosis (grayscale during merge)
    let desaturation = 0;

    // ============================================
    // PHASE 2: BURST (expand to grid positions)
    // v0.17: Spring physics with staggered delay
    // ============================================
    const isBursting = burstStartFrame > 0 && frame >= burstStartFrame;
    if (isBursting) {
      // Coordinated stagger: center photo moves first, corners last
      const distFromCenter = Math.abs(index - 4);

      // Use SPRING.bouncy for energetic pop
      const burstSpring = createStaggeredSpring(
        frame - burstStartFrame,
        fps,
        'bouncy',
        distFromCenter,  // index for stagger
        3,               // 3 frames stagger delay
        0                // no base delay
      );

      // Position springs from above folder lid to grid positions
      // v0.18.3: Start from new higher position (folderLidY - 40)
      x = springTo(burstSpring, [folderX, gridX]);
      y = springTo(burstSpring, [folderLidY - 40, gridY]);

      // Scale: spring from peek size (0.85) to full size with natural overshoot
      // v0.18.3: Updated from 0.4 to match new larger peek end scale
      scale = springTo(burstSpring, [0.85, 1]);

      // Minimal rotation during burst (subtle, not chaotic)
      const targetRotation = (gridPos.col - 1) * 1.5; // -1.5, 0, 1.5 degrees
      // Rotation peaks at spring ~0.7 then returns to 0
      const rotationProgress = burstSpring < 0.7
        ? burstSpring / 0.7
        : 1 - (burstSpring - 0.7) / 0.5;
      rotation = targetRotation * 1.5 * Math.max(0, Math.min(1, rotationProgress));

      opacity = 1;
      // v0.18.2: Remove clipping once burst starts - photos are free
      clipTop = null;

      // v0.20: Elevation increases during burst, settles back down
      elevation = springTo(burstSpring, [ELEVATION.lifted, ELEVATION.hover]);

      // ============================================
      // PHASE 3: SETTLE (subtle breathing to keep photos alive)
      // v0.19.2: Micro-oscillation prevents "dead" static feel
      // ============================================
      if (burstSpring > 0.8) {
        // Breathing effect: subtle scale oscillation based on photo index
        // Each photo breathes at slightly different phase for organic feel
        const breathePhase = (frame + index * 5) * 0.08;
        const breatheAmount = Math.sin(breathePhase) * 0.005; // Very subtle: 0.995-1.005
        scale = scale * (1 + breatheAmount);

        // Micro-float: tiny Y movement
        const floatAmount = Math.sin(breathePhase * 0.7) * 1; // 1px max
        y = y + floatAmount;
      }
    }

    // ============================================
    // PHASE 4: FILTER (non-middle-row fades out in wave)
    // v0.19.3: Enhanced with rotation for "floating away" feel
    // v0.20: Added focus blur - photos blur BEFORE fading (guides attention)
    // ============================================
    if (!MIDDLE_ROW_INDICES.includes(index) && filterProgress > 0) {
      // Wave: top row first (row 0), then bottom row (row 2)
      const rowDelay = gridPos.row === 0 ? 0 : 0.4;
      const adjustedFilter = Math.max(0, Math.min(1,
        (filterProgress - rowDelay) / (1 - rowDelay)
      ));

      opacity = interpolate(adjustedFilter, [0, 1], [1, 0]);
      scale = interpolate(adjustedFilter, [0, 1], [1, 0.9]);
      // Gentle drift up as fading
      y = y - adjustedFilter * 15;
      // v0.19.3: Subtle tilt as photos float away (left photos tilt left, right photos tilt right)
      const tiltDirection = gridPos.col - 1; // -1, 0, 1
      rotation = tiltDirection * adjustedFilter * 5; // Max 5 degrees

      // v0.20: Blur BEFORE fade - cinematic focus transition
      // Blur starts early (0-0.4), fade happens later (0.2-1.0)
      blur = interpolate(adjustedFilter, [0, 0.4], [0, 2], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }

    // ============================================
    // PHASE 5A: FORMATION (middle row → horizontal strip)
    // v0.21: Photos slide into tight strip before merge
    // ============================================
    // Strip target positions (tighter than grid)
    const stripOffsets: Record<number, number> = { 3: -150, 4: 0, 5: 150 };
    const stripX = centerX + (stripOffsets[index] || 0);

    const isForming = MIDDLE_ROW_INDICES.includes(index) &&
      formationStartFrame > 0 &&
      frame >= formationStartFrame &&
      frame < mergeStartFrame;

    if (isForming) {
      const formationSpring = createSpring(frame - formationStartFrame, fps, 'responsive', 0);

      // Slide from grid to strip position
      x = springTo(formationSpring, [gridX, stripX]);
      // Y stays at grid Y (horizontal movement only)
      scale = springTo(formationSpring, [1, 0.85]);
      // Align rotation to 0 as photos form strip
      rotation = springTo(formationSpring, [rotation, 0]);
    }

    // ============================================
    // PHASE 5B: BLUR-MERGE (photos blur + desaturate → dissolve)
    // v0.21: Enhanced with blur curve and desaturation
    // ============================================
    const isMerging = MIDDLE_ROW_INDICES.includes(index) && mergeStartFrame > 0 && frame >= mergeStartFrame;
    if (isMerging) {
      // Use SPRING.gentle for smooth convergence
      const mergeSpring = createSpring(frame - mergeStartFrame, fps, 'gentle', 0);

      // Position: compress from strip to tight center
      // Photos start from strip position, not grid position
      x = springTo(mergeSpring, [stripX, mergedX + (index - 4) * 30]); // Slight offset to avoid perfect overlap
      y = springTo(mergeSpring, [gridY, mergedY]);
      // Continue shrinking from formation scale
      scale = springTo(mergeSpring, [0.85, 0.5]);

      // BLUR: peaks at 0.4-0.6 of spring, then reduces as opacity fades
      // This guides attention away from dissolving photos
      const blurCurve = mergeSpring < 0.5
        ? mergeSpring * 6  // 0 → 3px
        : 3 - (mergeSpring - 0.5) * 6; // 3px → 0
      blur = Math.max(0, Math.min(3, blurCurve));

      // DESATURATION: progressive grayscale as photos become search bar
      desaturation = Math.min(0.8, mergeSpring * 1.2);

      // OPACITY: v0.23 - fades early so photos+bar sum ~100% (was [0.5, 0.95])
      opacity = interpolate(mergeSpring, [0.15, 0.65], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }

    return { x, y, scale, rotation, opacity, clipTop, elevation, blur, desaturation };
  };

  return (
    <>
      {photos.slice(0, 9).map((photo, index) => {
        if (!visibleIndices.includes(index)) return null;

        const state = getPhotoState(index);
        if (state.opacity <= 0.01) return null;

        // v0.18.2: Calculate clip path to hide portion below folder lid
        // This makes photos appear to emerge FROM the folder, not on top
        let clipPath: string | undefined;
        if (state.clipTop !== null) {
          // How much of the photo is above the clip line?
          const photoTop = state.y - (photoHeight * state.scale) / 2;
          const photoBottom = state.y + (photoHeight * state.scale) / 2;
          const visibleTop = Math.max(photoTop, state.clipTop);

          // If photo is entirely below clip line, hide it completely
          if (photoTop >= state.clipTop) {
            // Photo hasn't emerged yet - clip entirely
            clipPath = 'inset(100% 0 0 0)';
          } else if (photoBottom > state.clipTop) {
            // Photo is partially emerged - clip the bottom portion
            const clipPercent = ((state.clipTop - photoTop) / (photoBottom - photoTop)) * 100;
            clipPath = `inset(0 0 ${100 - clipPercent}% 0)`;
          }
        }

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: state.x,
              top: state.y,
              width: photoWidth,
              height: photoHeight,
              transform: `translate(-50%, -50%) scale(${state.scale}) rotate(${state.rotation}deg)`,
              opacity: state.opacity,
              borderRadius: 8,
              overflow: 'hidden',
              // v0.20: Elevation-aware shadow (replaces static shadow)
              boxShadow: getElevationShadow(state.elevation),
              // v0.20/v0.21: Combined filter for blur and desaturation
              filter: [
                state.blur > 0 ? `blur(${state.blur}px)` : '',
                state.desaturation > 0 ? `grayscale(${state.desaturation})` : '',
              ].filter(Boolean).join(' ') || undefined,
              clipPath, // v0.18.2: Clip to folder opening
            }}
          >
            <Img
              src={staticFile(photo)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        );
      })}
    </>
  );
};

/**
 * Get which photos should be visible during the disappear phase
 * v0.14: Wave-based (top row, then bottom row)
 */
export function getVisibleIndicesForDisappear(
  frame: number,
  startFrame: number,
  disappearDuration: number
): number[] {
  const allIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const progress = interpolate(
    frame - startFrame,
    [0, disappearDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // How many non-middle-row photos should have disappeared
  const disappearCount = Math.floor(progress * DISAPPEAR_ORDER.length);

  // Remove photos in wave order
  const toRemove = DISAPPEAR_ORDER.slice(0, disappearCount);
  return allIndices.filter(i => !toRemove.includes(i));
}
