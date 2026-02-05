import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from 'remotion';

interface Rectangle {
  x: number; // percentage
  y: number;
  width: number;
  height: number;
  delay: number; // frames before this rect starts drawing
}

interface AnimatedRectangleOverlayProps {
  rectangles?: Rectangle[];
  strokeColor?: string;
  strokeWidth?: number;
  drawDuration?: number; // frames to draw each rectangle
}

/**
 * Animated Rectangle Overlay
 *
 * Based on frame 100-110 analysis: Multiple white-outlined rectangles
 * of various sizes that animate in (draw from edges).
 * Used over video backgrounds to add geometric visual interest.
 */
export const AnimatedRectangleOverlay: React.FC<AnimatedRectangleOverlayProps> = ({
  rectangles = defaultRectangles,
  strokeColor = '#FFFFFF',
  strokeWidth = 2,
  drawDuration = 15,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width="100%" height="100%" style={{ position: 'absolute' }}>
        {rectangles.map((rect, index) => {
          const animStart = rect.delay;
          const animEnd = animStart + drawDuration;

          // Calculate perimeter for stroke animation
          const perimeter = 2 * (rect.width + rect.height);

          // Animate stroke dash offset (draw effect)
          const dashOffset = interpolate(
            frame,
            [animStart, animEnd],
            [perimeter, 0],
            {
              easing: Easing.out(Easing.ease),
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }
          );

          // Opacity
          const opacity = interpolate(
            frame,
            [animStart, animStart + 3],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }
          );

          return (
            <rect
              key={index}
              x={`${rect.x}%`}
              y={`${rect.y}%`}
              width={rect.width}
              height={rect.height}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={perimeter}
              strokeDashoffset={dashOffset}
              opacity={opacity}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/**
 * Default rectangle configuration based on frame analysis
 * Rectangles are positioned to create a scattered, dynamic composition
 */
export const defaultRectangles: Rectangle[] = [
  // Large rectangles
  { x: 5, y: 10, width: 200, height: 150, delay: 0 },
  { x: 60, y: 5, width: 180, height: 120, delay: 2 },
  { x: 70, y: 50, width: 220, height: 160, delay: 4 },

  // Medium rectangles
  { x: 15, y: 60, width: 140, height: 100, delay: 3 },
  { x: 45, y: 25, width: 120, height: 90, delay: 5 },
  { x: 80, y: 75, width: 150, height: 110, delay: 6 },

  // Small rectangles
  { x: 25, y: 5, width: 80, height: 60, delay: 4 },
  { x: 5, y: 45, width: 90, height: 70, delay: 7 },
  { x: 50, y: 70, width: 70, height: 50, delay: 8 },
  { x: 85, y: 20, width: 100, height: 75, delay: 5 },

  // Accent lines (very thin rectangles)
  { x: 2, y: 80, width: 120, height: 3, delay: 6 },
  { x: 75, y: 90, width: 150, height: 3, delay: 8 },
];

/**
 * Alternative configuration with fewer, bolder rectangles
 */
export const boldRectangles: Rectangle[] = [
  { x: 10, y: 15, width: 280, height: 200, delay: 0 },
  { x: 55, y: 10, width: 320, height: 220, delay: 3 },
  { x: 5, y: 55, width: 240, height: 180, delay: 5 },
  { x: 60, y: 60, width: 300, height: 200, delay: 7 },
];
