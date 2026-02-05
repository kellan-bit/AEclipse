---
name: video-transition
description: Seamless transitions from title card to video content
metadata:
  tags: transition, video, animation, minima
---

## Video Transition Component

The VideoTransition component handles the seamless transition from the title card to your video content.

## Basic Usage

```tsx
import { VideoTransition } from 'template-minima-title/components';
import { staticFile } from 'remotion';

<VideoTransition
  startFrame={75}                              // When transition begins
  duration={30}                                // Transition length in frames
  transitionType="fade"                        // Transition style
  videoSrc={staticFile('property-tour.mp4')}  // Your video file
>
  <TitleCard title="The Rosa Blanca" ... />   // Content to transition FROM
</VideoTransition>
```

## Transition Types

Six professional transition styles available:

### 1. Fade (Default)
Simple crossfade between title and video.
```tsx
transitionType="fade"
```
Best for: Clean, professional content. Most versatile.

### 2. Fade to Black
Fades to black, then reveals video. Creates a moment of pause.
```tsx
transitionType="fadeToBlack"
```
Best for: Dramatic reveals, separating intro from main content.

### 3. Scale Reveal
Title scales up and fades, revealing video underneath.
```tsx
transitionType="scaleReveal"
```
Best for: Dynamic, forward-moving energy.

### 4. Slide Up
Title slides up off screen, video fades in.
```tsx
transitionType="slideUp"
```
Best for: Vertical motion continuity.

### 5. Mask Wipe
Horizontal mask wipe reveals video from left to right.
```tsx
transitionType="maskWipe"
```
Best for: Editorial, cinematic feel.

### 6. Zoom Through
Title zooms past camera, video scales up to fill frame.
```tsx
transitionType="zoomThrough"
```
Best for: Immersive, "entering the space" feeling.

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `startFrame` | number | required | When transition begins |
| `duration` | number | 30 | Transition length in frames |
| `transitionType` | TransitionType | 'fade' | Animation style |
| `videoSrc` | string | optional | Path to video file |
| `imageSrc` | string | optional | Path to image (if no video) |
| `backgroundColor` | string | #141414 | Background color |
| `children` | ReactNode | required | Content to transition from |

## Adding Video Assets

### Step 1: Place video in public folder
```
template-minima-title/
└── public/
    └── property-tour.mp4
```

### Step 2: Reference with staticFile
```tsx
import { staticFile } from 'remotion';

videoSrc={staticFile('property-tour.mp4')}
```

## Static Image Alternative

For a poster image instead of video:
```tsx
<VideoTransition
  imageSrc={staticFile('hero-image.jpg')}
  // videoSrc not needed
>
  ...
</VideoTransition>
```

## Full Sequence Example

```tsx
import { AbsoluteFill, Sequence, staticFile } from 'remotion';
import { themes } from '@minima/brand';
import { AnimatedWordmark, TitleCard, VideoTransition } from 'template-minima-title/components';

export const FullTitleSequence = () => {
  const theme = themes.dark;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {/* Scene 1: Logo (0-90 frames / 0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <AnimatedWordmark
          startFrame={15}
          color={theme.colors.text}
          showTagline={true}
        />
      </Sequence>

      {/* Scene 2: Title Card + Transition (90-195 frames / 3-6.5s) */}
      <Sequence from={90} durationInFrames={105}>
        <VideoTransition
          startFrame={75}      // 75 frames into this scene
          duration={30}
          transitionType="fade"
          videoSrc={staticFile('property-tour.mp4')}
          backgroundColor={theme.colors.background}
        >
          <TitleCard
            title="The Rosa Blanca"
            subtitle="A Minima Residence"
            accentText="Where design meets discipline"
            color={theme.colors.text}
            backgroundColor={theme.colors.background}
          />
        </VideoTransition>
      </Sequence>
    </AbsoluteFill>
  );
};
```

## Timing Recommendations

| Element | Frames | Seconds | Notes |
|---------|--------|---------|-------|
| Logo animation | 90 | 3.0 | Includes hold time |
| Title card display | 75 | 2.5 | Before transition starts |
| Transition | 30 | 1.0 | Actual crossfade/wipe |
| **Total intro** | **195** | **6.5** | Before video plays |

## Transition Duration by Type

| Type | Recommended Duration | Notes |
|------|---------------------|-------|
| fade | 30 frames (1s) | Clean, professional |
| fadeToBlack | 45 frames (1.5s) | Needs time for black pause |
| scaleReveal | 30 frames (1s) | Dynamic, forward motion |
| slideUp | 25 frames (0.8s) | Quick, purposeful |
| maskWipe | 35 frames (1.2s) | Slower feels more editorial |
| zoomThrough | 40 frames (1.3s) | Needs time for zoom effect |

## Best Practices

1. **Match transition to content mood:**
   - Elegant property → `fade` or `fadeToBlack`
   - Dynamic tour → `scaleReveal` or `zoomThrough`
   - Editorial/documentary → `maskWipe`

2. **Video should start on a strong frame:**
   - First frame visible should be visually compelling
   - Avoid transitions into dark/blurry moments

3. **Audio considerations:**
   - If video has audio, consider `fadeToBlack` for clean audio transition
   - Crossfade works well with ambient background music

4. **Duration consistency:**
   - Keep transitions consistent across a video series
   - Don't mix dramatic and subtle transitions in same project
