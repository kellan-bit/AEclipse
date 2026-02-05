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

interface ProductQuoteCarouselProps {
  productName: string;
  quotes: Quote[];
  framesPerQuote?: number;
  fontFamily?: string;
  productFontSize?: number;
  quoteFontSize?: number;
}

export const ProductQuoteCarousel: React.FC<ProductQuoteCarouselProps> = ({
  productName,
  quotes,
  framesPerQuote = 35,
  fontFamily = 'Georgia, "Times New Roman", serif',
  productFontSize = 64,
  quoteFontSize = 24,
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

  // Smooth fade animation - quick fade in, hold, quick fade out
  const fadeInDuration = 12;
  const fadeOutDuration = 12;
  const holdStart = fadeInDuration;
  const holdEnd = framesPerQuote - fadeOutDuration;

  const quoteOpacity = interpolate(
    frameInQuote,
    [0, fadeInDuration, holdEnd, framesPerQuote],
    [0, 1, 1, 0],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const currentQuote = quotes[quoteIndex];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Product name - fixed position */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-100%, -50%)',
          marginLeft: -16,
          fontFamily,
          fontSize: productFontSize,
          fontWeight: 400,
          color: '#1A1A1A',
          whiteSpace: 'nowrap',
        }}
      >
        {productName}
      </div>

      {/* Quote box - fixed left edge, only fades */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: 16,
          opacity: quoteOpacity,
        }}
      >
        <div
          style={{
            backgroundColor: '#F5F5F5',
            padding: '10px 16px',
            borderRadius: 2,
          }}
        >
          <span
            style={{
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: quoteFontSize,
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
