/**
 * PhotoGrid Component
 * Photos with spring physics, multiple layouts, and morph animation
 */

import React from 'react';
import {
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

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
  burstProgress: number; // 0 = in folder, 1 = fully burst out
  settleProgress: number; // 0 = scattered, 1 = settled grid
  filterProgress: number; // 0 = all visible, 1 = only middle row
  mergeProgress: number; // 0 = photos, 1 = merged into bar
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

// Sporadic disappear order (NOT sequential)
const DISAPPEAR_ORDER = [0, 8, 2, 6, 1, 7]; // corners first, then top/bottom center

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  visibleIndices,
  burstProgress,
  settleProgress,
  filterProgress,
  mergeProgress,
  centerX,
  centerY,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const photoWidth = 200;
  const photoHeight = 140;
  const gridGap = 20;

  // Calculate grid dimensions
  const gridWidth = 3 * photoWidth + 2 * gridGap;
  const gridHeight = 3 * photoHeight + 2 * gridGap;
  const gridStartX = centerX - gridWidth / 2;
  const gridStartY = centerY - gridHeight / 2;

  const getPhotoState = (index: number): PhotoState => {
    const gridPos = GRID_POSITIONS[index] || { row: 1, col: 1 };

    // Target grid position
    const gridX = gridStartX + gridPos.col * (photoWidth + gridGap) + photoWidth / 2;
    const gridY = gridStartY + gridPos.row * (photoHeight + gridGap) + photoHeight / 2;

    // Folder position (all photos start here)
    const folderX = centerX;
    const folderY = centerY + 100;

    // Burst scatter positions (random-ish but deterministic)
    const scatterX = gridX + Math.sin(index * 2.5) * 100;
    const scatterY = gridY + Math.cos(index * 1.8) * 80;
    const scatterRotation = (index - 4) * 8 + Math.sin(index * 3) * 5;
    const scatterScale = 0.9 + Math.sin(index * 2) * 0.15;

    // Merged position (all photos compress to center for search bar)
    const mergedX = centerX;
    const mergedY = centerY;

    // Calculate current position based on animation phases

    // Phase 1: Burst from folder
    let x = interpolate(burstProgress, [0, 1], [folderX, scatterX]);
    let y = interpolate(burstProgress, [0, 1], [folderY, scatterY]);
    let rotation = interpolate(burstProgress, [0, 1], [0, scatterRotation]);
    let scale = interpolate(burstProgress, [0, 0.3, 1], [0.1, 1.2, scatterScale]);

    // Phase 2: Settle into grid
    x = interpolate(settleProgress, [0, 1], [x, gridX]);
    y = interpolate(settleProgress, [0, 1], [y, gridY]);
    rotation = interpolate(settleProgress, [0, 1], [rotation, 0]);
    scale = interpolate(settleProgress, [0, 1], [scale, 1]);

    // Phase 3: Filter (non-middle-row photos disappear)
    let opacity = 1;
    if (!MIDDLE_ROW_INDICES.includes(index)) {
      opacity = interpolate(filterProgress, [0, 1], [1, 0]);
      scale = scale * interpolate(filterProgress, [0, 1], [1, 0.5]);
    }

    // Phase 4: Merge into search bar
    if (MIDDLE_ROW_INDICES.includes(index)) {
      x = interpolate(mergeProgress, [0, 1], [x, mergedX]);
      y = interpolate(mergeProgress, [0, 1], [y, mergedY]);
      scale = interpolate(mergeProgress, [0, 1], [scale, 0.3]);
      opacity = interpolate(mergeProgress, [0.5, 1], [1, 0]);
    }

    // Add slight floating motion when settled
    if (settleProgress > 0.9 && filterProgress < 0.1 && mergeProgress < 0.1) {
      const floatOffset = Math.sin(frame * 0.05 + index) * 3;
      y += floatOffset;
    }

    return { x, y, scale, rotation, opacity };
  };

  return (
    <>
      {photos.slice(0, 9).map((photo, index) => {
        if (!visibleIndices.includes(index)) return null;

        const state = getPhotoState(index);
        if (state.opacity <= 0) return null;

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
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
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
 * Get which photos should be visible during the sporadic disappear phase
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

  // Remove photos in sporadic order
  const toRemove = DISAPPEAR_ORDER.slice(0, disappearCount);
  return allIndices.filter(i => !toRemove.includes(i));
}
