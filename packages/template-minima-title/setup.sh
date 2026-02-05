#!/bin/bash

# Minima Project Setup Script
# Automatically creates required folder structure for new projects

echo "Setting up Minima project structure..."

# Create public folder with assets subfolder
mkdir -p public/assets

# Add .gitkeep files to preserve folders in git
touch public/.gitkeep
touch public/assets/.gitkeep

# Create video-analysis structure (for reverse engineering workflow)
mkdir -p video-analysis/{input,frames/keyframes,frames/transitions,analysis,synthesis,output,validation/{rendered,comparison,diff}}

# Initialize manifest if it doesn't exist
if [ ! -f video-analysis/analysis/manifest.json ]; then
  cat > video-analysis/analysis/manifest.json << 'EOF'
{
  "video": {
    "source": null,
    "duration": null,
    "fps": null,
    "totalFrames": null,
    "resolution": null
  },
  "extraction": {
    "method": "keyframe_interval",
    "interval": 5,
    "extractedFrames": 0
  },
  "analysis": {
    "status": "not_started",
    "currentBatch": 0,
    "totalBatches": 0,
    "completedBatches": [],
    "framesPerBatch": 10
  },
  "lastUpdated": null,
  "resumeInstructions": "Add a video to input/ and run frame extraction"
}
EOF
fi

echo ""
echo "✓ Created public/"
echo "✓ Created public/assets/"
echo "✓ Created video-analysis/ structure"
echo ""
echo "Project ready! You can now:"
echo "  1. Drag assets into Remotion Studio's Assets panel"
echo "  2. Drop reference videos in video-analysis/input/ for analysis"
echo ""
