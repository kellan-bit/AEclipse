/**
 * MacFolderLayers - v0.38
 *
 * CHANGELOG:
 * - v0.37: Fixed anticipation denominator (10→14 frames, was missing 4-frame lead-in)
 *
 * - v0.28: Momentum system applied
 *   - Lid opening: replaced spring + manual anticipation with momentum 'throw'
 *     - Single momentum curve handles anticipation + action + settle
 *     - Eliminates separate anticipation pulse (v0.19.1) — momentum has it built in
 *   - Click feedback: momentum 'tap' for press animation
 *
 * - v0.19.1: Added anticipation pulse (now replaced by momentum)
 * - v0.18.4: Split folder into body + lid for proper z-ordering
 *
 * Usage in StonecrestReveal:
 * 1. <MacFolderBack {...props} />
 * 2. <PhotoGrid {...props} />
 * 3. <MacFolderLid {...props} />
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { SCALE, getMomentumCurve } from '../motion/index';

interface MacFolderLayerProps {
  label: string;
  isHovered: boolean;
  isClicking: boolean;
  isSelected: boolean;
  openStartFrame: number;
  x: number;
  y: number;
  opacity?: number; // For fade out
}

// Shared dimensions and calculations
const FOLDER_WIDTH = 200;
const FOLDER_HEIGHT = 160;

function useFolderState(props: MacFolderLayerProps) {
  const { isHovered, isClicking, openStartFrame } = props;
  const frame = useCurrentFrame();

  // Click feedback
  const clickScale = isClicking ? SCALE.pressed : 1;
  const clickBrightness = isClicking ? 1.15 : 1;

  // Hover effects
  const hoverScale = isHovered ? SCALE.hover : 1;
  const hoverBrightness = isHovered ? 1.05 : 1;

  // v0.37: Fixed anticipation denominator — phase spans 14 frames (4 before + 10 during),
  // not 10. Old code divided by 10, compressing the curve into the wrong window.
  const tapCurve = getMomentumCurve('tap');
  const anticipationStart = openStartFrame - 4;
  const tapDuration = 14; // Full phase: 4 anticipation + 10 open
  const isAnticipating = openStartFrame > 0 &&
    frame >= anticipationStart &&
    frame < anticipationStart + tapDuration;

  const anticipationProgress = isAnticipating
    ? Math.min((frame - anticipationStart) / tapDuration, 1)
    : 0;
  // Tap curve goes from 0 → past 1 → 1 (the achoo pattern)
  // Map to scale: 1 → 1.025 → 1 (the bulge)
  const anticipationScale = isAnticipating
    ? 1 + tapCurve(anticipationProgress) * 0.025
    : 1;

  // Combined scale: click/hover + anticipation
  const baseScale = isClicking ? clickScale : hoverScale;
  const finalScale = baseScale * anticipationScale;
  const finalBrightness = isClicking ? clickBrightness : hoverBrightness;

  // Glow pulse
  const glowPulse = isHovered ? 0.45 + Math.sin(frame * 0.15) * 0.08 : 0;

  // v0.28: Momentum 'throw' for lid opening
  // The throw curve gives anticipation (slight dip) + explosive release + overshoot + settle.
  // Replaces createSpring('folder') which had no anticipation.
  const isOpening = openStartFrame > 0 && frame >= openStartFrame;
  const lidDuration = 24; // Throw duration in frames
  const throwCurve = getMomentumCurve('throw');

  let lidProgress = 0;
  if (isOpening) {
    const effectiveFrame = frame - openStartFrame;
    const t = Math.min(effectiveFrame / lidDuration, 1);
    lidProgress = throwCurve(t);
  }

  // Lid rotates from 0 to -55deg with momentum overshoot
  const lidRotation = lidProgress * -55;
  // Lid translates up with same momentum
  const lidTranslateY = lidProgress * -35;

  // Wobble is naturally handled by momentum overshoot now,
  // but keep a subtle version during the anticipation phase
  const wobbleIntensity = isOpening && lidProgress < 0.3
    ? Math.sin(lidProgress * Math.PI * 6) * 1.5 * (1 - lidProgress * 3)
    : 0;

  return {
    finalScale,
    finalBrightness,
    glowPulse,
    lidRotation,
    lidTranslateY,
    wobbleIntensity,
    isOpening,
  };
}

/**
 * MacFolderBack - The folder body (renders BEHIND photos)
 * Contains: tab, main body, gradients, shadows, label
 */
export const MacFolderBack: React.FC<MacFolderLayerProps> = (props) => {
  const { label, isHovered, isClicking, isSelected, x, y, opacity = 1 } = props;
  const state = useFolderState(props);

  // Gradient IDs
  const mainGradientId = `folder-main-${x}-${y}`;
  const bottomGradientId = `folder-bottom-${x}-${y}`;
  const edgeGradientId = `folder-edge-${x}-${y}`;
  const shadowId = `folder-shadow-${x}-${y}`;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${state.finalScale}) translateX(${state.wobbleIntensity}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: `brightness(${state.finalBrightness})`,
        opacity,
        transition: isClicking
          ? 'transform 0.05s ease-out, filter 0.05s ease-out'
          : 'transform 0.15s ease-out, filter 0.15s ease-out',
      }}
    >
      {/* Hover glow */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            width: FOLDER_WIDTH * 1.6,
            height: FOLDER_HEIGHT * 1.4,
            background: `radial-gradient(ellipse, rgba(90, 200, 250, ${state.glowPulse}), transparent 65%)`,
            filter: 'blur(25px)',
            zIndex: -1,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {/* Click flash */}
      {isClicking && (
        <div
          style={{
            position: 'absolute',
            width: FOLDER_WIDTH * 1.2,
            height: FOLDER_HEIGHT * 1.1,
            background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.3), transparent 50%)',
            filter: 'blur(15px)',
            zIndex: -1,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {/* Folder body SVG (NO LID) */}
      <svg
        width={FOLDER_WIDTH}
        height={FOLDER_HEIGHT}
        viewBox="0 0 200 160"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={mainGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#83d4fb" />
            <stop offset="100%" stopColor="#60c0f0" />
          </linearGradient>
          <linearGradient id={bottomGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#008ea2" stopOpacity="0.25" />
            <stop offset="75%" stopColor="#008ea2" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id={edgeGradientId} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#46a2d7" stopOpacity="0.5" />
            <stop offset="10%" stopColor="#46a2d7" stopOpacity="0" />
            <stop offset="90%" stopColor="#46a2d7" stopOpacity="0" />
            <stop offset="100%" stopColor="#46a2d7" stopOpacity="0.5" />
          </linearGradient>
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Tab */}
        <path
          d="M 20 38 L 20 28 Q 20 22, 28 22 L 58 22 Q 66 22, 70 30 L 76 38 Z"
          fill="#46a2d7"
        />
        <path
          d="M 20 38 L 20 28 Q 20 22, 28 22 L 58 22 Q 66 22, 70 30 L 76 38 Z"
          fill="rgba(0,0,0,0.35)"
          opacity="0.35"
        />

        {/* Main body */}
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

        {/* Bottom gradient strip */}
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

        {/* Bottom rounded corners */}
        <path
          d="M 16 137 L 16 137 Q 16 147, 26 147 L 174 147 Q 184 147, 184 137 L 184 127 L 16 127 Z"
          fill={`url(#${bottomGradientId})`}
        />

        {/* Edge lighting */}
        <rect
          x="16"
          y="35"
          width="168"
          height="112"
          rx="10"
          ry="10"
          fill={`url(#${edgeGradientId})`}
        />

        {/* Top highlight */}
        <rect
          x="18"
          y="37"
          width="164"
          height="4"
          rx="2"
          fill="#ffffff"
          opacity="0.15"
        />

        {/* Front bottom panel highlight */}
        <rect
          x="18"
          y="110"
          width="164"
          height="2"
          fill="rgba(255,255,255,0.2)"
        />
      </svg>

      {/* Label */}
      <div
        style={{
          marginTop: 12,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
          fontSize: 14,
          fontWeight: 500,
          color: isSelected ? '#FFFFFF' : '#141414',
          textAlign: 'center',
          backgroundColor: isSelected ? '#0A84FF' : 'transparent',
          padding: isSelected ? '2px 8px' : '2px 4px',
          borderRadius: 4,
          maxWidth: FOLDER_WIDTH + 40,
          letterSpacing: '-0.01em',
          transition: 'background-color 0.1s ease-out, color 0.1s ease-out',
        }}
      >
        {label}
      </div>
    </div>
  );
};

/**
 * MacFolderLid - The animated front panel (renders ABOVE photos)
 * This creates the illusion of photos emerging from inside the folder
 */
export const MacFolderLid: React.FC<MacFolderLayerProps> = (props) => {
  const { isClicking, x, y, opacity = 1 } = props;
  const state = useFolderState(props);

  const lidGradientId = `folder-lid-${x}-${y}`;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${state.finalScale}) translateX(${state.wobbleIntensity}px)`,
        filter: `brightness(${state.finalBrightness})`,
        opacity,
        pointerEvents: 'none', // Lid doesn't capture clicks
        transition: isClicking
          ? 'transform 0.05s ease-out, filter 0.05s ease-out'
          : 'transform 0.15s ease-out, filter 0.15s ease-out',
      }}
    >
      <svg
        width={FOLDER_WIDTH}
        height={FOLDER_HEIGHT}
        viewBox="0 0 200 160"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={lidGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7dd0f8" />
            <stop offset="100%" stopColor="#5ab8e8" />
          </linearGradient>
        </defs>

        {/* Animated lid */}
        <g
          style={{
            transformOrigin: '100px 110px',
            transform: `rotateX(${state.lidRotation}deg) translateY(${state.lidTranslateY}px)`,
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
      </svg>
    </div>
  );
};
