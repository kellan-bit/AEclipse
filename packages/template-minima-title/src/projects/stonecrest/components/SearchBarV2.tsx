/**
 * SearchBar Component - v0.29
 *
 * CHANGELOG:
 * - v0.29: THE MORPH — Bar IS the website container
 *   - Removed ghost/solidification opacity ramp (no more fading in)
 *   - Bar starts at merged-photo geometry (280×54), fully opaque
 *   - Springs to search bar size (500×50)
 *   - renderExpandedContent prop: website renders INSIDE expanding bar
 *   - Same container throughout — no separate WebsiteUI layer
 *
 * - v0.26: Refactored to new motion infrastructure
 *   - Uses useSpringMulti, usePhaseProgress from motion/hooks
 *   - Cleaner phase detection with useInPhase
 *
 * LESSONS APPLIED:
 * - Morph, don't transition — same container changes content
 * - Physical geometry handoff > opacity crossover
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import {
  useSpringMulti,
  usePhaseProgress,
  useInPhase,
  getElevationShadow,
  ELEVATION,
  getMomentumCurve,
} from '../motion/index';

interface SearchBarProps {
  text: string;
  typingProgress: number;
  emergenceStartFrame: number;
  photosFullyMergedFrame: number;
  searchBarReadyFrame: number;
  expandStartFrame: number;
  visible: boolean;
  centerX: number;
  centerY: number;
  // v0.29: Website content renders INSIDE the expanding bar
  renderExpandedContent?: () => React.ReactNode;
}

// ============================================
// ANIMATION CONSTANTS
// Defined at top for easy tuning
// ============================================

const DIMENSIONS = {
  // v0.29: Stage 1 starts at merged photo geometry (pixel-perfect handoff)
  // 3 photos (180px each) compressed at scale 0.45 ≈ ~240px combined width
  merged: { width: 280, height: 54, borderRadius: 25 },
  // Stage 2: Growth (full search bar)
  ready: { width: 500, height: 50, borderRadius: 25 },
  // Stage 3: Expansion (browser viewport)
  expanded: { width: 1600, height: 900, borderRadius: 12 },
};

export const SearchBarV2: React.FC<SearchBarProps> = ({
  text,
  typingProgress,
  emergenceStartFrame,
  photosFullyMergedFrame,
  searchBarReadyFrame,
  expandStartFrame,
  visible,
  centerX,
  centerY,
  renderExpandedContent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ============================================
  // PHASE DETECTION (Clean boolean flags)
  // NOTE: All hooks MUST be called before any early return (Rules of Hooks)
  // ============================================

  const solidifyDuration = photosFullyMergedFrame - emergenceStartFrame;
  const growthDuration = expandStartFrame - photosFullyMergedFrame;

  const isSolidifying = useInPhase(emergenceStartFrame, solidifyDuration);
  const isGrowing = useInPhase(photosFullyMergedFrame, growthDuration);
  const isExpanding = frame >= expandStartFrame;

  // ============================================
  // STAGE 1: MORPH FROM PHOTOS
  // v0.29: Bar appears at merged photo geometry, fully opaque.
  // The white overlay on photos already handles the visual transition.
  // Bar then springs to its normal search bar dimensions.
  // No ghost stage. No opacity ramp. Pixel-perfect handoff.
  // ============================================

  const solidifyProgress = usePhaseProgress(
    emergenceStartFrame,
    solidifyDuration,
    getMomentumCurve('bounce')
  );

  // ============================================
  // STAGE 2: GROWTH
  // Bar springs from merged-photo size to full search bar size
  // ============================================

  const growthValues = useSpringMulti(
    {
      width: [DIMENSIONS.merged.width, DIMENSIONS.ready.width],
      height: [DIMENSIONS.merged.height, DIMENSIONS.ready.height],
      borderRadius: [DIMENSIONS.merged.borderRadius, DIMENSIONS.ready.borderRadius],
    },
    photosFullyMergedFrame,
    'responsive'
  );

  // ============================================
  // STAGE 3: EXPANSION
  // Bar expands to browser viewport
  // ============================================

  const expandValues = useSpringMulti(
    {
      width: [DIMENSIONS.ready.width, DIMENSIONS.expanded.width],
      height: [DIMENSIONS.ready.height, DIMENSIONS.expanded.height],
      borderRadius: [DIMENSIONS.ready.borderRadius, DIMENSIONS.expanded.borderRadius],
    },
    expandStartFrame,
    'responsive'
  );

  // ============================================
  // UI CONTENT OPACITY
  // Fades out during expansion (content dissolves into website)
  // ============================================

  const expandProgress = usePhaseProgress(expandStartFrame, 40, 'easeIn');

  // Early return AFTER all hooks (Rules of Hooks: hooks must always be called)
  if (!visible) return null;

  // ============================================
  // COMPUTE FINAL VALUES
  // Select from appropriate stage
  // ============================================

  let barWidth: number;
  let barHeight: number;
  let borderRadius: number;
  let barOpacity: number;

  if (isSolidifying) {
    // v0.29: Stage 1 — bar appears at merged photo size, fully opaque
    // The white overlay on photos handles the visual bridge
    barWidth = DIMENSIONS.merged.width;
    barHeight = DIMENSIONS.merged.height;
    borderRadius = DIMENSIONS.merged.borderRadius;
    barOpacity = 1.0;
  } else if (isGrowing) {
    // Stage 2: Spring from merged size to search bar size
    barWidth = growthValues.width;
    barHeight = growthValues.height;
    borderRadius = growthValues.borderRadius;
    barOpacity = 1.0;
  } else if (isExpanding) {
    // Stage 3: Expand to browser
    barWidth = expandValues.width;
    barHeight = expandValues.height;
    borderRadius = expandValues.borderRadius;
    barOpacity = 1.0;
  } else {
    // Static state (between stages)
    barWidth = DIMENSIONS.ready.width;
    barHeight = DIMENSIONS.ready.height;
    borderRadius = DIMENSIONS.ready.borderRadius;
    barOpacity = 1.0;
  }

  // Search UI opacity (expandProgress computed above, before early return)
  const searchUIOpacity = isExpanding
    ? interpolate(expandProgress, [0, 0.7], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  // ============================================
  // TYPING DISPLAY
  // ============================================

  const charsToShow = Math.floor(text.length * typingProgress);
  const displayText = text.slice(0, charsToShow);
  const cursorVisible = Math.floor(frame / 15) % 2 === 0 || typingProgress < 1;

  // ============================================
  // ELEVATION STATE
  // Shadow responds to animation stage
  // ============================================

  const elevation = isSolidifying
    ? ELEVATION.resting
    : isGrowing
      ? ELEVATION.hover
      : ELEVATION.lifted;

  return (
    <div
      style={{
        position: 'absolute',
        left: centerX,
        top: centerY,
        transform: 'translate(-50%, -50%)',
        width: barWidth,
        height: barHeight,
        opacity: barOpacity,
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius,
        boxShadow: getElevationShadow(elevation),
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Search bar content — fades out during expansion */}
      <div
        style={{
          opacity: searchUIOpacity,
          display: 'flex',
          alignItems: 'center',
          height: 50,
          padding: '0 20px',
          flexShrink: 0,
        }}
      >
        {/* Search icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          style={{ marginRight: 12, opacity: 0.4 }}
        >
          <circle cx="11" cy="11" r="7" stroke="#666" strokeWidth="2" />
          <path d="M16 16L20 20" stroke="#666" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* Text input */}
        <span
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            fontSize: 16,
            color: '#333',
            flex: 1,
          }}
        >
          {displayText}
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 20,
              background: '#007AFF',
              marginLeft: 1,
              verticalAlign: 'middle',
              opacity: cursorVisible ? 1 : 0,
            }}
          />
        </span>
      </div>

      {/* v0.29: Website content renders INSIDE the expanding bar.
          Same container, content swap — the bar IS the website.
          Fades in as search UI fades out. Clipped by overflow:hidden. */}
      {isExpanding && renderExpandedContent && expandProgress > 0.15 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: interpolate(expandProgress, [0.15, 0.55], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            overflow: 'hidden',
          }}
        >
          {renderExpandedContent()}
        </div>
      )}
    </div>
  );
};

/**
 * Calculate typing progress for a given frame
 */
export function getTypingProgress(
  frame: number,
  startFrame: number,
  text: string,
  framesPerChar: number = 3
): number {
  const totalFrames = text.length * framesPerChar;
  return interpolate(
    frame - startFrame,
    [0, totalFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
}
