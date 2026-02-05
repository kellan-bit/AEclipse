# Minima Title Template

Animated logo and title card sequence for Minima video content.

## Quick Start

```bash
# Install dependencies
npm install

# Start Remotion Studio
npm run dev

# Render video
npm run render -- --composition=MinimaTitle --output=output.mp4
```

## Sequence Structure

```
┌─────────────┐     ┌─────────────────────┐     ┌─────────────┐
│   MINIMA™   │     │   The Rosa Blanca   │     │             │
│             │ ──▶ │   A Minima Residence│ ──▶ │  ▶ VIDEO    │
│  DESIGN •   │     │   "Where design..." │     │             │
│  BUILD •    │     │                     │     │             │
│  DEVELOP    │     │                     │     │             │
└─────────────┘     └─────────────────────┘     └─────────────┘
   0s - 3s              3s - 5.5s               5.5s - 6.5s
  Logo Scene          Title Card Scene          Transition
```

## Adding Your Video

### Step 1: Add video to public folder

```
template-minima-title/
├── public/
│   └── my-property-video.mp4   ← Place your video here
└── src/
```

### Step 2: Update Root.tsx

```tsx
import { staticFile } from 'remotion';

const defaultTitleProps = {
  title: 'Your Property Name',
  subtitle: 'Your Subtitle',
  videoSrc: staticFile('my-property-video.mp4'),  // ← Add this
  // ...
};
```

### Step 3: Preview and Render

```bash
npm run dev      # Preview in browser
npm run render   # Export to MP4
```

## Available Compositions

| ID | Size | Use Case |
|----|------|----------|
| `MinimaTitle` | 1920×1080 | YouTube, standard video |
| `MinimaTitleVertical` | 1080×1920 | TikTok, Instagram Reels |
| `MinimaTitleSquare` | 1080×1080 | Instagram Feed |
| `MinimaLogo` | 1920×1080 | Logo animation only |
| `MinimaTitleCard` | 1920×1080 | Title card only |

## Customization

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | - | Main title text |
| `subtitle` | string | - | Subtitle (uppercase) |
| `accentText` | string | - | Italic accent text |
| `videoSrc` | string | - | Path to video file |
| `imageSrc` | string | - | Path to image (if no video) |
| `theme` | string | `'dark'` | `'dark'` \| `'light'` \| `'contrast'` \| `'warm'` |
| `transitionType` | string | `'fade'` | See transition types below |
| `logoFontSize` | number | `120` | Logo size in pixels |
| `logoDuration` | number | `90` | Logo scene frames |
| `titleCardDuration` | number | `75` | Title card frames |
| `transitionDuration` | number | `30` | Transition frames |

### Transition Types

- `fade` - Simple crossfade
- `fadeToBlack` - Fade to black, then reveal video
- `scaleReveal` - Scale up to reveal video underneath
- `slideUp` - Title slides up to reveal video
- `maskWipe` - Horizontal mask wipe
- `zoomThrough` - Zoom into center, revealing video

### Themes

- `dark` - Black background, white text (default)
- `light` - Cream background, black text
- `contrast` - High contrast black/white
- `warm` - Soft warm gray tones

## Letter Animations

The MINIMA wordmark uses unique animations per letter:

| Letter | Animation | Effect |
|--------|-----------|--------|
| M | `slideUp` | Rises from below |
| I | `fadeScale` | Scales with fade |
| N | `maskReveal` | Horizontal reveal |
| I | `scaleRotate` | Scales with rotation |
| M | `slideUp` | Mirrors first M |
| A | `bounceIn` | Gentle bounce |

## Render Commands

```bash
# Standard 1080p
npm run render -- --composition=MinimaTitle --output=video.mp4

# Vertical for TikTok
npm run render -- --composition=MinimaTitleVertical --output=tiktok.mp4

# Square for Instagram
npm run render -- --composition=MinimaTitleSquare --output=instagram.mp4

# High quality (ProRes)
npm run render -- --composition=MinimaTitle --codec=prores --output=video.mov
```

## Brand Package

This template uses `@minima/brand` for consistent styling:

```tsx
import { colors, fonts, themes, durations, easings } from '@minima/brand';
```

See the brand package for available colors, fonts, and animation presets.
