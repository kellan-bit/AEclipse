/**
 * TitleCard Component
 *
 * Displays the video title with elegant animations.
 * Supports main title, subtitle, and optional accent text.
 *
 * "Where design meets discipline, and every detail earns its place."
 */

import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { colors, fonts, fontSizes } from '@minima/brand';

type TitleCardProps = {
  title: string;
  subtitle?: string;
  accentText?: string;  // Italic accent (uses Honest font)
  startFrame?: number;
  color?: string;
  backgroundColor?: string;
};

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  accentText,
  startFrame = 0,
  color = colors.white,
  backgroundColor = colors.black,
}) => {
  const frame = useCurrentFrame();

  // Title animation
  const titleProgress = interpolate(
    frame,
    [startFrame, startFrame + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1], {
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });
  const titleY = interpolate(titleProgress, [0, 1], [40, 0], {
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });

  // Subtitle animation (delayed)
  const subtitleStartFrame = startFrame + 15;
  const subtitleProgress = interpolate(
    frame,
    [subtitleStartFrame, subtitleStartFrame + 25],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);
  const subtitleY = interpolate(subtitleProgress, [0, 1], [30, 0], {
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });

  // Accent text animation (further delayed)
  const accentStartFrame = startFrame + 30;
  const accentProgress = interpolate(
    frame,
    [accentStartFrame, accentStartFrame + 25],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const accentOpacity = interpolate(accentProgress, [0, 1], [0, 1]);

  // Decorative line animation
  const lineProgress = interpolate(
    frame,
    [startFrame + 10, startFrame + 40],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const lineWidth = interpolate(lineProgress, [0, 1], [0, 80], {
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 80,
      }}
    >
      {/* Main Title */}
      <h1
        style={{
          color,
          fontFamily: fonts.primary,
          fontSize: fontSizes.display.md,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          textAlign: 'center',
          margin: 0,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {title}
      </h1>

      {/* Decorative Line */}
      <div
        style={{
          width: lineWidth,
          height: 1,
          backgroundColor: colors.taupe,
          marginTop: 32,
          marginBottom: 32,
        }}
      />

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            color: colors.taupe,
            fontFamily: fonts.primary,
            fontSize: fontSizes.body.xl,
            fontWeight: 400,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textAlign: 'center',
            margin: 0,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Accent Text (Italic - Honest font) */}
      {accentText && (
        <p
          style={{
            color,
            fontFamily: fonts.accent,
            fontSize: fontSizes.heading.h3,
            fontWeight: 400,
            fontStyle: 'italic',
            textAlign: 'center',
            margin: 0,
            marginTop: 24,
            opacity: accentOpacity,
          }}
        >
          {accentText}
        </p>
      )}
    </AbsoluteFill>
  );
};
