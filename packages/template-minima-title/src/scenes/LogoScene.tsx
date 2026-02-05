/**
 * LogoScene
 *
 * The animated MINIMA wordmark reveal.
 * This scene focuses purely on the elegant logo animation.
 */

import { AbsoluteFill } from 'remotion';
import { colors, themes, type Theme } from '@minima/brand';
import { AnimatedWordmark } from '../components/AnimatedWordmark';

type LogoSceneProps = {
  theme?: Theme;
  showTagline?: boolean;
  fontSize?: number;
};

export const LogoScene: React.FC<LogoSceneProps> = ({
  theme = themes.dark,
  showTagline = true,
  fontSize = 120,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AnimatedWordmark
        startFrame={15}
        color={theme.colors.text}
        fontSize={fontSize}
        showTagline={showTagline}
        showTrademark={true}
        animationStyle="mixed"
      />
    </AbsoluteFill>
  );
};
