import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { AnimatedTweetCard } from '../components/AnimatedTweetCard';
import { AnimatedGeometricOverlay } from '../components/AnimatedGeometricOverlay';

interface AnimatedTestimonialSceneProps {
  backgroundImage: string;
  username: string;
  handle?: string;
  tweetText: string;
  verified?: boolean;
  profileColor?: string;
  showGeometricOverlay?: boolean;
  tweetPosition?: 'center' | 'bottom-left' | 'bottom-center';
  cardAppearFrame?: number;
  textStartFrame?: number;
  framesPerWord?: number;
  zoomAmount?: number;
}

/**
 * Animated Testimonial Scene based on frame analysis:
 * - Background with Ken Burns zoom effect
 * - Geometric overlay animates in (frames 100-108)
 * - Tweet card appears (frame 108-112)
 * - Text types in word-by-word (frame 130+)
 */
export const AnimatedTestimonialScene: React.FC<AnimatedTestimonialSceneProps> = ({
  backgroundImage,
  username,
  handle,
  tweetText,
  verified = true,
  profileColor = '#6B7280',
  showGeometricOverlay = true,
  tweetPosition = 'bottom-left',
  cardAppearFrame = 10,
  textStartFrame = 30,
  framesPerWord = 3,
  zoomAmount = 0.05,
}) => {
  const frame = useCurrentFrame();

  // Ken Burns effect - slow zoom
  const scale = interpolate(frame, [0, 150], [1, 1 + zoomAmount], {
    extrapolateRight: 'clamp',
  });

  // Position styles for tweet card
  const positionStyles: Record<string, React.CSSProperties> = {
    center: {
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

      {/* Geometric overlay - animates in */}
      {showGeometricOverlay && (
        <AnimatedGeometricOverlay startFrame={0} />
      )}

      {/* Animated Tweet card */}
      <AbsoluteFill style={positionStyles[tweetPosition]}>
        <AnimatedTweetCard
          username={username}
          handle={handle}
          text={tweetText}
          verified={verified}
          profileColor={profileColor}
          cardAppearFrame={cardAppearFrame}
          textStartFrame={textStartFrame}
          framesPerWord={framesPerWord}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
