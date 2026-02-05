# Template Synthesis Guide

This guide explains how to convert video analysis JSON into working Remotion components.

## Workflow

```
analysis/scenes.json
        ↓
   Parse scenes
        ↓
   Generate code
        ↓
   src/Root.tsx
   src/[VideoName].tsx
   src/scenes/Scene[N].tsx
   src/components/
   src/styles/theme.ts
```

## Step 1: Generate Theme from Analysis

From `scenes.json`, extract global colors and typography:

```tsx
// src/styles/theme.ts
export const theme = {
  colors: {
    // From scenes[0].visual.colors
    background: '#000000',
    text: '#ffffff',
    textSecondary: '#888888',
    accent: '#ff0000',
  },
  typography: {
    // From scenes[0].visual.typography
    heading: {
      fontFamily: 'Helvetica Neue, sans-serif',
      fontWeight: 700,
      letterSpacing: '0.02em',
      textTransform: 'uppercase' as const,
    },
    subheading: {
      fontFamily: 'Helvetica Neue, sans-serif',
      fontWeight: 400,
      letterSpacing: '0.1em',
    },
  },
  // Convert pixel values to percentages for responsive sizing
  fontSize: {
    heading: 72, // at 1080p
    subheading: 24,
  },
};
```

## Step 2: Generate Scene Components

For each scene in `scenes.json`:

```tsx
// src/scenes/Scene1.tsx
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { theme } from '../styles/theme';

// From scenes[0].visual.layout.elements
interface Scene1Props {
  title: string;
  subtitle: string;
}

export const Scene1: React.FC<Scene1Props> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();

  // From scenes[0].animations
  // Animation: title opacity 0→1 over frames 0-20
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    easing: Easing.out(Easing.ease),
    extrapolateRight: 'clamp',
  });

  // Animation: title translateY 30→0 over frames 0-20
  const titleY = interpolate(frame, [0, 20], [30, 0], {
    easing: Easing.out(Easing.ease),
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Title - from elements[0] */}
      <div
        style={{
          ...theme.typography.heading,
          fontSize: theme.fontSize.heading,
          color: theme.colors.text,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          // Position from elements[0].position
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: `translate(-50%, -50%) translateY(${titleY}px)`,
        }}
      >
        {title}
      </div>

      {/* Subtitle - from elements[1] */}
      <div
        style={{
          ...theme.typography.subheading,
          fontSize: theme.fontSize.subheading,
          color: theme.colors.textSecondary,
          position: 'absolute',
          top: '55%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};
```

## Step 3: Generate Main Composition

Combine scenes with transitions:

```tsx
// src/ReplicatedVideo.tsx
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';

interface ReplicatedVideoProps {
  scene1Title: string;
  scene1Subtitle: string;
  // ... props from analysis
}

export const ReplicatedVideo: React.FC<ReplicatedVideoProps> = (props) => {
  return (
    <TransitionSeries>
      {/* Scene 1: frames 0-89 (from scenes[0].timing) */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <Scene1 title={props.scene1Title} subtitle={props.scene1Subtitle} />
      </TransitionSeries.Sequence>

      {/* Transition: fade over 15 frames (from scenes[0].transition.out) */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />

      {/* Scene 2: frames 90-180 */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <Scene2 {...props} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
```

## Step 4: Generate Root.tsx with Schemas

```tsx
// src/Root.tsx
import { Composition } from 'remotion';
import { z } from 'zod';
import { ReplicatedVideo } from './ReplicatedVideo';

// Generate schema from analysis props
const replicatedVideoSchema = z.object({
  scene1Title: z.string(),
  scene1Subtitle: z.string(),
  // ... all props
});

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ReplicatedVideo"
      component={ReplicatedVideo}
      // From analysis/scenes.json videoInfo
      durationInFrames={1200}
      fps={30}
      width={1920}
      height={1080}
      schema={replicatedVideoSchema}
      // From analysis text content
      defaultProps={{
        scene1Title: 'Original Title',
        scene1Subtitle: 'Original Subtitle',
      }}
    />
  );
};
```

## Animation Conversion Reference

### Easing Conversion Table

| Analysis Easing | Remotion Easing |
|-----------------|-----------------|
| `"linear"` | No easing option |
| `"easeIn"` | `Easing.in(Easing.ease)` |
| `"easeOut"` | `Easing.out(Easing.ease)` |
| `"easeInOut"` | `Easing.inOut(Easing.ease)` |
| `"spring"` | `Easing.out(Easing.back(1.5))` |
| `[0.4, 0, 0.2, 1]` | `Easing.bezier(0.4, 0, 0.2, 1)` |

### Property Conversion

| Analysis Property | CSS/Transform |
|-------------------|---------------|
| `"opacity"` | `opacity` |
| `"translateX"` | `transform: translateX(${value}px)` |
| `"translateY"` | `transform: translateY(${value}px)` |
| `"scale"` | `transform: scale(${value})` |
| `"rotate"` | `transform: rotate(${value}deg)` |

### Animation Code Template

```tsx
// For each animation in scene.animations:
const [elementId]_[property] = interpolate(
  frame,
  [animation.keyframes[0].frame, animation.keyframes[1].frame],
  [animation.keyframes[0].value, animation.keyframes[1].value],
  {
    easing: /* converted easing */,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }
);
```

## Transition Conversion Reference

| Analysis Type | Remotion Transition |
|---------------|---------------------|
| `"fade"` | `fade()` |
| `"slideLeft"` | `slide({ direction: 'from-left' })` |
| `"slideRight"` | `slide({ direction: 'from-right' })` |
| `"slideUp"` | `slide({ direction: 'from-top' })` |
| `"slideDown"` | `slide({ direction: 'from-bottom' })` |
| `"wipe"` | `wipe()` |
| `"fadeToBlack"` | Custom: fade to black layer |

## File Structure Output

After synthesis, your project should look like:

```
src/
├── Root.tsx                 # Compositions with schemas
├── ReplicatedVideo.tsx      # Main video component
├── scenes/
│   ├── Scene1.tsx           # Scene components
│   ├── Scene2.tsx
│   └── ...
├── components/
│   ├── AnimatedText.tsx     # Reusable animation components
│   └── ...
└── styles/
    └── theme.ts             # Extracted theme
```

## Validation Checklist

After generating the template:

- [ ] All scenes have correct durations
- [ ] Transitions match analysis timing
- [ ] Colors match extracted palette
- [ ] Typography matches analysis
- [ ] Animations have correct timing and easing
- [ ] Text content is verbatim from analysis
- [ ] Schema includes all props
- [ ] defaultProps are inlined
