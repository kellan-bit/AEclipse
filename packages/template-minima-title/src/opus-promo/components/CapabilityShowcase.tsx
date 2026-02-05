import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  Easing,
  staticFile,
} from 'remotion';

interface CapabilityCard {
  prompt: string;
  screenshotSrc: string;
  x: number; // percentage from center
  y: number;
  rotation: number;
  scale: number;
  delay: number;
}

interface CapabilityShowcaseProps {
  centerText?: string;
  centerSubtext?: string;
  capabilities: CapabilityCard[];
  cardWidth?: number;
  cardHeight?: number;
}

/**
 * Capability Showcase
 *
 * Based on frame 700 analysis: Screenshots with prompt bubbles
 * scattered around center "Opus" text, showing Claude's capabilities.
 */
export const CapabilityShowcase: React.FC<CapabilityShowcaseProps> = ({
  centerText = 'Opus',
  centerSubtext = 'Introducing',
  capabilities,
  cardWidth = 280,
  cardHeight = 180,
}) => {
  const frame = useCurrentFrame();

  // Center text animation
  const centerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const centerScale = interpolate(frame, [0, 20], [0.9, 1], {
    easing: Easing.out(Easing.ease),
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFFFFF' }}>
      {/* Capability cards */}
      {capabilities.map((card, index) => {
        const animStart = card.delay;
        const animEnd = animStart + 25;

        // Float in animation
        const cardOpacity = interpolate(
          frame,
          [animStart, animStart + 10],
          [0, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );

        const cardY = interpolate(
          frame,
          [animStart, animEnd],
          [card.y + 5, card.y],
          {
            easing: Easing.out(Easing.ease),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );

        const cardScale = interpolate(
          frame,
          [animStart, animEnd],
          [0.8, card.scale],
          {
            easing: Easing.out(Easing.back(1.1)),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );

        // Subtle floating motion after initial animation
        const floatOffset = Math.sin((frame - animEnd) * 0.05) * 2;
        const finalY = frame > animEnd ? cardY + floatOffset : cardY;

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${card.x}%, ${finalY}%) rotate(${card.rotation}deg) scale(${cardScale})`,
              opacity: cardOpacity,
              width: cardWidth,
              zIndex: index + 1,
            }}
          >
            {/* Screenshot */}
            <div
              style={{
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Img
                src={staticFile(card.screenshotSrc)}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Prompt bubble */}
            <div
              style={{
                position: 'absolute',
                top: -15,
                left: 10,
                right: 10,
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                padding: '8px 12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                fontSize: 11,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#1A1A1A',
                lineHeight: 1.3,
                maxWidth: cardWidth - 20,
              }}
            >
              {card.prompt}
            </div>
          </div>
        );
      })}

      {/* Center text */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${centerScale})`,
          opacity: centerOpacity,
          textAlign: 'center',
          zIndex: 0,
        }}
      >
        <div
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 14,
            color: '#666666',
            marginBottom: 8,
            letterSpacing: '0.1em',
          }}
        >
          {centerSubtext}
        </div>
        <div
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 72,
            fontWeight: 400,
            color: '#1A1A1A',
          }}
        >
          {centerText}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Default capabilities based on frame 700 analysis
 */
export const defaultCapabilities: CapabilityCard[] = [
  {
    prompt: 'Build me a drum machine where I can record my own samples',
    screenshotSrc: 'assets/capability-drum.png',
    x: 45,
    y: -35,
    rotation: 2,
    scale: 1.0,
    delay: 5,
  },
  {
    prompt: 'Help me analyze how our different foams affect the ride and impact levels',
    screenshotSrc: 'assets/capability-data.png',
    x: -50,
    y: -20,
    rotation: -3,
    scale: 0.95,
    delay: 8,
  },
  {
    prompt: 'I want to build a custom typography generator',
    screenshotSrc: 'assets/capability-typography.png',
    x: 50,
    y: 25,
    rotation: 4,
    scale: 1.0,
    delay: 12,
  },
  {
    prompt: 'Create a style guide for our new brand identity',
    screenshotSrc: 'assets/capability-brand.png',
    x: -45,
    y: 35,
    rotation: -2,
    scale: 0.9,
    delay: 15,
  },
  {
    prompt: "Let's make an interactive dashboard to track our Q1 campaign",
    screenshotSrc: 'assets/capability-dashboard.png',
    x: -55,
    y: 5,
    rotation: -4,
    scale: 0.85,
    delay: 18,
  },
  {
    prompt: 'Show me relevant studies on market substitution scenarios',
    screenshotSrc: 'assets/capability-research.png',
    x: -30,
    y: -40,
    rotation: 1,
    scale: 0.8,
    delay: 10,
  },
];
