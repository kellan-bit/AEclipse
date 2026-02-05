/**
 * TitleCardScene
 *
 * Displays the video title with optional subtitle and accent text.
 * Follows the logo animation and precedes the video transition.
 */

import { themes } from '@minima/brand';
import { TitleCard } from '../components/TitleCard';

type TitleCardSceneProps = {
  title: string;
  subtitle?: string;
  accentText?: string;
  themeName?: 'dark' | 'light' | 'contrast' | 'warm';
  startFrame?: number;
};

export const TitleCardScene: React.FC<TitleCardSceneProps> = ({
  title,
  subtitle,
  accentText,
  themeName = 'dark',
  startFrame = 0,
}) => {
  const theme = themes[themeName];

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
