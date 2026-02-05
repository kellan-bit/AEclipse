import React from 'react';
import {
  AbsoluteFill,
  Video,
  OffthreadVideo,
  staticFile,
  useVideoConfig,
} from 'remotion';

interface VideoLayerProps {
  src: string;
  startFrom?: number; // frame to start video from
  playbackRate?: number;
  muted?: boolean;
  volume?: number;
  style?: React.CSSProperties;
  useOffthread?: boolean; // Use OffthreadVideo for better performance
  objectFit?: 'cover' | 'contain' | 'fill';
}

/**
 * Video Layer
 *
 * Plays a video file as a background layer.
 * Used for testimonial scenes with live video (e.g., woman walking).
 * Supports both Video and OffthreadVideo components.
 */
export const VideoLayer: React.FC<VideoLayerProps> = ({
  src,
  startFrom = 0,
  playbackRate = 1,
  muted = true,
  volume = 0,
  style = {},
  useOffthread = true,
  objectFit = 'cover',
}) => {
  const { fps } = useVideoConfig();
  const startFromSeconds = startFrom / fps;

  const VideoComponent = useOffthread ? OffthreadVideo : Video;

  return (
    <AbsoluteFill>
      <VideoComponent
        src={staticFile(src)}
        startFrom={startFromSeconds}
        playbackRate={playbackRate}
        muted={muted}
        volume={volume}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          ...style,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Video Layer with Ken Burns effect
 */
interface VideoLayerWithZoomProps extends VideoLayerProps {
  zoomAmount?: number;
  zoomDirection?: 'in' | 'out';
}

export const VideoLayerWithZoom: React.FC<VideoLayerWithZoomProps> = ({
  src,
  startFrom = 0,
  playbackRate = 1,
  muted = true,
  volume = 0,
  style = {},
  useOffthread = true,
  objectFit = 'cover',
  zoomAmount = 0.1,
  zoomDirection = 'in',
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const startFromSeconds = startFrom / fps;

  const VideoComponent = useOffthread ? OffthreadVideo : Video;

  // Ken Burns zoom calculated via CSS animation
  // Note: For precise control, use interpolate with useCurrentFrame
  const initialScale = zoomDirection === 'in' ? 1 : 1 + zoomAmount;
  const finalScale = zoomDirection === 'in' ? 1 + zoomAmount : 1;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <VideoComponent
        src={staticFile(src)}
        startFrom={startFromSeconds}
        playbackRate={playbackRate}
        muted={muted}
        volume={volume}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          transform: `scale(${initialScale})`,
          animation: `kenburns ${durationInFrames / fps}s linear forwards`,
          ...style,
        }}
      />
      <style>
        {`
          @keyframes kenburns {
            from { transform: scale(${initialScale}); }
            to { transform: scale(${finalScale}); }
          }
        `}
      </style>
    </AbsoluteFill>
  );
};
