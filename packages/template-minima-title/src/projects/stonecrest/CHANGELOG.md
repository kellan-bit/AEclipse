# Stonecrest Animation Changelog

All notable changes to the Stonecrest property introduction animation.

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
