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

## Phase 6: Validation & Comparison (The Real Test)

The analysis is only as good as its reproduction. This phase renders the generated code and compares it frame-by-frame with the original.

### Directory Structure

```
video-analysis/
├── validation/
│   ├── rendered/                     # Frames from our generated code
│   │   ├── frame_0000.png
│   │   ├── frame_0005.png
│   │   └── ...
│   ├── comparison/                   # Side-by-side comparisons
│   │   ├── compare_0000.png          # Original | Generated
│   │   └── ...
│   ├── diff/                         # Visual difference maps
│   │   ├── diff_0000.png
│   │   └── ...
│   └── failures.json                 # Documented failures
```

### Step 1: Render Generated Animation

```bash
# Render the generated composition to frames
cd packages/template-minima-title
npx remotion render output/ReconstructedAnimation.tsx \
  --frames=0-60 \
  --image-format=png \
  --output=video-analysis/validation/rendered/frame_%04d.png
```

Or render to video for quick review:
```bash
npx remotion render output/ReconstructedAnimation.tsx \
  --output=video-analysis/validation/rendered.mp4
```

### Step 2: Generate Side-by-Side Comparisons

```bash
# Create comparison images (original left, generated right)
cd video-analysis
for i in frames/keyframes/frame_*.png; do
  num=$(basename "$i" | grep -o '[0-9]*')
  ffmpeg -i "frames/keyframes/frame_${num}.png" \
         -i "validation/rendered/frame_${num}.png" \
         -filter_complex hstack \
         "validation/comparison/compare_${num}.png" -y
done
```

### Step 3: Generate Difference Maps

```bash
# Create visual diff (white = match, color = difference)
for i in frames/keyframes/frame_*.png; do
  num=$(basename "$i" | grep -o '[0-9]*')
  ffmpeg -i "frames/keyframes/frame_${num}.png" \
         -i "validation/rendered/frame_${num}.png" \
         -filter_complex "blend=difference" \
         "validation/diff/diff_${num}.png" -y
done
```

### Step 4: Document Failures (`validation/failures.json`)

```json
{
  "validationRun": "2025-02-05T14:00:00Z",
  "overallScore": 0.72,
  "failures": [
    {
      "frameRange": [10, 25],
      "severity": "high",
      "category": "timing",
      "description": "Letter 'M' animation starts 3 frames too early",
      "original": { "startFrame": 13 },
      "generated": { "startFrame": 10 },
      "fix": "Adjust letterStart from 10 to 13 in generated code"
    },
    {
      "frameRange": [30, 45],
      "severity": "medium",
      "category": "easing",
      "description": "Easing curve too aggressive - letters decelerate faster in original",
      "original": { "easing": "unknown - appears custom" },
      "generated": { "easing": "cubic-bezier(0.33, 1, 0.68, 1)" },
      "fix": "Try cubic-bezier(0.22, 1, 0.36, 1) for gentler deceleration"
    },
    {
      "frameRange": [50, 60],
      "severity": "low",
      "category": "color",
      "description": "Background slightly warmer in original",
      "original": { "background": "#0a0a0a" },
      "generated": { "background": "#000000" },
      "fix": "Update backgroundColor to #0a0a0a"
    }
  ],
  "successes": [
    {
      "aspect": "letter-order",
      "description": "Stagger sequence correctly identified (M-I-N-I-M-A)"
    },
    {
      "aspect": "animation-type",
      "description": "slideUp correctly identified as primary animation"
    }
  ]
}
```

### Step 5: Iterate Based on Failures

Claude reads `failures.json` and:
1. Applies fixes to generated code
2. Re-renders validation frames
3. Re-compares
4. Updates failures.json with new results
5. Repeats until score > 0.9 or no more improvements possible

### Validation Workflow Commands

```bash
# Full validation pipeline
./validate.sh

# Or step by step:
./render-generated.sh        # Render our code to frames
./compare-frames.sh          # Generate side-by-sides
./generate-diff.sh           # Create difference maps
```

Then tell Claude:
```
"Review validation results and document failures"
```

### Scoring Criteria

| Aspect | Weight | Measurement |
|--------|--------|-------------|
| Timing accuracy | 30% | Frame-accurate start/end |
| Easing match | 25% | Motion curve similarity |
| Position accuracy | 20% | Pixel position delta |
| Color accuracy | 15% | Color value delta |
| Element presence | 10% | All elements appear |

### Iteration Log (`validation/iterations.json`)

```json
{
  "iterations": [
    {
      "iteration": 1,
      "date": "2025-02-05T14:00:00Z",
      "score": 0.72,
      "failureCount": 3,
      "changes": "Initial generation from analysis"
    },
    {
      "iteration": 2,
      "date": "2025-02-05T14:30:00Z",
      "score": 0.85,
      "failureCount": 1,
      "changes": "Fixed timing offset, adjusted easing curve"
    },
    {
      "iteration": 3,
      "date": "2025-02-05T15:00:00Z",
      "score": 0.94,
      "failureCount": 0,
      "changes": "Adjusted background color"
    }
  ]
}
```

---

## Phase 7: Pattern Extraction

Once validation passes (score > 0.9), extract the learned pattern into the pattern library:

```json
// Add to packages/minima-patterns/learned/letter-animations.json
{
  "reverse-engineered-nike-logo-v1": {
    "source": "video-analysis/nike-logo-animation",
    "generation": 1,
    "confidence": 0.94,
    "rationale": "Reverse-engineered from Nike brand video. Validated with 94% accuracy.",
    "letters": {
      "all": {
        "animation": "slideUp",
        "duration": 18,
        "easing": "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    },
    "staggerDelay": 3,
    "validationScore": 0.94
  }
}
```

---

## Complete Workflow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│  1. INPUT                                                        │
│     Drop reference video into input/                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. EXTRACT                                                      │
│     ./extract-frames.sh input/video.mp4                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. ANALYZE (batched, resumable)                                 │
│     "Analyze the video" → batch_001.json, batch_002.json...     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. SYNTHESIZE                                                   │
│     Combine batches → timeline.json, techniques.md              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. GENERATE                                                     │
│     timeline.json → ReconstructedAnimation.tsx                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. VALIDATE                                                     │
│     Render → Compare → Diff → Document failures                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            Score < 0.9?          Score ≥ 0.9?
                    │                   │
                    ▼                   ▼
┌───────────────────────┐   ┌───────────────────────────────────┐
│  7. ITERATE            │   │  8. EXTRACT PATTERN                │
│  Fix failures          │   │  Add to pattern library            │
│  Re-render             │   │  Available for future generations  │
│  Re-compare            │   └───────────────────────────────────┘
└───────────────────────┘
          │
          └──────────► Back to VALIDATE
```

---

## Benefits

1. **Learn from professionals**: Analyze Apple, Nike, luxury brand animations
2. **Persistent knowledge**: Analysis files survive between sessions
3. **Reproducible**: Same video = same analysis = same code
4. **Evolvable**: Improve analysis techniques over time
5. **Library building**: Build a library of analyzed techniques
6. **Validated learning**: Every pattern is tested before it's trusted
7. **Failure documentation**: Know exactly where and why things fail
8. **Iterative improvement**: Systematic approach to closing gaps
