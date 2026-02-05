/**
 * LogoScene
 *
 * The animated MINIMA wordmark reveal.
 * This scene focuses purely on the elegant logo animation.
 */

import { AbsoluteFill } from 'remotion';
import { themes } from '@minima/brand';
import { AnimatedWordmark } from '../components/AnimatedWordmark';

type LogoSceneProps = {
  themeName?: 'dark' | 'light' | 'contrast' | 'warm';
  showTagline?: boolean;
  fontSize?: number;
};

export const LogoScene: React.FC<LogoSceneProps> = ({
  themeName = 'dark',
  showTagline = true,
  fontSize = 120,
}) => {
  const theme = themes[themeName];

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
