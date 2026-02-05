---
name: minima-brand
description: Minima brand colors, typography, themes, and animation principles
metadata:
  tags: brand, colors, typography, themes, minima
---

## Brand Package

Import brand assets from `@minima/brand`:

```tsx
import {
  colors,
  fonts,
  fontSizes,
  textStyles,
  themes,
  durations,
  easings,
  springs
} from '@minima/brand';
```

## Colors

**CRITICAL: Only use these colors. Never use colors outside this palette.**

```tsx
// Primary
colors.black        // #141414 - Primary text, dark backgrounds
colors.white        // #FFFFFF - Light text, clean backgrounds

// Neutrals
colors.darkGray     // #4C4C4C - Secondary text
colors.lightGray    // #E3DEDA - Subtle backgrounds, borders
colors.cream        // #F4F2F0 - Light backgrounds

// Accent
colors.taupe        // #C7BEB4 - Warm accent, highlights

// Semantic helpers
colors.text.primary     // #141414
colors.text.secondary   // #4C4C4C
colors.text.inverse     // #FFFFFF (for dark backgrounds)
colors.background.dark  // #141414
colors.background.light // #F4F2F0
```

## Typography

**Primary font:** Neue Haas Unica (clean, geometric, modern)
**Accent font:** Honest (italic emphasis, warmth)

```tsx
// Font families
fonts.primary   // 'Neue Haas Unica, Helvetica Neue, Arial, sans-serif'
fonts.accent    // 'Honest, Georgia, serif'

// Pre-built text styles
textStyles.heroTitle    // Large headlines (96px)
textStyles.sectionTitle // Section headers (42px)
textStyles.accent       // Italic emphasis (Honest font)
textStyles.body         // Body copy (16px)
textStyles.caption      // Labels, uppercase (12px)
textStyles.wordmark     // MINIMA logo style (wide letter-spacing)
```

### Typography Examples

```tsx
// Hero headline
<h1 style={{
  fontFamily: fonts.primary,
  fontSize: 96,
  fontWeight: 500,
  letterSpacing: '-0.02em',
  color: colors.white,
}}>
  The Rosa Blanca
</h1>

// Italic accent (uses Honest font)
<p style={{
  fontFamily: fonts.accent,
  fontSize: 28,
  fontStyle: 'italic',
  color: colors.white,
}}>
  Where design meets discipline
</p>

// Uppercase label
<span style={{
  fontFamily: fonts.primary,
  fontSize: 12,
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: colors.taupe,
}}>
  A Minima Residence
</span>
```

## Themes

Four pre-built themes available:

```tsx
import { themes } from '@minima/brand';

// Primary brand theme (use for most content)
themes.dark     // Black bg (#141414), white text

// Light alternative
themes.light    // Cream bg (#F4F2F0), black text

// High contrast
themes.contrast // Black bg, pure white accents

// Warm, inviting
themes.warm     // Light gray bg, warm taupe accents
```

### Using Themes

```tsx
const theme = themes.dark;

<AbsoluteFill style={{
  backgroundColor: theme.colors.background,
  color: theme.colors.text,
}}>
  <h1 style={{ color: theme.colors.text }}>Title</h1>
  <p style={{ color: theme.colors.textSecondary }}>Subtitle</p>
  <div style={{ borderColor: theme.colors.border }} />
</AbsoluteFill>
```

## Animation Principles

Minima animations should feel: **deliberate, smooth, understated, elegant**

### Durations (in frames at 30fps)

```tsx
import { durations } from '@minima/brand';

durations.instant   // 6 frames (0.2s) - Micro interactions
durations.fast      // 12 frames (0.4s) - Quick transitions
durations.normal    // 18 frames (0.6s) - Standard animations
durations.slow      // 30 frames (1.0s) - Emphasized reveals
durations.elegant   // 45 frames (1.5s) - Luxurious movements
durations.dramatic  // 60 frames (2.0s) - Hero moments
```

### Easing Functions

```tsx
import { easings } from '@minima/brand';

easings.default     // Smooth, professional
easings.elegantIn   // Slow start, confident finish
easings.elegantOut  // Graceful departure
easings.refined     // Balanced, sophisticated
easings.gentle      // Subtle spring-like feel
```

### Spring Configurations

```tsx
import { springs } from '@minima/brand';

springs.gentle   // Refined movement, no overshoot
springs.smooth   // Smooth, controlled
springs.subtle   // Very subtle response
springs.elegant  // Slow, luxurious
```

### Animation Example

```tsx
import { useCurrentFrame, interpolate } from 'remotion';
import { durations, easings } from '@minima/brand';

const frame = useCurrentFrame();

// Elegant fade + slide up
const opacity = interpolate(
  frame,
  [0, durations.slow],
  [0, 1],
  { easing: easings.elegantIn }
);

const translateY = interpolate(
  frame,
  [0, durations.slow],
  [40, 0],
  { easing: easings.elegantIn }
);

<div style={{ opacity, transform: `translateY(${translateY}px)` }}>
  Content
</div>
```

## Brand Messages

Use these approved taglines:

```tsx
import { brand } from '@minima/brand';

brand.messages.primary   // "Minimal homes crafted with intention, precision, and presence."
brand.messages.secondary // "Where design meets discipline, and every detail earns its place."
brand.messages.luxury    // "Intentional architecture. Quiet luxury. Nothing extra."
brand.messages.refined   // "Your space. Refined."
brand.messages.elegant   // "Elegant homes with nothing extra—only what matters most."
```

## Do's and Don'ts

**DO:**
- Use the brand color palette exclusively
- Use Neue Haas Unica for headlines and body
- Use Honest (italic) for accent/emphasis text
- Keep animations smooth and deliberate
- Maintain generous white/negative space
- Use dark theme for primary marketing content

**DON'T:**
- Use colors outside the brand palette
- Use bouncy or flashy animations
- Rush transitions (minimum 0.6s for reveals)
- Crowd elements together
- Use decorative fonts
- Add unnecessary visual effects
