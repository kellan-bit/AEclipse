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

---

## Global Learning Framework

**Every local fix teaches a transferable principle.** This section captures global insights that apply beyond this specific project.

### Principle: Perceptual Continuity
**Local Fix:** Move SEARCH_EMERGE 13 frames earlier (310 → 297)
**Global Application:** When transitioning between visual elements, the replacement must be perceptible BEFORE the original begins dissolving. The brain needs to register "something is here" before it can accept transformation.

**Applies to:**
- UI state transitions (skeleton loaders appear before content fades)
- Video editing (B-roll underlaps audio transition)
- Presentation design (next slide's element hints before transition)
- Game design (spawn indicators before enemies appear)
- Magic/illusion (misdirection establishes "where to look next")

**The Rule:** Never leave a perceptual void. The viewer's attention needs a landing zone.

---

### Principle: Optical Mixing
**Local Fix:** Photo opacity fade [0.5, 0.95] → [0.15, 0.65]
**Global Application:** When two elements overlap during transition, their combined visual weight must be orchestrated. Combined opacity >100% = visual noise/competition. Combined <100% = intentional "dissolve" breathing room.

**Applies to:**
- CSS transitions (crossfade timing)
- Video dissolves (overlap duration and curve)
- Audio crossfades (avoid volume spikes)
- Lighting design (gel layering)
- Layer compositing (blend modes)

**The Rule:** Transitions are two-body problems. You can't tune one element's curve without considering the other.

---

### Principle: Dimensional Inheritance
**Local Fix:** Bar starts at 340×86px to match photo cluster, not arbitrary 200×60px
**Global Application:** A transformed element must inherit the spatial footprint of its predecessor at the moment of handoff. Mismatches break the illusion of metamorphosis.

**Applies to:**
- Morphing animations (shared element transitions)
- Responsive design breakpoints (content flow)
- State machine transitions (UI component sizing)
- Shape tweening (matching anchor points)
- Video VFX (match-moving)

**The Rule:** Measure the source at the handoff frame. Start the target at those exact dimensions.

---

### Principle: Property Continuity
**Local Fix:** Border-radius animates from 8 → 25, doesn't jump from 16 → 25
**Global Application:** Every animatable property that changes between states must have an interpolation path. Instant jumps are perceptible as "cuts" even in peripheral vision.

**Applies to:**
- CSS transitions (ensure all changing properties are listed)
- Keyframe animation (hold keyframes for non-animated properties)
- Procedural generation (interpolate all parameters)
- State machines (transition functions for all state variables)
- 3D animation (all transform channels need curves)

**The Rule:** Audit every property that differs between states. If it changes, it animates.

---

### Principle: Shadow-Elevation Consistency
**Local Fix:** Use getElevationShadow() instead of hardcoded shadow values
**Global Application:** Shadows must track logical "height" of elements. When elements move in Z-space (appear to lift or lower), shadows must respond consistently across the entire system.

**Applies to:**
- Material Design elevation system
- CSS shadow progressions
- 3D lighting consistency
- Photography/cinematography key-light ratios
- Game UI depth layering

**The Rule:** Shadows are not decorative - they're information. They tell the viewer where things are in space.

---

### How to Add New Global Learnings

When you discover a new principle through local fixes:

1. **Name it** - Give the principle a memorable 2-3 word name
2. **State the local fix** - What specific change triggered this insight?
3. **Generalize** - What's the underlying principle that made this work?
4. **List domains** - Where else does this apply? (minimum 4 domains)
5. **The Rule** - One sentence that captures the actionable insight

**Template:**
```markdown
### Principle: [Name]
**Local Fix:** [Specific change made]
**Global Application:** [Why this works, the underlying principle]

**Applies to:**
- [Domain 1]
- [Domain 2]
- [Domain 3]
- [Domain 4+]

**The Rule:** [One sentence, actionable]
```

---

## Lesson 15: Declarative Motion Over Imperative Interpolation (v0.26)

**Problem:** Code like `const springVal = createSpring(...); const x = springTo(springVal, [a, b])` is hard to read and maintain.

**What Happened:** Every animation required:
1. Calling createSpring with frame math
2. Calling springTo to map the spring value
3. Manually checking if we're in the right phase
4. Complex if/else chains for multi-phase animations

**Right Approach: DECLARATIVE HOOKS**
```tsx
// Before (v0.25 - imperative)
const growthSpring = createSpring(frame - photosFullyMergedFrame, fps, 'responsive', 0);
barWidth = springTo(growthSpring, [340, 500]);
barHeight = springTo(growthSpring, [86, 50]);

// After (v0.26 - declarative)
const { width, height } = useSpringMulti({
  width: [340, 500],
  height: [86, 50],
}, photosFullyMergedFrame, 'responsive');
```

**Benefits:**
- Intent is clear: "spring these values from A to B starting at frame X"
- Frame math is hidden inside the hook
- Multi-value animations are coordinated automatically
- Easier to tune timing by changing one number

**Rule:** Prefer hooks that express WHAT you want, not HOW to calculate it.

---

## Lesson 16: Named Curves Over Magic Numbers (v0.26)

**Problem:** `Easing.bezier(0.34, 1.56, 0.64, 1)` means nothing at a glance.

**What Happened:** Every bezier curve required looking up what those control points do. Team members couldn't understand or tune animations without deep knowledge.

**Right Approach: NAMED CURVE LIBRARY**
```tsx
// Before - what does this even do?
easing: Easing.bezier(0.34, 1.56, 0.64, 1)

// After - intent is clear
easing: CURVES.overshootLarge
// or
easing: CURVES.appleDefault
// or
easing: CURVES.photoBurst  // project-specific
```

**Curve Library Categories:**
1. **Standard** - CSS spec (ease, easeIn, easeOut, easeInOut)
2. **Apple** - Measured from iOS/macOS (appleDefault, appleKeyboard, appleSheet)
3. **Material** - Google spec (materialStandard, materialDecelerate)
4. **Emphasis** - Overshoot/anticipation (overshootSmall, anticipateMedium)
5. **Project** - Custom curves (folderOpen, photoBurst, metamorphosis)

**Rule:** If a curve isn't named, you'll forget what it does. Name all curves.

---

## Lesson 17: Phase Hooks for Clean State Detection (v0.26)

**Problem:** Complex if/else chains for detecting animation phases.

**What Happened:** Code like this was everywhere:
```tsx
const isSolidifying = frame >= emergenceStartFrame && frame < photosFullyMergedFrame;
const isGrowing = frame >= photosFullyMergedFrame && frame < expandStartFrame;
const isExpanding = expandStartFrame > 0 && frame >= expandStartFrame;
```

**Right Approach: PHASE HOOKS**
```tsx
// Cleaner detection
const isSolidifying = useInPhase(emergenceStartFrame, solidifyDuration);
const isGrowing = useInPhase(photosFullyMergedFrame, growthDuration);

// Progress through a phase
const progress = usePhaseProgress(startFrame, duration, 'easeOut');
```

**Benefits:**
- Phase logic is encapsulated
- Edge cases handled consistently
- Easing can be applied to progress
- Easier to debug (inspect hook values)

**Rule:** Encapsulate phase detection in reusable hooks.

---

## Lesson 18: Infrastructure Enables Velocity (v0.26)

**Problem:** Adding new animations required copy-pasting boilerplate.

**Global Application:** Investing in infrastructure (motion primitives, hooks, presets) pays off exponentially. The time spent building reusable foundations is recovered many times over as the project grows.

**Signs You Need Infrastructure:**
- Copy-pasting animation code between components
- Same bug appearing in multiple places
- Team members afraid to touch animation code
- Tuning one animation breaks another
- No naming convention for timing/easing values

**Infrastructure Investment Levels:**
| Level | What | When |
|-------|------|------|
| 0 | Inline everything | Prototype, throwaway code |
| 1 | Constants | Any shared project |
| 2 | Utility functions | 3+ components with animation |
| 3 | Custom hooks | Animation-heavy applications |
| 4 | Full motion system | Animation is core to product |

**Rule:** Build infrastructure when you find yourself explaining the same pattern twice.

---

## Quick Reference: New Motion Hooks (v0.26)

```tsx
import {
  useSpring,         // Single value spring
  useTween,          // Single value tween
  useSpringMulti,    // Multi-value spring
  usePhaseProgress,  // 0-1 progress through phase
  useInPhase,        // Boolean: in phase?
  useBreathe,        // Subtle oscillation
  useFloat,          // Gentle vertical float
  useStaggeredSpring, // Staggered by index
} from '../motion';

// Examples
const scale = useSpring(0, 1, startFrame, 'bouncy');
const opacity = useTween(0, 1, startFrame, 15, 'easeOut');
const { x, y } = useSpringMulti({ x: [0, 100], y: [0, 50] }, startFrame, 'responsive');
const progress = usePhaseProgress(startFrame, duration, 'appleDefault');
const isActive = useInPhase(startFrame, duration);
const breathingScale = useBreathe(1, 0.005, 1, index * 5);
```

---

## Quick Reference: Named Curves (v0.26)

```tsx
import { CURVES } from '../motion';

// Apple ecosystem
CURVES.appleDefault      // Standard system animation
CURVES.appleKeyboard     // Keyboard appearance
CURVES.appleSheet        // Sheet presentation
CURVES.appleLaunch       // App launch zoom

// Emphasis
CURVES.overshootSmall    // Subtle bounce past target
CURVES.overshootMedium   // Noticeable spring
CURVES.overshootLarge    // Playful bounce
CURVES.anticipateSmall   // Slight pullback before

// Project-specific
CURVES.folderOpen        // Mechanical hinge feel
CURVES.photoBurst        // Energetic expansion
CURVES.searchGrow        // Responsive UI growth
CURVES.metamorphosis     // Smooth transformation
```
