/**
 * Stonecrest v0.33 - CONTINUOUS MOTION (Phase 3, Step 2.5)
 *
 * CHANGELOG:
 * - v0.33: Continuous Motion — eliminate stutter, faster morphs
 *   - Timeline tightened: formation 18fr, merge 20fr, searchGrow 18fr, expand 32fr
 *   - Merge curve: materialDecelerate (non-zero initial velocity at boundary)
 *   - Formation duration now derived dynamically (no more hardcoded mismatch)
 *
 * - v0.32: Morph Envelope — one element from merge to website
 *   - SearchBar renders BEFORE PhotoGrid in DOM (behind, not on top)
 *   - Bar visible from merge start (frame 200), masked by photos above
 *   - When photos fade at 90-100% merge, bar is already there
 *   - One continuous element: merge → search bar → website
 *
 * - v0.31: Seal the Merge Seam — geometry match
 *   - Merged dimensions match photo cluster geometry (189px, was 280px)
 *   - settleProgress wired up in PhotoGrid (breathing amplitude decay)
 *   - Lesson: crossfade between separate DOM elements = double exposure
 *
 * - v0.30: Declarative timeline system replaces flat TIMELINE object
 *   - All 25 frame constants → 18 typed phases via createTimeline()
 *   - useTimeline() hook provides t.progress(), t.isIn(), t.startOf()
 *   - interpolate() boilerplate → t.progress('phaseName', ease)
 *   - Visibility flags → t.isAfter() / t.isBefore()
 *   - Child components still receive frame numbers (gradual migration)
 *   - Zero visual regression — identical output at all frames
 *
 * - v0.29: THE MORPH (No Transitions)
 *   - Geometry morphs replace opacity transitions throughout
 *   - Folder shrinks behind photos (scale morph, not fade)
 *   - Photos slide out of frame (not fade), merge via white overlay
 *   - Search bar IS the website container (renderExpandedContent)
 *
 * - v0.25: Phase A complete - "The Invisible Seam"
 * - v0.21: Photo-to-SearchBar Metamorphosis
 * - v0.20: DEPTH SYSTEM
 * - v0.19: Polish & Flow
 * - v0.18: Cursor direction + faster pacing + z-ordering
 * - v0.17: Spring physics
 * - v0.15: White background
 * - v0.14: Unified motion, wave-based disappear
 * - v0.12: Initial implementation
 *
 * LESSONS APPLIED:
 * - Lesson 3: Spring Physics is Non-Negotiable
 * - Lesson 7: Professional Animation = Consistency Over Effects
 * - Lesson 8: Transitions Are Everything
 * - Lesson 22: Curve Selection Semantics
 * - Lesson 23: Audit Visibility Guards After Architecture Changes
 */

import React from 'react';
import {
  AbsoluteFill,
  useVideoConfig,
  interpolate,
} from 'remotion';

import { EASE } from './motion';
import { useTimeline } from './motion/index';
import { stonecrestTimeline } from './stonecrest-timeline';
import { MacFolderBack, MacFolderLid } from './components/MacFolderLayers';
import {
  MouseCursor,
  getMousePositionWithHesitation,
  interpolateMousePosition,
} from './components/MouseCursor';
import { PhotoGrid, getVisibleIndicesForDisappear } from './components/PhotoGrid';
import { SearchBarV2 as SearchBar, getTypingProgress } from './components/SearchBarV2';
import { WebsiteContent } from './components/WebsiteUI';

// ============================================
// ASSETS
// ============================================

const PHOTOS = [
  'assets/minima/Photos/Homes/Stonecrest/Basil_ex01_Final_2025-04-23.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basil_int1.1_Final_2025-04-24.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basin_int1.2_Final_2025-04-24.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basin_int1.3_Final_2025-04-24.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basin_int2.1_Final_2025-04-23.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basin_int3.1_Final_2025-04-24.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basin_int4.2_Final_2025-04-23.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basil_ex02_Final_2025-04-23.jpg',
  'assets/minima/Photos/Homes/Stonecrest/Basil_int1.1_Final_2025-04-24.jpg', // duplicate to fill 9
];

const BANNER_IMAGE = 'assets/minima/Photos/Homes/Stonecrest/Basil_ex01_Final_2025-04-23.jpg';

// ============================================
// MAIN COMPOSITION
// ============================================

export const StonecrestReveal: React.FC = () => {
  const t = useTimeline(stonecrestTimeline);
  const { width, height } = useVideoConfig();

  const centerX = width / 2;
  const centerY = height / 2;

  // ============================================
  // MOUSE ANIMATION
  // v0.18: Cursor enters from RIGHT (more natural approach angle)
  // ============================================

  const mouseStartX = width + 50;
  const mouseStartY = height / 2 - 80;
  const folderX = centerX;
  const folderY = centerY;

  let mouseX: number;
  let mouseY: number;
  let isClicking = false;

  if (t.isBefore('hesitation')) {
    // Moving toward folder
    const pos = interpolateMousePosition(
      t.frame,
      t.startOf('mouseApproach'),
      t.endOf('mouseApproach'),
      mouseStartX, mouseStartY,
      folderX, folderY - 20
    );
    mouseX = pos.x;
    mouseY = pos.y;
  } else if (t.isIn('hesitation')) {
    // Hesitating over folder
    const hesitationMid = (t.startOf('hesitation') + t.endOf('hesitation')) / 2;
    const hesitationIntensity = interpolate(
      t.frame,
      [t.startOf('hesitation'), hesitationMid, t.endOf('hesitation')],
      [0, 1, 0]
    );
    const pos = getMousePositionWithHesitation(t.frame, folderX, folderY - 20, hesitationIntensity);
    mouseX = pos.x;
    mouseY = pos.y;
  } else if (t.isBefore('photoBurst')) {
    // Clicking position (slight adjustment)
    mouseX = folderX + 5;
    mouseY = folderY - 15;

    // Click states
    isClicking = (
      (t.frame >= t.startOf('firstClick') && t.frame < t.startOf('firstClick') + 4) ||
      (t.frame >= t.startOf('secondClick') && t.frame < t.startOf('secondClick') + 4)
    );
  } else {
    // Mouse fades out / moves away
    mouseX = folderX + 200;
    mouseY = folderY - 100;
  }

  const mouseVisible = t.frame < t.startOf('photoBurst') + 30;

  // ============================================
  // FOLDER ANIMATION
  // v0.29: MORPH — folder shrinks behind photos (not fade)
  // ============================================

  const burstStart = t.startOf('photoBurst');
  const folderVisible = t.frame < burstStart + 20;
  const isHovered = t.isAfter('mouseApproach') && t.isBefore('photoBurst');
  const isSelected = t.frame >= t.startOf('secondClick') && t.frame < burstStart + 20;

  // v0.29: Folder SHRINKS as photos burst out (instead of fading)
  const folderScale = t.frame >= burstStart
    ? interpolate(
        t.frame,
        [burstStart, burstStart + 20],
        [1, 0.3],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  // Opacity only drops at the end (cleanup, not transition)
  const folderOpacity = t.frame >= burstStart
    ? interpolate(
        t.frame,
        [burstStart + 10, burstStart + 20],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  // ============================================
  // PHOTO GRID ANIMATION
  // ============================================

  // v0.29: Photos stay until merge completes (white overlay handles visual handoff)
  const photosVisible = !t.isBefore('photoPeek') && t.isBefore('searchGrow');

  // Peek phase — photos appear small at folder position
  const peekProgress = t.progress('photoPeek', EASE.enter);

  // Settle into grid
  const settleProgress = t.progress('photoSettle', EASE.default);

  // Filter — wave-based slide-out
  const filterProgress = t.progress('filter', EASE.default);

  // Get visible photo indices — wave-based (top row, then bottom row)
  const visibleIndices = t.isBefore('filter')
    ? [0, 1, 2, 3, 4, 5, 6, 7, 8]
    : getVisibleIndicesForDisappear(t.frame, t.startOf('filter'), t.durationOf('filter'));

  // ============================================
  // SEARCH BAR ANIMATION
  // ============================================

  // v0.32: MORPH ENVELOPE — bar renders from merge start, BEHIND photos in DOM.
  // Photos mask it during merge (they're on top). When photos fade at 90-100%
  // merge, the bar is already there at matching geometry. One continuous element
  // from merge through search bar through website reveal.
  const searchBarVisible = !t.isBefore('merge');

  const typingProgress = getTypingProgress(
    t.frame,
    t.startOf('typing'),
    'minimahomes.com',
    4
  );

  // ============================================
  // BACKGROUND
  // ============================================

  const backgroundColor = '#FFFFFF';

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: 'hidden' }}>
      {/* Folder BACK (body) - renders BEHIND photos */}
      {folderVisible && (
        <div style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${folderScale})`,
          transformOrigin: `${folderX}px ${folderY}px`,
        }}>
          <MacFolderBack
            label="Stonecrest (secret)"
            isHovered={isHovered}
            isClicking={isClicking}
            isSelected={isSelected}
            openStartFrame={t.startOf('folderOpen')}
            x={folderX}
            y={folderY}
            opacity={folderOpacity}
          />
        </div>
      )}

      {/* v0.32: MORPH ENVELOPE — SearchBar renders BEHIND photos.
          During merge, photos are on top (opaque + white overlay).
          When photos fade at 90-100% merge, the white bar is already
          underneath at matching geometry. One continuous element from
          merge → search bar → website. */}
      <SearchBar
        text="minimahomes.com"
        typingProgress={typingProgress}
        emergenceStartFrame={t.startOf('searchEmerge')}
        photosFullyMergedFrame={t.startOf('searchGrow')}
        searchBarReadyFrame={t.endOf('searchGrow')}
        expandStartFrame={t.startOf('expand')}
        visible={searchBarVisible}
        centerX={centerX}
        centerY={centerY}
        renderExpandedContent={() => <WebsiteContent bannerImage={BANNER_IMAGE} />}
      />

      {/* Photo Grid - renders ON TOP of envelope during merge */}
      {photosVisible && (
        <PhotoGrid
          photos={PHOTOS}
          visibleIndices={visibleIndices}
          peekProgress={peekProgress}
          burstStartFrame={t.startOf('photoBurst')}
          settleProgress={settleProgress}
          filterProgress={filterProgress}
          formationStartFrame={t.startOf('formation')}
          mergeStartFrame={t.startOf('merge')}
          centerX={centerX}
          centerY={centerY}
        />
      )}

      {/* Folder LID - renders ABOVE photos for emergence effect */}
      {folderVisible && (
        <div style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${folderScale})`,
          transformOrigin: `${folderX}px ${folderY}px`,
        }}>
          <MacFolderLid
            label="Stonecrest (secret)"
            isHovered={isHovered}
            isClicking={isClicking}
            isSelected={isSelected}
            openStartFrame={t.startOf('folderOpen')}
            x={folderX}
            y={folderY}
            opacity={folderOpacity}
          />
        </div>
      )}

      {/* Mouse Cursor (always on top) */}
      <MouseCursor
        x={mouseX}
        y={mouseY}
        isClicking={isClicking}
        visible={mouseVisible}
      />
    </AbsoluteFill>
  );
};
