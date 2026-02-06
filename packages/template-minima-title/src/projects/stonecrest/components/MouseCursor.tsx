/**
 * MouseCursor Component - v0.14
 *
 * CHANGELOG:
 * - v0.14: Simplified hesitation to subtle 1-2px drift (was exaggerated sine waves)
 *   - Removed layered sine/cosine jitter
 *   - Click animation now uses proper easing
 *   - Overall more subtle and professional
 *
 * - v0.12: Initial implementation with theatrical hesitation
 *
 * LESSONS APPLIED:
 * - Lesson 7: Professional Animation = Consistency Over Effects
 * - Subtlety over theatricality
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
        transition: isClicking ? 'none' : 'transform 0.05s ease-out',
      }}
    >
      {/* Apple-style pointer cursor */}
      <svg
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cursor outline (black) */}
        <path
          d="M2 2L2 28L8.5 21.5L13 32L17 30.5L12.5 20L22 20L2 2Z"
          fill="black"
          stroke="black"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Cursor fill (white) */}
        <path
          d="M4 5L4 24L9 19L13.5 29L15 28.5L10.5 19L19 19L4 5Z"
          fill="white"
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
