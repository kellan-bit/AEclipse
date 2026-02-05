---
name: minima-templates
description: Minima brand templates for luxury home video content
metadata:
  tags: minima, brand, logo, title-card, luxury, real-estate, animation
---

## When to use

Use this skill when creating video content for Minima or luxury real estate/architecture brands. This skill provides:

- Brand-consistent colors, typography, and themes
- Animated logo/wordmark components
- Title card templates
- Video transition patterns

## Brand Overview

**Minima** - Luxury home design & development
- Tagline: "DESIGN • BUILD • DEVELOP"
- Aesthetic: Minimal, refined, intentional, quiet luxury
- Key message: "Minimal homes crafted with intention, precision, and presence."

## How to use

Read individual rule files for detailed guidance:

- [rules/brand.md](rules/brand.md) - Minima brand colors, typography, and themes
- [rules/logo-animation.md](rules/logo-animation.md) - Animated MINIMA wordmark with per-letter animations
- [rules/title-card.md](rules/title-card.md) - Video title cards with subtitle and accent text
- [rules/video-transition.md](rules/video-transition.md) - Transitions from title card to video content

## Quick Start

```tsx
import { colors, fonts, themes } from '@minima/brand';
import { MinimaTitle } from 'template-minima-title';

// Use dark theme (primary brand theme)
const theme = themes.dark;

// Create a title sequence
<MinimaTitle
  title="The Rosa Blanca"
  subtitle="A Minima Residence"
  videoSrc={staticFile('property-tour.mp4')}
  theme="dark"
  transitionType="fade"
/>
```

## Important Rules

1. **Always use brand colors** - Never use colors outside the Minima palette
2. **Use Neue Haas Unica** as primary font, Honest for italic accents
3. **Animations should be elegant** - Deliberate, smooth, never rushed
4. **Dark theme is primary** - Use for main marketing content
5. **Maintain clear space** around the logo (minimum 24px)
