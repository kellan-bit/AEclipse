/**
 * Complex Animation Standards
 *
 * These are the BASELINE patterns - not special effects.
 * Every project should use these by default.
 */

import { interpolate, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// ============================================
// CAMERA MOVEMENTS (Simulated via transforms)
// ============================================

/**
 * Dolly zoom (Vertigo effect) - zoom in while pulling back
 * Creates unsettling depth distortion
 */
export function getDollyZoom(
  frame: number,
  startFrame: number,
  duration: number,
  intensity: number = 0.3
): { scale: number; translateZ: number } {
  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return {
    scale: 1 + progress * intensity,
    translateZ: -progress * intensity * 500,
  };
}

/**
 * Cinematic pan with ease
 * Starts slow, speeds up, slows down at end
 */
export function getCinematicPan(
  frame: number,
  startFrame: number,
  duration: number,
  distance: number = 200
): number {
  return interpolate(
    frame - startFrame,
    [0, duration],
    [0, distance],
    {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Cinematic ease
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
}

/**
 * Handheld camera shake
 * Subtle organic movement
 */
export function getHandheldShake(
  frame: number,
  intensity: number = 3
): { x: number; y: number; rotation: number } {
  const seed1 = Math.sin(frame * 0.1) * Math.cos(frame * 0.15);
  const seed2 = Math.cos(frame * 0.12) * Math.sin(frame * 0.08);
  const seed3 = Math.sin(frame * 0.05) * 0.5;

  return {
    x: seed1 * intensity,
    y: seed2 * intensity,
    rotation: seed3 * (intensity * 0.1),
  };
}

/**
 * Rack focus simulation (blur shift between layers)
 * Returns blur amount for foreground/background
 */
export function getRackFocus(
  frame: number,
  startFrame: number,
  duration: number,
  focusTarget: 'foreground' | 'background'
): { foregroundBlur: number; backgroundBlur: number } {
  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  if (focusTarget === 'background') {
    return {
      foregroundBlur: progress * 8,
      backgroundBlur: (1 - progress) * 8,
    };
  }
  return {
    foregroundBlur: (1 - progress) * 8,
    backgroundBlur: progress * 8,
  };
}

// ============================================
// MULTI-LAYER PARALLAX
// ============================================

/**
 * Parallax layer movement
 * Closer layers move faster
 */
export function getParallaxOffset(
  frame: number,
  baseSpeed: number,
  layerDepth: number // 0 = far, 1 = close
): number {
  const speed = baseSpeed * (0.2 + layerDepth * 0.8);
  return frame * speed;
}

/**
 * 3D parallax with perspective
 */
export function get3DParallax(
  frame: number,
  layerIndex: number,
  totalLayers: number,
  scrollSpeed: number = 2
): { x: number; y: number; scale: number; opacity: number } {
  const depth = layerIndex / totalLayers;
  const perspectiveScale = 0.7 + depth * 0.3;

  return {
    x: frame * scrollSpeed * depth,
    y: frame * scrollSpeed * depth * 0.3,
    scale: perspectiveScale,
    opacity: 0.5 + depth * 0.5,
  };
}

// ============================================
// COMPLEX EASING & SPRINGS
// ============================================

/**
 * Custom bezier curves for cinematic motion
 */
export const CINEMATIC_EASINGS = {
  // Slow start, fast middle, slow end
  dramatic: Easing.bezier(0.7, 0, 0.3, 1),

  // Quick start, long settle
  snappy: Easing.bezier(0.2, 0.8, 0.2, 1),

  // Smooth S-curve
  smooth: Easing.bezier(0.4, 0, 0.2, 1),

  // Anticipation (slight pullback before movement)
  anticipate: Easing.bezier(0.68, -0.6, 0.32, 1.6),

  // Heavy overshoot
  overshoot: Easing.bezier(0.34, 1.56, 0.64, 1),

  // Elastic settle
  elastic: Easing.bezier(0.68, -0.55, 0.265, 1.55),
};

/**
 * Spring physics for organic movement
 */
export function getSpringValue(
  frame: number,
  fps: number,
  config: {
    mass?: number;
    stiffness?: number;
    damping?: number;
  } = {}
): number {
  return spring({
    frame,
    fps,
    config: {
      mass: config.mass ?? 1,
      stiffness: config.stiffness ?? 100,
      damping: config.damping ?? 10,
    },
  });
}

// ============================================
// COMPLEX TRANSITIONS
// ============================================

/**
 * Iris wipe (circular reveal)
 */
export function getIrisWipe(
  frame: number,
  startFrame: number,
  duration: number,
  centerX: number = 50,
  centerY: number = 50
): string {
  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 150], // 150% to ensure full coverage
    {
      easing: CINEMATIC_EASINGS.smooth,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return `circle(${progress}% at ${centerX}% ${centerY}%)`;
}

/**
 * Diagonal wipe
 */
export function getDiagonalWipe(
  frame: number,
  startFrame: number,
  duration: number,
  angle: number = 45
): string {
  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [-50, 150],
    {
      easing: CINEMATIC_EASINGS.dramatic,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const rad = (angle * Math.PI) / 180;
  const x1 = 50 + Math.cos(rad) * progress;
  const y1 = 50 + Math.sin(rad) * progress;

  return `polygon(0% 0%, ${x1}% 0%, ${x1 + 10}% 100%, 0% 100%)`;
}

/**
 * Multi-panel split reveal
 */
export function getSplitReveal(
  frame: number,
  startFrame: number,
  duration: number,
  panels: number = 4
): number[] {
  const offsets: number[] = [];

  for (let i = 0; i < panels; i++) {
    const stagger = i * (duration / panels / 2);
    const panelProgress = interpolate(
      frame - startFrame - stagger,
      [0, duration - stagger],
      [100, 0],
      {
        easing: CINEMATIC_EASINGS.overshoot,
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );
    offsets.push(panelProgress);
  }

  return offsets;
}

/**
 * Glitch transition
 */
export function getGlitchOffset(
  frame: number,
  intensity: number = 20
): { x: number; y: number; skewX: number; sliceOffset: number[] } {
  const glitchActive = Math.random() > 0.7;

  if (!glitchActive) {
    return { x: 0, y: 0, skewX: 0, sliceOffset: [0, 0, 0] };
  }

  return {
    x: (Math.random() - 0.5) * intensity * 2,
    y: (Math.random() - 0.5) * intensity,
    skewX: (Math.random() - 0.5) * 5,
    sliceOffset: [
      Math.random() * intensity,
      -Math.random() * intensity,
      Math.random() * intensity * 0.5,
    ],
  };
}

// ============================================
// MULTI-ELEMENT ORCHESTRATION
// ============================================

/**
 * Staggered entrance with physics
 */
export function getOrchestratedEntrance(
  frame: number,
  fps: number,
  elementIndex: number,
  totalElements: number,
  config: {
    staggerDelay?: number;
    direction?: 'left' | 'right' | 'up' | 'down' | 'scale' | 'random';
    distance?: number;
  } = {}
): { x: number; y: number; scale: number; opacity: number; rotation: number } {
  const staggerDelay = config.staggerDelay ?? 3;
  const direction = config.direction ?? 'up';
  const distance = config.distance ?? 100;

  const elementFrame = frame - elementIndex * staggerDelay;

  const springProgress = spring({
    frame: elementFrame,
    fps,
    config: { mass: 0.5, stiffness: 100, damping: 12 },
  });

  const opacity = interpolate(springProgress, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  let x = 0, y = 0, scale = 1, rotation = 0;

  switch (direction) {
    case 'left':
      x = (1 - springProgress) * -distance;
      break;
    case 'right':
      x = (1 - springProgress) * distance;
      break;
    case 'up':
      y = (1 - springProgress) * distance;
      break;
    case 'down':
      y = (1 - springProgress) * -distance;
      break;
    case 'scale':
      scale = springProgress;
      break;
    case 'random':
      x = (1 - springProgress) * (Math.random() - 0.5) * distance * 2;
      y = (1 - springProgress) * (Math.random() - 0.5) * distance * 2;
      rotation = (1 - springProgress) * (Math.random() - 0.5) * 30;
      break;
  }

  return { x, y, scale, opacity, rotation };
}

/**
 * Wave animation across elements
 */
export function getWaveOffset(
  frame: number,
  elementIndex: number,
  config: {
    amplitude?: number;
    frequency?: number;
    speed?: number;
  } = {}
): number {
  const amplitude = config.amplitude ?? 20;
  const frequency = config.frequency ?? 0.3;
  const speed = config.speed ?? 0.1;

  return Math.sin(frame * speed + elementIndex * frequency) * amplitude;
}

// ============================================
// 3D TRANSFORMS
// ============================================

/**
 * Card flip animation
 */
export function getCardFlip(
  frame: number,
  startFrame: number,
  duration: number
): { rotateY: number; showBack: boolean } {
  const rotation = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 180],
    {
      easing: CINEMATIC_EASINGS.smooth,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return {
    rotateY: rotation,
    showBack: rotation > 90,
  };
}

/**
 * Perspective tilt on hover/focus
 */
export function getPerspectiveTilt(
  mouseX: number, // -1 to 1
  mouseY: number, // -1 to 1
  intensity: number = 15
): { rotateX: number; rotateY: number; transform: string } {
  const rotateX = mouseY * intensity;
  const rotateY = mouseX * -intensity;

  return {
    rotateX,
    rotateY,
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
  };
}

// ============================================
// DEFAULT COMPLEXITY SETTINGS
// ============================================

/**
 * These should be the STARTING POINT, not the "advanced" options
 */
export const DEFAULT_ANIMATION_COMPLEXITY = {
  // Always use cinematic easing, never linear
  defaultEasing: CINEMATIC_EASINGS.smooth,

  // Minimum 3 layers for any composition
  minLayers: 3,

  // Always include subtle camera movement
  cameraMovement: {
    enabled: true,
    shake: 1.5, // Subtle handheld feel
    drift: 0.02, // Slow drift
  },

  // Stagger everything by default
  stagger: {
    enabled: true,
    delayPerElement: 4, // frames
  },

  // Spring physics for all motion
  springConfig: {
    mass: 0.8,
    stiffness: 120,
    damping: 14,
  },

  // Parallax depth for layered compositions
  parallax: {
    enabled: true,
    depthRange: 0.3, // 30% depth variation
  },
};
