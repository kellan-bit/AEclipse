# Stonecrest Animation Changelog

All notable changes to the Stonecrest property introduction animation.

---

## [v0.29.1] - 2026-02-06

### Fixed - "Right Curve for Right Motion" + Blank Frame Bug
Momentum curves (anticipation + overshoot) were being used for exit and merge motions where they're semantically wrong. Also fixed a critical blank screen at the end of the animation.

- **PhotoGrid.tsx**: v0.29 → v0.29.1
  - FILTER exit: `sneeze` → `materialAccelerate` (no pullback, smooth acceleration out)
  - MERGE: `whip` → `materialStandard` (no bounce, smooth compression)
  - Exit distance 800→600px, scale 0.15→0.05, rotation 8→3 degrees
  - Lesson: Momentum curves are for reveals/emphasis, not exits/merges

- **StonecrestReveal.tsx**: Fixed blank screen at frame 375+
  - `searchBarVisible` had `frame < WEBSITE_REVEAL + 30` cutoff (legacy from pre-v0.29)
  - Since v0.29 the bar IS the website container — it must stay visible forever
  - Removed upper bound: now `frame >= SEARCH_SOLIDIFIED` (no end condition)

- **Root.tsx**: Fixed durationInFrames 600 → 420 to match TIMELINE.TOTAL

- **CLAUDE_CONTEXT.md**: Added "Testing Workflow — Frame Grab & Push" section
  - Standard `bunx remotion still` command for capturing key frames
  - Git push workflow for visual review

---

## [v0.29] - 2026-02-06

### Changed - "The Morph (No Transitions)"
Philosophy shift: transform geometry instead of swapping elements with opacity.
The brain tracks objects through space — physical movement > opacity changes.

- **PhotoGrid.tsx**: v0.28 → v0.29
  - FILTER: Non-middle photos now SLIDE OUT of frame (top row up, bottom row down)
    - Uses sneeze momentum for explosive exit with anticipation
    - No opacity change until 80% off-screen (cleanup only)
    - Replaces fade-based filter (opacity 1→0, scale 1→0.9, blur)
  - MERGE: White overlay "frost on glass" grows over photos during merge
    - Photos physically become the search bar rectangle
    - borderRadius morphs from 8 → 25 to match search bar
    - No opacity crossover — same pixels change what they are
  - Added `whiteOverlay` and `morphedRadius` to PhotoState interface

- **SearchBarV2.tsx**: v0.26 → v0.29
  - Removed ghost/solidification opacity ramp entirely
  - Bar starts at merged-photo geometry (280×54), fully opaque at frame 225
  - Springs to search bar size (500×50) — same container, different dimensions
  - Added `renderExpandedContent` render prop
  - Website renders INSIDE the expanding bar (clipped by overflow:hidden)
  - Removed separate WebsiteUI layer from composition

- **WebsiteUI.tsx**: v0.17 → v0.29
  - Extracted `WebsiteContent` as standalone component (no animation wrapper)
  - `WebsiteContent` passed to SearchBarV2 via renderExpandedContent prop
  - Legacy `WebsiteUI` wrapper kept for backward compat

- **StonecrestReveal.tsx**: v0.25 → v0.29
  - Folder: shrinks (scale 1→0.3) behind photos instead of 5-frame fade
  - Photos: visible until SEARCH_SOLIDIFIED (was EXPAND_START)
  - SearchBar: starts at SEARCH_SOLIDIFIED (was SEARCH_EMERGE)
  - Removed separate WebsiteUI component from render tree
  - Passes renderExpandedContent to SearchBar

---

## [v0.28] - 2026-02-06

### Changed - "Apply the Achoo"
Momentum system (v0.27 hooks) applied to all major animation components.
The "achoo" pattern (anticipation → action → settle) now drives motion throughout.

- **PhotoGrid.tsx**: v0.25 → v0.28
  - BURST: Replaced `createStaggeredSpring('bouncy')` with `getMomentumCurve('sneeze')`
    - Photos dip slightly INTO folder (anticipation), explode outward, overshoot, settle
    - Stagger preserved: center photo first, corners last (3 frames per distance)
  - FORMATION: Replaced `createSpring('responsive')` with momentum `'flick'`
    - Snappier strip formation with slight anticipation
  - MERGE: Replaced `createSpring('gentle')` with momentum `'whip'`
    - Photos snap together with quick anticipation before dissolving
  - Removed dependency on legacy `createSpring`/`springTo` — fully on momentum system

- **MacFolderLayers.tsx**: v0.19.1 → v0.28
  - LID OPENING: Replaced `createSpring('folder')` with `getMomentumCurve('throw')`
    - Single momentum curve handles anticipation + action + settle
    - Lid dips slightly before swinging open, overshoots past -55deg, settles
  - ANTICIPATION: Removed manual v0.19.1 interpolate-based pulse
    - Momentum 'tap' curve now handles this naturally (built-in anticipation)
  - Removed dependency on `createSpring`/`springTo`

- **SearchBarV2.tsx**: Swapped into StonecrestReveal as active SearchBar
  - SOLIDIFICATION: Changed easing from `'easeOut'` to `getMomentumCurve('bounce')`
    - Bar "catches" energy from dissolving photos — slight overshoot in opacity
    - Creates connected feeling: photos' energy → bar's materialization

- **StonecrestReveal.tsx**: Import changed from SearchBar → SearchBarV2

- **Import paths**: All components now import from `../motion/index` (barrel)
  instead of `../motion` (legacy file) to access new momentum system

### Why
Infrastructure Phase 1 (v0.26) and Momentum System (v0.27) built the tools
but never applied them to components. This version bridges that gap:
infrastructure → implementation. The "achoo" pattern is now the default motion
language across the animation.

### Lessons Applied
- Lesson 19: Momentum — The "Achoo" Pattern
- Lesson 15: Declarative Motion Over Imperative Interpolation
- Lesson 16: Named Curves Over Magic Numbers

---

## [v0.16] - 2026-02-06

### Changed
- **MacFolder.tsx**: Authentic macOS folder (THE FOLDER milestone)
  - Updated gradient colors to Apple Blue palette (#8BD0F5 → #4AADE0 → #2C6BA8)
  - Dark label text (#141414) for white background readability
  - Added `isSelected` prop for macOS Finder-style label highlight
  - Blue highlight (#0A84FF) on label after double-click
  - Documented color sources: Apple Blue Logo palette, GitHub references

- **StonecrestReveal.tsx**: Added selection state
  - New `isSelected` state triggers after SECOND_CLICK
  - Passed to MacFolder for label highlight

### Why
User decisions from v0.16 audit:
- Source icons from icon archives (macosicons.com, jim-nielsen)
- Label: Dark text (#141414) from minima brand palette
- Click state: Label highlighted like real macOS Finder
- Open animation: Custom peek (files peer out)

Reference: CLAUDE_CONTEXT.md for persistent user preferences.

---

## [v0.15] - 2026-02-06

### Changed
- **StonecrestReveal.tsx**: White background and improved tail transition
  - Removed dark desktop gradient
  - Clean white (#FFFFFF) background throughout
  - Search content visible until 70% (was 30%)
  - Website reveal overlaps search bar expand

### Why
User feedback: "Prefer branded white background instead of black.
The tail end transition still looks bad."

Structural fix: Better overlap between search bar and website reveal phases.

---

## [v0.14] - 2026-02-06

### Added
- **motion.ts**: New unified motion system
  - Single source of truth for all animation timing
  - EASE constants: default (Apple standard), enter, exit, emphasis
  - DURATION, SPRING, OPACITY, SCALE constants
  - All components now import from this file

### Changed
- **MouseCursor.tsx**: Simplified hesitation
  - Reduced from 8-15px layered movements to 1-2px subtle drift
  - Removed chaotic sine/cosine layering
  - Now feels natural, not theatrical

- **PhotoGrid.tsx**: Fixed timeline and improved coordination
  - Added peek phase (frames 90-110) - photos appear small at folder
  - Fixed burst phase to start at frame 110, not 90
  - Changed from sporadic disappear to wave-based (top row → bottom row)
  - Added coordinated stagger: center photo moves first, corners last
  - Using unified EASE constants

- **MacFolder.tsx**: Improved feedback
  - Increased hover glow opacity from 0.25 to 0.45
  - Added subtle pulsing glow animation on hover
  - Added click feedback (scale 0.98 + brightness flash)
  - Fast 50ms response for clicks

- **StonecrestReveal.tsx**: Added peek progress
  - New peekProgress prop for frames 90-110
  - Using EASE constants throughout
  - Pass isClicking to MacFolder

### Why
User feedback: "mouse actions too over-the-top, scatter disappear not smooth,
transitions don't feel good. Professional UI animation flows."

Key insight: We were ADDING animation instead of DESIGNING motion.
Professional animation requires consistency over effects.

---

## [v0.13] - 2026-02-06

### Changed
- **MacFolder.tsx**: Complete visual rebuild
  - Changed from CSS rectangles to proper SVG folder shape
  - Increased size from 80px to 200px for better visual presence
  - Added proper gradients (not flat colors)
  - Added inner shadows and depth
  - Improved tab shape to match actual macOS folders
  - Added fold line detail and edge highlights
  - Added easing to open animation

### Why
Visual review of v0.12 revealed the folder looked like a "blue rectangle" not a Mac folder.
This violated Lesson 2: "Apple-Style requires actual Apple details."

---

## [v0.12] - 2026-02-05

### Added
- New narrative-driven animation concept (Apple-style folder reveal)
- 5-act structure: Folder → Reveal → Filter → Transform → Website
- Components: MacFolder, MouseCursor, PhotoGrid, SearchBar, WebsiteUI
- Mouse hesitation micro-movements
- Sporadic photo disappear pattern
- 20-second duration (600 frames at 30fps)

### Issues Identified (for v0.13)
- Folder visual fidelity (blue rectangle, not Mac folder)
- No spring physics anywhere
- ~60% of animations lack easing curves
- Search bar 18x height expansion is jarring
- No anticipation before photo burst

---

## [v0.11] - 2026-02-05

### Changed
- Implemented motion hierarchy (primary/secondary/tertiary)
- Fixed stagger timing from 133ms to 33ms
- Applied correct easing per element type
- Removed competing animations (light leaks, breathing vignette)
- Reduced grain to 0.015

### Why
User feedback: Animations were "haphazard" with effects added randomly.
Researched UI animation theory: Disney's 12 Principles, Carbon Design System.

---

## [v0.1-v0.2] - 2026-02-04 (Archived)

### Approach
- "Clips with effects" approach
- Applied same effects to every clip
- Transitions between clips

### Why Abandoned
User feedback: "You're looking at this from the perspective of every clip needs
the same 5 effects and they just transition from clip to clip - that is not animation."

Animation is choreography - designing how the viewer experiences time, not templates.

---

## Version Naming Convention

- **Major versions** (v1.0, v2.0): Complete concept changes
- **Minor versions** (v0.1, v0.2): Iterative improvements within a concept
- **Patch versions** (v0.12.1): Bug fixes only
