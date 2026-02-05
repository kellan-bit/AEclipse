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
mkdir -p video-analysis/{input,frames/{all,keyframes,transitions,scenes,timestamped,analysis},analysis/scenes,synthesis,output,validation/{rendered,comparison,diff,frames_original,frames_rendered},scripts}

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
echo "Video Reverse-Engineering Workflow:"
echo "  1. Place video in video-analysis/input/"
echo "  2. Run: ./video-analysis/scripts/extract-frames.sh"
echo "  3. Analyze with Claude using CLAUDE_ANALYSIS_PROMPTS.md"
echo "  4. Generate template and render"
echo "  5. Compare: ./video-analysis/scripts/compare-videos.sh"
echo ""
echo "See video-analysis/ANALYSIS_PIPELINE.md for full documentation"
echo ""
