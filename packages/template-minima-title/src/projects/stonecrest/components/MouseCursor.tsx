/**
 * MouseCursor Component
 * Apple-style pointer cursor with click and hesitation states
 */

import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

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
  const frame = useCurrentFrame();

  // Click animation - cursor presses down slightly
  const clickScale = isClicking ? 0.85 : 1;
  const clickY = isClicking ? 2 : 0;

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${clickScale}) translateY(${clickY}px)`,
        pointerEvents: 'none',
        zIndex: 1000,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
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
 * Generate mouse position with hesitation micro-movements
 */
export function getMousePositionWithHesitation(
  frame: number,
  targetX: number,
  targetY: number,
  hesitationIntensity: number = 1
): { x: number; y: number } {
  // Micro-movements that feel human
  const jitterX = Math.sin(frame * 0.5) * 3 * hesitationIntensity +
                  Math.sin(frame * 1.3) * 2 * hesitationIntensity;
  const jitterY = Math.cos(frame * 0.7) * 2 * hesitationIntensity +
                  Math.cos(frame * 1.1) * 1.5 * hesitationIntensity;

  // Occasional larger "uncertain" movements
  const uncertaintyX = Math.sin(frame * 0.1) * 8 * hesitationIntensity;
  const uncertaintyY = Math.cos(frame * 0.15) * 5 * hesitationIntensity;

  return {
    x: targetX + jitterX + uncertaintyX,
    y: targetY + jitterY + uncertaintyY,
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
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Apple's default easing
    }
  );

  return {
    x: startX + (endX - startX) * progress,
    y: startY + (endY - startY) * progress,
  };
}
