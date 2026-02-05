---
name: title-card
description: Video title cards with subtitle and accent text
metadata:
  tags: title, card, typography, headline, minima
---

## Title Card Component

The title card displays the video title with optional subtitle and accent text. It follows the logo animation and precedes the video transition.

## Using the TitleCard Component

```tsx
import { TitleCard } from 'template-minima-title/components';

<TitleCard
  title="The Rosa Blanca"
  subtitle="A Minima Residence"
  accentText="Where design meets discipline"
  startFrame={0}
  color={colors.white}
  backgroundColor={colors.black}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | required | Main headline |
| `subtitle` | string | optional | Uppercase label |
| `accentText` | string | optional | Italic accent (Honest font) |
| `startFrame` | number | 0 | Animation start frame |
| `color` | string | white | Text color |
| `backgroundColor` | string | black | Background color |

## Layout Structure

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                                                        │
│                   The Rosa Blanca                      │  ← Title (56px)
│                                                        │
│                   ────────────────                     │  ← Decorative line
│                                                        │
│                A MINIMA RESIDENCE                      │  ← Subtitle (uppercase, taupe)
│                                                        │
│              Where design meets discipline             │  ← Accent (italic, Honest)
│                                                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Animation Sequence

```
Frame 0-30:   Title fades in + slides up
Frame 10-40:  Decorative line grows from center
Frame 15-40:  Subtitle fades in + slides up
Frame 30-55:  Accent text fades in
```

## Typography Hierarchy

### Title
- Font: Neue Haas Unica
- Size: 56px (fontSizes.display.md)
- Weight: 500 (medium)
- Letter-spacing: -0.02em
- Color: Primary text (white/black based on theme)

### Subtitle
- Font: Neue Haas Unica
- Size: 20px (fontSizes.body.xl)
- Weight: 400 (regular)
- Letter-spacing: 0.05em
- Transform: uppercase
- Color: Taupe (#C7BEB4)

### Accent Text
- Font: Honest (accent font)
- Size: 28px (fontSizes.heading.h3)
- Weight: 400 (regular)
- Style: italic
- Color: Primary text

## Example: Property Title Card

```tsx
import { AbsoluteFill, Sequence } from 'remotion';
import { themes } from '@minima/brand';
import { TitleCard } from 'template-minima-title/components';

export const PropertyTitleCard = () => {
  const theme = themes.dark;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <TitleCard
        title="The Rosa Blanca"
        subtitle="4 Bed • 4.5 Bath • 4,100 SF"
        accentText="Scottsdale, Arizona"
        color={theme.colors.text}
        backgroundColor={theme.colors.background}
      />
    </AbsoluteFill>
  );
};
```

## Content Guidelines

### Title
- Keep concise (2-4 words ideal)
- Use property name or project title
- Capitalize properly (Title Case)

### Subtitle
- Property details, location, or category
- Keep short (one line)
- Will be displayed in uppercase automatically

### Accent Text
- Optional emotional hook or tagline
- Uses italic styling for emphasis
- Can include brand messages:
  ```tsx
  accentText="Where design meets discipline"
  accentText="Intentional architecture"
  accentText="Your space, refined"
  ```

## Decorative Line

A subtle horizontal line separates title from subtitle:
- Color: Taupe (#C7BEB4)
- Width: Animates from 0 to 80px
- Height: 1px
- Timing: Grows during frames 10-40

## Themed Title Cards

### Dark Theme (Primary)
```tsx
<TitleCard
  title="The Rosa Blanca"
  color={themes.dark.colors.text}
  backgroundColor={themes.dark.colors.background}
/>
```

### Light Theme
```tsx
<TitleCard
  title="The Rosa Blanca"
  color={themes.light.colors.text}
  backgroundColor={themes.light.colors.background}
/>
```

## Duration Recommendations

- **Title card display:** 75-90 frames (2.5-3 seconds)
- **Hold before transition:** 15-30 frames
- **Total with transition:** 90-120 frames
