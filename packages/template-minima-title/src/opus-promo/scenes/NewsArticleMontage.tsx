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

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img
        src={staticFile(imageSrc)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
        }}
      />
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
