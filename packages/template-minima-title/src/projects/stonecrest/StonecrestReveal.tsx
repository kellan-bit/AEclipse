/**
 * Stonecrest v0.12 - Apple-Style Folder Reveal Animation
 *
 * A mouse hovers over a Mac folder labeled "Stonecrest (secret)".
 * The mouse hesitates, double-clicks, photos burst out, some disappear,
 * the remaining merge into a search bar typing "minimahomes.com",
 * which expands into a website with Stonecrest as the banner.
 *
 * This is ANIMATION - not clips with effects.
 * Every moment has narrative purpose.
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from 'remotion';

import { MacFolder } from './components/MacFolder';
import {
  MouseCursor,
  getMousePositionWithHesitation,
  interpolateMousePosition,
} from './components/MouseCursor';
import { PhotoGrid, getVisibleIndicesForDisappear } from './components/PhotoGrid';
import { SearchBar, getTypingProgress } from './components/SearchBar';
import { WebsiteUI } from './components/WebsiteUI';

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
// TIMELINE (frames at 30fps)
// ============================================

const TIMELINE = {
  // Act 1: The Folder
  MOUSE_ENTER: 0,
  MOUSE_ARRIVE: 30,
  HESITATION_START: 30,
  HESITATION_END: 55,
  FIRST_CLICK: 60,
  SECOND_CLICK: 68,

  // Act 2: The Reveal
  FOLDER_OPEN_START: 75,
  PHOTOS_PEEK: 90,
  PHOTOS_BURST: 110,
  PHOTOS_SETTLE: 160,
  PHOTOS_HOLD: 200,

  // Act 3: The Filter
  DISAPPEAR_START: 210,
  DISAPPEAR_END: 290,
  MIDDLE_ROW_HOLD: 320,

  // Act 4: The Transform
  MERGE_START: 330,
  MERGE_END: 380,
  TYPING_START: 390,
  TYPING_END: 440,

  // Act 5: The Website
  EXPAND_START: 450,
  EXPAND_END: 510,
  WEBSITE_REVEAL: 520,

  // End
  TOTAL: 600,
};

// ============================================
// MAIN COMPOSITION
// ============================================

export const StonecrestReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const centerX = width / 2;
  const centerY = height / 2;

  // ============================================
  // MOUSE ANIMATION
  // ============================================

  const mouseStartX = -50;
  const mouseStartY = height / 2 - 100;
  const folderX = centerX;
  const folderY = centerY;

  // Mouse position calculation
  let mouseX: number;
  let mouseY: number;
  let isClicking = false;

  if (frame < TIMELINE.MOUSE_ARRIVE) {
    // Moving toward folder
    const pos = interpolateMousePosition(
      frame,
      TIMELINE.MOUSE_ENTER,
      TIMELINE.MOUSE_ARRIVE,
      mouseStartX, mouseStartY,
      folderX, folderY - 20
    );
    mouseX = pos.x;
    mouseY = pos.y;
  } else if (frame < TIMELINE.HESITATION_END) {
    // Hesitating over folder
    const hesitationIntensity = interpolate(
      frame,
      [TIMELINE.HESITATION_START, TIMELINE.HESITATION_START + 10, TIMELINE.HESITATION_END - 5, TIMELINE.HESITATION_END],
      [0, 1, 1, 0]
    );
    const pos = getMousePositionWithHesitation(frame, folderX, folderY - 20, hesitationIntensity);
    mouseX = pos.x;
    mouseY = pos.y;
  } else if (frame < TIMELINE.PHOTOS_BURST) {
    // Clicking position (slight adjustment)
    mouseX = folderX + 5;
    mouseY = folderY - 15;

    // Click states
    isClicking = (
      (frame >= TIMELINE.FIRST_CLICK && frame < TIMELINE.FIRST_CLICK + 4) ||
      (frame >= TIMELINE.SECOND_CLICK && frame < TIMELINE.SECOND_CLICK + 4)
    );
  } else {
    // Mouse fades out / moves away
    mouseX = folderX + 200;
    mouseY = folderY - 100;
  }

  const mouseVisible = frame < TIMELINE.PHOTOS_BURST + 30;

  // ============================================
  // FOLDER ANIMATION
  // ============================================

  const folderVisible = frame < TIMELINE.PHOTOS_SETTLE;
  const isHovered = frame >= TIMELINE.MOUSE_ARRIVE && frame < TIMELINE.PHOTOS_BURST;

  const folderOpenProgress = interpolate(
    frame,
    [TIMELINE.FOLDER_OPEN_START, TIMELINE.PHOTOS_BURST],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Folder fades out after photos burst
  const folderOpacity = interpolate(
    frame,
    [TIMELINE.PHOTOS_BURST, TIMELINE.PHOTOS_SETTLE],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ============================================
  // PHOTO GRID ANIMATION
  // ============================================

  const photosVisible = frame >= TIMELINE.PHOTOS_PEEK && frame < TIMELINE.EXPAND_START;

  const burstProgress = interpolate(
    frame,
    [TIMELINE.PHOTOS_PEEK, TIMELINE.PHOTOS_BURST + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.34, 1.56, 0.64, 1) }
  );

  const settleProgress = interpolate(
    frame,
    [TIMELINE.PHOTOS_BURST + 30, TIMELINE.PHOTOS_SETTLE],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0, 0, 0.2, 1) }
  );

  const filterProgress = interpolate(
    frame,
    [TIMELINE.DISAPPEAR_START, TIMELINE.DISAPPEAR_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const mergeProgress = interpolate(
    frame,
    [TIMELINE.MERGE_START, TIMELINE.MERGE_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) }
  );

  // Get visible photo indices (sporadic disappear)
  const visibleIndices = frame < TIMELINE.DISAPPEAR_START
    ? [0, 1, 2, 3, 4, 5, 6, 7, 8]
    : getVisibleIndicesForDisappear(frame, TIMELINE.DISAPPEAR_START, TIMELINE.DISAPPEAR_END - TIMELINE.DISAPPEAR_START);

  // ============================================
  // SEARCH BAR ANIMATION
  // ============================================

  const searchBarVisible = frame >= TIMELINE.MERGE_END - 20 && frame < TIMELINE.WEBSITE_REVEAL + 30;

  const typingProgress = getTypingProgress(
    frame,
    TIMELINE.TYPING_START,
    'minimahomes.com',
    4
  );

  const expandProgress = interpolate(
    frame,
    [TIMELINE.EXPAND_START, TIMELINE.EXPAND_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) }
  );

  // ============================================
  // WEBSITE UI ANIMATION
  // ============================================

  const websiteVisible = frame >= TIMELINE.EXPAND_END;

  const websiteRevealProgress = interpolate(
    frame,
    [TIMELINE.WEBSITE_REVEAL, TIMELINE.WEBSITE_REVEAL + 40],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0, 0, 0.2, 1) }
  );

  // ============================================
  // BACKGROUND
  // ============================================

  // Background transitions from dark desktop to white website
  const bgColor = interpolate(
    frame,
    [TIMELINE.EXPAND_START, TIMELINE.EXPAND_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const backgroundColor = `rgb(${30 + bgColor * 225}, ${30 + bgColor * 225}, ${32 + bgColor * 223})`;

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: 'hidden' }}>
      {/* Desktop background gradient (fades out) */}
      {frame < TIMELINE.EXPAND_END && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(50,50,55,1) 0%, rgba(25,25,28,1) 100%)',
            opacity: 1 - expandProgress,
          }}
        />
      )}

      {/* Mac Folder */}
      {folderVisible && (
        <div style={{ opacity: folderOpacity }}>
          <MacFolder
            label="Stonecrest (secret)"
            isHovered={isHovered}
            openProgress={folderOpenProgress}
            x={folderX}
            y={folderY}
          />
        </div>
      )}

      {/* Photo Grid */}
      {photosVisible && (
        <PhotoGrid
          photos={PHOTOS}
          visibleIndices={visibleIndices}
          burstProgress={burstProgress}
          settleProgress={settleProgress}
          filterProgress={filterProgress}
          mergeProgress={mergeProgress}
          centerX={centerX}
          centerY={centerY}
        />
      )}

      {/* Search Bar */}
      <SearchBar
        text="minimahomes.com"
        typingProgress={typingProgress}
        expandProgress={expandProgress}
        visible={searchBarVisible}
        centerX={centerX}
        centerY={centerY}
      />

      {/* Website UI */}
      <WebsiteUI
        bannerImage={BANNER_IMAGE}
        revealProgress={websiteRevealProgress}
        visible={websiteVisible}
      />

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
