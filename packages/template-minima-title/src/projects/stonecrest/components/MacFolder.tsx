/**
 * MacFolder Component - v0.16.1
 *
 * CHANGELOG:
 * - v0.16.1: SVG shape refinement (closer to real macOS folder)
 *   - Smaller tab (38px × 12px, was 60px × 18px)
 *   - Front panel perspective: flares wider at bottom (156px→164px)
 *   - Curved bottom edge with bezier (peak at y:156)
 *   - Enhanced rim highlight gradient
 *   - Based on Google Images reference comparison
 *
 * - v0.16: Authentic macOS folder (THE FOLDER)
 *   - Updated gradient colors to match Apple palette (#78C5EF → #51A0D5 → #2C528C)
 *   - Dark label text (#141414) for white background
 *   - Click state: label highlighted with blue bg (like macOS Finder)
 *   - Source: Apple Blue Logo colors, GitHub macOS-Big-Sur-folder-icons research
 *
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
 * - Lesson 8: Preferred asset sources (macosicons.com, jim-nielsen)
 * - Lesson 9: Use brand colors consistently
 * - Reference: macOS Sonoma folder icon, Apple Blue palette
 */

import React from 'react';
import { interpolate, Easing, useCurrentFrame } from 'remotion';
import { SCALE } from '../motion';

interface MacFolderProps {
  label: string;
  isHovered: boolean;
  isClicking: boolean; // Click feedback
  isSelected: boolean; // NEW: Label highlight (like macOS Finder selection)
  openProgress: number; // 0 = closed, 1 = fully open
  x: number;
  y: number;
}

export const MacFolder: React.FC<MacFolderProps> = ({
  label,
  isHovered,
  isClicking,
  isSelected,
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
  const rimGradientId = `folder-rim-gradient-${x}-${y}`; // v0.16.1
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
          {/* Back panel gradient - Apple Blue palette */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8BD0F5" />
            <stop offset="50%" stopColor="#5BB5E8" />
            <stop offset="100%" stopColor="#3FA8E5" />
          </linearGradient>

          {/* Front panel gradient - darker Apple blues */}
          <linearGradient id={frontGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#51A0D5" />
            <stop offset="50%" stopColor="#3D8CC7" />
            <stop offset="100%" stopColor="#2C6BA8" />
          </linearGradient>

          {/* Lid gradient - mid tones */}
          <linearGradient id={lidGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6BC0ED" />
            <stop offset="100%" stopColor="#4AADE0" />
          </linearGradient>

          {/* Rim highlight gradient - v0.16.1 */}
          <linearGradient id={rimGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Drop shadow filter */}
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Back panel of folder - v0.16.1: adjusted tab connection */}
        <path
          d={`
            M 16 30
            L 16 140
            Q 16 150, 26 150
            L 174 150
            Q 184 150, 184 140
            L 184 30
            Q 184 20, 174 20
            L 60 20
            L 55 28
            L 26 28
            Q 16 28, 16 38
            Z
          `}
          fill={`url(#${gradientId})`}
          filter={`url(#${shadowId})`}
        />

        {/* Tab on back panel - v0.16.1: smaller, more subtle */}
        <path
          d={`
            M 22 30
            L 22 24
            Q 22 18, 28 18
            L 48 18
            Q 54 18, 56 24
            L 60 30
            Z
          `}
          fill="#8BD0F5"
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

        {/* Front panel (lid) - animates open - v0.16.1: trapezoid perspective */}
        <g
          style={{
            transformOrigin: '100px 120px',
            transform: `rotateX(${lidRotation}deg) translateY(${lidTranslateY}px)`,
          }}
        >
          <path
            d={`
              M 22 60
              L 178 60
              Q 183 60, 184 64
              L 186 116
              Q 187 120, 182 120
              L 18 120
              Q 13 120, 14 116
              L 16 64
              Q 17 60, 22 60
              Z
            `}
            fill={`url(#${lidGradientId})`}
          />

          {/* Fold line on lid */}
          <line
            x1="24"
            y1="90"
            x2="176"
            y2="90"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />

          {/* Top edge highlight - v0.16.1: adjusted to new lid width */}
          <line
            x1="22"
            y1="61"
            x2="178"
            y2="61"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2"
          />
        </g>

        {/* Front panel (stationary bottom) - v0.16.1: curved bottom edge */}
        <path
          d={`
            M 14 120
            L 186 120
            L 187 140
            Q 187 148, 180 150
            L 160 152
            Q 100 158, 40 152
            L 20 150
            Q 13 148, 13 140
            Z
          `}
          fill={`url(#${frontGradientId})`}
        />

        {/* Bottom edge shadow - v0.16.1: follows curved bottom */}
        <path
          d={`
            M 160 152
            Q 100 157, 40 152
            L 20 150
            Q 14 148, 14 141
            L 14 140
            L 186 140
            L 186 141
            Q 186 148, 180 150
            L 160 152
            Z
          `}
          fill="rgba(0,0,0,0.12)"
        />

        {/* Highlight on front panel edge - v0.16.1: adjusted width */}
        <line
          x1="18"
          y1="121"
          x2="182"
          y2="121"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Label - macOS Finder style with selection highlight */}
      <div
        style={{
          marginTop: 12,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
          fontSize: 14,
          fontWeight: 500,
          color: isSelected ? '#FFFFFF' : '#141414', // White text when selected, brand black otherwise
          textAlign: 'center',
          backgroundColor: isSelected ? '#0A84FF' : 'transparent', // macOS selection blue
          padding: isSelected ? '2px 8px' : '2px 4px',
          borderRadius: 4,
          maxWidth: folderWidth + 40,
          letterSpacing: '-0.01em',
          transition: 'background-color 0.1s ease-out, color 0.1s ease-out',
        }}
      >
        {label}
      </div>
    </div>
  );
};
