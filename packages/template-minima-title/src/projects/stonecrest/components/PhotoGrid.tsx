/**
 * PhotoGrid Component - v0.38
 *
 * CHANGELOG:
 * - v0.38: Clip path fade (3-frame reveal instead of 1-frame pop at burst start)
 * - v0.35: Breathing dampen — oscillation fades to zero over 5 frames before formation
 *
 * - v0.34: UNIFIED TRANSFORM — one continuous motion for formation+merge
 *   - Replaces separate formation (flick) and merge (materialDecelerate) blocks
 *   - Single anticipateSmall curve over 38 frames eliminates stutter
 *   - Strip position is a waypoint, not a stop
 *   - Effects (overlay, radius, desaturation) fire in latter portion only
 *
 * - v0.33: CONTINUOUS MOTION — eliminate stutter at formation→merge
 *   - Formation duration derived from timeline (was hardcoded 20, now dynamic)
 *   - Merge curve: materialDecelerate (non-zero initial velocity, no pause)
 *   - Tighter timeline: formation 18fr, merge 20fr (was 22, 25)
 *
 * - v0.31: SEAL THE MERGE SEAM — settle + geometry
 *   - settleProgress wired up: breathing amplitude decays during settle
 *   - Photo opacity kept at v0.29 behavior (white overlay handles transition)
 *   - Merge geometry produces 189px cluster (matches SearchBarV2 merged width)
 *
 * - v0.29.1: Curve Selection Fix
 *   - FILTER: materialAccelerate replaces sneeze (no anticipation for exit)
 *     - Reduced distance 800→600, scale 0.15→0.05, rotation 8→3
 *   - MERGE: materialStandard replaces whip (no overshoot for compression)
 *
 * - v0.29: THE MORPH — No Transitions
 *   - FILTER: Photos SLIDE OUT of frame (top up, bottom down) instead of fading
 *     - Physical movement > opacity exit
 *     - No opacity change until 80% off-screen (cleanup only)
 *   - MERGE: White overlay grows over photos ("frost on glass")
 *     - Photos physically become the search bar rectangle
 *     - borderRadius morphs from 8 → 25 to match bar
 *
 * - v0.28: The "Achoo" - Momentum System applied
 *   - BURST: Replaced createStaggeredSpring with getMomentumCurve('sneeze')
 *     - Photos now dip slightly INTO folder (anticipation), then explode outward
 *     - Overshoot grid positions briefly, settle back naturally
 *     - The "ah-ah-ah-CHOO!" pattern makes the burst feel explosive yet controlled
 *   - FORMATION: Replaced createSpring('responsive') with momentum('flick')
 *     - Snappier strip formation with slight anticipation
 *   - SETTLE: Uses useBreathe-style math (cleaned up)
 *   - Imports from new motion/ barrel (backward compat preserved for merge)
 *
 * - v0.23: Phase A - Opacity Orchestration
 *   - Fade range [0.5, 0.95] → [0.15, 0.65] for ~100% combined opacity with bar
 *
 * - v0.21: LEAP 2 - Photo-to-SearchBar Metamorphosis
 *   - Formation → blur-merge → search bar emergence
 *
 * - v0.20: DEPTH SYSTEM - Cinematic depth & weight
 * - v0.19.2: Breathing during settle
 * - v0.18.x: Folder emergence, clipping, layering
 * - v0.17: Spring physics for burst and merge
 * - v0.14: Peek phase, wave-based disappear
 * - v0.12: Initial implementation
 *
 * LESSONS APPLIED:
 * - Lesson 3: Spring Physics is Non-Negotiable
 * - Lesson 7: Coordinated movement, not chaotic
 * - Lesson 8: Smooth transitions between phases
 * - Lesson 19: Momentum — The "Achoo" Pattern
 */

import React from 'react';
import {
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import {
  // v0.28: Momentum curves for burst and formation
  getMomentumCurve,
  // v0.29.1: Standard curves for exit and merge (no anticipation/overshoot)
  getCurve,
  // v0.20: Depth system imports
  ELEVATION,
  getElevationShadow,
  getFocusBlur,
  FOCUS,
  DEPTH_LAYER,
} from '../motion/index';

interface PhotoState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  clipTop: number | null; // v0.18.2: Clip photos to simulate emerging from folder
  // v0.20: Depth system
  elevation: number;      // 0 (resting) to 1 (highest) - affects shadow
  blur: number;           // Focus blur in pixels (max 3)
  // v0.21: Metamorphosis
  desaturation: number;   // 0 (full color) to 1 (grayscale)
  // v0.29: Morph — photos become the search bar
  whiteOverlay: number;   // 0 (no overlay) to 1 (fully white) — "frost on glass"
  morphedRadius: number;  // borderRadius morphing from photo (8) to bar (25)
}

interface PhotoGridProps {
  photos: string[];
  visibleIndices: number[];
  peekProgress: number;      // 0 = hidden, 1 = peeking at folder
  burstStartFrame: number;   // v0.17: Frame when burst starts (for spring)
  settleProgress: number;    // 0 = arriving, 1 = settled (kept for compatibility)
  filterProgress: number;    // 0 = all visible, 1 = only middle row
  formationStartFrame: number; // v0.21: Frame when middle row forms strip
  mergeStartFrame: number;   // v0.17: Frame when merge starts (for spring)
  centerX: number;
  centerY: number;
}

// Grid layout for 9 photos (3x3)
const GRID_POSITIONS = [
  { row: 0, col: 0 }, // top-left
  { row: 0, col: 1 }, // top-center
  { row: 0, col: 2 }, // top-right
  { row: 1, col: 0 }, // middle-left
  { row: 1, col: 1 }, // middle-center
  { row: 1, col: 2 }, // middle-right
  { row: 2, col: 0 }, // bottom-left
  { row: 2, col: 1 }, // bottom-center
  { row: 2, col: 2 }, // bottom-right
];

// Middle row indices (these survive the filter)
const MIDDLE_ROW_INDICES = [3, 4, 5];

// Wave-based disappear: top row, then bottom row (coordinated, not sporadic)
const DISAPPEAR_ORDER = [0, 1, 2, 6, 7, 8];

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  visibleIndices,
  peekProgress,
  burstStartFrame,
  settleProgress,
  filterProgress,
  formationStartFrame,
  mergeStartFrame,
  centerX,
  centerY,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const photoWidth = 180;
  const photoHeight = 120;
  const gridGap = 16;

  // Calculate grid dimensions
  const gridWidth = 3 * photoWidth + 2 * gridGap;
  const gridHeight = 3 * photoHeight + 2 * gridGap;
  const gridStartX = centerX - gridWidth / 2;
  const gridStartY = centerY - gridHeight / 2;

  // Folder position (where photos emerge from)
  // v0.18.1: Photos emerge from INSIDE folder, moving UPWARD through lid opening
  const folderX = centerX;
  const folderInsideY = centerY + 20;   // Start position: INSIDE the folder body
  const folderLidY = centerY - 50;       // Exit position: just above the folder lid

  const getPhotoState = (index: number): PhotoState => {
    const gridPos = GRID_POSITIONS[index] || { row: 1, col: 1 };

    // Target grid position
    const gridX = gridStartX + gridPos.col * (photoWidth + gridGap) + photoWidth / 2;
    const gridY = gridStartY + gridPos.row * (photoHeight + gridGap) + photoHeight / 2;

    // Merged position (center for search bar transition)
    const mergedX = centerX;
    const mergedY = centerY;

    // ============================================
    // PHASE 1: PEEK (photos EMERGE from inside folder)
    // v0.18.3: Photos MUCH larger and higher - clearly visible emergence
    // ============================================
    let x = folderX;
    // Photos rise MUCH higher - well above folder (40px higher than before)
    let y = interpolate(peekProgress, [0, 1], [folderInsideY, folderLidY - 40]);
    // Scale from 0.5 to 0.85 - large enough to SEE clearly (was 0.15-0.4 = invisible)
    let scale = interpolate(peekProgress, [0, 1], [0.5, 0.85]);
    let rotation = 0;
    // Full opacity quickly (was [0, 0.2, 1] → [0, 0.8, 1] = slow fade)
    let opacity = interpolate(peekProgress, [0, 0.1], [0, 1]);
    // v0.18.3: Lower clip line so more of photo is visible during emergence
    // Clip line at centerY - 10 (was centerY - 30 = too aggressive)
    let clipTop: number | null = centerY - 10;

    // v0.20: Depth system - elevation and blur
    // Center photos (index 4) are foreground, edges are midground
    const distFromCenter = Math.abs(index - 4);
    const photoDepth = interpolate(distFromCenter, [0, 4], [DEPTH_LAYER.foreground, DEPTH_LAYER.midground]);
    let elevation = ELEVATION.resting;
    let blur = 0;
    // v0.21: Desaturation for metamorphosis (grayscale during merge)
    let desaturation = 0;
    // v0.29: Morph properties (photos become search bar)
    let whiteOverlay = 0;
    let morphedRadius = 8;

    // ============================================
    // PHASE 2: BURST (expand to grid positions)
    // v0.28: Momentum "sneeze" pattern — the "Achoo!"
    //   ah-ah-ah = slight dip/anticipation before burst
    //   CHOO! = explosive release, overshoot grid positions
    //   settle = ease back to target naturally
    // ============================================
    const isBursting = burstStartFrame > 0 && frame >= burstStartFrame;
    if (isBursting) {
      // Coordinated stagger: center photo moves first, corners last
      const distFromCenter = Math.abs(index - 4);
      const staggerDelay = distFromCenter * 3; // 3 frames per distance unit
      const burstDuration = 30; // Full achoo cycle in frames

      const effectiveFrame = frame - burstStartFrame - staggerDelay;
      const sneezeCurve = getMomentumCurve('sneeze');

      if (effectiveFrame < 0) {
        // Not yet started (stagger delay) — hold at peek position
        x = folderX;
        y = folderLidY - 40;
        scale = 0.85;
      } else {
        // Progress through the sneeze curve (anticipation → action → settle)
        const t = Math.min(effectiveFrame / burstDuration, 1);
        const progress = sneezeCurve(t);

        // Position: folder → grid with momentum overshoot
        x = folderX + (gridX - folderX) * progress;
        y = (folderLidY - 40) + (gridY - (folderLidY - 40)) * progress;

        // Scale: 0.85 → 1 with the achoo curve (overshoots past 1 briefly)
        scale = 0.85 + (1 - 0.85) * progress;
      }

      // Minimal rotation during burst (subtle, not chaotic)
      const targetRotation = (gridPos.col - 1) * 1.5; // -1.5, 0, 1.5 degrees
      const normalizedProgress = effectiveFrame < 0
        ? 0
        : Math.min(effectiveFrame / burstDuration, 1);
      // Rotation peaks mid-burst then returns to 0
      const rotationProgress = normalizedProgress < 0.5
        ? normalizedProgress / 0.5
        : 1 - (normalizedProgress - 0.5) / 0.5;
      rotation = targetRotation * 1.5 * Math.max(0, rotationProgress);

      opacity = 1;
      // v0.38: Fade clip over first 3 burst frames instead of instant removal.
      // At frame 60, clipTop jumped from centerY-10 to null (1-frame visibility pop).
      // Now the clip line rapidly moves upward over 3 frames for smooth reveal.
      const burstAge = frame - burstStartFrame;
      clipTop = burstAge < 3
        ? centerY - 10 - (burstAge / 3) * 200
        : null;

      // Elevation: lifted during burst, settles to hover
      elevation = effectiveFrame < 0
        ? ELEVATION.lifted
        : ELEVATION.lifted + (ELEVATION.hover - ELEVATION.lifted) * Math.min(effectiveFrame / burstDuration, 1);

      // ============================================
      // PHASE 3: SETTLE (deceleration + breathing)
      // v0.31: settleProgress wired up — breathing amplitude decays as
      //   photos "land" into grid position. Creates a gradual arrival
      //   rather than instant lock-into-place.
      // v0.19.2: Micro-oscillation prevents "dead" static feel
      // ============================================
      if (normalizedProgress >= 0.85) {
        // v0.31: Breathing amplitude decays with settle progress
        // Early settle (0): larger oscillation (0.01) — still "landing"
        // Late settle (1): smaller oscillation (0.005) — resting state
        const maxAmplitude = 0.01;
        const minAmplitude = 0.005;

        // v0.35: Dampen breathing over last 5 frames before formation
        // Prevents mid-cycle oscillation cutoff at phase boundary
        const framesToFormation = formationStartFrame - frame;
        const breatheDampen = formationStartFrame > 0 && framesToFormation <= 5
          ? Math.max(0, framesToFormation / 5)
          : 1;

        const breatheAmplitude = (maxAmplitude + (minAmplitude - maxAmplitude) * settleProgress) * breatheDampen;

        const breathePhase = (frame + index * 5) * 0.08;
        const breatheAmount = Math.sin(breathePhase) * breatheAmplitude;
        scale = scale * (1 + breatheAmount);

        // Micro-float: amplitude also decays (2px landing → 1px resting)
        const floatAmplitude = (2 - settleProgress) * breatheDampen;
        const floatAmount = Math.sin(breathePhase * 0.7) * floatAmplitude;
        y = y + floatAmount;
      }
    }

    // ============================================
    // PHASE 4: FILTER (non-middle-row SLIDES OUT of frame)
    // v0.29: MORPH — no fading. Top row shoots UP, bottom row shoots DOWN.
    //   Physical exit > opacity exit. The brain tracks spatial movement
    //   naturally but notices opacity changes as "an effect was applied."
    // ============================================
    if (!MIDDLE_ROW_INDICES.includes(index) && filterProgress > 0) {
      // Wave: top row first (row 0), then bottom row (row 2)
      const rowDelay = gridPos.row === 0 ? 0 : 0.4;
      const adjustedFilter = Math.max(0, Math.min(1,
        (filterProgress - rowDelay) / (1 - rowDelay)
      ));

      // v0.29.1: materialAccelerate for exit — no anticipation, no overshoot.
      // Elements leaving screen should accelerate out, not wind up first.
      const exitCurve = getCurve('materialAccelerate');
      const exitProgress = exitCurve(adjustedFilter);

      // Direction: top row goes UP, bottom row goes DOWN
      const exitDirection = gridPos.row === 0 ? -1 : 1;

      // Photos accelerate off screen (600px clears viewport from center)
      y = y + exitDirection * exitProgress * 600;

      // Subtle scale UP as they fly away (perspective: moving toward viewer)
      scale = 1 + exitProgress * 0.05;

      // Tilt in exit direction (subtle, not dramatic)
      const tiltDirection = gridPos.col - 1; // -1, 0, 1
      rotation = tiltDirection * exitProgress * 3;

      // Opacity stays 1 until 80% through, then quick cleanup
      opacity = exitProgress > 0.8
        ? interpolate(exitProgress, [0.8, 1], [1, 0])
        : 1;

      // Elevation increases as photos fly away
      elevation = ELEVATION.lifted + exitProgress * 0.3;
    }

    // ============================================
    // PHASE 5: UNIFIED TRANSFORM (formation + merge as one motion)
    // v0.34: Eliminates the formation→merge stutter by removing the phase
    //   boundary entirely. One curve drives scale, position, and rotation
    //   over the full 38-frame span. The old "strip position" is a waypoint
    //   the curve passes through, not a stop. Effects (white overlay,
    //   borderRadius, desaturation) fire in the latter portion only.
    // ============================================
    const mergedOffset = (index - 4) * (photoWidth * 0.5 * 0.6); // -54, 0, +54
    const targetX = centerX + mergedOffset;

    const isTransforming = MIDDLE_ROW_INDICES.includes(index) &&
      formationStartFrame > 0 &&
      frame >= formationStartFrame;

    if (isTransforming) {
      const mergeDuration = 20; // matches timeline
      const transformEnd = mergeStartFrame + mergeDuration;
      const totalDuration = transformEnd - formationStartFrame; // 38

      // Linear progress over the full span
      const linearProgress = Math.min(
        (frame - formationStartFrame) / totalDuration, 1
      );

      // Single curve: slight anticipation → continuous motion → smooth stop
      // anticipateSmall: bezier(0.38, -0.1, 0.69, 0.88)
      // - y1=-0.1: photos briefly scale UP ~1% ("breath" before compression)
      // - Single cubic bezier = no flat spots, no dead frames, no handoffs
      const transformCurve = getCurve('anticipateSmall');
      const easedProgress = transformCurve(linearProgress);

      // POSITION: grid → merged center (strip is a waypoint, not a stop)
      x = gridX + (targetX - gridX) * easedProgress;
      // Y: gridY ≈ centerY for middle row — slight correction to exact center
      y = gridY + (mergedY - gridY) * easedProgress;

      // SCALE: 1.0 → 0.45 in one arc
      // (anticipation briefly pushes above 1.0 before shrinking)
      scale = 1.0 + (0.45 - 1.0) * easedProgress;

      // ROTATION: zero out any residual from burst
      rotation = rotation * (1 - Math.min(easedProgress * 2, 1));

      // --- EFFECTS: latter portion only (original merge window) ---
      const mergePortionStart =
        (mergeStartFrame - formationStartFrame) / totalDuration; // ~0.474
      const effectsLinear = Math.max(0, Math.min(1,
        (linearProgress - mergePortionStart) / (1 - mergePortionStart)
      ));

      // v0.29: WHITE OVERLAY — "frost on glass" effect
      // Starts at 30% of merge portion, fully white by 90%
      whiteOverlay = interpolate(effectsLinear, [0.3, 0.9], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

      // borderRadius morphs from photo (8) to search bar (25)
      morphedRadius = 8 + (25 - 8) * effectsLinear;

      // DESATURATION: progressive grayscale as photos whiten
      desaturation = Math.min(0.8, effectsLinear * 1.2);

      // Photos stay opaque — white overlay handles the visual transition.
      // Only fade opacity in last 10% for DOM cleanup (envelope handoff).
      opacity = effectsLinear > 0.9
        ? interpolate(effectsLinear, [0.9, 1], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        : 1;

      blur = 0;
    }

    return { x, y, scale, rotation, opacity, clipTop, elevation, blur, desaturation, whiteOverlay, morphedRadius };
  };

  return (
    <>
      {photos.slice(0, 9).map((photo, index) => {
        if (!visibleIndices.includes(index)) return null;

        const state = getPhotoState(index);
        if (state.opacity <= 0.01) return null;

        // v0.18.2: Calculate clip path to hide portion below folder lid
        // This makes photos appear to emerge FROM the folder, not on top
        let clipPath: string | undefined;
        if (state.clipTop !== null) {
          // How much of the photo is above the clip line?
          const photoTop = state.y - (photoHeight * state.scale) / 2;
          const photoBottom = state.y + (photoHeight * state.scale) / 2;
          const visibleTop = Math.max(photoTop, state.clipTop);

          // If photo is entirely below clip line, hide it completely
          if (photoTop >= state.clipTop) {
            // Photo hasn't emerged yet - clip entirely
            clipPath = 'inset(100% 0 0 0)';
          } else if (photoBottom > state.clipTop) {
            // Photo is partially emerged - clip the bottom portion
            const clipPercent = ((state.clipTop - photoTop) / (photoBottom - photoTop)) * 100;
            clipPath = `inset(0 0 ${100 - clipPercent}% 0)`;
          }
        }

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: state.x,
              top: state.y,
              width: photoWidth,
              height: photoHeight,
              transform: `translate(-50%, -50%) scale(${state.scale}) rotate(${state.rotation}deg)`,
              opacity: state.opacity,
              // v0.29: borderRadius morphs during merge (photo shape → bar shape)
              borderRadius: state.morphedRadius,
              overflow: 'hidden',
              // v0.20: Elevation-aware shadow (replaces static shadow)
              boxShadow: getElevationShadow(state.elevation),
              // v0.20/v0.21: Combined filter for blur and desaturation
              filter: [
                state.blur > 0 ? `blur(${state.blur}px)` : '',
                state.desaturation > 0 ? `grayscale(${state.desaturation})` : '',
              ].filter(Boolean).join(' ') || undefined,
              clipPath, // v0.18.2: Clip to folder opening
            }}
          >
            <Img
              src={staticFile(photo)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* v0.29: White overlay — "frost on glass" morph effect */}
            {state.whiteOverlay > 0 && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#FFFFFF',
                  opacity: state.whiteOverlay,
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

/**
 * Get which photos should be visible during the disappear phase
 * v0.14: Wave-based (top row, then bottom row)
 */
export function getVisibleIndicesForDisappear(
  frame: number,
  startFrame: number,
  disappearDuration: number
): number[] {
  const allIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const progress = interpolate(
    frame - startFrame,
    [0, disappearDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // How many non-middle-row photos should have disappeared
  const disappearCount = Math.floor(progress * DISAPPEAR_ORDER.length);

  // Remove photos in wave order
  const toRemove = DISAPPEAR_ORDER.slice(0, disappearCount);
  return allIndices.filter(i => !toRemove.includes(i));
}
