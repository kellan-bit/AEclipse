#!/bin/bash

# Video Analysis Frame Extraction Script
# Extracts frames at multiple granularities for Claude analysis

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
INPUT_DIR="$BASE_DIR/input"
FRAMES_DIR="$BASE_DIR/frames"

# Find input video
VIDEO=$(find "$INPUT_DIR" -type f \( -name "*.mp4" -o -name "*.mov" -o -name "*.webm" -o -name "*.avi" \) | head -1)

if [ -z "$VIDEO" ]; then
    echo "Error: No video file found in $INPUT_DIR"
    echo "Please place your video file in the input/ folder"
    exit 1
fi

echo "Found video: $VIDEO"

# Get video info
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO")
FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 "$VIDEO" | bc -l | cut -d'.' -f1)
WIDTH=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "$VIDEO")
HEIGHT=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 "$VIDEO")

echo "Video Info:"
echo "  Duration: ${DURATION}s"
echo "  FPS: $FPS"
echo "  Resolution: ${WIDTH}x${HEIGHT}"
echo ""

# Create output directories
mkdir -p "$FRAMES_DIR"/{all,keyframes,transitions,scenes,analysis}

# Calculate total frames
TOTAL_FRAMES=$(echo "$DURATION * $FPS" | bc | cut -d'.' -f1)
echo "Total frames to extract: $TOTAL_FRAMES"
echo ""

# 1. Extract ALL frames (for detailed motion analysis)
echo "=== Stage 1: Extracting all frames ==="
echo "This may take a while for long videos..."
ffmpeg -y -i "$VIDEO" \
    -vf "fps=$FPS" \
    -q:v 2 \
    "$FRAMES_DIR/all/frame_%04d.png" \
    2>/dev/null

ALL_COUNT=$(ls -1 "$FRAMES_DIR/all/" 2>/dev/null | wc -l)
echo "Extracted $ALL_COUNT frames to frames/all/"
echo ""

# 2. Extract KEYFRAMES (1 per second for scene overview)
echo "=== Stage 2: Extracting keyframes (1 per second) ==="
ffmpeg -y -i "$VIDEO" \
    -vf "fps=1" \
    -q:v 2 \
    "$FRAMES_DIR/keyframes/keyframe_%04d.png" \
    2>/dev/null

KEY_COUNT=$(ls -1 "$FRAMES_DIR/keyframes/" 2>/dev/null | wc -l)
echo "Extracted $KEY_COUNT keyframes to frames/keyframes/"
echo ""

# 3. Extract frames with TIMESTAMPS (for reference)
echo "=== Stage 3: Creating timestamped reference frames ==="
mkdir -p "$FRAMES_DIR/timestamped"
ffmpeg -y -i "$VIDEO" \
    -vf "fps=2,drawtext=text='%{pts\:hms} | Frame %{n}':x=20:y=20:fontsize=36:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=10" \
    -q:v 2 \
    "$FRAMES_DIR/timestamped/ref_%04d.png" \
    2>/dev/null

REF_COUNT=$(ls -1 "$FRAMES_DIR/timestamped/" 2>/dev/null | wc -l)
echo "Created $REF_COUNT timestamped reference frames"
echo ""

# 4. Detect scene changes using ffmpeg
echo "=== Stage 4: Detecting scene changes ==="
ffmpeg -y -i "$VIDEO" \
    -vf "select='gt(scene,0.3)',showinfo" \
    -vsync vfr \
    -q:v 2 \
    "$FRAMES_DIR/transitions/transition_%04d.png" \
    2>&1 | grep showinfo | grep pts_time > "$FRAMES_DIR/analysis/scene_changes.txt" || true

TRANS_COUNT=$(ls -1 "$FRAMES_DIR/transitions/" 2>/dev/null | wc -l)
echo "Detected $TRANS_COUNT potential scene transitions"
echo ""

# 5. Create video info JSON
echo "=== Stage 5: Creating metadata ==="
cat > "$BASE_DIR/analysis/video_info.json" << EOF
{
  "source": "$(basename "$VIDEO")",
  "duration": $DURATION,
  "fps": $FPS,
  "width": $WIDTH,
  "height": $HEIGHT,
  "totalFrames": $TOTAL_FRAMES,
  "extraction": {
    "allFrames": $ALL_COUNT,
    "keyframes": $KEY_COUNT,
    "transitions": $TRANS_COUNT,
    "timestampedRefs": $REF_COUNT
  },
  "paths": {
    "allFrames": "frames/all/",
    "keyframes": "frames/keyframes/",
    "transitions": "frames/transitions/",
    "timestamped": "frames/timestamped/"
  },
  "extractedAt": "$(date -Iseconds)"
}
EOF

echo "Created analysis/video_info.json"
echo ""

# 6. Create analysis manifest for Claude
echo "=== Stage 6: Creating analysis manifest ==="
cat > "$BASE_DIR/analysis/manifest.json" << EOF
{
  "version": "1.0",
  "video": {
    "source": "$(basename "$VIDEO")",
    "duration": $DURATION,
    "fps": $FPS,
    "resolution": "${WIDTH}x${HEIGHT}",
    "totalFrames": $TOTAL_FRAMES
  },
  "analysisStatus": {
    "framesExtracted": true,
    "scenesDetected": false,
    "visualAnalysis": false,
    "motionAnalysis": false,
    "textExtraction": false,
    "templateSynthesis": false,
    "validation": false
  },
  "scenes": [],
  "notes": []
}
EOF

echo "Created analysis/manifest.json"
echo ""

echo "=========================================="
echo "Frame extraction complete!"
echo ""
echo "Next steps:"
echo "1. Review keyframes in frames/keyframes/ to understand video structure"
echo "2. Check transitions in frames/transitions/ for scene boundaries"
echo "3. Use Claude to analyze frames and build the template"
echo ""
echo "Recommended Claude workflow:"
echo "  - Start with keyframes for scene overview"
echo "  - Analyze transitions for animation patterns"
echo "  - Use all frames for detailed motion analysis"
echo "=========================================="
