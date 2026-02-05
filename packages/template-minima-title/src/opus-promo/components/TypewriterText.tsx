import React from 'react';
import { useCurrentFrame } from 'remotion';

interface TypewriterTextProps {
  text: string;
  startFrame: number;
  framesPerWord?: number;
  style?: React.CSSProperties;
}

/**
 * Word-by-word text reveal animation
 * Matches the original video's tweet text typing effect
 */
export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame,
  framesPerWord = 3,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  if (relativeFrame < 0) {
    return null;
  }

  const words = text.split(' ');
  const wordsToShow = Math.min(
    Math.floor(relativeFrame / framesPerWord) + 1,
    words.length
  );

  const visibleText = words.slice(0, wordsToShow).join(' ');

  return (
    <span style={style}>
      {visibleText}
    </span>
  );
};
