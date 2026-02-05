#!/bin/bash

# Video Comparison Script
# Compares original video with Remotion-rendered output

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
INPUT_DIR="$BASE_DIR/input"
OUTPUT_DIR="$BASE_DIR/output"
VALIDATION_DIR="$BASE_DIR/validation"

# Find original video
ORIGINAL=$(find "$INPUT_DIR" -type f \( -name "*.mp4" -o -name "*.mov" \) | head -1)

# Find rendered video
RENDERED=$(find "$OUTPUT_DIR" -type f -name "*.mp4" | head -1)

if [ -z "$ORIGINAL" ]; then
    echo "Error: No original video found in $INPUT_DIR"
    exit 1
fi

if [ -z "$RENDERED" ]; then
    echo "Error: No rendered video found in $OUTPUT_DIR"
    echo "Please render your Remotion composition first"
    exit 1
fi

echo "Comparing:"
echo "  Original: $ORIGINAL"
echo "  Rendered: $RENDERED"
echo ""

# Create comparison directories
mkdir -p "$VALIDATION_DIR"/{comparison,diff,frames_original,frames_rendered}

# Get video info
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$ORIGINAL")
FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 "$ORIGINAL" | bc -l | cut -d'.' -f1)

echo "=== Stage 1: Extracting comparison frames ==="

# Extract frames from both videos (1 per second for comparison)
ffmpeg -y -i "$ORIGINAL" -vf "fps=1" -q:v 2 "$VALIDATION_DIR/frames_original/frame_%04d.png" 2>/dev/null
ffmpeg -y -i "$RENDERED" -vf "fps=1" -q:v 2 "$VALIDATION_DIR/frames_rendered/frame_%04d.png" 2>/dev/null

FRAME_COUNT=$(ls -1 "$VALIDATION_DIR/frames_original/" | wc -l)
echo "Extracted $FRAME_COUNT frames from each video"
echo ""

# Create side-by-side comparisons and diff images
echo "=== Stage 2: Creating comparison images ==="

for i in $(seq -f "%04g" 1 $FRAME_COUNT); do
    ORIG="$VALIDATION_DIR/frames_original/frame_$i.png"
    REND="$VALIDATION_DIR/frames_rendered/frame_$i.png"

    if [ -f "$ORIG" ] && [ -f "$REND" ]; then
        # Side-by-side comparison
        ffmpeg -y -i "$ORIG" -i "$REND" \
            -filter_complex "[0:v][1:v]hstack=inputs=2" \
            "$VALIDATION_DIR/comparison/compare_$i.png" 2>/dev/null

        # Difference image (highlights changes)
        ffmpeg -y -i "$ORIG" -i "$REND" \
            -filter_complex "[0:v][1:v]blend=all_mode=difference" \
            "$VALIDATION_DIR/diff/diff_$i.png" 2>/dev/null
    fi
done

echo "Created comparison images in validation/comparison/"
echo "Created diff images in validation/diff/"
echo ""

# Calculate SSIM (Structural Similarity Index)
echo "=== Stage 3: Calculating similarity metrics ==="

SSIM_OUTPUT=$(ffmpeg -i "$ORIGINAL" -i "$RENDERED" \
    -lavfi "ssim=stats_file=$VALIDATION_DIR/ssim.log" \
    -f null - 2>&1 | grep "SSIM" | tail -1)

echo "SSIM Result: $SSIM_OUTPUT"

# Calculate PSNR (Peak Signal-to-Noise Ratio)
PSNR_OUTPUT=$(ffmpeg -i "$ORIGINAL" -i "$RENDERED" \
    -lavfi "psnr=stats_file=$VALIDATION_DIR/psnr.log" \
    -f null - 2>&1 | grep "PSNR" | tail -1)

echo "PSNR Result: $PSNR_OUTPUT"
echo ""

# Generate validation report
echo "=== Stage 4: Generating validation report ==="

# Parse SSIM value
SSIM_AVG=$(echo "$SSIM_OUTPUT" | grep -oP 'All:\K[0-9.]+' || echo "N/A")

cat > "$VALIDATION_DIR/report.json" << EOF
{
  "comparison": {
    "original": "$(basename "$ORIGINAL")",
    "rendered": "$(basename "$RENDERED")",
    "timestamp": "$(date -Iseconds)"
  },
  "metrics": {
    "ssim": {
      "average": "$SSIM_AVG",
      "target": "0.95",
      "pass": $([ "$(echo "$SSIM_AVG > 0.95" | bc -l 2>/dev/null || echo 0)" = "1" ] && echo "true" || echo "false")
    },
    "framesCompared": $FRAME_COUNT
  },
  "files": {
    "comparisons": "validation/comparison/",
    "diffs": "validation/diff/",
    "ssimLog": "validation/ssim.log",
    "psnrLog": "validation/psnr.log"
  },
  "notes": [
    "Review diff images for specific discrepancies",
    "Areas with high difference values need adjustment",
    "SSIM > 0.95 indicates excellent similarity"
  ]
}
EOF

echo "Validation report saved to validation/report.json"
echo ""

echo "=========================================="
echo "Comparison complete!"
echo ""
echo "Results:"
echo "  - Side-by-side: validation/comparison/"
echo "  - Difference maps: validation/diff/"
echo "  - SSIM log: validation/ssim.log"
echo "  - Report: validation/report.json"
echo ""
echo "Review the diff images to identify areas needing adjustment."
echo "Black areas = perfect match, colored areas = differences"
echo "=========================================="
