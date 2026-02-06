/**
 * SearchBar Component - v0.26
 *
 * REFACTORED to use new motion infrastructure.
 *
 * CHANGES FROM v0.25:
 * - Uses useSpring, useSpringMulti, usePhaseProgress from motion/hooks
 * - Cleaner phase detection with useInPhase
 * - Multi-value springs replace manual springTo calls
 * - More declarative, less imperative code
 *
 * This serves as a proof-of-concept for the new motion system.
 * Once validated, other components will be refactored similarly.
 *
 * LESSONS APPLIED:
 * - Declarative motion > imperative interpolation
 * - Named presets > magic numbers
 * - Hooks > class instances in React
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import {
  useSpring,
  useSpringMulti,
  usePhaseProgress,
  useInPhase,
  SPRING_PRESETS,
  getElevationShadow,
  ELEVATION,
  // v0.28: Momentum for solidification — "catching" energy from dissolving photos
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
}

// ============================================
// ANIMATION CONSTANTS
// Defined at top for easy tuning
// ============================================

const DIMENSIONS = {
  // Stage 1: Solidification (matches photo cluster)
  solidify: { width: 340, height: 86, borderRadius: 8 },
  // Stage 2: Growth (full search bar)
  ready: { width: 500, height: 50, borderRadius: 25 },
  // Stage 3: Expansion (browser viewport)
  expanded: { width: 1600, height: 900, borderRadius: 12 },
};

const OPACITY = {
  ghostStart: 0.2,
  solidified: 0.7,
  full: 1.0,
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
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!visible) return null;

  // ============================================
  // PHASE DETECTION (Clean boolean flags)
  // ============================================

  const solidifyDuration = photosFullyMergedFrame - emergenceStartFrame;
  const growthDuration = expandStartFrame - photosFullyMergedFrame;

  const isSolidifying = useInPhase(emergenceStartFrame, solidifyDuration);
  const isGrowing = useInPhase(photosFullyMergedFrame, growthDuration);
  const isExpanding = frame >= expandStartFrame;

  // ============================================
  // STAGE 1: SOLIDIFICATION
  // v0.28: Bar materializes with momentum — "catches" energy from dissolving photos.
  // Uses 'bounce' momentum curve: slight overshoot in opacity then settles.
  // This creates the feeling that the photos' energy PUSHED the bar into existence.
  // ============================================

  const solidifyProgress = usePhaseProgress(
    emergenceStartFrame,
    solidifyDuration,
    getMomentumCurve('bounce')
  );

  // ============================================
  // STAGE 2: GROWTH
  // Bar springs to full search bar size
  // Using useSpringMulti for coordinated animation
  // ============================================

  const growthValues = useSpringMulti(
    {
      width: [DIMENSIONS.solidify.width, DIMENSIONS.ready.width],
      height: [DIMENSIONS.solidify.height, DIMENSIONS.ready.height],
      borderRadius: [DIMENSIONS.solidify.borderRadius, DIMENSIONS.ready.borderRadius],
      opacity: [OPACITY.solidified, OPACITY.full],
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
  // COMPUTE FINAL VALUES
  // Select from appropriate stage
  // ============================================

  let barWidth: number;
  let barHeight: number;
  let borderRadius: number;
  let barOpacity: number;

  if (isSolidifying) {
    // Stage 1: Fixed dimensions, fading in
    barWidth = DIMENSIONS.solidify.width;
    barHeight = DIMENSIONS.solidify.height;
    borderRadius = DIMENSIONS.solidify.borderRadius;
    barOpacity = OPACITY.ghostStart + solidifyProgress * (OPACITY.solidified - OPACITY.ghostStart);
  } else if (isGrowing) {
    // Stage 2: Spring to search bar size
    barWidth = growthValues.width;
    barHeight = growthValues.height;
    borderRadius = growthValues.borderRadius;
    barOpacity = growthValues.opacity;
  } else if (isExpanding) {
    // Stage 3: Expand to browser
    barWidth = expandValues.width;
    barHeight = expandValues.height;
    borderRadius = expandValues.borderRadius;
    barOpacity = OPACITY.full;
  } else {
    // Static state (between stages)
    barWidth = DIMENSIONS.ready.width;
    barHeight = DIMENSIONS.ready.height;
    borderRadius = DIMENSIONS.ready.borderRadius;
    barOpacity = OPACITY.full;
  }

  // ============================================
  // UI CONTENT OPACITY
  // Fades out during expansion (content dissolves into website)
  // ============================================

  const expandProgress = usePhaseProgress(expandStartFrame, 40, 'easeIn');
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
      {/* Search bar content */}
      <div
        style={{
          opacity: searchUIOpacity,
          display: 'flex',
          alignItems: 'center',
          height: 50,
          padding: '0 20px',
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
