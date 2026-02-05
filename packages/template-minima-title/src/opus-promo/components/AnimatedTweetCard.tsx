import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { TypewriterText } from './TypewriterText';

interface AnimatedTweetCardProps {
  username: string;
  handle?: string;
  text: string;
  verified?: boolean;
  profileColor?: string;
  cardAppearFrame?: number;
  textStartFrame?: number;
  framesPerWord?: number;
}

/**
 * Animated Tweet Card with:
 * - Card appears with fade (3 frames based on analysis)
 * - Username/header shows first
 * - Text types in word-by-word (starts ~20 frames after card)
 */
export const AnimatedTweetCard: React.FC<AnimatedTweetCardProps> = ({
  username,
  handle,
  text,
  verified = true,
  profileColor = '#6B7280',
  cardAppearFrame = 0,
  textStartFrame = 20,
  framesPerWord = 3,
}) => {
  const frame = useCurrentFrame();

  // Card fade in (3 frames based on frame 108-110 analysis)
  const cardOpacity = interpolate(
    frame,
    [cardAppearFrame, cardAppearFrame + 3],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Generate initials for profile pic
  const initials = username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (frame < cardAppearFrame) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        maxWidth: 400,
        opacity: cardOpacity,
      }}
    >
      {/* Header with profile */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        {/* Profile pic placeholder */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: profileColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {initials}
        </div>

        {/* Username and handle */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: 15,
                fontWeight: 700,
                color: '#0F1419',
              }}
            >
              {username}
            </span>
            {verified && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DA1F2">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
              </svg>
            )}
          </div>
          {handle && (
            <span
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: 14,
                color: '#536471',
              }}
            >
              {handle}
            </span>
          )}
        </div>
      </div>

      {/* Tweet text with typewriter effect */}
      <div
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 18,
          lineHeight: 1.4,
          color: '#0F1419',
          minHeight: 50,
        }}
      >
        <TypewriterText
          text={text}
          startFrame={textStartFrame}
          framesPerWord={framesPerWord}
        />
      </div>
    </div>
  );
};
