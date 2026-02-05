#!/bin/bash

# Master Video Analysis Orchestration Script
# Guides through the complete video reverse-engineering process

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"

echo "=============================================="
echo "  VIDEO REVERSE-ENGINEERING PIPELINE"
echo "=============================================="
echo ""

# Check for input video
if [ ! -d "$BASE_DIR/input" ] || [ -z "$(ls -A $BASE_DIR/input 2>/dev/null)" ]; then
    echo "Step 1: Add your source video"
    echo "================================"
    echo ""
    echo "Please place your video file in:"
    echo "  $BASE_DIR/input/"
    echo ""
    echo "Supported formats: .mp4, .mov, .webm, .avi"
    echo ""
    echo "Then run this script again."
    exit 0
fi

VIDEO=$(find "$BASE_DIR/input" -type f \( -name "*.mp4" -o -name "*.mov" -o -name "*.webm" -o -name "*.avi" \) | head -1)
echo "Found video: $(basename "$VIDEO")"
echo ""

# Menu
echo "What would you like to do?"
echo ""
echo "  1) Extract frames (required first step)"
echo "  2) View analysis status"
echo "  3) Open keyframes for analysis"
echo "  4) Generate template (after Claude analysis)"
echo "  5) Render and compare"
echo "  6) Full pipeline (all steps)"
echo ""
read -p "Select option (1-6): " option

case $option in
    1)
        echo ""
        echo "Starting frame extraction..."
        "$SCRIPT_DIR/extract-frames.sh"
        ;;
    2)
        echo ""
        echo "Analysis Status"
        echo "==============="
        if [ -f "$BASE_DIR/analysis/manifest.json" ]; then
            cat "$BASE_DIR/analysis/manifest.json" | python3 -m json.tool 2>/dev/null || cat "$BASE_DIR/analysis/manifest.json"
        else
            echo "No analysis started yet. Run frame extraction first."
        fi
        ;;
    3)
        echo ""
        echo "Keyframe Analysis"
        echo "================="
        KEYFRAME_COUNT=$(ls -1 "$BASE_DIR/frames/keyframes/" 2>/dev/null | wc -l)
        if [ "$KEYFRAME_COUNT" -eq 0 ]; then
            echo "No keyframes found. Run frame extraction first."
        else
            echo "Found $KEYFRAME_COUNT keyframes in frames/keyframes/"
            echo ""
            echo "To analyze with Claude:"
            echo "1. Read the keyframe images: frames/keyframes/keyframe_*.png"
            echo "2. Use prompts from CLAUDE_ANALYSIS_PROMPTS.md"
            echo "3. Save analysis results to analysis/scenes.json"
            echo ""
            echo "Opening keyframes directory..."
            if command -v xdg-open &> /dev/null; then
                xdg-open "$BASE_DIR/frames/keyframes/" 2>/dev/null &
            elif command -v open &> /dev/null; then
                open "$BASE_DIR/frames/keyframes/"
            else
                echo "Keyframes location: $BASE_DIR/frames/keyframes/"
            fi
        fi
        ;;
    4)
        echo ""
        echo "Template Generation"
        echo "==================="
        if [ ! -f "$BASE_DIR/analysis/scenes.json" ]; then
            echo "No scene analysis found."
            echo "Please complete Claude analysis first and save to analysis/scenes.json"
        else
            echo "Scene analysis found. Ready for template generation."
            echo ""
            echo "To generate template with Claude:"
            echo "1. Read analysis/scenes.json"
            echo "2. Read analysis/scenes/*/visual.json (if exists)"
            echo "3. Use Prompt 7 from CLAUDE_ANALYSIS_PROMPTS.md"
            echo "4. Generate Remotion components in src/"
        fi
        ;;
    5)
        echo ""
        echo "Render and Compare"
        echo "=================="
        if [ ! -f "$BASE_DIR/output/rendered.mp4" ]; then
            echo "No rendered output found."
            echo ""
            echo "To render your Remotion template:"
            echo "  cd $(dirname $BASE_DIR)"
            echo "  bun run build"
            echo "  npx remotion render [CompositionId] video-analysis/output/rendered.mp4"
            echo ""
            echo "Then run this script again with option 5."
        else
            echo "Running comparison..."
            "$SCRIPT_DIR/compare-videos.sh"
        fi
        ;;
    6)
        echo ""
        echo "Full Pipeline"
        echo "============="
        echo "This will guide you through all steps."
        echo ""

        # Step 1: Extract
        if [ ! -d "$BASE_DIR/frames/keyframes" ] || [ -z "$(ls -A $BASE_DIR/frames/keyframes 2>/dev/null)" ]; then
            echo "Step 1/5: Extracting frames..."
            "$SCRIPT_DIR/extract-frames.sh"
        else
            echo "Step 1/5: Frames already extracted ✓"
        fi

        echo ""
        echo "Step 2/5: Claude Analysis Required"
        echo "==================================="
        echo ""
        echo "Now you need to analyze the frames with Claude."
        echo ""
        echo "Recommended workflow:"
        echo ""
        echo "a) Start with OVERVIEW analysis:"
        echo "   - Read all keyframes from: frames/keyframes/"
        echo "   - Use Prompt 1 from CLAUDE_ANALYSIS_PROMPTS.md"
        echo "   - Identify scenes and overall structure"
        echo ""
        echo "b) For each scene, do DEEP analysis:"
        echo "   - Read specific frames for that scene"
        echo "   - Use Prompt 2 for visual design"
        echo "   - Use Prompt 3 for animation (compare consecutive frames)"
        echo ""
        echo "c) Save analysis results to:"
        echo "   - analysis/scenes.json (scene structure)"
        echo "   - analysis/scenes/{id}/visual.json (per-scene design)"
        echo "   - analysis/scenes/{id}/motion.json (per-scene animation)"
        echo ""
        echo "After completing analysis, run this script with option 4 to generate template."
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac
