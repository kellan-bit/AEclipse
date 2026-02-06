# Stonecrest Animation Changelog

All notable changes to the Stonecrest property introduction animation.

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
