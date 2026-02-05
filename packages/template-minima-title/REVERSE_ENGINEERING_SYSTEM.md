# Video Reverse Engineering System

## Overview

A system for Claude Code to analyze professional animations frame-by-frame, persist analysis across sessions, and generate Remotion code that recreates the techniques.

---

## Architecture

```
video-analysis/
├── input/
│   └── reference-video.mp4           # Video to analyze
│
├── frames/
│   ├── keyframes/                    # Sampled frames (every Nth frame)
│   │   ├── frame_0000.png
│   │   ├── frame_0010.png
│   │   └── ...
│   └── transitions/                  # Frames around key transitions
│
├── analysis/
│   ├── manifest.json                 # Analysis progress & metadata
│   ├── batch_001.json                # Frames 0-30 analysis
│   ├── batch_002.json                # Frames 30-60 analysis
│   └── ...
│
├── synthesis/
│   ├── timeline.json                 # Reconstructed animation timeline
│   ├── techniques.md                 # Identified animation techniques
│   └── motion-graph.json             # Motion/easing curves extracted
│
└── output/
    └── generated-composition.tsx     # Final Remotion code
```

---

## Phase 1: Frame Extraction Pipeline

### Extract Keyframes (ffmpeg)

```bash
# Extract every 5th frame (for 30fps video = 6 samples/second)
ffmpeg -i input/reference-video.mp4 -vf "select=not(mod(n\,5))" -vsync vfr frames/keyframes/frame_%04d.png

# Extract at specific timestamps (for transition analysis)
ffmpeg -i input/reference-video.mp4 -ss 00:00:02.000 -vframes 1 frames/transitions/transition_01.png
```

### Smart Sampling Strategy

For a 10-second video at 30fps (300 frames):
- **Keyframes**: Every 5th frame = 60 frames
- **Transition zones**: Extra frames around detected changes
- **Total to analyze**: ~80-100 frames instead of 300

---

## Phase 2: Chunked Analysis (Context Management)

### Manifest File (`analysis/manifest.json`)

```json
{
  "video": {
    "source": "reference-video.mp4",
    "duration": 10.5,
    "fps": 30,
    "totalFrames": 315,
    "resolution": [1920, 1080]
  },
  "extraction": {
    "method": "keyframe_interval",
    "interval": 5,
    "extractedFrames": 63
  },
  "analysis": {
    "status": "in_progress",
    "currentBatch": 3,
    "totalBatches": 7,
    "completedBatches": [1, 2],
    "framesPerBatch": 10
  },
  "lastUpdated": "2025-02-05T12:30:00Z",
  "resumeInstructions": "Continue with batch 3, frames 20-29"
}
```

### Batch Analysis Format (`analysis/batch_001.json`)

```json
{
  "batchId": 1,
  "frameRange": [0, 9],
  "analyzedAt": "2025-02-05T12:00:00Z",
  "frames": [
    {
      "frameNumber": 0,
      "timestamp": 0.0,
      "file": "frames/keyframes/frame_0000.png",
      "analysis": {
        "visibleElements": ["black background"],
        "textContent": null,
        "motionFromPrevious": null,
        "estimatedPhase": "pre-animation"
      }
    },
    {
      "frameNumber": 5,
      "timestamp": 0.167,
      "file": "frames/keyframes/frame_0005.png",
      "analysis": {
        "visibleElements": ["black background", "letter M partially visible"],
        "textContent": "M (partial)",
        "motionFromPrevious": {
          "type": "slideUp",
          "progress": 0.3,
          "estimatedEasing": "ease-out"
        },
        "estimatedPhase": "logo-animation-start"
      }
    }
  ],
  "batchSummary": {
    "phase": "Logo entrance begins",
    "dominantTechnique": "staggered letter reveal",
    "colorPalette": ["#000000", "#FFFFFF"],
    "typography": {
      "font": "sans-serif, geometric",
      "weight": "light to medium",
      "tracking": "wide"
    }
  }
}
```

---

## Phase 3: Analysis Workflow

### Session Start Protocol

```
1. Check manifest.json for status
2. If status = "in_progress":
   - Read completedBatches
   - Load last batch summary for context
   - Resume from currentBatch
3. If status = "complete":
   - Proceed to synthesis phase
```

### Single Batch Analysis (Claude's Process)

```
For batch N (frames X to Y):

1. Load frames X through Y (10 images max)
2. Analyze each frame:
   - What elements are visible?
   - What changed from previous frame?
   - Estimate motion type (slide, scale, fade, rotate)
   - Estimate easing (linear, ease-in, ease-out, spring)
   - Identify color values
3. Summarize batch:
   - What animation phase is this?
   - What technique is being used?
4. Write batch_N.json
5. Update manifest.json (increment currentBatch)
6. If more batches: continue or pause for next session
```

### Context Preservation Between Sessions

Each batch file contains:
- Raw observations (frame-by-frame)
- Batch summary (synthesized understanding)
- Link to previous batch findings

At session start, Claude reads:
- manifest.json (where we are)
- Previous 2 batch summaries (context)
- Does NOT need to re-read all frames

---

## Phase 4: Synthesis

### Timeline Reconstruction (`synthesis/timeline.json`)

```json
{
  "totalDuration": 315,
  "fps": 30,
  "scenes": [
    {
      "name": "logo-entrance",
      "startFrame": 0,
      "endFrame": 90,
      "duration": 3.0,
      "elements": [
        {
          "type": "letter",
          "content": "M",
          "animation": {
            "property": "translateY",
            "from": 50,
            "to": 0,
            "startFrame": 10,
            "endFrame": 30,
            "easing": "cubic-bezier(0.33, 1, 0.68, 1)"
          }
        }
      ]
    }
  ]
}
```

### Technique Documentation (`synthesis/techniques.md`)

```markdown
# Identified Animation Techniques

## 1. Staggered Letter Reveal
- **Frames**: 10-60
- **Description**: Each letter enters with slideUp, 4-frame stagger
- **Easing**: Smooth deceleration (ease-out)
- **Remotion equivalent**:
  - `interpolate()` with per-letter delay
  - `Easing.bezier(0.33, 1, 0.68, 1)`

## 2. Fade Transition
- **Frames**: 85-95
- **Description**: Cross-dissolve from title to video
- **Remotion equivalent**:
  - `interpolate(frame, [85, 95], [1, 0])` for outgoing
  - `interpolate(frame, [85, 95], [0, 1])` for incoming
```

---

## Phase 5: Code Generation

### From Timeline to Remotion

```typescript
// Auto-generated from synthesis/timeline.json

export const ReconstructedAnimation: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: Logo Entrance (frames 0-90)
  // Technique: Staggered letter reveal
  const letters = 'MINIMA'.split('');
  const staggerDelay = 4;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <div style={{ display: 'flex' }}>
        {letters.map((letter, i) => {
          const letterStart = 10 + (i * staggerDelay);
          const progress = interpolate(
            frame,
            [letterStart, letterStart + 20],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const y = interpolate(progress, [0, 1], [50, 0], {
            easing: Easing.bezier(0.33, 1, 0.68, 1),
          });
          const opacity = interpolate(progress, [0, 1], [0, 1]);

          return (
            <span
              key={i}
              style={{
                transform: `translateY(${y}px)`,
                opacity,
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

---

## Usage Commands

### 1. Initialize Analysis

```bash
# Create directory structure
mkdir -p video-analysis/{input,frames/keyframes,frames/transitions,analysis,synthesis,output}

# Add your reference video
cp ~/Downloads/reference-animation.mp4 video-analysis/input/
```

### 2. Extract Frames

```bash
# Extract keyframes
ffmpeg -i video-analysis/input/reference-animation.mp4 \
  -vf "select=not(mod(n\,5))" -vsync vfr \
  video-analysis/frames/keyframes/frame_%04d.png
```

### 3. Start Analysis Session

Tell Claude:
```
"Analyze the video in video-analysis/. Start from the manifest or create one if new."
```

### 4. Resume Analysis

Tell Claude:
```
"Continue video analysis from where we left off."
```

### 5. Generate Code

Tell Claude:
```
"Synthesis is complete. Generate Remotion code from the timeline."
```

---

## Context Budget

| Operation | Images | Text | Fits in Context? |
|-----------|--------|------|------------------|
| Single batch (10 frames) | 10 | ~2KB JSON | ✅ Yes |
| Resume (2 batch summaries) | 0 | ~4KB | ✅ Yes |
| Full synthesis | 0 | ~20KB | ✅ Yes |
| All frames at once | 60+ | - | ❌ No |

The chunked approach keeps each operation well within context limits.

---

## Benefits

1. **Learn from professionals**: Analyze Apple, Nike, luxury brand animations
2. **Persistent knowledge**: Analysis files survive between sessions
3. **Reproducible**: Same video = same analysis = same code
4. **Evolvable**: Improve analysis techniques over time
5. **Library building**: Build a library of analyzed techniques
