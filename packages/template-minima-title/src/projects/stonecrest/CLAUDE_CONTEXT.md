# Claude Session Context - Stonecrest Animation

**READ THIS FILE AT THE START OF EVERY SESSION.**

This file contains persistent instructions, preferences, and context that should inform all work on this project. Do not ask the user to repeat these instructions.

---

## Project Overview

Building an Apple-style property introduction animation for Stonecrest using Remotion.
- **Current version:** v0.15
- **Roadmap:** v0.16 → v0.20 (see plan file)
- **Philosophy:** Fluidity = seamlessness, not effects

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

### After Every Session
Update these files with any new learnings:
1. `LESSONS.md` - Reusable patterns
2. `CHANGELOG.md` - Version history
3. `CLAUDE_CONTEXT.md` (this file) - Persistent instructions
4. Plan file - Roadmap updates

### What to Document
- User preferences (so they don't repeat themselves)
- Technical decisions and why
- What approaches failed
- Asset sources used
- Brand/style requirements

---

## Current Roadmap (v0.16-v0.20)

### v0.16 - THE FOLDER
- Replace folder SVG with authentic macOS folder
- Dark label text (#141414)
- Click state highlight
- Source from icon archives

### v0.17 - THE PHYSICS
- Spring physics system (spring.ts)
- Object-specific spring profiles
- Velocity handoff between phases
- Replace ~15-20 interpolate() calls

### v0.18 - THE TRANSITIONS
- 20-30% overlap between all phases
- Anticipation before every action
- Follow-through after every landing
- Timing diagram as source of truth

### v0.19 - THE SPACE
- Z-layer depth system
- Parallax motion
- Shadow dynamics
- Environmental response

### v0.20 - THE RHYTHM
- Beat mapping (12 key moments)
- Micro-timing (1-2 frame adjustments)
- A/B testing vs Apple references
- Sound design integration points

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
| v0.16 | (Next) Authentic folder from icon archives |

---

**Last updated:** 2026-02-06
**Update this file whenever user provides new persistent instructions.**
