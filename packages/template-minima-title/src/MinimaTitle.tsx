/**
 * MinimaTitle Composition
 *
 * Complete title sequence:
 * 1. Logo animation (MINIMA wordmark with per-letter animations)
 * 2. Title card (video title, subtitle, accent text)
 * 3. Seamless transition to video first frame
 *
 * "Minimal homes crafted with intention, precision, and presence."
 */

import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { colors, themes, type Theme } from '@minima/brand';
import { AnimatedWordmark } from './components/AnimatedWordmark';
import { TitleCard } from './components/TitleCard';
import { VideoTransition, TransitionType } from './components/VideoTransition';

export type MinimaTitleProps = {
  // Content
  title: string;
  subtitle?: string;
  accentText?: string;

  // Video/Image to transition to
  videoSrc?: string;
  imageSrc?: string;

  // Styling
  theme?: 'dark' | 'light' | 'contrast' | 'warm';
  logoFontSize?: number;

  // Timing (in frames at 30fps)
  logoDuration?: number;
  titleCardDuration?: number;
  transitionDuration?: number;

  // Transition style
  transitionType?: TransitionType;

  // Options
  showTagline?: boolean;
};

export const MinimaTitle: React.FC<MinimaTitleProps> = ({
  title,
  subtitle,
  accentText,
  videoSrc,
  imageSrc,
  theme: themeName = 'dark',
  logoFontSize = 120,
  logoDuration = 90,       // 3 seconds
  titleCardDuration = 75,  // 2.5 seconds
  transitionDuration = 30, // 1 second
  transitionType = 'fade',
  showTagline = true,
}) => {
  const { fps } = useVideoConfig();
  const theme = themes[themeName];

  // Calculate sequence timing
  const logoStart = 0;
  const titleCardStart = logoDuration;
  const transitionStart = titleCardStart + titleCardDuration;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {/* Scene 1: Logo Animation */}
      <Sequence from={logoStart} durationInFrames={logoDuration}>
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
            fontSize={logoFontSize}
            showTagline={showTagline}
            showTrademark={true}
            animationStyle="mixed"
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Title Card */}
      <Sequence from={titleCardStart} durationInFrames={titleCardDuration + transitionDuration}>
        <VideoTransition
          startFrame={titleCardDuration}
          duration={transitionDuration}
          transitionType={transitionType}
          videoSrc={videoSrc}
          imageSrc={imageSrc}
          backgroundColor={theme.colors.background}
        >
          <TitleCard
            title={title}
            subtitle={subtitle}
            accentText={accentText}
            startFrame={0}
            color={theme.colors.text}
            backgroundColor={theme.colors.background}
          />
        </VideoTransition>
      </Sequence>
    </AbsoluteFill>
  );
};
