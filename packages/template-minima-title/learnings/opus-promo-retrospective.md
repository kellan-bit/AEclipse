# Opus Promo Experiment - Retrospective

**Date**: 2026-02-05
**Goal**: Reverse engineer a 40-second promotional video into a Remotion template

---

## What Worked Well

### Animation Primitives
- `interpolate()` + `Easing` functions are powerful for any animation
- `useCurrentFrame()` gives precise frame-level control
- Component composition (TypewriterText, RectangularReveal) is highly reusable

### Analysis Pipeline
- Frame-by-frame extraction revealed exact structure and timing
- Comprehensive manifest format is useful for cataloging video segments
- Identifying transition types (hard cut, fade, rectangular reveal) was valuable

### Reusable Components Created
```
TypewriterText      - Word-by-word text reveal
RectangularReveal   - Center-expanding rectangle transition
AnimatedTweetCard   - Card fade + text typing
PhotoMosaicTransition - Scattered images animation
CapabilityShowcase  - Screenshots with prompt bubbles
AnimatedRectangleOverlay - Geometric line overlays
```

### Technical Insights
- Instant cuts between quotes (no fade) looked more professional
- Ken Burns zoom (3-5%) adds subtle life to static images
- 3 frames for card fade-in feels snappy
- Word-by-word typing at 3 frames/word is readable but dynamic

---

## What Failed

### Backwards Workflow
- **Video → Template is wrong direction**
- Without actual assets, templates are just empty shells
- Spent massive effort on components that couldn't render without images

### Asset Problem
- Templates crash without uploaded assets
- Placeholder fallbacks look nothing like real content
- No way to test quality without real assets

### Reverse Engineering Limitations
- AI vision can identify elements but not extract them
- Precise measurements (exact pixels, exact easing curves) are guesswork
- Match-cut text integration requires the original composed images

### Over-Abstraction
- Built complex component library before having content
- Asset manifest tracked things that didn't exist
- Multiple template versions (V1, V2, V3) without real improvement

---

## Key Learnings

1. **Start with assets, not templates**
   - Real workflow: Assets → Project → Refine → Template
   - Not: Video → Analysis → Template → Assets

2. **Animation code is the easy part**
   - Remotion primitives handle animations well
   - The hard part is having the right content

3. **AI strengths vs weaknesses**
   - Strong: Generating animation code, understanding timing
   - Weak: Extracting assets from video, precise pixel measurements

4. **Iteration requires content**
   - Can't iterate on "looks wrong" without seeing it
   - Placeholders don't give useful feedback

---

## Recommended Next Approach

### Asset-First Workflow
1. Point system at local asset folder
2. Catalog available assets (images, videos, fonts)
3. Build compositions using REAL assets
4. Iterate based on actual renders
5. Extract templates from successful projects

### What to Keep
- Animation utility functions (interpolate patterns)
- Component architecture (composable scenes)
- Series/Sequence structure for timeline

### What to Abandon
- Reverse engineering from video
- Asset manifests for non-existent assets
- Building templates before content exists

---

## Files to Preserve

The following patterns are worth keeping for future projects:

```typescript
// Word-by-word text reveal
const wordsToShow = Math.min(
  Math.floor(relativeFrame / framesPerWord) + 1,
  words.length
);

// Rectangular reveal from center
const clipPath = `inset(${(100 - progress * 100) / 2}% ${(100 - progress * 100) / 2}%)`;

// Ken Burns zoom
const scale = interpolate(frame, [0, duration], [1, 1 + zoomAmount]);

// Instant cuts (no transition)
const currentIndex = Math.floor(frame / framesPerItem);
```

---

## Summary

**The experiment validated that Remotion + AI can create sophisticated animations.**

**The experiment failed because we worked backwards from video instead of forwards from assets.**

**Next step: Build system that works with real local assets first.**
