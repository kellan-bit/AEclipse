# Claude Session Context - Stonecrest Animation

**READ THIS FILE AT THE START OF EVERY SESSION.**

This file contains persistent instructions, preferences, and context that should inform all work on this project. Do not ask the user to repeat these instructions.

---

## Project Overview

Building an Apple-style property introduction animation for Stonecrest using Remotion.
- **Current version:** v0.20 (DEPTH SYSTEM - complete)
- **Next:** LEAP 2 - Photo-to-SearchBar Metamorphosis
- **Philosophy:** Fluidity = seamlessness, not effects
- **v0.20 Philosophy:** Invisible enhancement - feel depth, don't see technique

---

## User Preferences (Do Not Ask Again)

### Asset Sources
- **Mac/iOS icons:** Use icon archives (macosicons.com, jim-nielsen's gallery)
- **Never** hand-draw approximations of system UI
- Extract from system files if needed: `/System/Library/CoreServices/CoreTypes.bundle/`

### Brand Colors (Minima)
Always use these exact values, never arbitrary hex:
```
Brand black (text): #141414
Brand white: #FFFFFF
Cream (light bg): #F4F2F0
Light gray: #E3DEDA
Dark gray: #4C4C4C
Taupe (accent): #C7BEB4
```

Import from: `@minima-brand/colors` and `@minima-brand/themes`

### Animation Philosophy
- **Fluidity = seamlessness**, not more effects
- Don't add hover glows, click feedback as "improvements"
- Focus on: flow between phases, natural motion, no hard cuts
- Test at 0.25x speed - if you see "cuts," it's not fluid

### Background
- Use white/cream background (not dark desktop)
- Current: `#FFFFFF`

### Folder Specifics
- Size: 200px (confirmed)
- Label: Dark text (#141414) on white background
- Click state: Label highlighted with blue bg (like macOS Finder)
- Open animation: Custom - files peer out (creative liberty, not realistic)

---

## Documentation Requirements

### ⚠️ CRITICAL: Update Documentation INCREMENTALLY

**DO NOT wait until end of session to update docs.** Sessions can run out of context.

**Update docs IMMEDIATELY when you:**
- Complete a feature or version milestone
- Learn a new lesson or pattern
- Receive user feedback or preferences
- Make a decision that future sessions should know

**Update in this order (after each milestone):**
1. `LESSONS.md` - Add new patterns/learnings FIRST
2. `CLAUDE_CONTEXT.md` (this file) - Update version, add preferences
3. Plan file - Mark completed, update next steps
4. Commit the docs along with code changes

### What to Document
- User preferences (so they don't repeat themselves)
- Technical decisions and why
- What approaches failed
- Asset sources used
- Brand/style requirements
- New reusable utilities (like v0.20 depth system)

---

## Current Roadmap

### v0.20 - DEPTH SYSTEM ✅ COMPLETE (APP MILESTONE)
- Reusable depth utilities in motion.ts
- ELEVATION: getElevationShadow() - shadows respond to height
- FOCUS: getFocusBlur() - selective blur guides attention (max 3px)
- PARALLAX: getParallaxFactor() - depth through motion (max 15%)
- Philosophy: "Invisible enhancement" - feel depth, don't see technique

### v0.19 - POLISH & FLOW ✅ COMPLETE
- Folder anticipation pulse (scale 1.025 before opening)
- Photo breathing during settle (micro-oscillation)
- Disappearing photos tilt outward

### v0.18 - PHOTO EMERGENCE ✅ COMPLETE
- Split folder into MacFolderBack + MacFolderLid layers
- Photos genuinely emerge FROM folder (proper z-ordering)
- Overlapping phases for seamless flow

### v0.17 - SPRING PHYSICS ✅ COMPLETE
- Spring physics system in motion.ts
- SPRING profiles: gentle, responsive, bouncy, folder
- createSpring(), createStaggeredSpring(), springTo() helpers

### NEXT: LEAP 2 - Photo-to-SearchBar Metamorphosis
- Formation phase: middle row slides into strip
- Blur-merge transition: photos blur as they become search bar
- Search bar emergence: grows FROM photo strip dimensions

---

## Files to Read at Session Start

1. `CLAUDE_CONTEXT.md` (this file) - Instructions and preferences
2. `LESSONS.md` - Reusable patterns
3. `CHANGELOG.md` - Recent version history
4. Plan file at `/root/.claude/plans/smooth-popping-flurry.md` - Detailed roadmap

---

## Key Technical Files

- `StonecrestReveal.tsx` - Main composition, timeline
- `MacFolder.tsx` - Folder component (needs v0.16 rebuild)
- `PhotoGrid.tsx` - Photo burst/settle
- `SearchBar.tsx` - Search bar expansion
- `WebsiteUI.tsx` - Final website reveal
- `motion.ts` - Unified easing/timing constants
- `MouseCursor.tsx` - Cursor component

---

## Communication Style

- Don't polish minor details (hover glows) when fundamentals need work
- Don't confuse "adding effects" with "improving animation"
- When user says "structural improvements" - focus on flow, not features
- Document learnings so user doesn't repeat instructions

---

## Version History Summary

| Version | Focus |
|---------|-------|
| v0.12 | Initial 5-act structure |
| v0.13 | Folder visual rebuild (was blue rectangle) |
| v0.14 | Unified motion system, simplified mouse |
| v0.15 | White background, tail transition fix |
| v0.16 | Authentic folder: Apple gradients, dark label, click highlight |
| v0.17 | Spring physics system (createSpring, springTo) |
| v0.18 | Photo emergence (split folder layers, overlapping phases) |
| v0.19 | Polish & flow (anticipation, breathing, tilt) |
| v0.20 | **APP MILESTONE** - Cinematic depth system (elevation, focus, parallax) |

---

**Last updated:** 2026-02-06
**Update this file INCREMENTALLY - don't wait until end of session.**
