/**
 * PhotoGrid Component - v0.17
 *
 * CHANGELOG:
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
import { createStaggeredSpring, createSpring, springTo } from '../motion';

interface PhotoState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

interface PhotoGridProps {
  photos: string[];
  visibleIndices: number[];
  peekProgress: number;      // 0 = hidden, 1 = peeking at folder
  burstStartFrame: number;   // v0.17: Frame when burst starts (for spring)
  settleProgress: number;    // 0 = arriving, 1 = settled (kept for compatibility)
  filterProgress: number;    // 0 = all visible, 1 = only middle row
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
  const folderX = centerX;
  const folderY = centerY;

  const getPhotoState = (index: number): PhotoState => {
    const gridPos = GRID_POSITIONS[index] || { row: 1, col: 1 };

    // Target grid position
    const gridX = gridStartX + gridPos.col * (photoWidth + gridGap) + photoWidth / 2;
    const gridY = gridStartY + gridPos.row * (photoHeight + gridGap) + photoHeight / 2;

    // Merged position (center for search bar transition)
    const mergedX = centerX;
    const mergedY = centerY;

    // ============================================
    // PHASE 1: PEEK (photos appear at folder, small)
    // ============================================
    let x = folderX;
    let y = folderY;
    let scale = interpolate(peekProgress, [0, 1], [0, 0.35]);
    let rotation = 0;
    let opacity = peekProgress;

    // ============================================
    // PHASE 2: BURST (expand to grid positions)
    // v0.17: Spring physics with staggered delay
    // ============================================
    const isBursting = burstStartFrame > 0 && frame >= burstStartFrame;
    if (isBursting) {
      // Coordinated stagger: center photo moves first, corners last
      const distFromCenter = Math.abs(index - 4);
      const staggerFrames = distFromCenter * 3; // 3 frames per distance unit

      // Use SPRING.bouncy for energetic pop
      const burstSpring = createStaggeredSpring(
        frame - burstStartFrame,
        fps,
        'bouncy',
        distFromCenter,  // index for stagger
        3,               // 3 frames stagger delay
        0                // no base delay
      );

      // Position springs from folder to grid
      x = springTo(burstSpring, [folderX, gridX]);
      y = springTo(burstSpring, [folderY, gridY]);

      // Scale: spring naturally overshoots then settles
      scale = springTo(burstSpring, [0.35, 1]);

      // Minimal rotation during burst (subtle, not chaotic)
      const targetRotation = (gridPos.col - 1) * 1.5; // -1.5, 0, 1.5 degrees
      // Rotation peaks at spring ~0.7 then returns to 0
      const rotationProgress = burstSpring < 0.7
        ? burstSpring / 0.7
        : 1 - (burstSpring - 0.7) / 0.5;
      rotation = targetRotation * 1.5 * Math.max(0, Math.min(1, rotationProgress));

      opacity = 1;
    }

    // ============================================
    // PHASE 3: SETTLE (already at grid, minor adjustments)
    // ============================================
    // No additional changes needed - burst brings to final position

    // ============================================
    // PHASE 4: FILTER (non-middle-row fades out in wave)
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
    }

    // ============================================
    // PHASE 5: MERGE (middle row → center, then fade)
    // v0.17: Spring physics for smooth convergence
    // ============================================
    const isMerging = MIDDLE_ROW_INDICES.includes(index) && mergeStartFrame > 0 && frame >= mergeStartFrame;
    if (isMerging) {
      // Use SPRING.gentle for smooth convergence
      const mergeSpring = createSpring(frame - mergeStartFrame, fps, 'gentle', 0);

      x = springTo(mergeSpring, [gridX, mergedX]);
      y = springTo(mergeSpring, [gridY, mergedY]);
      scale = springTo(mergeSpring, [1, 0.6]);

      // Fade out in second half (keep as interpolate - opacity works well linear)
      opacity = interpolate(mergeSpring, [0.4, 0.9], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }

    return { x, y, scale, rotation, opacity };
  };

  return (
    <>
      {photos.slice(0, 9).map((photo, index) => {
        if (!visibleIndices.includes(index)) return null;

        const state = getPhotoState(index);
        if (state.opacity <= 0.01) return null;

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
              boxShadow: `0 ${4 + state.scale * 4}px ${8 + state.scale * 8}px rgba(0,0,0,${0.15 + state.scale * 0.1})`,
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
