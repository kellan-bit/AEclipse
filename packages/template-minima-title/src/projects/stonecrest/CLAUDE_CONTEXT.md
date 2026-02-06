# Claude Session Context - Stonecrest Animation

**READ THIS FILE AT THE START OF EVERY SESSION.**

This file contains persistent instructions, preferences, and context that should inform all work on this project. Do not ask the user to repeat these instructions.

---

## Project Overview

Building an Apple-style property introduction animation for Stonecrest using Remotion.
- **Current version:** v0.31 (Seal the Merge Seam — Phase 3, Step 1)
- **Next:** Phase 3, Step 2 - The Morph Envelope — one DOM element from merge to website
- **Philosophy:** Fluidity = seamlessness, not effects
- **v0.20 Philosophy:** Invisible enhancement - feel depth, don't see technique
- **v0.26 Philosophy:** Declarative motion > imperative interpolation
- **v0.28 Philosophy:** Momentum is the default motion language
- **v0.29 Philosophy:** Morph, don't transition — transform geometry, not opacity

---

## Infrastructure Improvement (v0.26+)

**IMPORTANT:** This project is undergoing a multi-session infrastructure improvement.

### Current Status
- Phase 1: Unified Motion Primitives (v0.26) - **COMPLETE**
- Phase 1.5: Momentum System (v0.27) - **COMPLETE** (hooks defined)
- Phase 1.5b: Apply Momentum (v0.28) - **COMPLETE** (hooks applied to components)
- Phase 1.5c: The Morph (v0.29) - **COMPLETE** (geometry morphs replace opacity transitions)
- Phase 2: Timeline Architecture (v0.30) - **COMPLETE** (createTimeline + useTimeline)
- Phase 3: Animation State Machine - **NEXT**
- Phase 4: Motion Presets Library - PLANNED
- Phase 5: Component Refactor - PLANNED

### Key Files for Infrastructure
- `INFRASTRUCTURE_PLAN.md` - Full roadmap and specifications
- `motion/curves.ts` - Comprehensive easing library (40+ named curves)
- `motion/core.ts` - MotionValue class and transitions
- `motion/hooks.ts` - React hooks (useSpring, useTween, etc.)
- `motion/timeline.ts` - Timeline system (createTimeline, useTimeline)
- `motion/index.ts` - Unified exports
- `stonecrest-timeline.ts` - 18 named phases for Stonecrest animation

### Proof of Concept
- `components/SearchBarV2.tsx` - Refactored with new motion system
- Shows cleaner code with hooks vs manual interpolation

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

## Testing Workflow — Preview & Frame Grab

**EVERY TIME you make visual changes, give the user commands to preview and optionally grab frames.**

### Remotion Setup
- Composition ID: `StonecrestReveal`
- Entry point: `src/index.ts`
- Resolution: 1920×1080, 30fps
- Working dir: `packages/template-minima-title/`
- Dev server: `bun run dev` (launches Remotion Studio in browser)
- Frame capture: `bunx remotion still`

### IMPORTANT: Multi-line commands get garbled when copy-pasted from markdown.
Always use the **script file approach** below. NEVER give a multi-line `&&` chain.

### Step 1: Pull & Preview (user runs this FIRST)

This pulls the latest code from Claude's branch and launches Remotion Studio
in the browser so the user can preview the animation in real time.

```bash
cat > /tmp/pull-and-preview.sh << 'SCRIPT'
#!/bin/bash
cd ~/Documents/AEclipse
CLAUDE_BRANCH="claude/stonecrest-template-improvements-O5TmO"
git fetch origin "$CLAUDE_BRANCH"
git checkout "origin/$CLAUDE_BRANCH" -- packages/template-minima-title/src
echo "✓ Pulled latest src from $CLAUDE_BRANCH"
echo "Launching Remotion Studio..."
cd packages/template-minima-title
bun run dev
SCRIPT
chmod +x /tmp/pull-and-preview.sh
```

Then run:
```bash
bash /tmp/pull-and-preview.sh
```

**NOTE for Claude:** Update the `CLAUDE_BRANCH` variable in the script to match
whatever branch you are currently pushing to. Check with `git rev-parse --abbrev-ref HEAD`.

### Step 2: Frame Grab & Push (optional — for Claude to review)

Only needed when Claude needs to see rendered frames (user can't describe the issue).

**Command 1 — Create the script** (user copies this):
```bash
cat > /tmp/grab-frames.sh << 'SCRIPT'
#!/bin/bash
cd ~/Documents/AEclipse/packages/template-minima-title
mkdir -p out/frames
for f in 44 60 80 100 115 140 175 178 200 210 225 252 295 320 345 400; do
  bunx remotion still src/index.ts StonecrestReveal "out/frames/frame-$(printf '%03d' $f).png" --frame=$f 2>/dev/null
  if [ $? -eq 0 ]; then echo "frame $f done"; else echo "frame $f FAILED"; fi
done
echo "Done capturing!"
cd ~/Documents/AEclipse
BRANCH=$(git rev-parse --abbrev-ref HEAD)
git add packages/template-minima-title/out/frames/
git commit -m "debug: add frame captures for visual review"
git push origin "$BRANCH"
echo "Frames pushed on branch: $BRANCH"
SCRIPT
chmod +x /tmp/grab-frames.sh
```

**Command 2 — Run it** (user copies this):
```bash
bash /tmp/grab-frames.sh
```

### Customizing Frame Numbers
To capture different frames, modify the `for f in ...` line in the script.
Only change the numbers — the rest of the script stays the same.

### Key Frames Reference

| Frame | Phase | What's Happening |
|-------|-------|-----------------|
| 44 | Peek | Photos peek from folder |
| 60 | Burst | Burst starts |
| 80 | Burst | Burst mid-flight |
| 100 | Settle | Photos settled in grid |
| 115 | Filter | Slide-out begins |
| 140 | Filter | Slide-out mid-flight |
| 175 | Filter | Only middle row remains |
| 178 | Formation | Strip formation starts |
| 200 | Merge | Merge starts |
| 210 | Merge | Merge mid-progress |
| 225 | Merge | Merge complete → bar handoff |
| 252 | Search | Typing in search bar |
| 295 | Expand | Bar expansion starts |
| 320 | Expand | Bar expanding with website |
| 345 | Website | Website fully revealed |
| 400 | Hold | Final hold |

### How Claude Receives Frames

After the user pushes, fetch from whatever branch they report:
```bash
git fetch origin && git pull origin <branch-name>
```
Then use the Read tool to view PNGs in `packages/template-minima-title/out/frames/`.

### Lessons Learned (v0.30)
- Multi-line `&&` chains break when pasted from markdown (terminal sees `cmdand`)
- Always use a script file (`/tmp/grab-frames.sh`) instead
- Never hardcode the branch name — use `git rev-parse --abbrev-ref HEAD`
- User may be on a different branch than Claude — always fetch from Claude's branch explicitly
- `git checkout origin/<branch> -- <path>` pulls specific files without switching branches
- **NEVER `git stash pop` in pull scripts** — it reapplies local changes on top of checked-out files, creating merge conflict markers that crash the build. Just `git checkout` the files directly (overwrites local changes to those files only)

---

## Current Roadmap

### v0.28 - APPLY THE ACHOO ✅ COMPLETE
- **Momentum system applied to all components**
- PhotoGrid: burst ('sneeze'), formation ('flick'), merge ('whip')
- MacFolderLayers: lid ('throw'), click ('tap')
- SearchBarV2: solidification ('bounce'), swapped into StonecrestReveal
- All components import from `motion/index` barrel
- Lesson 20: Hooks vs Curves — use the right abstraction level

### v0.26/v0.27 - MOTION INFRASTRUCTURE ✅ COMPLETE
- v0.26: Unified Motion Primitives (curves, core, hooks)
- v0.27: Momentum System hooks (useMomentum, useChainedMomentum, etc.)
- SearchBarV2.tsx - Proof of concept using new system

### v0.29 - TIMELINE ARCHITECTURE (NEXT)
- **Declarative, composable timeline system**
- Named phases with automatic overlapping
- Event system instead of magic frame numbers
- Keyframe syntax for declarative animation

### v0.25 - PHASE A: THE INVISIBLE SEAM ✅ COMPLETE
- Photo→SearchBar metamorphosis perfected
- Gap elimination, opacity orchestration, dimensional precision

### v0.21 - LEAP 2: METAMORPHOSIS ✅ COMPLETE
- Formation phase: middle row slides into horizontal strip (frames 275-300)
- Blur-merge: photos blur (peak 3px) + desaturate → dissolve (frames 300-325)
- Search bar emergence: two-stage (solidify 200×60, grow to 500×50)
- Overlapping phases: photos dissolve AS bar solidifies

### v0.20 - DEPTH SYSTEM ✅ COMPLETE (APP MILESTONE)
- Reusable depth utilities in motion.ts
- ELEVATION: getElevationShadow() - shadows respond to height
- FOCUS: getFocusBlur() - selective blur guides attention (max 3px)
- PARALLAX: getParallaxFactor() - depth through motion (max 15%)

---

## Files to Read at Session Start

1. `CLAUDE_CONTEXT.md` (this file) - Instructions and preferences
2. `LESSONS.md` - Reusable patterns
3. `CHANGELOG.md` - Recent version history
4. Plan file at `/root/.claude/plans/smooth-popping-flurry.md` - Detailed roadmap

---

## Key Technical Files

- `StonecrestReveal.tsx` - Main composition, timeline (uses SearchBarV2)
- `MacFolderLayers.tsx` - Folder body + lid (momentum 'throw'/'tap')
- `PhotoGrid.tsx` - Photo burst/settle/merge (momentum 'sneeze'/'flick'/'whip')
- `SearchBarV2.tsx` - Search bar with momentum solidification (ACTIVE)
- `SearchBar.tsx` - Legacy search bar (kept for reference)
- `WebsiteUI.tsx` - Final website reveal
- `motion.ts` - Legacy easing/timing constants
- `motion/index.ts` - New barrel: curves + core + hooks (USE THIS)
- `MouseCursor.tsx` - Cursor component

---

## Communication Style

- Don't polish minor details (hover glows) when fundamentals need work
- Don't confuse "adding effects" with "improving animation"
- When user says "structural improvements" - focus on flow, not features
- Document learnings so user doesn't repeat instructions

---

## Global Learning Requirement

**When explaining improvements, always articulate the transferable knowledge.**

For EVERY change or improvement, explain:

1. **Local Impact** - What this fixes in the Stonecrest animation specifically
2. **Global Skill** - What generalizable principle, technique, or understanding this teaches that applies to ANY animation, software, or creative project

### Examples of Global Framing:

| Local Fix | Global Skill |
|-----------|--------------|
| "Move SEARCH_EMERGE 10 frames earlier" | **Perceptual Continuity**: When transitioning between visual elements, the replacement must be perceptible BEFORE the original begins dissolving. The brain needs to register "something is here" before it can accept transformation. Applies to: UI transitions, video editing, presentation slides, magic tricks. |
| "Opacity should sum to ~100% during crossfade" | **Optical Mixing**: When two elements overlap during transition, their combined visual weight must remain constant. >100% = visual noise/competition. <100% = intentional "dissolve" breathing room. Applies to: CSS transitions, video dissolves, audio crossfades, lighting design. |
| "Bar dimensions must match photo cluster at emergence" | **Dimensional Inheritance**: A transformed element must inherit the spatial footprint of its predecessor at the moment of handoff. Mismatches break the illusion of metamorphosis. Applies to: morphing animations, responsive design breakpoints, state machine transitions. |
| "Border-radius must animate, not jump" | **Property Continuity**: Every animatable property that changes between states must have an interpolation path. Instant jumps are perceptible as "cuts" even in peripheral vision. Applies to: CSS transitions, keyframe animation, procedural generation. |

### Why This Matters:

This project is a TRAINING GROUND for animation principles. Each fix should build the user's mental model of:
- Motion design psychology (what the eye/brain expects)
- Technical animation craft (how to achieve smoothness)
- Systematic debugging (how to identify and categorize visual problems)
- Transferable vocabulary (terms that apply across tools and domains)

**Document these global insights in LESSONS.md as reusable patterns.**

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
| v0.21 | **LEAP 2** - Photo-to-SearchBar Metamorphosis (formation, blur-merge, emergence) |
| v0.22-v0.25 | **Phase A** - The Invisible Seam (gap elimination, opacity, dimensions) |
| v0.26 | **INFRASTRUCTURE** - Unified Motion Primitives (curves, core, hooks) |
| v0.27 | Momentum System - "Achoo" hooks defined |
| v0.28 | **APPLY THE ACHOO** - Momentum applied to all components |

---

**Last updated:** 2026-02-06 (v0.30)
**Update this file INCREMENTALLY - don't wait until end of session.**
