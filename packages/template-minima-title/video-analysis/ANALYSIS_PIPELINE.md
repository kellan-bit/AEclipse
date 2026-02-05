# Video Reverse-Engineering Pipeline

## Overview

This pipeline extracts all visual, motion, and timing information from a source video to recreate it as a Remotion template with near 1:1 accuracy.

## Input Specifications

- **Duration**: 40 seconds
- **Frame Rate**: 30 fps
- **Total Frames**: 1,200 frames

## Pipeline Stages

### Stage 1: Frame Extraction

Extract frames at multiple granularities:

```
input/source-video.mp4
    ↓
frames/
├── all/           # Every frame (1,200 images) - for motion analysis
├── keyframes/     # Every 30 frames (40 images) - for scene analysis
├── transitions/   # Detected transition frames
└── scenes/        # First frame of each scene
```

**Commands:**
```bash
# Extract all frames
ffmpeg -i input/source-video.mp4 -vf "fps=30" frames/all/frame_%04d.png

# Extract keyframes (1 per second)
ffmpeg -i input/source-video.mp4 -vf "fps=1" frames/keyframes/keyframe_%04d.png

# Extract with timestamps
ffmpeg -i input/source-video.mp4 -vf "fps=30,drawtext=text='%{pts\:hms}':x=10:y=10:fontsize=24:fontcolor=white" frames/timestamped/frame_%04d.png
```

### Stage 2: Scene Detection

Identify scene boundaries using frame difference analysis:

1. **Color histogram comparison** between consecutive frames
2. **Structural similarity index (SSIM)** for detecting cuts
3. **Optical flow magnitude** for detecting transitions

**Output:** `analysis/scenes.json`
```json
{
  "scenes": [
    {
      "id": 1,
      "startFrame": 0,
      "endFrame": 89,
      "startTime": "00:00:00",
      "endTime": "00:02:29",
      "durationFrames": 90,
      "durationSeconds": 3.0,
      "transitionIn": "cut",
      "transitionOut": "fade",
      "transitionDuration": 15
    }
  ]
}
```

### Stage 3: Visual Analysis (Per Scene)

For each scene, analyze:

#### 3.1 Color Palette
- Dominant colors (top 5)
- Background color
- Text/foreground colors
- Accent colors

#### 3.2 Typography
- Font identification (visual matching)
- Font sizes (relative to frame)
- Font weights
- Text positions (grid coordinates)
- Letter spacing, line height

#### 3.3 Layout & Composition
- Grid structure (columns, rows)
- Element positions (x, y, width, height)
- Margins and padding
- Alignment (center, left, right)
- Visual hierarchy

#### 3.4 Assets
- Logo detection and extraction
- Image/video backgrounds
- Overlays and effects

**Output:** `analysis/scenes/{scene_id}/visual.json`

### Stage 4: Motion & Animation Analysis

Compare consecutive frames to detect:

#### 4.1 Animation Types
- **Fade**: Opacity changes
- **Scale**: Size changes
- **Position**: Movement (translate)
- **Rotation**: Angular changes
- **Mask/Reveal**: Progressive reveal

#### 4.2 Timing Curves
- Linear
- Ease-in (slow start)
- Ease-out (slow end)
- Ease-in-out
- Custom bezier curves

#### 4.3 Animation Sequencing
- Which elements animate first
- Stagger delays between elements
- Overlap timing

**Analysis Method:**
```
Frame N vs Frame N+1:
├── Calculate pixel differences
├── Detect moving regions
├── Track element positions
├── Measure opacity changes
└── Estimate easing curve
```

**Output:** `analysis/scenes/{scene_id}/motion.json`
```json
{
  "animations": [
    {
      "element": "title",
      "property": "opacity",
      "startFrame": 0,
      "endFrame": 15,
      "startValue": 0,
      "endValue": 1,
      "easing": "easeOut",
      "easingParams": [0.0, 0.0, 0.58, 1.0]
    },
    {
      "element": "title",
      "property": "translateY",
      "startFrame": 0,
      "endFrame": 20,
      "startValue": 30,
      "endValue": 0,
      "easing": "easeOut"
    }
  ]
}
```

### Stage 5: Text Content Extraction

Use OCR to extract all text:
- Titles
- Subtitles
- Captions
- Dates/numbers
- Branding text

**Output:** `analysis/text.json`

### Stage 6: Asset Identification & Extraction

**Critical**: Videos often contain photos, graphics, logos, and video clips that animate. I can identify these but cannot extract them - you must provide source files.

#### 6.1 Asset Detection (Claude identifies)

When analyzing frames, I will flag:
- **Photos**: Property images, headshots, product shots
- **Graphics**: Icons, illustrations, shapes
- **Logos**: Brand marks, watermarks
- **Video clips**: Footage playing within the composition
- **Textures**: Backgrounds, overlays, grain

#### 6.2 Asset Manifest

**Output:** `analysis/assets_required.json`
```json
{
  "assets": [
    {
      "id": "asset_001",
      "type": "photo",
      "description": "Exterior shot of modern white house, wide angle",
      "appearsInScenes": [2, 3],
      "firstAppearance": {
        "frame": 120,
        "timestamp": "00:04:00"
      },
      "animationApplied": ["scale", "position"],
      "aspectRatio": "16:9",
      "suggestedFilename": "house-exterior.jpg",
      "status": "needed",
      "providedPath": null
    },
    {
      "id": "asset_002",
      "type": "logo",
      "description": "Company logo, white on transparent",
      "appearsInScenes": [1, 5],
      "suggestedFilename": "logo-white.png",
      "status": "needed"
    }
  ],
  "assetSummary": {
    "photos": 5,
    "logos": 1,
    "videoClips": 2,
    "graphics": 3,
    "total": 11
  }
}
```

#### 6.3 Asset Resolution Workflow

```
┌─────────────────────────────────────────────────┐
│  Claude identifies asset in frame               │
│  "Photo of modern house, appears at 4s"         │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│  Add to assets_required.json                    │
│  status: "needed"                               │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│  USER provides original asset                   │
│  Drag into Remotion Studio or public/assets/   │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│  Update manifest: providedPath, status: "ready" │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│  Claude references asset in template            │
│  staticFile('assets/house-exterior.jpg')        │
└─────────────────────────────────────────────────┘
```

#### 6.4 Frame Extraction for Similar Assets

If you don't have the original asset, ffmpeg can extract the cleanest frame:

```bash
# Extract specific frame as asset (not ideal but works)
ffmpeg -i input/source-video.mp4 -vf "select=eq(n\,120)" -vframes 1 assets/extracted_frame_120.png

# Extract at specific timestamp
ffmpeg -ss 00:00:04 -i input/source-video.mp4 -vframes 1 assets/house_at_4s.png
```

**Note**: Extracted frames may have animation applied (scale, position, blur). Original assets are always better.

#### 6.5 Asset Analysis Prompt

When analyzing frames with embedded images:
```
I see this frame contains a photo/image. Please describe:

1. ASSET TYPE
   - [ ] Photo (real photograph)
   - [ ] Illustration/graphic
   - [ ] Logo/brand mark
   - [ ] Video clip (multiple frames of motion)
   - [ ] Texture/pattern

2. DESCRIPTION
   - Subject: [what is it showing]
   - Style: [photography style, color treatment]
   - Aspect ratio: [estimated]
   - Quality: [resolution appears high/low]

3. ANIMATION APPLIED TO ASSET
   - Scale: [zooming in/out, Ken Burns effect]
   - Position: [panning, sliding]
   - Opacity: [fading]
   - Mask/crop: [reveal animation, shape mask]
   - Filter: [blur, color grade applied]

4. TIMING
   - First appears: frame [X]
   - Animation duration: [X] frames
   - Fully visible: frames [X] to [Y]

5. SUGGESTED SOURCE
   - Filename: [descriptive-name.jpg]
   - Resolution needed: [minimum WxH]
   - Format: [jpg/png/mp4]
```

### Stage 7: Audio Analysis (if applicable)

- Beat detection
- Music timing markers
- Audio waveform peaks
- Sync points with visuals

### Stage 7: Template Synthesis

Convert analysis into Remotion code:

```
analysis/
├── scenes.json
├── text.json
├── audio.json
└── scenes/
    ├── 1/
    │   ├── visual.json
    │   ├── motion.json
    │   └── thumbnail.png
    └── 2/
        └── ...

    ↓ SYNTHESIS ↓

src/
├── Root.tsx           # Composition definitions
├── ReplicatedVideo.tsx # Main component
├── scenes/
│   ├── Scene1.tsx
│   ├── Scene2.tsx
│   └── ...
├── components/
│   ├── AnimatedText.tsx
│   └── ...
└── styles/
    └── theme.ts       # Extracted colors/typography
```

### Stage 8: Validation & Comparison

Render the Remotion template and compare:

1. **Frame-by-frame diff** - Visual comparison
2. **SSIM score** - Structural similarity
3. **Color accuracy** - Delta-E color difference
4. **Timing accuracy** - Animation sync check

**Output:** `validation/report.json`

## Stage 2.5: Claude Image Analysis (CRITICAL)

**Claude is multimodal** - I can directly view and analyze PNG frames using the Read tool.

### How It Works

1. You provide frame paths (from `frames/keyframes/` or `frames/all/`)
2. I read the image files directly (Read tool supports PNG/JPG)
3. I visually analyze colors, typography, layout, animations
4. I output structured JSON analysis

### Analysis Workflow

```bash
# Helper script to prepare batches
./scripts/prepare-analysis-batch.sh

# Or manually provide paths:
# "Claude, read and analyze these frames:"
# /path/to/frames/keyframes/keyframe_0001.png
# /path/to/frames/keyframes/keyframe_0002.png
# ...
```

### What I Extract From Each Frame

| Visual Element | What I Identify |
|----------------|-----------------|
| **Colors** | Exact hex values for background, text, accents |
| **Typography** | Font family (or closest match), size, weight, spacing |
| **Layout** | Element positions as percentages, alignment, margins |
| **Text** | All visible text content, verbatim |
| **Effects** | Shadows, gradients, overlays, blur |
| **Animation State** | If comparing frames: what's moving, direction, progress |

### Recommended Batch Sizes

| Analysis Type | Frames to Send | Purpose |
|---------------|----------------|---------|
| Overview | All keyframes (40 for 40s video) | Scene structure |
| Scene Deep Dive | 3-5 frames from one scene | Detailed design |
| Motion Analysis | 10-15 consecutive frames | Animation timing |
| Transition | 20 frames around cut point | Transition type/duration |

## Claude Analysis Protocol

For each extracted frame, Claude should analyze:

### Frame Analysis Prompt Template
```
Analyze this video frame and extract:

1. LAYOUT
   - Overall composition (centered, rule-of-thirds, etc.)
   - Grid structure if visible
   - Element positions as percentages

2. COLORS
   - Background color (hex)
   - Primary text color (hex)
   - Accent colors (hex)
   - Any gradients or overlays

3. TYPOGRAPHY
   - Fonts used (identify or describe)
   - Font sizes (small/medium/large/xlarge)
   - Font weights (light/regular/medium/bold)
   - Text alignment
   - Letter spacing (tight/normal/wide)

4. TEXT CONTENT
   - All visible text, verbatim
   - Text hierarchy (heading, subheading, body)

5. VISUAL EFFECTS
   - Shadows, glows, blurs
   - Overlays, masks
   - Texture or grain

6. ANIMATION HINTS (if comparing to previous frame)
   - What elements are animating
   - Direction of motion
   - Estimated progress (0-100%)
```

### Motion Analysis (Frame Pairs)
```
Compare these two consecutive frames and identify:

1. CHANGED ELEMENTS
   - What moved, faded, scaled, or rotated

2. MOTION VECTORS
   - Direction and magnitude of movement
   - For each moving element

3. OPACITY CHANGES
   - Elements fading in or out
   - Current opacity estimate

4. TIMING ESTIMATE
   - Is this early, middle, or late in the animation?
   - Estimated easing (linear, ease-in, ease-out)
```

## Implementation Files

```
video-analysis/
├── ANALYSIS_PIPELINE.md    # This document
├── input/                   # Place source video here
│   └── source-video.mp4
├── frames/
│   ├── all/                # All 1,200 frames
│   ├── keyframes/          # 1 per second (40 frames)
│   ├── transitions/        # Detected transitions
│   └── scenes/             # First frame per scene
├── analysis/
│   ├── scenes.json         # Scene boundaries
│   ├── text.json           # Extracted text
│   ├── audio.json          # Audio markers
│   ├── summary.json        # Overall video summary
│   └── scenes/
│       └── {id}/
│           ├── visual.json
│           ├── motion.json
│           └── thumbnail.png
├── synthesis/
│   ├── template.json       # Generated template config
│   └── components/         # Generated component specs
├── output/
│   └── rendered/           # Rendered Remotion output
└── validation/
    ├── comparison/         # Side-by-side frames
    ├── diff/               # Difference images
    └── report.json         # Accuracy metrics
```

## Workflow Commands

```bash
# 1. Place video in input folder
cp ~/my-video.mp4 video-analysis/input/source-video.mp4

# 2. Extract all frames
./scripts/extract-frames.sh

# 3. Prepare frame batches for Claude
./scripts/prepare-analysis-batch.sh

# 4. Claude image analysis (INTERACTIVE)
#    Tell Claude: "Read and analyze these frames: [paste paths]"
#    Claude views the PNGs and extracts:
#      - Scene structure
#      - Colors (hex values)
#      - Typography (fonts, sizes)
#      - Layouts (positions, alignment)
#      - Animations (by comparing consecutive frames)
#    Save output to analysis/scenes.json

# 5. Synthesize template
#    Claude generates Remotion components from analysis JSON
#    Output: src/Root.tsx, src/scenes/*.tsx, src/styles/theme.ts

# 6. Render
bun run build
npx remotion render ReplicatedVideo output/rendered/output.mp4

# 7. Compare and validate
./scripts/compare-videos.sh
```

### Example Claude Analysis Request

```
Read and analyze these keyframes to identify the video structure:

/home/user/AEclipse/packages/template-minima-title/video-analysis/frames/keyframes/keyframe_0001.png
/home/user/AEclipse/packages/template-minima-title/video-analysis/frames/keyframes/keyframe_0002.png
/home/user/AEclipse/packages/template-minima-title/video-analysis/frames/keyframes/keyframe_0003.png
...

Extract:
1. How many distinct scenes are there?
2. What are the dominant colors (hex)?
3. What typography is used?
4. Where do transitions occur?

Output as JSON matching analysis/scenes_template.json format.
```

## Success Metrics

| Metric | Target |
|--------|--------|
| Scene detection accuracy | 100% |
| Color matching (Delta-E) | < 3.0 |
| Typography match | 95%+ visual similarity |
| Animation timing | ±2 frames |
| Overall SSIM | > 0.95 |
| Text content accuracy | 100% |
