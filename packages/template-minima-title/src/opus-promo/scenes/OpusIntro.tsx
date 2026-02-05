import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
  Easing,
} from 'remotion';

interface OpusIntroProps {
  productName?: string;
  version?: string;
  screenshotsImage?: string;
  showScreenshots?: boolean;
}

export const OpusIntro: React.FC<OpusIntroProps> = ({
  productName = 'Opus',
  version = '4.6',
  screenshotsImage = 'assets/opus-screenshots.png',
  showScreenshots = true,
}) => {
  const frame = useCurrentFrame();

  // "Introducing" fade in
  const introducingOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const introducingY = interpolate(frame, [0, 20], [20, 0], {
    easing: Easing.out(Easing.ease),
    extrapolateRight: 'clamp',
  });

  // Product name fade in (slightly delayed)
  const nameOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const nameY = interpolate(frame, [10, 30], [30, 0], {
    easing: Easing.out(Easing.ease),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Screenshots scale in (if showing)
  const screenshotsScale = interpolate(frame, [30, 60], [0.8, 1], {
    easing: Easing.out(Easing.ease),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const screenshotsOpacity = interpolate(frame, [30, 50], [0, 1], {
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
      {/* Screenshots background (if showing) */}
      {showScreenshots && (
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

        {/* Product name */}
        <div
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 72,
            fontWeight: 400,
            color: '#1A1A1A',
            opacity: nameOpacity,
            transform: `translateY(${nameY}px)`,
          }}
        >
          {productName} {version}
        </div>
      </div>
    </AbsoluteFill>
  );
};
