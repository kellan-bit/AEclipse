/**
 * MacFolder Component - v0.14
 *
 * CHANGELOG:
 * - v0.14: Improved hover glow and added click feedback
 *   - Increased hover glow opacity from 0.25 to 0.45
 *   - Added pulsing glow animation on hover
 *   - Added click feedback (scale + brightness flash)
 *   - Using unified EASE/SCALE constants from motion.ts
 *
 * - v0.13: Complete visual rebuild to match actual macOS folder appearance
 *   - Changed from rectangles to proper SVG folder shape
 *   - Increased size from 80px to 200px for better visual presence
 *   - Added proper gradients (not flat colors)
 *   - Added inner shadows and depth
 *   - Improved tab shape to match macOS
 *   - Added fold line detail
 *
 * - v0.12: Initial implementation (blue rectangle - incorrect)
 *
 * LESSONS APPLIED:
 * - Lesson 2: "Apple-Style" requires actual Apple details
 * - Lesson 7: Subtle, purposeful effects over theatrical
 * - Reference: macOS Sonoma folder icon
 */

import React from 'react';
import { interpolate, Easing, useCurrentFrame } from 'remotion';
import { SCALE } from '../motion';

interface MacFolderProps {
  label: string;
  isHovered: boolean;
  isClicking: boolean; // NEW: click feedback
  openProgress: number; // 0 = closed, 1 = fully open
  x: number;
  y: number;
}

export const MacFolder: React.FC<MacFolderProps> = ({
  label,
  isHovered,
  isClicking,
  openProgress,
  x,
  y,
}) => {
  const frame = useCurrentFrame();

  // Size - much larger for visual presence (was 80px, now 200px)
  const folderWidth = 200;
  const folderHeight = 160;

  // Click feedback - quick scale down
  const clickScale = isClicking ? SCALE.pressed : 1;
  const clickBrightness = isClicking ? 1.15 : 1; // Flash on click

  // Hover effects with easing
  const hoverScale = isHovered ? SCALE.hover : 1;
  const hoverBrightness = isHovered ? 1.05 : 1;

  // Combined scale (click overrides hover)
  const finalScale = isClicking ? clickScale : hoverScale;
  const finalBrightness = isClicking ? clickBrightness : hoverBrightness;

  // Pulsing glow on hover (subtle animation)
  const glowPulse = isHovered
    ? 0.45 + Math.sin(frame * 0.15) * 0.08
    : 0;

  // Open animation with proper easing
  const easedOpenProgress = interpolate(
    openProgress,
    [0, 1],
    [0, 1],
    { easing: Easing.out(Easing.cubic) }
  );

  // Lid lifts up and rotates back
  const lidRotation = interpolate(easedOpenProgress, [0, 1], [0, -55]);
  const lidTranslateY = interpolate(easedOpenProgress, [0, 1], [0, -35]);

  // Folder wobble/anticipation before opening
  const wobbleIntensity = openProgress > 0 && openProgress < 0.2
    ? Math.sin(openProgress * Math.PI * 10) * 3 * (1 - openProgress * 5)
    : 0;

  // Gradient IDs (unique per instance to avoid conflicts)
  const gradientId = `folder-gradient-${x}-${y}`;
  const frontGradientId = `folder-front-gradient-${x}-${y}`;
  const lidGradientId = `folder-lid-gradient-${x}-${y}`;
  const shadowId = `folder-shadow-${x}-${y}`;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${finalScale}) translateX(${wobbleIntensity}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: `brightness(${finalBrightness})`,
        transition: isClicking
          ? 'transform 0.05s ease-out, filter 0.05s ease-out' // Fast click response
          : 'transform 0.15s ease-out, filter 0.15s ease-out',
      }}
    >
      {/* Hover glow effect - more visible with pulse */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            width: folderWidth * 1.6,
            height: folderHeight * 1.4,
            background: `radial-gradient(ellipse, rgba(90, 200, 250, ${glowPulse}), transparent 65%)`,
            filter: 'blur(25px)',
            zIndex: -1,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {/* Click flash effect */}
      {isClicking && (
        <div
          style={{
            position: 'absolute',
            width: folderWidth * 1.2,
            height: folderHeight * 1.1,
            background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.3), transparent 50%)',
            filter: 'blur(15px)',
            zIndex: -1,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {/* Main folder SVG */}
      <svg
        width={folderWidth}
        height={folderHeight}
        viewBox="0 0 200 160"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Back panel gradient */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>

          {/* Front panel gradient */}
          <linearGradient id={frontGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="40%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* Lid gradient */}
          <linearGradient id={lidGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>

          {/* Drop shadow filter */}
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Back panel of folder */}
        <path
          d={`
            M 16 30
            L 16 140
            Q 16 150, 26 150
            L 174 150
            Q 184 150, 184 140
            L 184 30
            Q 184 20, 174 20
            L 80 20
            L 70 30
            L 26 30
            Q 16 30, 16 40
            Z
          `}
          fill={`url(#${gradientId})`}
          filter={`url(#${shadowId})`}
        />

        {/* Tab on back panel */}
        <path
          d={`
            M 20 30
            L 20 20
            Q 20 12, 28 12
            L 62 12
            Q 70 12, 74 20
            L 80 30
            Z
          `}
          fill="#7DD3FC"
        />

        {/* Inner shadow on back panel (depth) */}
        <path
          d={`
            M 20 35
            L 180 35
            L 180 45
            L 20 45
            Z
          `}
          fill="rgba(0,0,0,0.08)"
        />

        {/* Front panel (lid) - animates open */}
        <g
          style={{
            transformOrigin: '100px 120px',
            transform: `rotateX(${lidRotation}deg) translateY(${lidTranslateY}px)`,
          }}
        >
          <path
            d={`
              M 20 60
              L 180 60
              Q 184 60, 184 64
              L 184 116
              Q 184 120, 180 120
              L 20 120
              Q 16 120, 16 116
              L 16 64
              Q 16 60, 20 60
              Z
            `}
            fill={`url(#${lidGradientId})`}
          />

          {/* Fold line on lid */}
          <line
            x1="25"
            y1="90"
            x2="175"
            y2="90"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />

          {/* Top edge highlight */}
          <line
            x1="20"
            y1="61"
            x2="180"
            y2="61"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
          />
        </g>

        {/* Front panel (stationary bottom) */}
        <path
          d={`
            M 16 120
            L 184 120
            L 184 140
            Q 184 150, 174 150
            L 26 150
            Q 16 150, 16 140
            Z
          `}
          fill={`url(#${frontGradientId})`}
        />

        {/* Bottom edge shadow */}
        <path
          d={`
            M 26 148
            L 174 148
            Q 180 148, 182 144
            L 182 140
            L 18 140
            L 18 144
            Q 20 148, 26 148
            Z
          `}
          fill="rgba(0,0,0,0.15)"
        />

        {/* Highlight on front panel edge */}
        <line
          x1="20"
          y1="121"
          x2="180"
          y2="121"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
      </svg>

      {/* Label */}
      <div
        style={{
          marginTop: 12,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
          fontSize: 14,
          fontWeight: 500,
          color: '#FFFFFF',
          textAlign: 'center',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          maxWidth: folderWidth + 40,
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </div>
    </div>
  );
};
