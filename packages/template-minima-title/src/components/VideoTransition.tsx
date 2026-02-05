/**
 * VideoTransition Component
 *
 * Handles the seamless transition from title card to video content.
 * Supports multiple transition styles that maintain the elegant aesthetic.
 */

import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Img, Video, OffthreadVideo } from 'remotion';
import { colors } from '@minima/brand';

export type TransitionType =
  | 'fade'           // Simple crossfade
  | 'fadeToBlack'    // Fade to black, then reveal video
  | 'scaleReveal'    // Scale up to reveal video underneath
  | 'slideUp'        // Title slides up to reveal video
  | 'maskWipe'       // Horizontal mask wipe
  | 'zoomThrough';   // Zoom into center, revealing video

type VideoTransitionProps = {
  startFrame: number;
  duration?: number;
  transitionType?: TransitionType;
  videoSrc?: string;
  imageSrc?: string;  // For static first frame
  backgroundColor?: string;
  children?: React.ReactNode;  // Title card content to transition from
};

export const VideoTransition: React.FC<VideoTransitionProps> = ({
  startFrame,
  duration = 30,
  transitionType = 'fade',
  videoSrc,
  imageSrc,
  backgroundColor = colors.black,
  children,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Get transition styles based on type
  const getTransitionStyles = () => {
    switch (transitionType) {
      case 'fade': {
        const titleOpacity = interpolate(progress, [0, 1], [1, 0]);
        const videoOpacity = interpolate(progress, [0, 1], [0, 1]);
        return {
          title: { opacity: titleOpacity },
          video: { opacity: videoOpacity },
          overlay: null,
        };
      }

      case 'fadeToBlack': {
        const titleOpacity = interpolate(progress, [0, 0.4], [1, 0], {
          extrapolateRight: 'clamp',
        });
        const videoOpacity = interpolate(progress, [0.5, 1], [0, 1], {
          extrapolateLeft: 'clamp',
        });
        const blackOpacity = interpolate(
          progress,
          [0, 0.4, 0.5, 1],
          [0, 1, 1, 0]
        );
        return {
          title: { opacity: titleOpacity },
          video: { opacity: videoOpacity },
          overlay: { backgroundColor: colors.black, opacity: blackOpacity },
        };
      }

      case 'scaleReveal': {
        const titleScale = interpolate(progress, [0, 1], [1, 1.2], {
          easing: Easing.bezier(0.65, 0, 0.35, 1),
        });
        const titleOpacity = interpolate(progress, [0, 0.8], [1, 0], {
          extrapolateRight: 'clamp',
        });
        const videoOpacity = interpolate(progress, [0.3, 1], [0, 1], {
          extrapolateLeft: 'clamp',
        });
        return {
          title: {
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
          },
          video: { opacity: videoOpacity },
          overlay: null,
        };
      }

      case 'slideUp': {
        const titleY = interpolate(progress, [0, 1], [0, -100], {
          easing: Easing.bezier(0.65, 0, 0.35, 1),
        });
        const titleOpacity = interpolate(progress, [0.5, 1], [1, 0], {
          extrapolateLeft: 'clamp',
        });
        const videoOpacity = interpolate(progress, [0.2, 0.8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return {
          title: {
            opacity: titleOpacity,
            transform: `translateY(${titleY}%)`,
          },
          video: { opacity: videoOpacity },
          overlay: null,
        };
      }

      case 'maskWipe': {
        const clipRight = interpolate(progress, [0, 1], [100, 0], {
          easing: Easing.bezier(0.65, 0, 0.35, 1),
        });
        return {
          title: { opacity: progress < 1 ? 1 : 0 },
          video: {
            clipPath: `inset(0 ${clipRight}% 0 0)`,
            opacity: 1,
          },
          overlay: null,
        };
      }

      case 'zoomThrough': {
        const titleScale = interpolate(progress, [0, 1], [1, 3], {
          easing: Easing.bezier(0.65, 0, 0.35, 1),
        });
        const titleOpacity = interpolate(progress, [0, 0.6], [1, 0], {
          extrapolateRight: 'clamp',
        });
        const videoOpacity = interpolate(progress, [0.4, 1], [0, 1], {
          extrapolateLeft: 'clamp',
        });
        const videoScale = interpolate(progress, [0.4, 1], [0.8, 1], {
          extrapolateLeft: 'clamp',
          easing: Easing.bezier(0.33, 1, 0.68, 1),
        });
        return {
          title: {
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
          },
          video: {
            opacity: videoOpacity,
            transform: `scale(${videoScale})`,
          },
          overlay: null,
        };
      }

      default:
        return {
          title: { opacity: 1 },
          video: { opacity: progress },
          overlay: null,
        };
    }
  };

  const styles = getTransitionStyles();

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Video/Image Layer (underneath) */}
      <AbsoluteFill style={styles.video}>
        {videoSrc && (
          <OffthreadVideo
            src={videoSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        {imageSrc && !videoSrc && (
          <Img
            src={imageSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </AbsoluteFill>

      {/* Title Card Layer (on top, transitions out) */}
      <AbsoluteFill style={styles.title}>
        {children}
      </AbsoluteFill>

      {/* Optional Overlay (for fadeToBlack) */}
      {styles.overlay && (
        <AbsoluteFill style={styles.overlay} />
      )}
    </AbsoluteFill>
  );
};
