import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';

interface GeometricOverlayProps {
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  startFrame?: number;
  animationDuration?: number;
}

export const GeometricOverlay: React.FC<GeometricOverlayProps> = ({
  color = '#FFFFFF',
  strokeWidth = 2,
  opacity = 0.9,
  startFrame = 0,
  animationDuration = 20,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  // Animate the lines drawing in
  const progress = interpolate(
    relativeFrame,
    [0, animationDuration],
    [0, 1],
    {
      easing: Easing.out(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const lineOpacity = interpolate(relativeFrame, [0, 10], [0, opacity], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Top-left corner rectangles */}
      <g opacity={lineOpacity}>
        {/* Outer rectangle */}
        <rect
          x="40"
          y="40"
          width={200 * progress}
          height={150 * progress}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        {/* Inner rectangle */}
        <rect
          x="80"
          y="80"
          width={120 * progress}
          height={80 * progress}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>

      {/* Top-right corner */}
      <g opacity={lineOpacity}>
        <rect
          x={1920 - 240}
          y="60"
          width={180 * progress}
          height={120 * progress}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>

      {/* Bottom-left diagonal lines */}
      <g opacity={lineOpacity}>
        <line
          x1="0"
          y1={1080 - 100}
          x2={300 * progress}
          y2={1080 - 100 - 200 * progress}
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <line
          x1="0"
          y1={1080 - 50}
          x2={200 * progress}
          y2={1080 - 50 - 150 * progress}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>

      {/* Bottom-right rectangles */}
      <g opacity={lineOpacity}>
        <rect
          x={1920 - 300}
          y={1080 - 200}
          width={240 * progress}
          height={140 * progress}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>

      {/* Center accents */}
      <g opacity={lineOpacity * 0.5}>
        <line
          x1={960 - 100 * progress}
          y1="40"
          x2={960 + 100 * progress}
          y2="40"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <line
          x1={960 - 80 * progress}
          y1={1080 - 40}
          x2={960 + 80 * progress}
          y2={1080 - 40}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </g>
    </svg>
  );
};
