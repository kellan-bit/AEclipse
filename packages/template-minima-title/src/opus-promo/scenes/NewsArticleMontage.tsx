import React from 'react';
import {
  AbsoluteFill,
  Img,
  Series,
  useCurrentFrame,
  interpolate,
  Easing,
  staticFile,
} from 'remotion';

interface NewsArticle {
  imageSrc: string;
  durationFrames: number;
  zoomAmount?: number;
  zoomDirection?: 'in' | 'out';
}

interface NewsArticleMontageProps {
  articles: NewsArticle[];
}

/**
 * News Article Montage
 *
 * Based on frames 1-95 analysis: Rapid hard cuts between news articles
 * featuring Claude headlines. Each article has a subtle Ken Burns zoom.
 *
 * The text is integrated INTO the article images (match cut style),
 * not overlaid. User must provide pre-composed article screenshots.
 */
export const NewsArticleMontage: React.FC<NewsArticleMontageProps> = ({
  articles,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#FFFFFF' }}>
      <Series>
        {articles.map((article, index) => (
          <Series.Sequence
            key={index}
            durationInFrames={article.durationFrames}
          >
            <NewsArticleFrame
              imageSrc={article.imageSrc}
              zoomAmount={article.zoomAmount ?? 0.05}
              zoomDirection={article.zoomDirection ?? 'in'}
            />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

interface NewsArticleFrameProps {
  imageSrc: string;
  zoomAmount: number;
  zoomDirection: 'in' | 'out';
}

const NewsArticleFrame: React.FC<NewsArticleFrameProps> = ({
  imageSrc,
  zoomAmount,
  zoomDirection,
}) => {
  const frame = useCurrentFrame();

  // Ken Burns zoom
  const startScale = zoomDirection === 'in' ? 1 : 1 + zoomAmount;
  const endScale = zoomDirection === 'in' ? 1 + zoomAmount : 1;

  const scale = interpolate(frame, [0, 100], [startScale, endScale], {
    easing: Easing.linear,
    extrapolateRight: 'clamp',
  });

  // Generate a pseudo-random color based on image path
  const hash = imageSrc.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Placeholder - newspaper style gradient with text */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(180deg, #F8F8F8 0%, #E8E8E8 100%)`,
          transform: `scale(${scale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}
      >
        {/* Fake newspaper header */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 14,
            color: '#888',
            letterSpacing: '0.2em',
            marginBottom: 20,
          }}
        >
          TECHNOLOGY | ARTIFICIAL INTELLIGENCE
        </div>

        {/* Headline placeholder */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 64,
            fontWeight: 700,
            color: '#1A1A1A',
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          Claude Headline
        </div>

        {/* Subtext */}
        <div
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 12,
            color: '#999',
            marginTop: 30,
          }}
        >
          {imageSrc.split('/').pop()}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Default news articles for testing
 * User should replace with actual article screenshots
 */
export const defaultNewsArticles: NewsArticle[] = [
  {
    imageSrc: 'assets/news-article-1.png',
    durationFrames: 18,
    zoomAmount: 0.03,
    zoomDirection: 'in',
  },
  {
    imageSrc: 'assets/news-article-2.png',
    durationFrames: 15,
    zoomAmount: 0.04,
    zoomDirection: 'in',
  },
  {
    imageSrc: 'assets/news-article-3.png',
    durationFrames: 12,
    zoomAmount: 0.03,
    zoomDirection: 'out',
  },
  {
    imageSrc: 'assets/news-article-4.png',
    durationFrames: 18,
    zoomAmount: 0.05,
    zoomDirection: 'in',
  },
  {
    imageSrc: 'assets/news-article-5.png',
    durationFrames: 15,
    zoomAmount: 0.04,
    zoomDirection: 'in',
  },
  {
    imageSrc: 'assets/news-article-6.png',
    durationFrames: 17,
    zoomAmount: 0.03,
    zoomDirection: 'out',
  },
];

/**
 * Text Zoom Animation Component
 *
 * For scenes where text zooms in dramatically (frames 75-95)
 */
interface TextZoomProps {
  text: string;
  startScale?: number;
  endScale?: number;
  fontSize?: number;
  fontFamily?: string;
  backgroundColor?: string;
}

export const TextZoom: React.FC<TextZoomProps> = ({
  text,
  startScale = 0.5,
  endScale = 2.5,
  fontSize = 120,
  fontFamily = 'system-ui, -apple-system, sans-serif',
  backgroundColor = '#F8F8F8',
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 30], [startScale, endScale], {
    easing: Easing.out(Easing.ease),
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(frame, [20, 30], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize,
          fontWeight: 900,
          color: '#1A1A1A',
          transform: `scale(${scale})`,
          opacity,
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
