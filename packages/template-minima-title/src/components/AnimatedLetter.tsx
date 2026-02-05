/**
 * AnimatedLetter Component
 *
 * Individual letter animation with multiple creative styles.
 * Each letter can have a unique entrance animation while maintaining
 * the refined, elegant Minima aesthetic.
 */

import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { colors, fonts } from '@minima/brand';

export type LetterAnimation =
  | 'slideUp'       // Slides up from below
  | 'slideDown'     // Slides down from above
  | 'scaleRotate'   // Scales up with subtle rotation
  | 'maskReveal'    // Horizontal mask reveal
  | 'fadeScale'     // Fade in with scale
  | 'splitReveal'   // Splits and reveals from center
  | 'bounceIn'      // Gentle bounce entrance
  | 'typewriter';   // Sharp, instant appearance

type AnimatedLetterProps = {
  letter: string;
  index: number;
  startFrame: number;
  duration?: number;
  animation?: LetterAnimation;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  staggerDelay?: number;
};

export const AnimatedLetter: React.FC<AnimatedLetterProps> = ({
  letter,
  index,
  startFrame,
  duration = 20,
  animation = 'slideUp',
  color = colors.white,
  fontSize = 120,
  fontFamily = fonts.primary,
  staggerDelay = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate this letter's animation start based on index and stagger
  const letterStart = startFrame + (index * staggerDelay);
  const letterEnd = letterStart + duration;

  // Progress for this letter (0 to 1)
  const progress = interpolate(
    frame,
    [letterStart, letterEnd],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Get animation values based on type
  const getAnimationStyle = (): React.CSSProperties => {
    switch (animation) {
      case 'slideUp': {
        const y = interpolate(progress, [0, 1], [60, 0], {
          easing: Easing.bezier(0.33, 1, 0.68, 1), // easeOutCubic
        });
        const opacity = interpolate(progress, [0, 0.3, 1], [0, 1, 1]);
        return {
          transform: `translateY(${y}px)`,
          opacity,
        };
      }

      case 'slideDown': {
        const y = interpolate(progress, [0, 1], [-60, 0], {
          easing: Easing.bezier(0.33, 1, 0.68, 1),
        });
        const opacity = interpolate(progress, [0, 0.3, 1], [0, 1, 1]);
        return {
          transform: `translateY(${y}px)`,
          opacity,
        };
      }

      case 'scaleRotate': {
        const scale = interpolate(progress, [0, 1], [0.3, 1], {
          easing: Easing.bezier(0.34, 1.56, 0.64, 1), // easeOutBack
        });
        const rotate = interpolate(progress, [0, 1], [-15, 0], {
          easing: Easing.bezier(0.33, 1, 0.68, 1),
        });
        const opacity = interpolate(progress, [0, 0.2, 1], [0, 1, 1]);
        return {
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          opacity,
        };
      }

      case 'maskReveal': {
        const clipRight = interpolate(progress, [0, 1], [100, 0], {
          easing: Easing.bezier(0.65, 0, 0.35, 1), // easeInOutCubic
        });
        return {
          clipPath: `inset(0 ${clipRight}% 0 0)`,
          opacity: 1,
        };
      }

      case 'fadeScale': {
        const scale = interpolate(progress, [0, 1], [0.8, 1], {
          easing: Easing.bezier(0.33, 1, 0.68, 1),
        });
        const opacity = interpolate(progress, [0, 1], [0, 1], {
          easing: Easing.bezier(0.33, 1, 0.68, 1),
        });
        return {
          transform: `scale(${scale})`,
          opacity,
        };
      }

      case 'splitReveal': {
        const scaleY = interpolate(progress, [0, 0.5, 1], [0, 1, 1], {
          easing: Easing.bezier(0.65, 0, 0.35, 1),
        });
        const opacity = interpolate(progress, [0, 0.1, 1], [0, 1, 1]);
        return {
          transform: `scaleY(${scaleY})`,
          transformOrigin: 'center center',
          opacity,
        };
      }

      case 'bounceIn': {
        const scale = interpolate(progress, [0, 0.6, 0.8, 1], [0, 1.1, 0.95, 1], {
          easing: Easing.linear,
        });
        const opacity = interpolate(progress, [0, 0.2, 1], [0, 1, 1]);
        return {
          transform: `scale(${scale})`,
          opacity,
        };
      }

      case 'typewriter': {
        const opacity = progress > 0.1 ? 1 : 0;
        return {
          opacity,
        };
      }

      default:
        return { opacity: 1 };
    }
  };

  const animationStyle = getAnimationStyle();

  return (
    <span
      style={{
        display: 'inline-block',
        color,
        fontSize,
        fontFamily,
        fontWeight: 500,
        letterSpacing: '0.15em',
        ...animationStyle,
      }}
    >
      {letter}
    </span>
  );
};
