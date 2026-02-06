/**
 * SearchBar Component - v0.17
 *
 * CHANGELOG:
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
  typingProgress: number;      // 0 = empty, 1 = fully typed
  expandStartFrame: number;    // v0.17: Frame when expansion starts (for spring)
  visible: boolean;
  centerX: number;
  centerY: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  text,
  typingProgress,
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

  // v0.17: Spring-based expansion (SPRING.responsive for snappy UI)
  const isExpanding = expandStartFrame > 0 && frame >= expandStartFrame;
  const expandSpring = isExpanding
    ? createSpring(frame - expandStartFrame, fps, 'responsive', 0)
    : 0;

  // Bar dimensions - expand from search bar to browser with spring
  const barWidth = springTo(expandSpring, [500, 1600]);
  const barHeight = springTo(expandSpring, [50, 900]);
  const borderRadius = springTo(expandSpring, [25, 12]);

  // Opacity for search bar UI elements
  // v0.15: Keep content visible until 70% (was 30% - too early)
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
        background: expandSpring < 0.5
          ? 'rgba(255, 255, 255, 0.95)'
          : 'rgba(255, 255, 255, 1)',
        borderRadius,
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
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
