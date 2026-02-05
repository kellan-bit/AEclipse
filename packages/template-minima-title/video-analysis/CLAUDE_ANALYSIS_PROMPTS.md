# Claude Video Analysis Prompts

This document contains structured prompts for Claude to analyze video frames and generate Remotion templates.

## Analysis Workflow

```
1. OVERVIEW ANALYSIS (keyframes)
   └── Identify scenes, overall structure

2. SCENE-BY-SCENE ANALYSIS
   ├── Visual design extraction
   ├── Text content extraction
   └── Layout mapping

3. MOTION ANALYSIS (frame pairs)
   ├── Animation detection
   ├── Timing estimation
   └── Easing curve identification

4. SYNTHESIS
   └── Generate Remotion components
```

---

## Prompt 1: Initial Overview Analysis

Use with: `frames/keyframes/` (all keyframes at once or in batches)

```
I'm analyzing a video to recreate it as a Remotion template. Here are keyframes extracted at 1-second intervals.

Please analyze these frames and provide:

## 1. VIDEO STRUCTURE
- Total number of distinct scenes/sections
- Timestamp ranges for each scene
- Scene descriptions (what happens in each)

## 2. VISUAL THEMES
- Overall color palette (list hex codes)
- Typography style (font family guesses, weights)
- Design aesthetic (minimal, bold, luxury, playful, etc.)

## 3. ANIMATION PATTERNS OBSERVED
- Types of transitions between scenes
- Common animation patterns (fades, slides, scales)
- Pacing (fast-paced, slow/elegant, mixed)

## 4. CONTENT ELEMENTS
- Text content visible in each scene
- Logo/branding elements
- Background elements (solid, gradient, image, video)

## 5. TECHNICAL SPECS FOR REMOTION
- Suggested scene durations (in frames at 30fps)
- Component breakdown (what reusable components to create)
- Recommended file structure

Output as structured JSON where possible.
```

---

## Prompt 2: Single Scene Deep Analysis

Use with: First and last frame of a specific scene

```
Analyze this scene from a video I'm recreating in Remotion.

Scene: [SCENE_NUMBER]
Frames: [START_FRAME] to [END_FRAME]
Duration: [X] seconds ([Y] frames at 30fps)

## VISUAL ANALYSIS

### Colors (provide exact hex codes)
- Background: #______
- Primary text: #______
- Secondary text: #______
- Accent colors: #______, #______

### Typography
- Heading font: [describe or identify]
  - Size: [estimate relative to frame height, e.g., "8% of height"]
  - Weight: [light/regular/medium/bold/black]
  - Case: [uppercase/lowercase/title case]
  - Letter-spacing: [tight/normal/wide, estimate in em]

- Body/subtitle font: [describe or identify]
  - Size: [estimate]
  - Weight: [weight]

### Layout (use percentages of frame dimensions)
- Main content area:
  - X position: [%]
  - Y position: [%]
  - Width: [%]
  - Alignment: [left/center/right]

- Element positions:
  - Element 1: { x: %, y: %, width: %, height: % }
  - Element 2: { x: %, y: %, width: %, height: % }

### Visual Effects
- Shadows: [none/subtle/prominent, describe]
- Overlays: [none/gradient/solid, opacity %]
- Blur effects: [none/background blur/motion blur]
- Other effects: [grain, vignette, etc.]

## TEXT CONTENT (verbatim)
- Line 1: "[text]"
- Line 2: "[text]"
- etc.

## ASSETS NEEDED
- [ ] Logo (describe: [details])
- [ ] Background image/video
- [ ] Icons
- [ ] Other assets

## REMOTION COMPONENT STRUCTURE
```tsx
// Suggested component structure
const Scene[N]: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#______' }}>
      {/* Element structure */}
    </AbsoluteFill>
  );
};
```
```

---

## Prompt 3: Motion/Animation Analysis

Use with: 5-10 consecutive frames showing animation

```
Analyze these consecutive frames to extract animation data.

Frames shown: [FRAME_NUMBERS]
Time span: [X]ms (at 30fps)

For each animating element, provide:

## ANIMATION BREAKDOWN

### Element: [Element Name]
```json
{
  "property": "opacity|translateX|translateY|scale|rotate",
  "startFrame": 0,
  "endFrame": 15,
  "startValue": 0,
  "endValue": 1,
  "easing": "linear|easeIn|easeOut|easeInOut|spring",
  "easingCurve": [0, 0, 0.58, 1]  // cubic-bezier if custom
}
```

### Timing Analysis
- Animation starts at frame: [X]
- Animation ends at frame: [Y]
- Duration: [Z] frames ([Z/30]s)

### Easing Detection
Looking at the animation progression:
- Frame 1-2: [slow/medium/fast] change → suggests [ease-in/ease-out]
- Frame 2-3: [slow/medium/fast] change
- etc.
- Estimated easing: [type]

### Sequence/Stagger
If multiple elements animate:
- Element A starts at frame [X]
- Element B starts at frame [X + stagger]
- Stagger delay: [N] frames

## REMOTION INTERPOLATE CODE
```tsx
const frame = useCurrentFrame();

// [Element Name] animation
const elementOpacity = interpolate(
  frame,
  [startFrame, endFrame],
  [0, 1],
  { easing: Easing.out(Easing.ease) }
);

const elementY = interpolate(
  frame,
  [startFrame, endFrame],
  [30, 0],
  { easing: Easing.out(Easing.ease) }
);
```
```

---

## Prompt 4: Transition Analysis

Use with: Frames around a scene transition

```
Analyze this transition between two scenes.

Transition frames: [X] to [Y]
Duration: [Z] frames

## TRANSITION TYPE
- [ ] Cut (instant change)
- [ ] Fade (cross-dissolve)
- [ ] Fade to black (dip to black)
- [ ] Slide (direction: left/right/up/down)
- [ ] Scale/Zoom
- [ ] Wipe (direction/shape)
- [ ] Custom (describe)

## TRANSITION PARAMETERS
- Duration: [X] frames
- Easing: [type]
- Overlap: [X] frames (if scenes overlap)

## REMOTION TRANSITION CODE
```tsx
import { TransitionSeries, linearTiming, fade } from '@remotion/transitions';

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={90}>
    <Scene1 />
  </TransitionSeries.Sequence>

  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 30 })}
  />

  <TransitionSeries.Sequence durationInFrames={60}>
    <Scene2 />
  </TransitionSeries.Sequence>
</TransitionSeries>
```
```

---

## Prompt 5: Color Extraction

Use with: Any representative frame

```
Extract the exact color palette from this frame.

## COLOR PALETTE

### Primary Colors
| Role | Hex | RGB | Usage |
|------|-----|-----|-------|
| Background | #______ | rgb(_, _, _) | Main background |
| Primary Text | #______ | rgb(_, _, _) | Headlines |
| Secondary Text | #______ | rgb(_, _, _) | Subtitles |
| Accent | #______ | rgb(_, _, _) | Highlights |

### Gradients (if any)
```css
/* Gradient 1 */
background: linear-gradient([angle]deg, #______ 0%, #______ 100%);
```

### Shadows (if any)
```css
/* Shadow style */
box-shadow: [x]px [y]px [blur]px rgba(_, _, _, [alpha]);
```

## REMOTION THEME OBJECT
```tsx
export const extractedTheme = {
  colors: {
    background: '#______',
    text: '#______',
    textSecondary: '#______',
    accent: '#______',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.15)',
  },
};
```
```

---

## Prompt 6: Typography Extraction

Use with: Frame with clear text

```
Analyze the typography in this frame.

## TYPOGRAPHY ANALYSIS

### Font Identification
Based on the letterforms, this appears to be:
- Primary font: [Font name or closest match]
  - Characteristics: [serif/sans-serif, geometric/humanist, etc.]

- Secondary font (if different): [Font name]

### Text Styles

#### Heading Style
```tsx
const headingStyle: React.CSSProperties = {
  fontFamily: '[font name], sans-serif',
  fontSize: [X],  // in pixels for 1080p
  fontWeight: [weight],
  letterSpacing: '[X]em',
  lineHeight: [X],
  textTransform: '[none/uppercase/lowercase]',
  color: '#______',
};
```

#### Subheading Style
```tsx
const subheadingStyle: React.CSSProperties = {
  fontFamily: '[font name], sans-serif',
  fontSize: [X],
  fontWeight: [weight],
  letterSpacing: '[X]em',
  color: '#______',
};
```

### Font Loading (for Remotion)
```tsx
import { loadFont } from '@remotion/fonts';

const fontFamily = loadFont({
  family: '[Font Name]',
  url: staticFile('fonts/[font-file].woff2'),
  weight: '[weight]',
});
```
```

---

## Prompt 7: Full Template Synthesis

Use with: Complete analysis data from previous prompts

```
Based on the analysis data provided, generate a complete Remotion template.

## ANALYSIS SUMMARY
[Paste scene analysis, colors, typography, animations]

## GENERATE

### 1. Root.tsx (Composition definitions)
- All compositions with schemas
- Correct durations and dimensions
- Inline defaultProps

### 2. Main Component ([VideoName].tsx)
- Scene sequencing with TransitionSeries
- Proper timing

### 3. Scene Components (scenes/Scene[N].tsx)
- Visual layout matching analysis
- Animation interpolations
- Text content

### 4. Reusable Components (components/)
- AnimatedText
- Logo
- Background
- etc.

### 5. Theme/Styles (styles/theme.ts)
- Color palette
- Typography styles
- Common spacing values

### 6. Assets manifest
- Required images/videos
- Font files needed

Output complete, working code that can be dropped into a Remotion project.
```

---

## Quick Reference: Common Remotion Patterns

### Fade In
```tsx
const opacity = interpolate(frame, [0, 20], [0, 1], {
  extrapolateRight: 'clamp',
});
```

### Slide Up
```tsx
const translateY = interpolate(frame, [0, 20], [50, 0], {
  easing: Easing.out(Easing.ease),
  extrapolateRight: 'clamp',
});
```

### Scale In
```tsx
const scale = interpolate(frame, [0, 20], [0.8, 1], {
  easing: Easing.out(Easing.back(1.5)),
  extrapolateRight: 'clamp',
});
```

### Staggered Animation
```tsx
const items = ['A', 'B', 'C'];
const stagger = 5; // frames between each

{items.map((item, i) => {
  const startFrame = i * stagger;
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return <div style={{ opacity }}>{item}</div>;
})}
```
