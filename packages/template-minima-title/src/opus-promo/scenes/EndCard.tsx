import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from 'remotion';

interface EndCardProps {
  productName?: string;
  version?: string;
  brandName?: string;
}

export const EndCard: React.FC<EndCardProps> = ({
  productName = 'Opus',
  version = '4.6',
  brandName = 'ANTHROPIC',
}) => {
  const frame = useCurrentFrame();

  // Fade in animation
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(frame, [0, 20], [0.95, 1], {
    easing: Easing.out(Easing.ease),
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 16,
        }}
      >
        {/* Product name */}
        <span
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 56,
            fontWeight: 400,
            color: '#1A1A1A',
          }}
        >
          {productName} {version}
        </span>

        {/* "by" text */}
        <span
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 32,
            fontWeight: 400,
            color: '#1A1A1A',
          }}
        >
          by
        </span>

        {/* Brand name */}
        <span
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 48,
            fontWeight: 600,
            letterSpacing: '0.05em',
            color: '#1A1A1A',
          }}
        >
          {brandName}
        </span>
      </div>
    </AbsoluteFill>
  );
};
