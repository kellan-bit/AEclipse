# Animation Lessons Learned

Reusable patterns and lessons from building the Stonecrest animation.
Apply these to all future animation projects.

**IMPORTANT:** Also read `CLAUDE_CONTEXT.md` for persistent instructions and user preferences.

---

## Lesson 1: Visual Fidelity Before Motion

**Problem:** Built animation logic before ensuring visual elements looked correct.

**What Happened:** The MacFolder component was animated beautifully, but it was
just a blue rectangle - not a Mac folder. All that motion work was wasted on
an incorrect visual.

**Rule:** Screenshot each key element in isolation before animating.

**Checklist:**
- [ ] Does this element look correct when static?
- [ ] Would someone recognize what this is supposed to be?
- [ ] Compare to reference images before proceeding

---

## Lesson 2: "Apple-Style" Requires Apple Details

**Problem:** Said "Mac folder" but implemented a colored box.

**What Apple Design Actually Has:**
- Distinctive shapes (not just rounded rectangles)
- Gradient fills (not flat colors)
- Inner shadows and depth
- Subtle highlights on edges
- Specific proportions and spacing

**Rule:** When referencing a brand style, study actual examples.

**Process:**
1. Find 3-5 reference images of the actual element
2. Note specific details: colors, shapes, shadows, proportions
3. Implement those specific details
4. Compare side-by-side with reference

---

## Lesson 3: Spring Physics is Non-Negotiable

**Problem:** Used linear interpolation everywhere, resulting in mechanical motion.

**Why Linear Looks Wrong:**
- Real objects have mass and momentum
- They overshoot their target and settle back
- They accelerate and decelerate naturally

**Rule:** Every position/scale/rotation change needs easing or spring physics.

**Remotion Spring Example:**
```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: {
    damping: 12,
    stiffness: 200,
    mass: 0.5,
  },
});
```

**When to Use What:**
- **Spring:** Objects that should feel physical (photos landing, buttons pressing)
- **Ease-out:** Objects entering the screen
- **Ease-in:** Objects leaving the screen
- **Ease-in-out:** Objects moving from one position to another
- **Linear:** Only for constant motion (scrolling, progress bars)

---

## Lesson 4: Spatial Relationships Matter

**Problem:** Photos appeared disconnected from folder (scale mismatch, no emergence).

**The Issue:**
- Folder was 80px wide
- Photos in grid were 200px+ wide
- No visual connection showing photos coming FROM the folder

**Rule:** If B comes from A, show the connection visually.

**How to Show Connection:**
1. Scale: A should be large enough to plausibly contain B
2. Position: B should start at/near A's position
3. Timing: Show B emerging, not just appearing
4. Overlap: Brief moment where B is partially inside A

---

## Lesson 5: Test Visually Early and Often

**Problem:** Discovered major visual issues only after full implementation.

**The Cost:**
- Hours of animation work on incorrect visuals
- Debugging motion when the real issue was appearance
- Delayed feedback loop

**Rule:** Check frames at 0%, 25%, 50%, 75%, 100% after each component change.

**Quick Visual Check Process:**
1. Make change
2. Scrub to key frames in timeline
3. Pause and examine
4. Ask: "Does this look right?"
5. Fix visual issues before moving to next component

---

## Lesson 6: Document Decisions

**Problem:** No record of why things were built certain ways.

**Why Documentation Matters:**
- Future you won't remember why you made choices
- Team members need context
- Similar problems will come up again
- Avoids repeating mistakes

**What to Document:**
- What changed and why
- What approaches were tried and rejected
- Lessons learned from failures
- Reference materials used

**Where to Document:**
- `CHANGELOG.md` - Version history
- `LESSONS.md` - Reusable patterns (this file)
- Component comments - Inline explanations
- Plan files - Design decisions

---

## Lesson 7: Animation is Storytelling, Not Effects

**Problem (v0.1-v0.2):** Treated animation as "clips with effects."

**The Wrong Approach:**
- Every clip gets the same 5 effects
- Effects are applied uniformly
- Transitions connect clips
- No narrative purpose

**The Right Approach:**
- Animation serves a story
- Each moment has a purpose
- Viewer's attention is guided
- Motion creates meaning

**Questions to Ask:**
- What should the viewer focus on now?
- What emotion should this moment create?
- How does this motion serve the narrative?
- What would be lost if this animation was removed?

---

## Quick Reference: Easing Curves

```tsx
import { Easing } from 'remotion';

// For elements appearing (entering)
Easing.out(Easing.cubic)    // Starts fast, slows down

// For elements disappearing (exiting)
Easing.in(Easing.cubic)     // Starts slow, speeds up

// For elements moving between positions
Easing.inOut(Easing.cubic)  // Slow-fast-slow

// Apple's default animation curve
Easing.bezier(0.25, 0.1, 0.25, 1)

// Overshoot (bounce past target)
Easing.bezier(0.34, 1.56, 0.64, 1)
```

---

## Quick Reference: Shadow Depths

```tsx
// Resting state
boxShadow: '0 2px 8px rgba(0,0,0,0.15)'

// Hover state
boxShadow: '0 4px 16px rgba(0,0,0,0.2)'

// Lifted/active state
boxShadow: '0 8px 32px rgba(0,0,0,0.25)'

// Pressed state
boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
```

---

## Quick Reference: Timing Guidelines

Based on Carbon Design System and Apple HIG:

| Animation Type | Duration | Notes |
|---------------|----------|-------|
| Micro-interaction | 100-200ms | Button press, toggle |
| Small movement | 200-300ms | Menu open, tooltip |
| Medium movement | 300-400ms | Modal, panel |
| Large movement | 400-500ms | Page transition |
| Complex sequence | 500ms+ | Multi-step animation |

**Stagger Timing:** 30-50ms between items (not 100ms+)

---

## Lesson 8: Preferred Asset Sources

**Problem:** Hand-drawing approximations of system icons wastes time and looks wrong.

**Preferred Sources for Mac/iOS Icons:**
- **macosicons.com** - Community collection of macOS app icons
- **jim-nielsen's macOS icon gallery** - High-quality references
- **System files:** `/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/`
- **Extract tools:** `iconutil` to convert .icns to PNG/SVG

**Rule:** Don't approximate system UI - source the actual assets.

**Process:**
1. Search icon archives first
2. Download highest resolution available
3. Trace to SVG if needed (Figma/Illustrator)
4. Match exact gradients and proportions
5. Compare side-by-side with original

---

## Lesson 9: Use Brand Colors Consistently

**Minima Brand Palette:**
```tsx
// Primary
black: '#141414'    // Primary text on light
white: '#FFFFFF'    // Clean backgrounds

// Neutral
darkGray: '#4C4C4C' // Secondary text
lightGray: '#E3DEDA'// Subtle backgrounds
cream: '#F4F2F0'    // Light backgrounds

// Accent
taupe: '#C7BEB4'    // Warm accent
```

**Import from:**
```tsx
import { colors } from '@minima-brand/colors';
import { lightTheme, darkTheme } from '@minima-brand/themes';
```

**Rule:** Always use brand colors, never arbitrary hex values.

---

## Lesson 10: Fluidity Over Effects

**Problem (v0.12-v0.15):** Confused "complexity" with "more effects."

**Wrong Thinking:**
- Add hover glow → more complex
- Add click feedback → more complex
- Add spring physics → more complex

**Right Thinking:**
- Fluidity = seamlessness
- Everything should flow naturally into everything else
- No hard starts/stops - everything breathes
- Overlapping transitions - one thing starts before previous ends
- Connected motion - related elements move as a system

**The Test:** Watch at 0.25x speed. If you see "cuts" between phases, it's not fluid.

**Rule:** Complexity means seamless flow, not more effects.

---

## Lesson 11: Depth Through Invisible Enhancement (v0.20)

**Problem:** Animation felt "flat" - everything on same plane, no sense of weight.

**Wrong Approach (Rejected):**
- Over-the-top 3D rotations
- Flash effects on burst
- Camera shake
- These call attention to technique, breaking minimalist aesthetic

**Right Approach: INVISIBLE ENHANCEMENT**
- Viewers should FEEL depth without noticing technique
- If someone points to a specific effect, it's TOO MUCH
- Like HDR vs SDR - same image, more presence

**Three Systems for Cinematic Depth:**

### 1. Elevation Shadows
Shadows respond to element "height" off surface:
```tsx
import { ELEVATION, getElevationShadow } from '../motion';

// As elements "lift", shadows become longer, softer, more diffused
const elevation = isBursting ? ELEVATION.lifted : ELEVATION.resting;
boxShadow: getElevationShadow(elevation)
```
- Y-offset increases (shadow moves down)
- Blur radius increases (shadow softens)
- Opacity DECREASES (counterintuitive but correct - shadow diffuses)

### 2. Selective Focus Blur
Blur non-focal elements to guide attention:
```tsx
import { getFocusBlur, FOCUS, DEPTH_LAYER } from '../motion';

// Max blur = 3px (anything over 4px looks artificial)
const blur = getFocusBlur(elementDepth, focalDepth, FOCUS.normal);
filter: blur > 0 ? `blur(${blur}px)` : 'none'
```
- ✅ During reveals, hero moments, transitions
- ❌ When everything is equally important
- ❌ On text or UI chrome (always sharp)

### 3. Micro-Parallax
Elements at different depths move at different rates:
```tsx
import { getParallaxFactor, PARALLAX } from '../motion';

// Foreground moves 7.5% more, background moves 7.5% less
const factor = getParallaxFactor(depth, PARALLAX.subtle);
const adjustedDelta = baseDelta * factor;
```

**Thresholds (NEVER EXCEED):**
| Effect | Max Value | Rationale |
|--------|-----------|-----------|
| Shadow Y-offset | 12px | Beyond = artificial |
| Focus blur | 3px | Beyond = distracting |
| Parallax difference | 15% | Beyond = looks like bug |

**Verification Tests:**
1. **"Did Something Change?" Test** - Ask unfamiliar viewer if it feels like depth. "Yes" without knowing why = SUCCESS
2. **"Turn It Off" Test** - Disable depth, animation should feel "flatter"
3. **0.25x Speed Test** - Shadows smooth, blur transitions smooth, parallax barely visible

**Rule:** Depth should be felt, not seen. If it's noticeable, it's too much.

---

## Lesson 12: Document Incrementally, Not At End

**Problem:** Waiting until end of session to update documentation risks losing learnings if session runs out of context.

**What Happened:** Session context can be exhausted mid-task. If documentation updates are queued for "later," they may never happen.

**Rule:** Update documentation IMMEDIATELY after each milestone, not at end.

**When to Update Docs:**
- ✅ After completing a feature or version
- ✅ After learning a new pattern
- ✅ After receiving user feedback/preferences
- ✅ After making a decision future sessions should know

**Update Order (after each milestone):**
1. `LESSONS.md` - Add new patterns/learnings FIRST
2. `CLAUDE_CONTEXT.md` - Update version, add preferences
3. Plan file - Mark completed, update next steps
4. Commit docs WITH code changes (same commit)

**Why This Matters:**
- Session context is finite
- Documentation is the knowledge transfer mechanism
- Future sessions start by reading these files
- Lost documentation = lost learnings = repeated mistakes

**The Pattern:**
```
Complete feature → Update LESSONS.md → Update CLAUDE_CONTEXT.md → Commit all together
```

**Rule:** Treat documentation as part of the deliverable, not a post-task cleanup.

---

## Lesson 13: Metamorphosis Over Teleportation (v0.21)

**Problem:** Elements appearing and disappearing feels disconnected. "Photos disappear, then search bar appears" lacks narrative.

**Wrong Approach:**
- Element A fades out completely
- Gap of time
- Element B fades in from nothing
- Viewer perceives two separate things

**Right Approach: METAMORPHOSIS**
- Element A transforms INTO Element B
- Overlapping phases: A dissolves AS B materializes
- Dimensional continuity: B starts at A's final size/position
- Visual connection: blur/desaturation bridges the transformation

**Three-Phase Transformation Pattern:**
```tsx
// Phase 1: FORMATION (prepare for transformation)
// Element A moves toward target shape (e.g., strip formation)

// Phase 2: BLUR-MERGE (dissolve with attention guidance)
// A blurs (peak mid-animation), desaturates, fades
// Blur peaks BEFORE opacity fades - guides attention away

// Phase 3: EMERGENCE (B materializes from A's ghost)
// B appears at A's final dimensions (not magic arbitrary size)
// Two stages: solidification (opacity 0.2→0.7) then growth
```

**Key Techniques:**

1. **Dimensional Inheritance:**
   - Search bar initial size (200×60) matches compressed photo cluster
   - NOT arbitrary 500×50 appearing from nothing

2. **Blur Curve:**
   ```tsx
   // Blur peaks mid-animation, reduces as opacity fades
   const blurCurve = spring < 0.5
     ? spring * 6        // 0 → 3px
     : 3 - (spring - 0.5) * 6;  // 3px → 0
   ```

3. **Overlapping Phases:**
   - Photos at frame 310: blurring, 50% opacity
   - Search bar at frame 310: 20% opacity, solidifying
   - Both visible simultaneously = transformation, not replacement

4. **Desaturation Bridge:**
   - Photos lose color as they merge (become neutral like UI)
   - Visual signal: "becoming something else"

**Thresholds:**
| Effect | Max Value | Rationale |
|--------|-----------|-----------|
| Blur peak | 3px | Beyond = distracting |
| Desaturation | 80% | Some color remains until fade |
| Overlap duration | 15-20 frames | Too short = jarring, too long = sluggish |

**Verification:**
- Frame 310: Both elements visible, mid-transformation
- Frame 317: Peak blur, search bar 50% visible
- Frame 325: Clean handoff complete

**Rule:** Elements should transform, not teleport. If you can point to "where A ends and B begins," the transition isn't seamless enough.

---

## Lesson 14: Always Provide Test Commands

**Problem:** After implementing changes, user needs to manually figure out how to pull and test.

**Rule:** After every commit/push, ALWAYS provide these commands:

**Standard Pull + Run:**
```bash
cd ~/Documents/AEclipse && git pull origin claude/analyze-program-functionality-gb52b && cd packages/template-minima-title && bun run dev
```

**If Local Changes Exist:**
```bash
cd ~/Documents/AEclipse && git stash && git pull origin claude/analyze-program-functionality-gb52b && git stash pop && cd packages/template-minima-title && bun run dev
```

**Also Include:**
- Verification frames table (key frames to scrub to)
- What to look for at each frame
- Expected visual state

**Example Format:**
```
| Frame | What to See |
|-------|-------------|
| 275 | Middle row in grid, about to form strip |
| 310 | Photos blurring, search bar ghost appearing |
```

**Render Verification Frames (one command):**
```bash
cd ~/Documents/AEclipse/packages/template-minima-title && \
mkdir -p review && \
bun remotion still StonecrestReveal --frame=275 --output=review/f275.png && \
bun remotion still StonecrestReveal --frame=310 --output=review/f310.png && \
bun remotion still StonecrestReveal --frame=325 --output=review/f325.png && \
bun remotion still StonecrestReveal --frame=350 --output=review/f350.png && \
echo "Done! Review frames saved to review/"
```

**Commit & Push Frames for Claude Review:**
```bash
cd ~/Documents/AEclipse && \
git add packages/template-minima-title/review/ && \
git commit -m "Review frames" && \
git push origin claude/analyze-program-functionality-gb52b
```

**Rule:** Every push should be immediately testable by the user.
