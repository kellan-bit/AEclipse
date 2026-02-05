import React from 'react';
import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame, Easing } from 'remotion';
import { TweetCard } from '../components/TweetCard';
import { GeometricOverlay } from '../components/GeometricOverlay';

interface TestimonialSceneProps {
  backgroundImage: string;
  username: string;
  handle?: string;
  tweetText: string;
  verified?: boolean;
  profileColor?: string;
  showGeometricOverlay?: boolean;
  tweetPosition?: 'center' | 'bottom-left' | 'bottom-center';
  startFrame?: number;
  zoomAmount?: number;
}

export const TestimonialScene: React.FC<TestimonialSceneProps> = ({
  backgroundImage,
  username,
  handle,
  tweetText,
  verified = true,
  profileColor = '#6B7280',
  showGeometricOverlay = true,
  tweetPosition = 'bottom-left',
  startFrame = 0,
  zoomAmount = 0.05,
}) => {
  const frame = useCurrentFrame();

  // Ken Burns effect - slow zoom
  const scale = interpolate(frame, [0, 150], [1, 1 + zoomAmount], {
    extrapolateRight: 'clamp',
  });

  // Position styles for tweet card
  const positionStyles: Record<string, React.CSSProperties> = {
    'center': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    'bottom-left': {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      padding: 60,
    },
    'bottom-center': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      padding: 60,
    },
  };

  return (
    <AbsoluteFill>
      {/* Background image with Ken Burns */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={staticFile(backgroundImage)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>

      {/* Geometric overlay */}
      {showGeometricOverlay && (
        <GeometricOverlay startFrame={startFrame} />
      )}

      {/* Tweet card */}
      <AbsoluteFill style={positionStyles[tweetPosition]}>
        <TweetCard
          username={username}
          handle={handle}
          text={tweetText}
          verified={verified}
          profileColor={profileColor}
          startFrame={startFrame + 10}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
