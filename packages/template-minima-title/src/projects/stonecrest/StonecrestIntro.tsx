/**
 * Stonecrest Introduction Video
 *
 * A 30-second luxury property showcase with complex animations.
 *
 * Structure:
 * 1. Logo intro (0-3s) - Spring physics, subtle shake
 * 2. Property name reveal (3-5s) - Split panel transition
 * 3. Hero exterior (5-9s) - Dolly zoom, cinematic pan
 * 4. Interior sequence (9-24s) - Complex transitions between 6 shots
 * 5. Closing exterior (24-27s) - Slow zoom out
 * 6. End card (27-30s) - Brand close
 */

import React from 'react';
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Sequence,
  staticFile,
} from 'remotion';

// Asset paths (relative to public/assets/minima symlink)
const ASSETS = {
  logo: 'minima/Photos/Logo-White.svg',
  wordmark: 'minima/Photos/Wordmark-White.svg',
  exteriors: [
    'minima/Photos/Homes/Stonecrest/Basil_ex01_Final_2025-04-23.jpg',
    'minima/Photos/Homes/Stonecrest/Basil_ex02_Final_2025-04-23.jpg',
  ],
  interiors: [
    'minima/Photos/Homes/Stonecrest/Basil_int1.1_Final_2025-04-24.jpg',
    'minima/Photos/Homes/Stonecrest/Basin_int1.2_Final_2025-04-24.jpg',
    'minima/Photos/Homes/Stonecrest/Basin_int1.3_Final_2025-04-24.jpg',
    'minima/Photos/Homes/Stonecrest/Basin_int2.1_Final_2025-04-23.jpg',
    'minima/Photos/Homes/Stonecrest/Basin_int3.1_Final_2025-04-24.jpg',
    'minima/Photos/Homes/Stonecrest/Basin_int4.2_Final_2025-04-23.jpg',
  ],
};

// ============================================
// CINEMATIC EASINGS
// ============================================
const EASING = {
  dramatic: Easing.bezier(0.7, 0, 0.3, 1),
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
  overshoot: Easing.bezier(0.34, 1.56, 0.64, 1),
  anticipate: Easing.bezier(0.68, -0.6, 0.32, 1.6),
};

// ============================================
// LOGO INTRO SCENE
// ============================================
const LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring-based scale
  const scaleSpring = spring({
    frame,
    fps,
    config: { mass: 0.8, stiffness: 100, damping: 12 },
  });

  // Fade in
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Subtle handheld shake
  const shakeX = Math.sin(frame * 0.15) * 2;
  const shakeY = Math.cos(frame * 0.12) * 1.5;
  const shakeRotation = Math.sin(frame * 0.08) * 0.3;

  // Subtle continuous drift
  const driftX = Math.sin(frame * 0.02) * 5;
  const driftY = Math.cos(frame * 0.025) * 3;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0A',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          transform: `
            translate(${shakeX + driftX}px, ${shakeY + driftY}px)
            rotate(${shakeRotation}deg)
            scale(${scaleSpring * 0.8 + 0.2})
          `,
          opacity,
        }}
      >
        <Img
          src={staticFile(ASSETS.logo)}
          style={{
            width: 200,
            height: 'auto',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// PROPERTY NAME REVEAL (Split Panel)
// ============================================
const PropertyNameReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Split panels animation
  const panelProgress = spring({
    frame,
    fps,
    config: { mass: 1, stiffness: 80, damping: 15 },
  });

  const leftPanelX = interpolate(panelProgress, [0, 1], [-width / 2, 0]);
  const rightPanelX = interpolate(panelProgress, [0, 1], [width / 2, 0]);

  // Text reveal (staggered letters)
  const text = 'STONECREST';
  const letterDelay = 3; // frames between each letter

  // Subtle camera drift
  const driftX = Math.sin(frame * 0.03) * 8;
  const driftY = Math.cos(frame * 0.025) * 5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0A',
        overflow: 'hidden',
      }}
    >
      {/* Left panel (slides in from left) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: '100%',
          backgroundColor: '#111',
          transform: `translateX(${leftPanelX}px)`,
        }}
      />

      {/* Right panel (slides in from right) */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          height: '100%',
          backgroundColor: '#111',
          transform: `translateX(${rightPanelX}px)`,
        }}
      />

      {/* Property name with staggered letter reveal */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `translate(${driftX}px, ${driftY}px)`,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {text.split('').map((letter, i) => {
            const letterFrame = frame - i * letterDelay;
            const letterSpring = spring({
              frame: letterFrame,
              fps,
              config: { mass: 0.5, stiffness: 120, damping: 10 },
            });

            const letterY = interpolate(letterSpring, [0, 1], [50, 0]);
            const letterOpacity = interpolate(letterSpring, [0, 0.5], [0, 1], {
              extrapolateRight: 'clamp',
            });

            return (
              <span
                key={i}
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 120,
                  fontWeight: 400,
                  color: '#FFFFFF',
                  letterSpacing: '0.15em',
                  transform: `translateY(${letterY}px)`,
                  opacity: letterOpacity,
                  display: 'inline-block',
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          width: '100%',
          textAlign: 'center',
          opacity: interpolate(frame, [40, 60], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          transform: `translateY(${interpolate(frame, [40, 60], [20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EASING.smooth,
          })}px)`,
        }}
      >
        <span
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 24,
            fontWeight: 300,
            color: '#888',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          A Minima Residence
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// HERO IMAGE WITH DOLLY ZOOM
// ============================================
interface HeroImageProps {
  src: string;
  dollyIntensity?: number;
  panDirection?: 'left' | 'right' | 'none';
  panDistance?: number;
}

const HeroImage: React.FC<HeroImageProps> = ({
  src,
  dollyIntensity = 0.15,
  panDirection = 'right',
  panDistance = 100,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Dolly zoom effect
  const progress = frame / durationInFrames;
  const scale = 1 + progress * dollyIntensity;

  // Cinematic pan
  const panProgress = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: EASING.smooth,
  });
  const panX =
    panDirection === 'none'
      ? 0
      : panDirection === 'right'
      ? -panProgress * panDistance
      : panProgress * panDistance;

  // Subtle handheld
  const shakeX = Math.sin(frame * 0.1) * 3;
  const shakeY = Math.cos(frame * 0.08) * 2;

  // Vignette opacity (increases over time for drama)
  const vignetteOpacity = interpolate(progress, [0, 1], [0.3, 0.5]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <Img
        src={staticFile(src)}
        style={{
          width: '120%',
          height: '120%',
          objectFit: 'cover',
          transform: `
            translate(${panX + shakeX - 10}%, ${shakeY - 10}%)
            scale(${scale})
          `,
        }}
      />

      {/* Cinematic vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${vignetteOpacity}) 100%)`,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================
// INTERIOR SHOT WITH TRANSITION
// ============================================
interface InteriorShotProps {
  src: string;
  transitionType: 'iris' | 'diagonal' | 'splitV' | 'splitH' | 'fade';
  transitionDuration?: number;
}

const InteriorShot: React.FC<InteriorShotProps> = ({
  src,
  transitionType,
  transitionDuration = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Ken Burns zoom
  const zoomProgress = frame / durationInFrames;
  const scale = 1 + zoomProgress * 0.08;

  // Subtle drift
  const driftX = Math.sin(frame * 0.02) * 15;
  const driftY = Math.cos(frame * 0.018) * 10;

  // Transition clip path
  let clipPath = 'none';
  const transitionProgress = interpolate(
    frame,
    [0, transitionDuration],
    [0, 1],
    {
      easing: EASING.dramatic,
      extrapolateRight: 'clamp',
    }
  );

  switch (transitionType) {
    case 'iris':
      const irisSize = transitionProgress * 150;
      clipPath = `circle(${irisSize}% at 50% 50%)`;
      break;
    case 'diagonal':
      const diagProgress = transitionProgress * 200 - 50;
      clipPath = `polygon(${diagProgress}% 0%, ${diagProgress + 50}% 0%, ${diagProgress + 50}% 100%, ${diagProgress}% 100%)`;
      break;
    case 'splitV':
      const splitV = transitionProgress * 50;
      clipPath = `polygon(${50 - splitV}% 0%, ${50 + splitV}% 0%, ${50 + splitV}% 100%, ${50 - splitV}% 100%)`;
      break;
    case 'splitH':
      const splitH = transitionProgress * 50;
      clipPath = `polygon(0% ${50 - splitH}%, 100% ${50 - splitH}%, 100% ${50 + splitH}%, 0% ${50 + splitH}%)`;
      break;
    case 'fade':
    default:
      clipPath = 'none';
  }

  const opacity =
    transitionType === 'fade'
      ? interpolate(frame, [0, transitionDuration], [0, 1], {
          extrapolateRight: 'clamp',
        })
      : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          clipPath,
          opacity,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: '110%',
            height: '110%',
            objectFit: 'cover',
            transform: `
              translate(${driftX - 5}%, ${driftY - 5}%)
              scale(${scale})
            `,
          }}
        />
      </div>

      {/* Subtle vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================
// END CARD
// ============================================
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const springConfig = { mass: 0.8, stiffness: 100, damping: 14 };

  // Property name
  const nameSpring = spring({ frame, fps, config: springConfig });
  const nameY = interpolate(nameSpring, [0, 1], [30, 0]);
  const nameOpacity = interpolate(nameSpring, [0, 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // "by MINIMA" (delayed)
  const bySpring = spring({ frame: frame - 15, fps, config: springConfig });
  const byY = interpolate(bySpring, [0, 1], [20, 0]);
  const byOpacity = interpolate(bySpring, [0, 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Logo (delayed more)
  const logoSpring = spring({ frame: frame - 30, fps, config: springConfig });
  const logoScale = interpolate(logoSpring, [0, 1], [0.8, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 0.5], [0, 1], {
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
      <div style={{ textAlign: 'center' }}>
        {/* Property Name */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 80,
            color: '#FFFFFF',
            letterSpacing: '0.2em',
            marginBottom: 20,
            transform: `translateY(${nameY}px)`,
            opacity: nameOpacity,
          }}
        >
          STONECREST
        </div>

        {/* by MINIMA */}
        <div
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 18,
            color: '#666',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            marginBottom: 40,
            transform: `translateY(${byY}px)`,
            opacity: byOpacity,
          }}
        >
          by MINIMA
        </div>

        {/* Logo */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
        >
          <Img
            src={staticFile(ASSETS.logo)}
            style={{
              width: 80,
              height: 'auto',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================
export const StonecrestIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
      {/* Scene 1: Logo Intro (0-90 frames / 0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <LogoIntro />
      </Sequence>

      {/* Scene 2: Property Name Reveal (90-150 frames / 3-5s) */}
      <Sequence from={90} durationInFrames={60}>
        <PropertyNameReveal />
      </Sequence>

      {/* Scene 3: Hero Exterior (150-270 frames / 5-9s) */}
      <Sequence from={150} durationInFrames={120}>
        <HeroImage
          src={ASSETS.exteriors[0]}
          dollyIntensity={0.12}
          panDirection="right"
          panDistance={80}
        />
      </Sequence>

      {/* Scene 4: Interior Sequence (270-720 frames / 9-24s) */}
      {/* Interior 1 - Iris wipe */}
      <Sequence from={270} durationInFrames={75}>
        <InteriorShot src={ASSETS.interiors[0]} transitionType="iris" />
      </Sequence>

      {/* Interior 2 - Diagonal wipe */}
      <Sequence from={345} durationInFrames={75}>
        <InteriorShot src={ASSETS.interiors[1]} transitionType="diagonal" />
      </Sequence>

      {/* Interior 3 - Vertical split */}
      <Sequence from={420} durationInFrames={75}>
        <InteriorShot src={ASSETS.interiors[2]} transitionType="splitV" />
      </Sequence>

      {/* Interior 4 - Iris wipe */}
      <Sequence from={495} durationInFrames={75}>
        <InteriorShot src={ASSETS.interiors[3]} transitionType="iris" />
      </Sequence>

      {/* Interior 5 - Horizontal split */}
      <Sequence from={570} durationInFrames={75}>
        <InteriorShot src={ASSETS.interiors[4]} transitionType="splitH" />
      </Sequence>

      {/* Interior 6 - Diagonal */}
      <Sequence from={645} durationInFrames={75}>
        <InteriorShot src={ASSETS.interiors[5]} transitionType="diagonal" />
      </Sequence>

      {/* Scene 5: Closing Exterior (720-810 frames / 24-27s) */}
      <Sequence from={720} durationInFrames={90}>
        <HeroImage
          src={ASSETS.exteriors[1]}
          dollyIntensity={-0.08} // Zoom OUT
          panDirection="left"
          panDistance={60}
        />
      </Sequence>

      {/* Scene 6: End Card (810-900 frames / 27-30s) */}
      <Sequence from={810} durationInFrames={90}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
