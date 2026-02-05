#!/bin/bash

# Prepare Analysis Batch
# Creates batches of frames for Claude to analyze visually

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
FRAMES_DIR="$BASE_DIR/frames"
ANALYSIS_DIR="$BASE_DIR/analysis"

echo "=============================================="
echo "  PREPARE FRAMES FOR CLAUDE IMAGE ANALYSIS"
echo "=============================================="
echo ""

# Check if frames exist
if [ ! -d "$FRAMES_DIR/keyframes" ] || [ -z "$(ls -A $FRAMES_DIR/keyframes 2>/dev/null)" ]; then
    echo "No keyframes found. Run extract-frames.sh first."
    exit 1
fi

KEYFRAME_COUNT=$(ls -1 "$FRAMES_DIR/keyframes/" | wc -l)
echo "Found $KEYFRAME_COUNT keyframes"
echo ""

# Menu
echo "Select analysis type:"
echo ""
echo "  1) Overview analysis (all keyframes - scene structure)"
echo "  2) Scene-by-scene analysis (specify frame range)"
echo "  3) Motion analysis (consecutive frames for animation)"
echo "  4) Transition analysis (frames around scene change)"
echo "  5) List all available frames"
echo ""
read -p "Select option (1-5): " option

case $option in
    1)
        echo ""
        echo "OVERVIEW ANALYSIS"
        echo "================="
        echo ""
        echo "Claude will analyze these keyframes to identify:"
        echo "  - Scene structure and boundaries"
        echo "  - Overall color palette"
        echo "  - Typography styles"
        echo "  - Animation patterns"
        echo ""
        echo "Keyframe paths for Claude to read:"
        echo ""

        # List all keyframes with full paths
        for f in "$FRAMES_DIR/keyframes"/keyframe_*.png; do
            echo "  $f"
        done

        echo ""
        echo "---"
        echo "Copy the paths above and ask Claude to read and analyze them."
        echo "Use Prompt 1 from CLAUDE_ANALYSIS_PROMPTS.md"
        ;;
    2)
        echo ""
        read -p "Enter start keyframe number (e.g., 1): " start
        read -p "Enter end keyframe number (e.g., 10): " end

        echo ""
        echo "SCENE ANALYSIS: Keyframes $start to $end"
        echo "========================================"
        echo ""
        echo "Frame paths for Claude to read:"
        echo ""

        for i in $(seq -f "%04g" $start $end); do
            f="$FRAMES_DIR/keyframes/keyframe_$i.png"
            if [ -f "$f" ]; then
                echo "  $f"
            fi
        done

        echo ""
        echo "---"
        echo "Use Prompt 2 from CLAUDE_ANALYSIS_PROMPTS.md"
        ;;
    3)
        echo ""
        read -p "Enter center frame number (from all frames): " center
        read -p "Enter range (frames before and after, e.g., 5): " range

        start=$((center - range))
        end=$((center + range))

        echo ""
        echo "MOTION ANALYSIS: Frames $start to $end"
        echo "======================================"
        echo ""
        echo "Consecutive frame paths for animation analysis:"
        echo ""

        for i in $(seq -f "%04g" $start $end); do
            f="$FRAMES_DIR/all/frame_$i.png"
            if [ -f "$f" ]; then
                echo "  $f"
            fi
        done

        echo ""
        echo "---"
        echo "Use Prompt 3 from CLAUDE_ANALYSIS_PROMPTS.md"
        ;;
    4)
        echo ""
        echo "Detected transitions:"
        if [ -d "$FRAMES_DIR/transitions" ] && [ "$(ls -A $FRAMES_DIR/transitions 2>/dev/null)" ]; then
            ls -1 "$FRAMES_DIR/transitions/"
        else
            echo "  (none detected - check manually)"
        fi
        echo ""

        read -p "Enter transition frame number: " trans
        range=10
        start=$((trans - range))
        end=$((trans + range))

        echo ""
        echo "TRANSITION ANALYSIS: Frames around $trans"
        echo "=========================================="
        echo ""

        for i in $(seq -f "%04g" $start $end); do
            f="$FRAMES_DIR/all/frame_$i.png"
            if [ -f "$f" ]; then
                echo "  $f"
            fi
        done

        echo ""
        echo "---"
        echo "Use Prompt 4 from CLAUDE_ANALYSIS_PROMPTS.md"
        ;;
    5)
        echo ""
        echo "Available frames:"
        echo ""
        echo "Keyframes (1 per second):"
        ls -1 "$FRAMES_DIR/keyframes/" 2>/dev/null | head -20
        TOTAL_KEY=$(ls -1 "$FRAMES_DIR/keyframes/" 2>/dev/null | wc -l)
        [ "$TOTAL_KEY" -gt 20 ] && echo "  ... and $((TOTAL_KEY - 20)) more"

        echo ""
        echo "All frames:"
        ls -1 "$FRAMES_DIR/all/" 2>/dev/null | head -10
        TOTAL_ALL=$(ls -1 "$FRAMES_DIR/all/" 2>/dev/null | wc -l)
        [ "$TOTAL_ALL" -gt 10 ] && echo "  ... and $((TOTAL_ALL - 10)) more"

        echo ""
        echo "Transitions:"
        ls -1 "$FRAMES_DIR/transitions/" 2>/dev/null || echo "  (none)"
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "=============================================="
echo "HOW TO USE WITH CLAUDE:"
echo ""
echo "1. Copy the frame paths listed above"
echo "2. Tell Claude: 'Read and analyze these frames: [paste paths]'"
echo "3. Claude will view the images and extract visual data"
echo "4. Save Claude's analysis to analysis/scenes.json"
echo "=============================================="
