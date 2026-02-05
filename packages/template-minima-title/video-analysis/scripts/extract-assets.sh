#!/bin/bash

# Extract specific frames as assets from the source video
# Run this locally to generate placeholder assets

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
INPUT_DIR="$BASE_DIR/input"
ASSETS_DIR="$BASE_DIR/../public/assets"

VIDEO=$(find "$INPUT_DIR" -type f \( -name "*.mp4" -o -name "*.mov" \) | head -1)

if [ -z "$VIDEO" ]; then
    echo "Error: No video found in $INPUT_DIR"
    exit 1
fi

echo "Extracting assets from: $VIDEO"
mkdir -p "$ASSETS_DIR"

# Scene 1: News headline (frame at 1s)
echo "Extracting: news-headline.png"
ffmpeg -y -ss 00:00:01 -i "$VIDEO" -vframes 1 -q:v 2 "$ASSETS_DIR/news-headline.png" 2>/dev/null

# Scene 2: Math student with geometric overlay (frame at 5s)
echo "Extracting: testimonial-math.png"
ffmpeg -y -ss 00:00:05 -i "$VIDEO" -vframes 1 -q:v 2 "$ASSETS_DIR/testimonial-math.png" 2>/dev/null

# Scene 2b: Chalkboard (frame at 7s)
echo "Extracting: testimonial-chalkboard.png"
ffmpeg -y -ss 00:00:07 -i "$VIDEO" -vframes 1 -q:v 2 "$ASSETS_DIR/testimonial-chalkboard.png" 2>/dev/null

# Scene 3: Hardware project (frame at 9s)
echo "Extracting: testimonial-hardware.png"
ffmpeg -y -ss 00:00:09 -i "$VIDEO" -vframes 1 -q:v 2 "$ASSETS_DIR/testimonial-hardware.png" 2>/dev/null

# Scene 4: MRI scan (frame at 11s)
echo "Extracting: testimonial-mri.png"
ffmpeg -y -ss 00:00:11 -i "$VIDEO" -vframes 1 -q:v 2 "$ASSETS_DIR/testimonial-mri.png" 2>/dev/null

# Scene 5: Ocean/sky split (frame at 13s)
echo "Extracting: testimonial-ocean.png"
ffmpeg -y -ss 00:00:13 -i "$VIDEO" -vframes 1 -q:v 2 "$ASSETS_DIR/testimonial-ocean.png" 2>/dev/null

# Scene 6: Knitter (frame at 15s)
echo "Extracting: testimonial-knitter.png"
ffmpeg -y -ss 00:00:15 -i "$VIDEO" -vframes 1 -q:v 2 "$ASSETS_DIR/testimonial-knitter.png" 2>/dev/null

# Scene 7: School folders (frame at 17s)
echo "Extracting: testimonial-folders.png"
ffmpeg -y -ss 00:00:17 -i "$VIDEO" -vframes 1 -q:v 2 "$ASSETS_DIR/testimonial-folders.png" 2>/dev/null

# Scene 8: Industrial (frame at 18s)
echo "Extracting: testimonial-industrial.png"
ffmpeg -y -ss 00:00:18 -i "$VIDEO" -vframes 1 -q:v 2 "$ASSETS_DIR/testimonial-industrial.png" 2>/dev/null

# Scene 9: Mars rover (frame at 20s)
echo "Extracting: mars-rover.png"
ffmpeg -y -ss 00:00:20 -i "$VIDEO" -vframes 1 -q:v 2 "$ASSETS_DIR/mars-rover.png" 2>/dev/null

# Scene 10: Montage (frame at 22s)
echo "Extracting: testimonial-montage.png"
ffmpeg -y -ss 00:00:22 -i "$VIDEO" -vframes 1 -q:v 2 "$ASSETS_DIR/testimonial-montage.png" 2>/dev/null

# Scene 11: Opus intro with screenshots (frame at 29s)
echo "Extracting: opus-screenshots.png"
ffmpeg -y -ss 00:00:29 -i "$VIDEO" -vframes 1 -q:v 2 "$ASSETS_DIR/opus-screenshots.png" 2>/dev/null

# Scene 10b: Mountain landscape (frame at 21s)
echo "Extracting: testimonial-mountain.png"
ffmpeg -y -ss 00:00:21 -i "$VIDEO" -vframes 1 -q:v 2 "$ASSETS_DIR/testimonial-mountain.png" 2>/dev/null

echo ""
echo "✓ Assets extracted to public/assets/"
echo ""
ls -la "$ASSETS_DIR"
