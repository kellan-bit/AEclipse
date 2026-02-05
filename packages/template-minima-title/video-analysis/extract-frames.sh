#!/bin/bash

# Frame Extraction Script for Video Analysis
# Usage: ./extract-frames.sh input/video.mp4 [interval]

VIDEO_PATH=$1
INTERVAL=${2:-5}  # Default: every 5th frame

if [ -z "$VIDEO_PATH" ]; then
  echo "Usage: ./extract-frames.sh <video-path> [frame-interval]"
  echo "Example: ./extract-frames.sh input/reference.mp4 5"
  exit 1
fi

# Get video info
echo "Analyzing video..."
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO_PATH")
FPS=$(ffprobe -v error -select_streams v -of default=noprint_wrappers=1:nokey=1 -show_entries stream=r_frame_rate "$VIDEO_PATH" | bc -l | xargs printf "%.0f")
TOTAL_FRAMES=$(echo "$DURATION * $FPS" | bc | xargs printf "%.0f")
RESOLUTION=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$VIDEO_PATH")

echo "Video: $VIDEO_PATH"
echo "Duration: ${DURATION}s"
echo "FPS: $FPS"
echo "Total frames: $TOTAL_FRAMES"
echo "Resolution: $RESOLUTION"
echo "Extracting every ${INTERVAL}th frame..."

# Extract keyframes
ffmpeg -i "$VIDEO_PATH" -vf "select=not(mod(n\,$INTERVAL))" -vsync vfr frames/keyframes/frame_%04d.png -y

EXTRACTED=$(ls frames/keyframes/*.png 2>/dev/null | wc -l)
echo "Extracted $EXTRACTED frames"

# Calculate batches (10 frames per batch)
BATCHES=$(( ($EXTRACTED + 9) / 10 ))

# Update manifest
cat > analysis/manifest.json << EOF
{
  "video": {
    "source": "$VIDEO_PATH",
    "duration": $DURATION,
    "fps": $FPS,
    "totalFrames": $TOTAL_FRAMES,
    "resolution": "$(echo $RESOLUTION | tr 'x' ',')"
  },
  "extraction": {
    "method": "keyframe_interval",
    "interval": $INTERVAL,
    "extractedFrames": $EXTRACTED
  },
  "analysis": {
    "status": "ready",
    "currentBatch": 1,
    "totalBatches": $BATCHES,
    "completedBatches": [],
    "framesPerBatch": 10
  },
  "lastUpdated": "$(date -Iseconds)",
  "resumeInstructions": "Ready for analysis. Start with batch 1."
}
EOF

echo ""
echo "Manifest updated. Ready for Claude to analyze."
echo "Total batches to analyze: $BATCHES"
echo ""
echo "Tell Claude: 'Analyze the video in video-analysis/'"
