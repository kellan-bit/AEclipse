import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';

interface AnimatedOpusIntroProps {
  productName?: string;
  version?: string;
  screenshotsImage?: string;
}

/**
 * Animated Opus Intro based on frame analysis:
 * - Frame 600: "Opus 4.5" appears
 * - Frame 620: "Introducing" fades in above
 * - Frame 640: Version changes to "4.6"
 * - Frame 680-700: Screenshots animate in from edges
 */
export const AnimatedOpusIntro: React.FC<AnimatedOpusIntroProps> = ({
  productName = 'Opus',
  version = '4.6',
  screenshotsImage = 'assets/opus-screenshots.png',
}) => {
  const frame = useCurrentFrame();

  // Phase 1: Product name appears (frame 0)
  const nameOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Phase 2: "Introducing" appears (frame 20)
  const introducingOpacity = interpolate(frame, [20, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const introducingY = interpolate(frame, [20, 30], [15, 0], {
    easing: Easing.out(Easing.ease),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 3: Version number appears (frame 40)
  const versionOpacity = interpolate(frame, [40, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 4: Screenshots animate in (frame 80-120)
  const screenshotsOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const screenshotsScale = interpolate(frame, [80, 120], [1.1, 1], {
    easing: Easing.out(Easing.ease),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Screenshots background (animates in last) */}
      {frame >= 80 && (
        <AbsoluteFill
          style={{
            opacity: screenshotsOpacity,
            transform: `scale(${screenshotsScale})`,
          }}
        >
          <Img
            src={staticFile(screenshotsImage)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </AbsoluteFill>
      )}

      {/* Center text container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
          backgroundColor: frame >= 80 ? 'rgba(255,255,255,0.85)' : 'transparent',
          padding: frame >= 80 ? '20px 40px' : 0,
          borderRadius: 4,
        }}
      >
        {/* "Introducing" text */}
        <div
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 24,
            fontStyle: 'italic',
            color: '#1A1A1A',
            opacity: introducingOpacity,
            transform: `translateY(${introducingY}px)`,
            marginBottom: 8,
          }}
        >
          Introducing
        </div>

        {/* Product name + version */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 72,
              fontWeight: 400,
              color: '#1A1A1A',
              opacity: nameOpacity,
            }}
          >
            {productName}
          </span>
          <span
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 72,
              fontWeight: 400,
              color: '#1A1A1A',
              opacity: versionOpacity,
            }}
          >
            {version}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
