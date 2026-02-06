/**
 * SearchBar Component - v0.21
 *
 * CHANGELOG:
 * - v0.21: LEAP 2 - Two-stage emergence from photo strip
 *   - Stage 1: Solidification (emergenceStart → photosFullyMerged)
 *     - Bar appears at 200x60 (matching compressed photo cluster)
 *     - Opacity: 0.2 → 0.7 (ghost → solidifying)
 *   - Stage 2: Growth (photosFullyMerged → searchBarReady)
 *     - Width: 200 → 500, Height: 60 → 50
 *     - Border-radius: 16 → 25 (pill shape)
 *     - Opacity: 0.7 → 1.0
 *   - Photos dissolve AS bar solidifies (overlapping phases)
 *
 * - v0.17: Spring physics for expansion
 *   - Uses SPRING.responsive for snappy UI feel
 *   - Width/height expand with natural overshoot
 *   - Smooth settle into final browser size
 *
 * - v0.15: Keep content visible until 70%
 *
 * Search bar with typing animation and expand to browser
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { createSpring, springTo } from '../motion';

interface SearchBarProps {
  text: string;
  typingProgress: number;         // 0 = empty, 1 = fully typed
  emergenceStartFrame: number;    // v0.21: Frame when bar ghost appears
  photosFullyMergedFrame: number; // v0.21: Frame when photos are gone, bar solidifies
  searchBarReadyFrame: number;    // v0.21: Frame when bar is at full 500x50
  expandStartFrame: number;       // v0.17: Frame when expansion starts (for spring)
  visible: boolean;
  centerX: number;
  centerY: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
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

  // Characters to show based on typing progress
  const charsToShow = Math.floor(text.length * typingProgress);
  const displayText = text.slice(0, charsToShow);

  // Cursor blink
  const cursorVisible = Math.floor(frame / 15) % 2 === 0 || typingProgress < 1;

  // ============================================
  // v0.21: Two-stage emergence from photo strip
  // ============================================

  let barWidth: number;
  let barHeight: number;
  let borderRadius: number;
  let barOpacity: number;

  // Stage 1: Solidification (emergence → photosFullyMerged)
  // Bar appears at photo strip dimensions, opacity increases
  const isSolidifying = frame >= emergenceStartFrame && frame < photosFullyMergedFrame;

  // Stage 2: Growth (photosFullyMerged → searchBarReady)
  // Bar grows from 200x60 to 500x50
  const isGrowing = frame >= photosFullyMergedFrame && frame < expandStartFrame;

  // Stage 3: Expansion (expandStart → browser size)
  const isExpanding = expandStartFrame > 0 && frame >= expandStartFrame;

  if (isSolidifying) {
    // Stage 1: Solidification - match photo strip, fade in
    const solidificationDuration = photosFullyMergedFrame - emergenceStartFrame;
    const solidifyProgress = (frame - emergenceStartFrame) / solidificationDuration;

    barWidth = 200;   // Match compressed photo strip
    barHeight = 60;   // Match photo height
    borderRadius = 16; // Rounded but not pill-shaped yet
    barOpacity = interpolate(solidifyProgress, [0, 1], [0.2, 0.7]);
  } else if (isGrowing) {
    // Stage 2: Growth - spring to full search bar size
    const growthSpring = createSpring(frame - photosFullyMergedFrame, fps, 'responsive', 0);

    barWidth = springTo(growthSpring, [200, 500]);
    barHeight = springTo(growthSpring, [60, 50]);
    borderRadius = springTo(growthSpring, [16, 25]); // Become pill-shaped
    barOpacity = springTo(growthSpring, [0.7, 1.0]);
  } else if (isExpanding) {
    // Stage 3: Expansion to browser
    const expandSpring = createSpring(frame - expandStartFrame, fps, 'responsive', 0);

    barWidth = springTo(expandSpring, [500, 1600]);
    barHeight = springTo(expandSpring, [50, 900]);
    borderRadius = springTo(expandSpring, [25, 12]);
    barOpacity = 1;
  } else {
    // Static search bar (after growth, before expansion)
    barWidth = 500;
    barHeight = 50;
    borderRadius = 25;
    barOpacity = 1;
  }

  // Opacity for search bar UI elements (text, icon)
  // v0.15: Keep content visible until 70% of expansion
  const expandSpring = isExpanding
    ? createSpring(frame - expandStartFrame, fps, 'responsive', 0)
    : 0;
  const searchUIOpacity = interpolate(expandSpring, [0, 0.7], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: centerX,
        top: centerY,
        transform: 'translate(-50%, -50%)',
        width: barWidth,
        height: barHeight,
        // v0.21: Opacity driven by emergence stage
        opacity: barOpacity,
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius,
        // v0.21: Shadow grows with emergence (subtle during solidification)
        boxShadow: isSolidifying
          ? '0 4px 20px rgba(0,0,0,0.1)'
          : '0 8px 40px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Search bar content (fades out during expand) */}
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
          {/* Typing cursor */}
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
 * Returns 0-1 based on character timing
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
