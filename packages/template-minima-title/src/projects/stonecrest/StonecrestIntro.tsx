/**
 * Stonecrest Introduction Video - v0.2
 *
 * LAYERED DEPTH APPROACH:
 * Every scene is composed of multiple layers that move independently,
 * creating depth and atmosphere even with single images.
 *
 * LAYER STRUCTURE:
 * 1. Base image (slowest motion)
 * 2. Atmospheric grain
 * 3. Light/lens effects (independent motion)
 * 4. Dynamic vignette
 * 5. Typography (interacts with composition)
 *
 * PRINCIPLES:
 * - Depth through parallax
 * - Atmosphere through overlays
 * - Typography as design element, not afterthought
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
  random,
} from 'remotion';

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
// LAYER COMPONENTS
// ============================================

/**
 * Film Grain Layer - Adds texture and life
 */
const FilmGrain: React.FC<{ opacity?: number; speed?: number }> = ({
  opacity = 0.04,
  speed = 1,
}) => {
  const frame = useCurrentFrame();

  // Animated grain pattern using noise
  const grainOffset = (frame * speed) % 1000;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        mixBlendMode: 'overlay',
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${Math.floor(grainOffset)}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
      }}
    />
  );
};

/**
 * Light Leak Layer - Drifting warm highlights
 */
const LightLeak: React.FC<{
  color?: string;
  startX?: number;
  startY?: number;
}> = ({
  color = 'rgba(255, 200, 150, 0.15)',
  startX = 70,
  startY = 20,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Slow drift across frame
  const x = interpolate(frame, [0, durationInFrames], [startX, startX - 15]);
  const y = interpolate(frame, [0, durationInFrames], [startY, startY + 10]);

  // Subtle pulse
  const pulse = 1 + Math.sin(frame * 0.03) * 0.1;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 60% 80% at ${x}% ${y}%, ${color}, transparent 70%)`,
        opacity: pulse,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );
};

/**
 * Dynamic Vignette - Breathes with the scene
 */
const DynamicVignette: React.FC<{
  intensity?: number;
  breathe?: boolean;
}> = ({ intensity = 0.6, breathe = true }) => {
  const frame = useCurrentFrame();

  // Subtle breathing
  const breatheAmount = breathe ? Math.sin(frame * 0.02) * 0.05 : 0;
  const currentIntensity = intensity + breatheAmount;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(0,0,0,${currentIntensity}) 100%)`,
        pointerEvents: 'none',
      }}
    />
  );
};

/**
 * Edge Gradient - Directional atmosphere
 */
const EdgeGradient: React.FC<{
  direction: 'top' | 'bottom' | 'left' | 'right';
  color?: string;
  size?: number;
}> = ({ direction, color = 'rgba(0,0,0,0.4)', size = 30 }) => {
  const gradients: Record<string, string> = {
    top: `linear-gradient(to bottom, ${color}, transparent ${size}%)`,
    bottom: `linear-gradient(to top, ${color}, transparent ${size}%)`,
    left: `linear-gradient(to right, ${color}, transparent ${size}%)`,
    right: `linear-gradient(to left, ${color}, transparent ${size}%)`,
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: gradients[direction],
        pointerEvents: 'none',
      }}
    />
  );
};

// ============================================
// SCENE COMPONENTS
// ============================================

/**
 * Logo Scene - Minimal, atmospheric
 */
const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, 40, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Subtle scale
  const scale = interpolate(frame, [0, durationInFrames], [0.95, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#080808' }}>
      {/* Atmospheric background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(30,25,20,1) 0%, rgba(8,8,8,1) 70%)',
        }}
      />

      {/* Logo */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Img
          src={staticFile(ASSETS.logo)}
          style={{
            width: 100,
            opacity,
            transform: `scale(${scale})`,
          }}
        />
      </AbsoluteFill>

      <FilmGrain opacity={0.03} />
      <DynamicVignette intensity={0.5} breathe={false} />
    </AbsoluteFill>
  );
};

/**
 * Title Scene - Typography as architecture
 */
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Title reveal - horizontal mask
  const maskProgress = interpolate(frame, [10, 50], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });

  // Subtitle fade
  const subtitleOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scene fade out
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );

  // Decorative line
  const lineWidth = interpolate(frame, [0, 40], [0, 200], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#080808', opacity: fadeOut }}>
      {/* Warm atmospheric glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(40,30,20,0.5) 0%, transparent 60%)',
        }}
      />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        {/* Decorative line above */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
            marginBottom: 40,
          }}
        />

        {/* Main title with mask reveal */}
        <div style={{ overflow: 'hidden' }}>
          <h1
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 100,
              fontWeight: 400,
              color: '#FFFFFF',
              letterSpacing: '0.25em',
              margin: 0,
              clipPath: `inset(0 ${100 - maskProgress}% 0 0)`,
            }}
          >
            STONECREST
          </h1>
        </div>

        {/* Subtitle */}
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
          }}
        >
          A Minima Residence
        </p>

        {/* Decorative line below */}
        <div
          style={{
            width: lineWidth * 0.6,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.2)',
            marginTop: 40,
            opacity: subtitleOpacity,
          }}
        />
      </AbsoluteFill>

      <FilmGrain opacity={0.025} />
      <DynamicVignette intensity={0.4} />
    </AbsoluteFill>
  );
};

/**
 * Property Image Scene - Layered depth
 */
interface PropertyImageProps {
  src: string;
  panDirection?: 'left' | 'right';
  lightLeakPosition?: 'left' | 'right';
}

const PropertyImageScene: React.FC<PropertyImageProps> = ({
  src,
  panDirection = 'right',
  lightLeakPosition = 'right',
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Base image motion - slow, confident
  const pan = interpolate(
    frame,
    [0, durationInFrames],
    panDirection === 'right' ? [2, -2] : [-2, 2]
  );

  const scale = interpolate(frame, [0, durationInFrames], [1.08, 1.12]);

  // Fade in/out
  const fadeIn = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#080808' }}>
      {/* Base image layer */}
      <div
        style={{
          position: 'absolute',
          inset: '-10%',
          opacity: fadeIn * fadeOut,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: '120%',
            height: '120%',
            objectFit: 'cover',
            transform: `translate(${pan}%, 0) scale(${scale})`,
          }}
        />
      </div>

      {/* Atmospheric layers */}
      <LightLeak
        startX={lightLeakPosition === 'right' ? 75 : 25}
        startY={15}
        color="rgba(255, 220, 180, 0.08)"
      />

      <EdgeGradient direction="top" size={25} color="rgba(0,0,0,0.3)" />
      <EdgeGradient direction="bottom" size={35} color="rgba(0,0,0,0.5)" />

      <FilmGrain opacity={0.035} />
      <DynamicVignette intensity={0.55} breathe />
    </AbsoluteFill>
  );
};

/**
 * End Card - Refined, layered
 */
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Staggered reveals
  const line1 = interpolate(frame, [0, 30], [0, 120], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });

  const titleOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleY = interpolate(frame, [15, 45], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });

  const bylineOpacity = interpolate(frame, [40, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logoOpacity = interpolate(frame, [55, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const line2 = interpolate(frame, [60, 90], [0, 80], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#080808' }}>
      {/* Warm center glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(35,28,22,0.6) 0%, transparent 60%)',
        }}
      />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        {/* Top decorative line */}
        <div
          style={{
            width: line1,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.25)',
            marginBottom: 50,
          }}
        />

        {/* Property name */}
        <h1
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 64,
            fontWeight: 400,
            color: '#FFFFFF',
            letterSpacing: '0.2em',
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
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
            opacity: bylineOpacity,
          }}
        >
          by Minima
        </p>

        {/* Logo */}
        <div style={{ marginTop: 45, opacity: logoOpacity }}>
          <Img
            src={staticFile(ASSETS.logo)}
            style={{ width: 50 }}
          />
        </div>

        {/* Bottom decorative line */}
        <div
          style={{
            width: line2,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.15)',
            marginTop: 50,
          }}
        />
      </AbsoluteFill>

      <FilmGrain opacity={0.025} />
      <DynamicVignette intensity={0.45} breathe={false} />
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
        <PropertyImageScene
          src={ASSETS.exteriors[0]}
          panDirection="right"
          lightLeakPosition="right"
        />
      </Sequence>

      {/* Interior 1 - 3s */}
      <Sequence from={285} durationInFrames={90}>
        <PropertyImageScene
          src={ASSETS.interiors[0]}
          panDirection="left"
          lightLeakPosition="left"
        />
      </Sequence>

      {/* Interior 2 - 3s */}
      <Sequence from={375} durationInFrames={90}>
        <PropertyImageScene
          src={ASSETS.interiors[1]}
          panDirection="right"
          lightLeakPosition="right"
        />
      </Sequence>

      {/* Interior 3 - 3s */}
      <Sequence from={465} durationInFrames={90}>
        <PropertyImageScene
          src={ASSETS.interiors[2]}
          panDirection="left"
          lightLeakPosition="left"
        />
      </Sequence>

      {/* Interior 4 - 3s */}
      <Sequence from={555} durationInFrames={90}>
        <PropertyImageScene
          src={ASSETS.interiors[3]}
          panDirection="right"
          lightLeakPosition="right"
        />
      </Sequence>

      {/* Interior 5 - 3s */}
      <Sequence from={645} durationInFrames={90}>
        <PropertyImageScene
          src={ASSETS.interiors[4]}
          panDirection="left"
          lightLeakPosition="left"
        />
      </Sequence>

      {/* Closing Exterior - 3s */}
      <Sequence from={735} durationInFrames={90}>
        <PropertyImageScene
          src={ASSETS.exteriors[1]}
          panDirection="right"
          lightLeakPosition="right"
        />
      </Sequence>

      {/* End Card - 2.5s */}
      <Sequence from={825} durationInFrames={75}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
