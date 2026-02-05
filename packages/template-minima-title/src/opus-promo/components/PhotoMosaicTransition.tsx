import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  Easing,
  staticFile,
} from 'remotion';

interface MosaicImage {
  src: string;
  initialX: number; // percentage from center
  initialY: number;
  rotation: number; // degrees
  scale: number;
  delay: number; // frames before this image starts animating
}

interface PhotoMosaicTransitionProps {
  images: MosaicImage[];
  durationFrames?: number;
  animationStyle?: 'scale_in' | 'fly_in' | 'scatter';
}

/**
 * Photo Mosaic Transition
 *
 * Multiple images scale/rotate in from scattered positions to fill the frame.
 * Based on frame 550 analysis: 8-12 overlapping images with rotation and shadows.
 */
export const PhotoMosaicTransition: React.FC<PhotoMosaicTransitionProps> = ({
  images,
  durationFrames = 30,
  animationStyle = 'scale_in',
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F5F5F5',
        overflow: 'hidden',
      }}
    >
      {images.map((image, index) => {
        const animationStart = image.delay;
        const animationEnd = animationStart + 20;

        // Scale animation
        const scale = interpolate(
          frame,
          [animationStart, animationEnd],
          [0.3, image.scale],
          {
            easing: Easing.out(Easing.back(1.2)),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );

        // Position animation (from center outward)
        const x = interpolate(
          frame,
          [animationStart, animationEnd],
          [0, image.initialX],
          {
            easing: Easing.out(Easing.ease),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );

        const y = interpolate(
          frame,
          [animationStart, animationEnd],
          [0, image.initialY],
          {
            easing: Easing.out(Easing.ease),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );

        // Rotation animation
        const rotation = interpolate(
          frame,
          [animationStart, animationEnd],
          [0, image.rotation],
          {
            easing: Easing.out(Easing.ease),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );

        // Opacity
        const opacity = interpolate(
          frame,
          [animationStart, animationStart + 5],
          [0, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${x}%, ${y}%) rotate(${rotation}deg) scale(${scale})`,
              opacity,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              borderRadius: 4,
              overflow: 'hidden',
              zIndex: index,
            }}
          >
            <Img
              src={staticFile(image.src)}
              style={{
                width: 300,
                height: 200,
                objectFit: 'cover',
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * Default mosaic configuration for testing
 */
export const defaultMosaicImages: MosaicImage[] = [
  { src: 'assets/mosaic-1.png', initialX: -30, initialY: -25, rotation: -8, scale: 1.1, delay: 0 },
  { src: 'assets/mosaic-2.png', initialX: 25, initialY: -20, rotation: 5, scale: 1.0, delay: 2 },
  { src: 'assets/mosaic-3.png', initialX: -25, initialY: 20, rotation: -3, scale: 0.9, delay: 4 },
  { src: 'assets/mosaic-4.png', initialX: 30, initialY: 25, rotation: 7, scale: 1.05, delay: 6 },
  { src: 'assets/mosaic-5.png', initialX: 0, initialY: -30, rotation: -2, scale: 0.95, delay: 3 },
  { src: 'assets/mosaic-6.png', initialX: -35, initialY: 0, rotation: 4, scale: 1.0, delay: 5 },
  { src: 'assets/mosaic-7.png', initialX: 35, initialY: 5, rotation: -6, scale: 1.1, delay: 7 },
  { src: 'assets/mosaic-8.png', initialX: 5, initialY: 30, rotation: 3, scale: 0.9, delay: 8 },
];
