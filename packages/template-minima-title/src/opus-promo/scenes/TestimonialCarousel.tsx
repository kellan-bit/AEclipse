import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from 'remotion';

interface Quote {
  text: string;
}

interface TestimonialCarouselProps {
  productName?: string;
  version?: string;
  quotes: Quote[];
  framesPerQuote?: number;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  productName = 'Opus',
  version = '4.6',
  quotes,
  framesPerQuote = 30,
}) => {
  const frame = useCurrentFrame();

  // Determine which quote to show
  const quoteIndex = Math.min(
    Math.floor(frame / framesPerQuote),
    quotes.length - 1
  );

  // Calculate progress within current quote
  const quoteStartFrame = quoteIndex * framesPerQuote;
  const frameInQuote = frame - quoteStartFrame;

  // Animate quote in
  const quoteOpacity = interpolate(
    frameInQuote,
    [0, 10, framesPerQuote - 10, framesPerQuote],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const quoteY = interpolate(
    frameInQuote,
    [0, 10],
    [15, 0],
    {
      easing: Easing.out(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const currentQuote = quotes[quoteIndex];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '0 120px',
      }}
    >
      {/* Product name (left side) */}
      <div
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 56,
          fontWeight: 400,
          color: '#1A1A1A',
          whiteSpace: 'nowrap',
        }}
      >
        {productName} {version}
      </div>

      {/* Quote (right side) */}
      <div
        style={{
          marginLeft: 40,
          opacity: quoteOpacity,
          transform: `translateY(${quoteY}px)`,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            padding: '12px 20px',
            borderRadius: 4,
          }}
        >
          <span
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 22,
              fontWeight: 400,
              color: '#1A1A1A',
            }}
          >
            {currentQuote.text}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
