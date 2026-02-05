/**
 * Complete Minima Title Sequence Example
 *
 * This example shows the full title sequence:
 * 1. Animated MINIMA wordmark
 * 2. Title card with property info
 * 3. Seamless transition to video
 */

import { AbsoluteFill, Sequence, staticFile } from 'remotion';
import { colors, themes } from '@minima/brand';
import {
  AnimatedWordmark,
  TitleCard,
  VideoTransition,
} from 'template-minima-title/components';

// Props for customizing the title sequence
type MinimaTitleExampleProps = {
  // Content
  propertyName: string;
  propertyDetails: string;
  tagline: string;

  // Video asset
  videoFile: string;

  // Styling
  theme?: 'dark' | 'light';
  transitionType?: 'fade' | 'fadeToBlack' | 'scaleReveal' | 'slideUp' | 'maskWipe' | 'zoomThrough';
};

export const MinimaTitleExample: React.FC<MinimaTitleExampleProps> = ({
  propertyName,
  propertyDetails,
  tagline,
  videoFile,
  theme: themeName = 'dark',
  transitionType = 'fade',
}) => {
  const theme = themes[themeName];

  // Timing configuration (frames at 30fps)
  const LOGO_DURATION = 90;        // 3 seconds
  const TITLE_CARD_DURATION = 75;  // 2.5 seconds
  const TRANSITION_DURATION = 30;  // 1 second

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {/* ═══════════════════════════════════════════════════════════════
          SCENE 1: LOGO ANIMATION
          Frames 0-90 (0s - 3s)
          ═══════════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={LOGO_DURATION}>
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
            fontSize={120}
            showTagline={true}
            showTrademark={true}
            animationStyle="mixed"
          />
        </AbsoluteFill>
      </Sequence>

      {/* ═══════════════════════════════════════════════════════════════
          SCENE 2: TITLE CARD → VIDEO TRANSITION
          Frames 90-195 (3s - 6.5s)
          ═══════════════════════════════════════════════════════════════ */}
      <Sequence
        from={LOGO_DURATION}
        durationInFrames={TITLE_CARD_DURATION + TRANSITION_DURATION}
      >
        <VideoTransition
          startFrame={TITLE_CARD_DURATION}
          duration={TRANSITION_DURATION}
          transitionType={transitionType}
          videoSrc={staticFile(videoFile)}
          backgroundColor={theme.colors.background}
        >
          <TitleCard
            title={propertyName}
            subtitle={propertyDetails}
            accentText={tagline}
            startFrame={0}
            color={theme.colors.text}
            backgroundColor={theme.colors.background}
          />
        </VideoTransition>
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * Usage Example:
 *
 * <MinimaTitleExample
 *   propertyName="The Rosa Blanca"
 *   propertyDetails="4 Bed • 4.5 Bath • 4,100 SF"
 *   tagline="Where design meets discipline"
 *   videoFile="rosa-blanca-tour.mp4"
 *   theme="dark"
 *   transitionType="fade"
 * />
 *
 * Required setup:
 * 1. Place video in public/ folder
 * 2. Register composition in Root.tsx with durationInFrames={195}
 * 3. Run: npm run dev
 */
