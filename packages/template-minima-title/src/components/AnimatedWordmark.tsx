/**
 * AnimatedWordmark Component
 *
 * The MINIMA wordmark with creative per-letter animations.
 * Each letter has its own unique entrance while maintaining cohesion.
 *
 * Animation sequence creates a dynamic, sophisticated reveal
 * that embodies the brand's refined aesthetic.
 */

import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { colors, fonts, brand } from '@minima/brand';
import { AnimatedLetter, LetterAnimation } from './AnimatedLetter';

type AnimatedWordmarkProps = {
  startFrame?: number;
  color?: string;
  fontSize?: number;
  showTagline?: boolean;
  showTrademark?: boolean;
  animationStyle?: 'mixed' | 'uniform';
  uniformAnimation?: LetterAnimation;
};

// Creative animation assignments for each letter in MINIMA
const letterAnimations: LetterAnimation[] = [
  'slideUp',      // M - rises with confidence
  'fadeScale',    // I - subtle scale entrance
  'maskReveal',   // N - reveals horizontally
  'scaleRotate',  // I - slight rotation flair
  'slideUp',      // M - mirrors first M
  'bounceIn',     // A - gentle bounce to finish
];

export const AnimatedWordmark: React.FC<AnimatedWordmarkProps> = ({
  startFrame = 0,
  color = colors.white,
  fontSize = 120,
  showTagline = false,
  showTrademark = true,
  animationStyle = 'mixed',
  uniformAnimation = 'slideUp',
}) => {
  const frame = useCurrentFrame();
  const letters = brand.logo.wordmark.text.split(''); // ['M', 'I', 'N', 'I', 'M', 'A']

  // Trademark animation (appears after all letters)
  const tmStartFrame = startFrame + (letters.length * 4) + 15;
  const tmProgress = interpolate(
    frame,
    [tmStartFrame, tmStartFrame + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const tmOpacity = interpolate(tmProgress, [0, 1], [0, 1], {
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });

  // Tagline animation (appears after trademark)
  const taglineStartFrame = tmStartFrame + 20;
  const taglineProgress = interpolate(
    frame,
    [taglineStartFrame, taglineStartFrame + 25],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const taglineOpacity = interpolate(taglineProgress, [0, 1], [0, 1]);
  const taglineY = interpolate(taglineProgress, [0, 1], [20, 0], {
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {/* Wordmark */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
        }}
      >
        {letters.map((letter, index) => (
          <AnimatedLetter
            key={index}
            letter={letter}
            index={index}
            startFrame={startFrame}
            animation={
              animationStyle === 'mixed'
                ? letterAnimations[index]
                : uniformAnimation
            }
            color={color}
            fontSize={fontSize}
            fontFamily={fonts.primary}
            staggerDelay={4}
            duration={20}
          />
        ))}

        {/* Trademark symbol */}
        {showTrademark && (
          <span
            style={{
              display: 'inline-block',
              color,
              fontSize: fontSize * 0.25,
              fontFamily: fonts.primary,
              fontWeight: 400,
              marginLeft: 4,
              opacity: tmOpacity,
              verticalAlign: 'super',
            }}
          >
            ™
          </span>
        )}
      </div>

      {/* Tagline */}
      {showTagline && (
        <div
          style={{
            marginTop: fontSize * 0.3,
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          <span
            style={{
              color,
              fontSize: fontSize * 0.14,
              fontFamily: fonts.primary,
              fontWeight: 400,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}
          >
            {brand.logo.withTagline.tagline}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
