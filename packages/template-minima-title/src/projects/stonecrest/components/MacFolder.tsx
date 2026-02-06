/**
 * MacFolder Component
 * Apple-style folder icon with hover and open states
 */

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface MacFolderProps {
  label: string;
  isHovered: boolean;
  openProgress: number; // 0 = closed, 1 = fully open
  x: number;
  y: number;
}

export const MacFolder: React.FC<MacFolderProps> = ({
  label,
  isHovered,
  openProgress,
  x,
  y,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Folder colors (Apple blue folder style)
  const folderBack = '#5AC8FA';
  const folderFront = '#007AFF';
  const folderTab = '#34AADC';

  // Hover glow
  const glowOpacity = isHovered ? 0.3 : 0;
  const glowScale = isHovered ? 1.05 : 1;

  // Open animation - lid lifts up
  const lidRotation = interpolate(openProgress, [0, 1], [0, -45]);
  const lidY = interpolate(openProgress, [0, 1], [0, -20]);

  // Folder shake on open (anticipation)
  const shakeAmount = openProgress > 0 && openProgress < 0.3
    ? Math.sin(frame * 2) * 2 * (1 - openProgress * 3)
    : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${glowScale}) translateX(${shakeAmount}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Hover glow */}
      <div
        style={{
          position: 'absolute',
          width: 120,
          height: 100,
          background: `radial-gradient(ellipse, rgba(90, 200, 250, ${glowOpacity}), transparent 70%)`,
          filter: 'blur(20px)',
          zIndex: -1,
        }}
      />

      {/* Folder icon */}
      <div style={{ position: 'relative', width: 80, height: 64 }}>
        {/* Back of folder */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 80,
            height: 56,
            background: folderBack,
            borderRadius: '4px 4px 8px 8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        />

        {/* Tab */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 8,
            width: 28,
            height: 12,
            background: folderTab,
            borderRadius: '4px 4px 0 0',
          }}
        />

        {/* Front flap (lid) */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            width: 80,
            height: 40,
            background: folderFront,
            borderRadius: '2px 2px 0 0',
            transformOrigin: 'bottom center',
            transform: `rotateX(${lidRotation}deg) translateY(${lidY}px)`,
            boxShadow: openProgress > 0 ? '0 -4px 12px rgba(0,0,0,0.15)' : 'none',
          }}
        />

        {/* Front of folder */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 80,
            height: 48,
            background: folderFront,
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        />
      </div>

      {/* Label */}
      <div
        style={{
          marginTop: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          fontSize: 12,
          fontWeight: 500,
          color: '#FFFFFF',
          textAlign: 'center',
          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          maxWidth: 100,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
    </div>
  );
};
