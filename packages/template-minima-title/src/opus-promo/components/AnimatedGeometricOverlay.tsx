import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

interface AnimatedGeometricOverlayProps {
  color?: string;
  strokeWidth?: number;
  startFrame?: number;
}

/**
 * Animated geometric line overlay
 * Based on frame analysis: lines appear and move continuously during testimonial scenes
 * White rectangular outlines that animate in and shift position
 */
export const AnimatedGeometricOverlay: React.FC<AnimatedGeometricOverlayProps> = ({
  color = '#FFFFFF',
  strokeWidth = 2,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) {
    return null;
  }

  // Continuous motion - lines drift slowly
  const drift = relativeFrame * 0.3;

  // Fade in over first 10 frames
  const opacity = interpolate(
    relativeFrame,
    [0, 10],
    [0, 0.9],
    { extrapolateRight: 'clamp' }
  );

  // Lines draw in from corners
  const drawProgress = interpolate(
    relativeFrame,
    [0, 20],
    [0, 1],
    {
      easing: Easing.out(Easing.ease),
      extrapolateRight: 'clamp',
    }
  );

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        opacity,
      }}
      viewBox="0 0 1920 1080"
    >
      {/* Top-left corner - two nested rectangles */}
      <g transform={`translate(${drift * 0.5}, ${drift * 0.3})`}>
        <rect
          x="60"
          y="60"
          width={180 * drawProgress}
          height={120 * drawProgress}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <rect
          x="100"
          y="90"
          width={100 * drawProgress}
          height={60 * drawProgress}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>

      {/* Top-right corner */}
      <g transform={`translate(${-drift * 0.4}, ${drift * 0.2})`}>
        <rect
          x={1920 - 220}
          y="80"
          width={160 * drawProgress}
          height={100 * drawProgress}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>

      {/* Bottom-left corner */}
      <g transform={`translate(${drift * 0.3}, ${-drift * 0.4})`}>
        <rect
          x="80"
          y={1080 - 180}
          width={140 * drawProgress}
          height={100 * drawProgress}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>

      {/* Bottom-right corner - larger rectangle */}
      <g transform={`translate(${-drift * 0.3}, ${-drift * 0.2})`}>
        <rect
          x={1920 - 280}
          y={1080 - 160}
          width={200 * drawProgress}
          height={100 * drawProgress}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <rect
          x={1920 - 240}
          y={1080 - 130}
          width={120 * drawProgress}
          height={50 * drawProgress}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>

      {/* Center accent lines */}
      <g opacity={0.5}>
        <line
          x1={960 - 60 * drawProgress}
          y1="50"
          x2={960 + 60 * drawProgress}
          y2="50"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <line
          x1={960 - 40 * drawProgress}
          y1={1080 - 50}
          x2={960 + 40 * drawProgress}
          y2={1080 - 50}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>
    </svg>
  );
};
