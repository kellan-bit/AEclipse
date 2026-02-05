/**
 * Stonecrest Introduction Video - v0.11
 *
 * MOTION HIERARCHY APPROACH (based on UI animation theory):
 * - Multiple elements moving is fine
 * - Multiple COMPETING elements is the problem
 * - Establish clear primary/secondary/tertiary relationships
 *
 * PRINCIPLES APPLIED:
 * 1. Follow-through: Primary moves first, secondary follows
 * 2. Correct easing: LINEAR for ambient, EASE-OUT for appearing
 * 3. Proper stagger: ~33ms (1 frame), not 133ms (4 frames)
 * 4. Hierarchy: Layers support, not compete
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

// ============================================
// ASSETS
// ============================================

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

// ============================================
// EASING CURVES (per element type)
// ============================================

// Elements APPEARING - confident arrival
const EASE_OUT = Easing.bezier(0, 0, 0.2, 1);

// Elements LEAVING - building to exit
const EASE_IN = Easing.bezier(0.4, 0, 1, 1);

// On-screen movement
const EASE_IN_OUT = Easing.bezier(0.4, 0, 0.2, 1);

// Background/ambient motion - constant, non-attention-seeking
// Use no easing (linear) for Ken Burns and drifts

// ============================================
// TIMING CONSTANTS
// ============================================

const STAGGER_DELAY = 1; // 1 frame = 33ms (correct per Carbon guidelines)
const APPEAR_DURATION = 20; // ~667ms for appearing elements
const FADE_OUT_DURATION = 15; // ~500ms for fading out

// ============================================
// SUPPORTING COMPONENTS (Secondary/Tertiary)
// ============================================

/**
 * Static Vignette - supports image without competing
 * No breathing, no animation - just framing
 */
const StaticVignette: React.FC<{ intensity?: number }> = ({
  intensity = 0.5
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,${intensity}) 100%)`,
        pointerEvents: 'none',
      }}
    />
  );
};

/**
 * Subtle Film Grain - tertiary, barely perceptible
 * Very low opacity, doesn't compete
 */
const SubtleGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame % 100;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.015, // Very subtle - tertiary element
        mixBlendMode: 'overlay',
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' seed='${seed}'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
      }}
    />
  );
};

// ============================================
// SCENE COMPONENTS
// ============================================

/**
 * Logo Scene
 * Primary: Logo scale + fade (EASE_OUT)
 * Secondary: Background glow (static)
 */
const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Primary motion: Logo appears with confidence
  const logoOpacity = interpolate(
    frame,
    [0, APPEAR_DURATION, durationInFrames - FADE_OUT_DURATION, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE_OUT,
    }
  );

  const logoScale = interpolate(
    frame,
    [0, APPEAR_DURATION],
    [0.95, 1],
    {
      extrapolateRight: 'clamp',
      easing: EASE_OUT,
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#080808' }}>
      {/* Secondary: Static background glow (doesn't compete) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(25,22,18,1) 0%, rgba(8,8,8,1) 70%)',
        }}
      />

      {/* Primary: Logo */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Img
          src={staticFile(ASSETS.logo)}
          style={{
            width: 100,
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        />
      </AbsoluteFill>

      {/* Tertiary: Subtle grain */}
      <SubtleGrain />
      <StaticVignette intensity={0.4} />
    </AbsoluteFill>
  );
};

/**
 * Title Scene
 * Primary: Title text rises + fades (EASE_OUT)
 * Secondary: Subtitle follows by 1 frame (EASE_OUT)
 */
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Primary: Title appears
  const titleOpacity = interpolate(
    frame,
    [0, APPEAR_DURATION],
    [0, 1],
    { extrapolateRight: 'clamp', easing: EASE_OUT }
  );

  const titleY = interpolate(
    frame,
    [0, APPEAR_DURATION],
    [20, 0],
    { extrapolateRight: 'clamp', easing: EASE_OUT }
  );

  // Secondary: Subtitle follows by STAGGER_DELAY frames
  const subtitleOpacity = interpolate(
    frame - STAGGER_DELAY,
    [APPEAR_DURATION, APPEAR_DURATION + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT }
  );

  const subtitleY = interpolate(
    frame - STAGGER_DELAY,
    [APPEAR_DURATION, APPEAR_DURATION + 15],
    [10, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT }
  );

  // Scene fade out
  const sceneOpacity = interpolate(
    frame,
    [durationInFrames - FADE_OUT_DURATION, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', easing: EASE_IN }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#080808', opacity: sceneOpacity }}>
      {/* Static background warmth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(30,25,20,0.4) 0%, transparent 60%)',
        }}
      />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        {/* Primary: Title */}
        <h1
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 100,
            fontWeight: 400,
            color: '#FFFFFF',
            letterSpacing: '0.25em',
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          STONECREST
        </h1>

        {/* Secondary: Subtitle (follows title) */}
        <p
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 14,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            marginTop: 30,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          A Minima Residence
        </p>
      </AbsoluteFill>

      <SubtleGrain />
      <StaticVignette intensity={0.35} />
    </AbsoluteFill>
  );
};

/**
 * Property Image Scene
 * Primary: Image with Ken Burns (LINEAR - ambient, constant)
 * Secondary: Static vignette (supports focus)
 * Tertiary: Subtle grain
 */
interface PropertyImageProps {
  src: string;
}

const PropertyImageScene: React.FC<PropertyImageProps> = ({ src }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Primary: Ken Burns scale - LINEAR (ambient, constant, not attention-seeking)
  const scale = interpolate(
    frame,
    [0, durationInFrames],
    [1.0, 1.04]
    // No easing = linear = constant background motion
  );

  // Fade in/out
  const fadeIn = interpolate(
    frame,
    [0, APPEAR_DURATION],
    [0, 1],
    { extrapolateRight: 'clamp', easing: EASE_OUT }
  );

  const fadeOut = interpolate(
    frame,
    [durationInFrames - FADE_OUT_DURATION, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', easing: EASE_IN }
  );

  const opacity = fadeIn * fadeOut;

  return (
    <AbsoluteFill style={{ backgroundColor: '#080808' }}>
      {/* Primary: Image with Ken Burns */}
      <div
        style={{
          position: 'absolute',
          inset: '-5%',
          opacity,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: '110%',
            height: '110%',
            objectFit: 'cover',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        />
      </div>

      {/* Secondary: Static vignette (supports focus, doesn't compete) */}
      <StaticVignette intensity={0.5} />

      {/* Tertiary: Subtle grain */}
      <SubtleGrain />
    </AbsoluteFill>
  );
};

/**
 * End Card
 * Single unit animation - all elements appear together
 * One EASE_OUT motion for entire card
 */
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Single unit: Everything fades in together
  const cardOpacity = interpolate(
    frame,
    [0, APPEAR_DURATION + 10],
    [0, 1],
    { extrapolateRight: 'clamp', easing: EASE_OUT }
  );

  const cardScale = interpolate(
    frame,
    [0, APPEAR_DURATION + 10],
    [0.98, 1],
    { extrapolateRight: 'clamp', easing: EASE_OUT }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#080808' }}>
      {/* Static background warmth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(30,25,20,0.5) 0%, transparent 60%)',
        }}
      />

      {/* Single unit: All elements together */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
        }}
      >
        {/* Property name */}
        <h1
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 64,
            fontWeight: 400,
            color: '#FFFFFF',
            letterSpacing: '0.2em',
            margin: 0,
          }}
        >
          STONECREST
        </h1>

        {/* By line */}
        <p
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 12,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            marginTop: 25,
          }}
        >
          by Minima
        </p>

        {/* Logo */}
        <div style={{ marginTop: 45 }}>
          <Img
            src={staticFile(ASSETS.logo)}
            style={{ width: 50 }}
          />
        </div>
      </AbsoluteFill>

      <SubtleGrain />
      <StaticVignette intensity={0.4} />
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const StonecrestIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#080808' }}>
      {/* Logo - 3s */}
      <Sequence from={0} durationInFrames={90}>
        <LogoScene />
      </Sequence>

      {/* Title - 3s */}
      <Sequence from={90} durationInFrames={90}>
        <TitleScene />
      </Sequence>

      {/* Hero Exterior - 3.5s */}
      <Sequence from={180} durationInFrames={105}>
        <PropertyImageScene src={ASSETS.exteriors[0]} />
      </Sequence>

      {/* Interior 1 - 3s */}
      <Sequence from={285} durationInFrames={90}>
        <PropertyImageScene src={ASSETS.interiors[0]} />
      </Sequence>

      {/* Interior 2 - 3s */}
      <Sequence from={375} durationInFrames={90}>
        <PropertyImageScene src={ASSETS.interiors[1]} />
      </Sequence>

      {/* Interior 3 - 3s */}
      <Sequence from={465} durationInFrames={90}>
        <PropertyImageScene src={ASSETS.interiors[2]} />
      </Sequence>

      {/* Interior 4 - 3s */}
      <Sequence from={555} durationInFrames={90}>
        <PropertyImageScene src={ASSETS.interiors[3]} />
      </Sequence>

      {/* Interior 5 - 3s */}
      <Sequence from={645} durationInFrames={90}>
        <PropertyImageScene src={ASSETS.interiors[4]} />
      </Sequence>

      {/* Closing Exterior - 3s */}
      <Sequence from={735} durationInFrames={90}>
        <PropertyImageScene src={ASSETS.exteriors[1]} />
      </Sequence>

      {/* End Card - 2.5s */}
      <Sequence from={825} durationInFrames={75}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
