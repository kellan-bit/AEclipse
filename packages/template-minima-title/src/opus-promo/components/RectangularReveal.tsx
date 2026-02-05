import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

interface RectangularRevealProps {
  children: React.ReactNode;
  startFrame: number;
  durationFrames?: number;
}

/**
 * Rectangular expand from center transition
 * Based on frame analysis: frames 168-178 show rectangle expanding outward
 * New scene appears through a growing rectangle in the center
 */
export const RectangularReveal: React.FC<RectangularRevealProps> = ({
  children,
  startFrame,
  durationFrames = 10,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  // Before transition starts, show nothing
  if (relativeFrame < 0) {
    return null;
  }

  // After transition completes, show full content
  if (relativeFrame >= durationFrames) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  // During transition: rectangle expands from center
  const progress = interpolate(
    relativeFrame,
    [0, durationFrames],
    [0, 1],
    {
      easing: Easing.out(Easing.ease),
      extrapolateRight: 'clamp',
    }
  );

  // Start from small rectangle in center, expand to full screen
  const clipWidth = interpolate(progress, [0, 1], [10, 100]);
  const clipHeight = interpolate(progress, [0, 1], [10, 100]);

  const clipPath = `inset(${(100 - clipHeight) / 2}% ${(100 - clipWidth) / 2}% ${(100 - clipHeight) / 2}% ${(100 - clipWidth) / 2}%)`;

  return (
    <AbsoluteFill
      style={{
        clipPath,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
