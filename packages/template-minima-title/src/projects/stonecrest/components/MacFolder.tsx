/**
 * MacFolder Component - v0.16.2
 *
 * CHANGELOG:
 * - v0.16.2: Complete SVG rebuild (proper macOS structure)
 *   - Simple rounded rectangles (not perspective geometry)
 *   - Layered gradients for depth illusion
 *   - Based on WhiteSur icon theme reference
 *   - Key insight: depth comes from GRADIENTS, not 3D geometry
 *
 * - v0.16.1: (Reverted) Attempted perspective/curved geometry
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

  // Gradient IDs (unique per instance to avoid conflicts) - v0.16.2 simplified
  const mainGradientId = `folder-main-${x}-${y}`;
  const bottomGradientId = `folder-bottom-${x}-${y}`;
  const edgeGradientId = `folder-edge-${x}-${y}`;
  const lidGradientId = `folder-lid-${x}-${y}`;
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
          {/* v0.16.2: Main body gradient - light top to medium bottom */}
          <linearGradient id={mainGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#83d4fb" />
            <stop offset="100%" stopColor="#60c0f0" />
          </linearGradient>

          {/* v0.16.2: Bottom strip gradient - darker for depth */}
          <linearGradient id={bottomGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#008ea2" stopOpacity="0.25" />
            <stop offset="75%" stopColor="#008ea2" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
          </linearGradient>

          {/* v0.16.2: Edge lighting - bright at edges, transparent middle */}
          <linearGradient id={edgeGradientId} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#46a2d7" stopOpacity="0.5" />
            <stop offset="10%" stopColor="#46a2d7" stopOpacity="0" />
            <stop offset="90%" stopColor="#46a2d7" stopOpacity="0" />
            <stop offset="100%" stopColor="#46a2d7" stopOpacity="0.5" />
          </linearGradient>

          {/* v0.16.2: Lid gradient for animated portion */}
          <linearGradient id={lidGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7dd0f8" />
            <stop offset="100%" stopColor="#5ab8e8" />
          </linearGradient>

          {/* Drop shadow filter */}
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* v0.16.2: Tab (small protrusion at top-left) */}
        <path
          d="M 20 38 L 20 28 Q 20 22, 28 22 L 58 22 Q 66 22, 70 30 L 76 38 Z"
          fill="#46a2d7"
        />

        {/* v0.16.2: Tab shadow overlay */}
        <path
          d="M 20 38 L 20 28 Q 20 22, 28 22 L 58 22 Q 66 22, 70 30 L 76 38 Z"
          fill="rgba(0,0,0,0.35)"
          opacity="0.35"
        />

        {/* v0.16.2: Main body - simple rounded rectangle */}
        <rect
          x="16"
          y="35"
          width="168"
          height="112"
          rx="10"
          ry="10"
          fill={`url(#${mainGradientId})`}
          filter={`url(#${shadowId})`}
        />

        {/* v0.16.2: Bottom gradient strip (depth) */}
        <rect
          x="16"
          y="127"
          width="168"
          height="20"
          rx="0"
          ry="0"
          fill={`url(#${bottomGradientId})`}
          clipPath="inset(0 0 0 0 round 0 0 10px 10px)"
        />

        {/* v0.16.2: Bottom rounded corners overlay */}
        <path
          d="M 16 137 L 16 137 Q 16 147, 26 147 L 174 147 Q 184 147, 184 137 L 184 127 L 16 127 Z"
          fill={`url(#${bottomGradientId})`}
        />

        {/* v0.16.2: Edge lighting overlay */}
        <rect
          x="16"
          y="35"
          width="168"
          height="112"
          rx="10"
          ry="10"
          fill={`url(#${edgeGradientId})`}
        />

        {/* v0.16.2: Top highlight strip */}
        <rect
          x="18"
          y="37"
          width="164"
          height="4"
          rx="2"
          fill="#ffffff"
          opacity="0.15"
        />

        {/* v0.16.2: Front panel (lid) - animates open */}
        <g
          style={{
            transformOrigin: '100px 110px',
            transform: `rotateX(${lidRotation}deg) translateY(${lidTranslateY}px)`,
          }}
        >
          {/* Lid body */}
          <rect
            x="18"
            y="50"
            width="164"
            height="60"
            rx="6"
            ry="6"
            fill={`url(#${lidGradientId})`}
          />

          {/* Lid top highlight */}
          <rect
            x="20"
            y="52"
            width="160"
            height="3"
            rx="1.5"
            fill="#ffffff"
            opacity="0.2"
          />

          {/* Lid fold line */}
          <line
            x1="25"
            y1="80"
            x2="175"
            y2="80"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
        </g>

        {/* v0.16.2: Front bottom panel highlight */}
        <rect
          x="18"
          y="110"
          width="164"
          height="2"
          fill="rgba(255,255,255,0.2)"
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
