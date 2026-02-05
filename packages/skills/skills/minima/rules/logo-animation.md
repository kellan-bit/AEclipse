---
name: logo-animation
description: Animated MINIMA wordmark with per-letter animations
metadata:
  tags: logo, wordmark, animation, letters, minima
---

## MINIMA Wordmark Animation

The MINIMA wordmark uses **per-letter animations** where each letter has a unique entrance animation while maintaining visual cohesion.

## Using the AnimatedWordmark Component

```tsx
import { AnimatedWordmark } from 'template-minima-title/components';

<AnimatedWordmark
  startFrame={15}           // When animation begins
  color={colors.white}      // Text color
  fontSize={120}            // Logo size in pixels
  showTagline={true}        // Show "DESIGN • BUILD • DEVELOP"
  showTrademark={true}      // Show ™ symbol
  animationStyle="mixed"    // 'mixed' or 'uniform'
/>
```

## Letter Animation Assignments

Each letter in "MINIMA" has a unique animation:

| Letter | Animation | Effect |
|--------|-----------|--------|
| M | `slideUp` | Rises confidently from below |
| I | `fadeScale` | Fades in with subtle scale |
| N | `maskReveal` | Horizontal wipe reveal |
| I | `scaleRotate` | Scales with slight rotation |
| M | `slideUp` | Mirrors first M |
| A | `bounceIn` | Gentle bounce to finish |

## Available Letter Animations

```tsx
type LetterAnimation =
  | 'slideUp'       // Rises from below with fade
  | 'slideDown'     // Drops from above with fade
  | 'scaleRotate'   // Scales up with subtle rotation
  | 'maskReveal'    // Horizontal mask wipe
  | 'fadeScale'     // Fade in with scale
  | 'splitReveal'   // Vertical scale from center
  | 'bounceIn'      // Gentle bounce entrance
  | 'typewriter';   // Sharp instant appearance
```

## Uniform Animation Style

For a more subtle approach, use uniform animation:

```tsx
<AnimatedWordmark
  animationStyle="uniform"
  uniformAnimation="slideUp"  // All letters use same animation
/>
```

## Custom Letter Animation

Use the `AnimatedLetter` component for custom implementations:

```tsx
import { AnimatedLetter } from 'template-minima-title/components';

const letters = 'MINIMA'.split('');

<div style={{ display: 'flex' }}>
  {letters.map((letter, index) => (
    <AnimatedLetter
      key={index}
      letter={letter}
      index={index}
      startFrame={15}
      duration={20}           // Animation duration in frames
      animation="slideUp"     // Animation type
      staggerDelay={4}        // Frames between each letter
      color={colors.white}
      fontSize={120}
    />
  ))}
</div>
```

## Animation Timing

Default timing for the wordmark animation:

```
Frame 0-15:    Hold (black screen)
Frame 15-35:   M animates in
Frame 19-39:   I animates in (4 frame stagger)
Frame 23-43:   N animates in
Frame 27-47:   I animates in
Frame 31-51:   M animates in
Frame 35-55:   A animates in
Frame 55-70:   ™ fades in
Frame 70-90:   Tagline fades in (if enabled)
```

Total logo animation: ~90 frames (3 seconds at 30fps)

## Tagline

The tagline "DESIGN • BUILD • DEVELOP" appears below the wordmark:

```tsx
<AnimatedWordmark
  showTagline={true}   // Enable tagline
/>
```

Tagline styling:
- Font: Neue Haas Unica
- Size: 14% of logo fontSize
- Letter-spacing: 0.3em
- Uppercase
- Fades in after all letters complete

## Logo Specifications

From brand guidelines:

- **Minimum size:** 24px height
- **Clear space:** 24px around all sides
- **Colors:** White on dark, Black on light (never other colors)
- **Letter-spacing:** 0.15em for wordmark

## Full Logo Scene Example

```tsx
import { AbsoluteFill } from 'remotion';
import { colors, themes } from '@minima/brand';
import { AnimatedWordmark } from 'template-minima-title/components';

export const LogoScene = () => {
  const theme = themes.dark;

  return (
    <AbsoluteFill style={{
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <AnimatedWordmark
        startFrame={15}
        color={theme.colors.text}
        fontSize={120}
        showTagline={true}
        showTrademark={true}
        animationStyle="mixed"
      />
    </AbsoluteFill>
  );
};
```

## Size Recommendations by Format

| Format | Resolution | Logo Font Size |
|--------|------------|----------------|
| Landscape (16:9) | 1920×1080 | 120px |
| Vertical (9:16) | 1080×1920 | 80px |
| Square (1:1) | 1080×1080 | 90px |
| Cinematic (2.4:1) | 1920×800 | 100px |
