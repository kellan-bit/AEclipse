/**
 * TitleCardScene
 *
 * Displays the video title with optional subtitle and accent text.
 * Follows the logo animation and precedes the video transition.
 */

import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { colors, fonts, fontSizes, themes, type Theme } from '@minima/brand';
import { TitleCard } from '../components/TitleCard';

type TitleCardSceneProps = {
  title: string;
  subtitle?: string;
  accentText?: string;
  theme?: Theme;
  startFrame?: number;
};

export const TitleCardScene: React.FC<TitleCardSceneProps> = ({
  title,
  subtitle,
  accentText,
  theme = themes.dark,
  startFrame = 0,
}) => {
  return (
    <TitleCard
      title={title}
      subtitle={subtitle}
      accentText={accentText}
      startFrame={startFrame}
      color={theme.colors.text}
      backgroundColor={theme.colors.background}
    />
  );
};
