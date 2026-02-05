/**
 * Stonecrest Introduction Video - v2
 *
 * DESIGN PRINCIPLES:
 * - Luxury = slow, deliberate, confident
 * - Less is more - restraint over spectacle
 * - Let the photography breathe
 * - Every movement has PURPOSE
 * - Stillness is powerful
 *
 * VISUAL LANGUAGE:
 * - Slow, smooth reveals (no snappy springs)
 * - Horizontal movement = progress through space
 * - Subtle scale = depth and presence
 * - Clean cuts with brief overlaps
 * - Typography: elegant, unhurried appearance
 */

import React from 'react';
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Sequence,
  staticFile,
} from 'remotion';

// Asset paths
const ASSETS = {
  logo: 'assets/minima/Photos/Logo-White.svg',
  exteriors: [
    'assets/minima/Photos/Homes/Stonecrest/Basil_ex01_Final_2025-04-23.jpg',
    'assets/minima/Photos/Homes/Stonecrest/Basil_ex02_Final_2025-04-23.jpg',
  ],
  interiors: [
    'assets/minima/Photos/Homes/Stonecrest/Basil_int1.1_Final_2025-04-24.jpg',
    'assets/minima/Photos/Homes/Stonecrest/Basin_int1.2_Final_2025-04-24.jpg',
    'assets/minima/Photos/Homes/Stonecrest/Basin_int1.3_Final_2025-04-24.jpg',
    'assets/minima/Photos/Homes/Stonecrest/Basin_int2.1_Final_2025-04-23.jpg',
    'assets/minima/Photos/Homes/Stonecrest/Basin_int3.1_Final_2025-04-24.jpg',
    'assets/minima/Photos/Homes/Stonecrest/Basin_int4.2_Final_2025-04-23.jpg',
  ],
};

// Single easing for consistency - smooth, luxurious
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

// ============================================
// SCENE 1: LOGO (Simple, confident)
// ============================================
const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Simple fade in, hold, fade out
  const opacity = interpolate(
    frame,
    [0, 30, durationInFrames - 20, durationInFrames],
    [0, 1, 1, 0],
    { easing: EASE }
  );

  // Very subtle scale - barely perceptible
  const scale = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.02],
    { easing: EASE }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0A',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Img
        src={staticFile(ASSETS.logo)}
        style={{
          width: 120,
          opacity,
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 2: PROPERTY NAME (Elegant reveal)
// ============================================
const PropertyName: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Mask reveal from center - clean, not gimmicky
  const revealWidth = interpolate(
    frame,
    [0, 45],
    [0, 100],
    { easing: EASE, extrapolateRight: 'clamp' }
  );

  // Subtitle fades in after main title
  const subtitleOpacity = interpolate(
    frame,
    [50, 70],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0A',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeOut,
      }}
    >
      {/* Main title with clip mask */}
      <div
        style={{
          overflow: 'hidden',
          width: `${revealWidth}%`,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 90,
            fontWeight: 400,
            color: '#FFFFFF',
            letterSpacing: '0.2em',
            margin: 0,
            whiteSpace: 'nowrap',
          }}
        >
          STONECREST
        </h1>
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 16,
          fontWeight: 300,
          color: '#666',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginTop: 30,
          opacity: subtitleOpacity,
        }}
      >
        A Minima Residence
      </p>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 3+: PROPERTY IMAGE (Slow, purposeful)
// ============================================
interface PropertyImageProps {
  src: string;
  direction?: 'left' | 'right'; // Slow pan direction
}

const PropertyImage: React.FC<PropertyImageProps> = ({
  src,
  direction = 'right',
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Slow pan - 3% movement over entire duration
  const panAmount = 3;
  const pan = interpolate(
    frame,
    [0, durationInFrames],
    direction === 'right' ? [0, -panAmount] : [-panAmount, 0],
    { easing: EASE }
  );

  // Very subtle scale - 2% zoom over duration
  const scale = interpolate(
    frame,
    [0, durationInFrames],
    [1.05, 1.08],
    { easing: EASE }
  );

  // Fade in at start
  const fadeIn = interpolate(
    frame,
    [0, 20],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          opacity: fadeIn * fadeOut,
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: '110%',
            height: '110%',
            objectFit: 'cover',
            objectPosition: 'center',
            transform: `translate(${pan}%, -5%) scale(${scale})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE: END CARD (Clean, minimal)
// ============================================
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Staggered fade in - property name, then tagline, then logo
  const nameOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const taglineOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const logoOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0A',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Property name */}
      <h1
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 72,
          fontWeight: 400,
          color: '#FFFFFF',
          letterSpacing: '0.2em',
          margin: 0,
          opacity: nameOpacity,
        }}
      >
        STONECREST
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 14,
          fontWeight: 300,
          color: '#666',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          marginTop: 20,
          marginBottom: 50,
          opacity: taglineOpacity,
        }}
      >
        by Minima
      </p>

      {/* Logo */}
      <Img
        src={staticFile(ASSETS.logo)}
        style={{
          width: 60,
          opacity: logoOpacity,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================
export const StonecrestIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
      {/* Logo - 3 seconds */}
      <Sequence from={0} durationInFrames={90}>
        <LogoScene />
      </Sequence>

      {/* Property Name - 2.5 seconds */}
      <Sequence from={90} durationInFrames={75}>
        <PropertyName />
      </Sequence>

      {/* Hero Exterior - 4 seconds */}
      <Sequence from={165} durationInFrames={120}>
        <PropertyImage src={ASSETS.exteriors[0]} direction="right" />
      </Sequence>

      {/* Interior 1 - 3 seconds */}
      <Sequence from={285} durationInFrames={90}>
        <PropertyImage src={ASSETS.interiors[0]} direction="left" />
      </Sequence>

      {/* Interior 2 - 3 seconds */}
      <Sequence from={375} durationInFrames={90}>
        <PropertyImage src={ASSETS.interiors[1]} direction="right" />
      </Sequence>

      {/* Interior 3 - 3 seconds */}
      <Sequence from={465} durationInFrames={90}>
        <PropertyImage src={ASSETS.interiors[2]} direction="left" />
      </Sequence>

      {/* Interior 4 - 3 seconds */}
      <Sequence from={555} durationInFrames={90}>
        <PropertyImage src={ASSETS.interiors[3]} direction="right" />
      </Sequence>

      {/* Interior 5 - 3 seconds */}
      <Sequence from={645} durationInFrames={90}>
        <PropertyImage src={ASSETS.interiors[4]} direction="left" />
      </Sequence>

      {/* Closing Exterior - 3 seconds */}
      <Sequence from={735} durationInFrames={90}>
        <PropertyImage src={ASSETS.exteriors[1]} direction="right" />
      </Sequence>

      {/* End Card - 2.5 seconds */}
      <Sequence from={825} durationInFrames={75}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
