# Frame-by-Frame Analysis Plan

## Overview

946 frames at 30fps = 31.5 seconds of video. Too much for one context window.

**Solution**: Batch processing with persistent state files that survive across sessions.

---

## Architecture

```
video-analysis/
├── analysis/
│   ├── state.json              # Current progress, resumable
│   ├── frames/                 # Per-frame analysis
│   │   ├── frame_0001.json
│   │   ├── frame_0002.json
│   │   └── ...
│   ├── segments/               # Grouped findings
│   │   ├── segment_001_news.json
│   │   ├── segment_002_testimonials.json
│   │   └── ...
│   ├── animations/             # Detected animation patterns
│   │   ├── animation_001.json
│   │   └── ...
│   └── synthesis/              # Final template specs
│       └── template_spec.json
```

---

## Phase 1: Segment Identification (1 session)

**Goal**: Identify major segments/scenes without analyzing every frame.

**Method**: Sample every 30th frame (1 per second) to find scene boundaries.

**Output**: `segments/boundaries.json`
```json
{
  "segments": [
    { "id": 1, "name": "news_headlines", "startFrame": 1, "endFrame": 120 },
    { "id": 2, "name": "testimonials", "startFrame": 121, "endFrame": 600 },
    { "id": 3, "name": "mars_feature", "startFrame": 601, "endFrame": 660 },
    { "id": 4, "name": "opus_intro", "startFrame": 661, "endFrame": 750 },
    { "id": 5, "name": "quote_carousel", "startFrame": 751, "endFrame": 900 },
    { "id": 6, "name": "end_card", "startFrame": 901, "endFrame": 946 }
  ]
}
```

---

## Phase 2: Transition Detection (1-2 sessions)

**Goal**: Find exact frames where animations happen.

**Method**: For each segment, compare consecutive frames to detect:
- Opacity changes > 10%
- Position shifts > 5px
- New elements appearing
- Elements disappearing

**Process**:
1. Read frames N and N+1
2. Describe differences
3. If significant change detected, log to `transitions.json`

**Output**: `animations/transitions.json`
```json
{
  "transitions": [
    {
      "id": 1,
      "startFrame": 751,
      "endFrame": 763,
      "type": "text_swap",
      "element": "quote_box",
      "description": "Quote fades out over 12 frames",
      "properties": {
        "opacity": { "from": 1, "to": 0 },
        "duration": 12
      }
    }
  ]
}
```

---

## Phase 3: Deep Animation Analysis (3-5 sessions)

**Goal**: Extract exact animation curves for each transition.

**Method**: For each detected transition:
1. Read every frame in the transition range
2. Measure property values at each frame
3. Plot the curve
4. Identify easing function

**Output**: `animations/animation_001.json`
```json
{
  "id": 1,
  "name": "quote_fade_out",
  "frames": {
    "751": { "opacity": 1.0 },
    "752": { "opacity": 0.95 },
    "753": { "opacity": 0.87 },
    "754": { "opacity": 0.76 },
    "...": "..."
  },
  "curve": "easeInOut",
  "bezier": [0.42, 0, 0.58, 1],
  "remotionCode": "interpolate(frame, [751, 763], [1, 0], { easing: Easing.inOut(Easing.ease) })"
}
```

---

## Phase 4: Template Synthesis (1-2 sessions)

**Goal**: Convert all analysis into working Remotion code.

**Input**: All JSON files from previous phases
**Output**: Complete component files

---

## State Management

### state.json (Tracks Progress)
```json
{
  "version": "1.0",
  "totalFrames": 946,
  "currentPhase": "transition_detection",
  "progress": {
    "phase1_segments": "complete",
    "phase2_transitions": {
      "status": "in_progress",
      "currentSegment": 5,
      "currentFrame": 780,
      "lastAnalyzed": "2024-02-05T20:30:00Z"
    },
    "phase3_deep_analysis": "pending",
    "phase4_synthesis": "pending"
  },
  "resumeInstructions": "Continue transition detection from frame 780 in segment 5 (quote_carousel)"
}
```

---

## Session Protocol

### Starting a New Session
```
1. Read state.json to understand current progress
2. Read the relevant segment/animation files
3. Continue from where we left off
4. Update state.json before ending
```

### Ending a Session
```
1. Save all analysis to JSON files
2. Update state.json with exact stopping point
3. Write clear resume instructions
4. Commit and push all changes
```

---

## Batch Sizes

| Phase | Frames per Session | Sessions Needed |
|-------|-------------------|-----------------|
| 1. Segments | 40 keyframes | 1 |
| 2. Transitions | ~100 frames | 2-3 |
| 3. Deep Analysis | 20-30 frames per animation | 3-5 |
| 4. Synthesis | N/A | 1-2 |

**Total estimated sessions**: 7-11

---

## Commands for User

### Push all frames for analysis
```bash
cd /Users/kellan/Documents/AEclipse/packages/template-minima-title
git add video-analysis/frames/all/
git commit -m "Add all extracted frames for analysis"
git push origin claude/analyze-program-functionality-gb52b
```

### Check analysis progress
```bash
cat video-analysis/analysis/state.json
```

### Resume analysis
Just tell Claude: "Resume frame analysis from state.json"

---

## Priority Segments

Based on your feedback, analyze in this order:

1. **Quote Carousel (frames 751-900)** - Your priority
2. **Opus Intro (frames 661-750)** - Related to carousel
3. **End Card (frames 901-946)** - Simple, quick win
4. **Testimonials (frames 121-600)** - Complex, save for later
5. **News Headlines (frames 1-120)** - Complex, save for later

---

## Next Steps

1. You push `frames/all/` to the repo
2. I create `state.json` and `segments/boundaries.json`
3. We start with Quote Carousel segment (your priority)
4. Each session: analyze ~50-100 frames, save progress, commit
5. Repeat until complete
