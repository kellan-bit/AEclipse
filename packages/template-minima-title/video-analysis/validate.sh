#!/bin/bash

# Validation Pipeline Script
# Renders generated animation, compares with original, documents failures

set -e

echo "=== Video Analysis Validation Pipeline ==="
echo ""

# Check if generated composition exists
if [ ! -f "../output/ReconstructedAnimation.tsx" ]; then
  echo "Error: No generated composition found at output/ReconstructedAnimation.tsx"
  echo "Run code generation first."
  exit 1
fi

# Check if original frames exist
if [ ! -d "frames/keyframes" ] || [ -z "$(ls -A frames/keyframes 2>/dev/null)" ]; then
  echo "Error: No original frames found in frames/keyframes/"
  echo "Run frame extraction first."
  exit 1
fi

# Step 1: Render generated animation
echo "Step 1: Rendering generated animation..."
cd ..
npx remotion render src/output/ReconstructedAnimation.tsx ReconstructedAnimation \
  --image-format=png \
  --output-location=video-analysis/validation/rendered/frame_%04d.png \
  2>/dev/null || {
    echo "Remotion render failed. Trying alternative method..."
    # Fallback: render to video then extract frames
    npx remotion render src/output/ReconstructedAnimation.tsx ReconstructedAnimation \
      --output=video-analysis/validation/rendered.mp4
    ffmpeg -i video-analysis/validation/rendered.mp4 \
      -vf "select=not(mod(n\,5))" -vsync vfr \
      video-analysis/validation/rendered/frame_%04d.png -y
  }
cd video-analysis

RENDERED_COUNT=$(ls validation/rendered/*.png 2>/dev/null | wc -l)
echo "Rendered $RENDERED_COUNT frames"

# Step 2: Generate side-by-side comparisons
echo ""
echo "Step 2: Generating side-by-side comparisons..."
for orig in frames/keyframes/frame_*.png; do
  num=$(basename "$orig" | sed 's/frame_\([0-9]*\).png/\1/')
  rendered="validation/rendered/frame_${num}.png"

  if [ -f "$rendered" ]; then
    ffmpeg -i "$orig" -i "$rendered" \
      -filter_complex "[0:v]drawtext=text='ORIGINAL':x=10:y=10:fontsize=24:fontcolor=white[a];[1:v]drawtext=text='GENERATED':x=10:y=10:fontsize=24:fontcolor=white[b];[a][b]hstack" \
      "validation/comparison/compare_${num}.png" -y 2>/dev/null
  fi
done

COMPARE_COUNT=$(ls validation/comparison/*.png 2>/dev/null | wc -l)
echo "Generated $COMPARE_COUNT comparison images"

# Step 3: Generate difference maps
echo ""
echo "Step 3: Generating difference maps..."
for orig in frames/keyframes/frame_*.png; do
  num=$(basename "$orig" | sed 's/frame_\([0-9]*\).png/\1/')
  rendered="validation/rendered/frame_${num}.png"

  if [ -f "$rendered" ]; then
    ffmpeg -i "$orig" -i "$rendered" \
      -filter_complex "blend=all_mode=difference" \
      "validation/diff/diff_${num}.png" -y 2>/dev/null
  fi
done

DIFF_COUNT=$(ls validation/diff/*.png 2>/dev/null | wc -l)
echo "Generated $DIFF_COUNT difference maps"

# Step 4: Create initial failures.json template
echo ""
echo "Step 4: Creating failures template..."
cat > validation/failures.json << 'EOF'
{
  "validationRun": "TIMESTAMP",
  "overallScore": null,
  "status": "pending_review",
  "note": "Claude should review comparison/ and diff/ images to populate failures",
  "failures": [],
  "successes": []
}
EOF
sed -i "s/TIMESTAMP/$(date -Iseconds)/" validation/failures.json 2>/dev/null || \
  sed -i '' "s/TIMESTAMP/$(date -Iseconds)/" validation/failures.json

echo ""
echo "=== Validation Pipeline Complete ==="
echo ""
echo "Results:"
echo "  - Rendered frames:    validation/rendered/"
echo "  - Comparisons:        validation/comparison/"
echo "  - Difference maps:    validation/diff/"
echo "  - Failures template:  validation/failures.json"
echo ""
echo "Next: Tell Claude to review the comparison images and document failures"
echo "Command: \"Review validation results in video-analysis/validation/\""
