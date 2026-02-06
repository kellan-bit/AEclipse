/**
 * MouseCursor Component - v0.38
 *
 * CHANGELOG:
 * - v0.37: Click transition always animates (was instant pop with 'none')
 *
 * - v0.17.2: Authentic Apple cursor (no outline stroke)
 *   - Removed thick black stroke that made it look hand-drawn
 *   - Single path with white fill and thin black edge
 *   - Matches real macOS pointer appearance
 *
 * - v0.14: Simplified hesitation to subtle 1-2px drift (was exaggerated sine waves)
 *   - Removed layered sine/cosine jitter
 *   - Click animation now uses proper easing
 *   - Overall more subtle and professional
 *
 * - v0.12: Initial implementation with theatrical hesitation
 *
 * LESSONS APPLIED:
 * - Lesson 2: "Apple-Style" Requires Apple Details
 * - Lesson 7: Professional Animation = Consistency Over Effects
 */

import React from 'react';
import { interpolate } from 'remotion';
import { EASE, SCALE } from '../motion';

interface MouseCursorProps {
  x: number;
  y: number;
  isClicking: boolean;
  visible?: boolean;
}

export const MouseCursor: React.FC<MouseCursorProps> = ({
  x,
  y,
  isClicking,
  visible = true,
}) => {
  // Click animation - subtle press (was 0.85, now 0.95)
  const clickScale = isClicking ? SCALE.pressed : SCALE.normal;

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${clickScale})`,
        transformOrigin: 'top left',
        pointerEvents: 'none',
        zIndex: 1000,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        // v0.37: Always use CSS transition — 'none' caused instant pop on click
        transition: 'transform 0.05s ease-out',
      }}
    >
      {/* Apple-style pointer cursor - v0.17.2: No outline stroke */}
      <svg
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Single cursor shape - white fill with subtle black edge */}
        <path
          d="M3 3L3 26L8 21L12 30L15 29L11 20L19 20L3 3Z"
          fill="white"
          stroke="#1a1a1a"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/**
 * Generate mouse position with SUBTLE micro-drift
 * v0.14: Reduced from 8-15px movements to 1-2px max
 */
export function getMousePositionWithHesitation(
  frame: number,
  targetX: number,
  targetY: number,
  hesitationIntensity: number = 1
): { x: number; y: number } {
  // Subtle drift - barely noticeable (1-2px max)
  const driftX = Math.sin(frame * 0.15) * 1.5 * hesitationIntensity;
  const driftY = Math.cos(frame * 0.12) * 1 * hesitationIntensity;

  return {
    x: targetX + driftX,
    y: targetY + driftY,
  };
}

/**
 * Animate mouse from point A to B with easing
 */
export function interpolateMousePosition(
  frame: number,
  startFrame: number,
  endFrame: number,
  startX: number,
  startY: number,
  endX: number,
  endY: number
): { x: number; y: number } {
  const progress = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE.default,
    }
  );

  return {
    x: startX + (endX - startX) * progress,
    y: startY + (endY - startY) * progress,
  };
}
