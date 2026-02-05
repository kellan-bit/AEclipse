/**
 * Minima Title Template
 *
 * Animated logo and title card sequence for Minima video content.
 *
 * Compositions:
 * - MinimaTitle: Full sequence (logo → title → video transition)
 * - MinimaLogo: Just the logo animation
 * - MinimaTitleCard: Just the title card
 */

import { Composition, Folder } from 'remotion';
import { MinimaTitle, MinimaTitleProps } from './MinimaTitle';
import { LogoScene } from './scenes/LogoScene';
import { TitleCardScene } from './scenes/TitleCardScene';
import { themes } from '@minima/brand';

/**
 * VIDEO ASSET CONFIGURATION
 *
 * To use your own video:
 * 1. Place your video file in the public/ folder
 * 2. Update the videoSrc path below
 *
 * Example:
 *   videoSrc: staticFile('my-property-tour.mp4')
 *
 * For a static image instead:
 *   imageSrc: staticFile('hero-image.jpg')
 */
import { staticFile } from 'remotion';

// Default props for the full title sequence
const defaultTitleProps: MinimaTitleProps = {
  // Content
  title: 'The Rosa Blanca',
  subtitle: 'A Minima Residence',
  accentText: 'Where design meets discipline',

  // Video/Image asset (uncomment one):
  // videoSrc: staticFile('property-video.mp4'),  // ← Your video
  // imageSrc: staticFile('hero-image.jpg'),      // ← Or static image

  // Styling
  theme: 'dark',
  logoFontSize: 120,

  // Timing (in frames at 30fps)
  logoDuration: 90,        // 3 seconds - logo animation
  titleCardDuration: 75,   // 2.5 seconds - title display
  transitionDuration: 30,  // 1 second - transition to video

  // Transition style: 'fade' | 'fadeToBlack' | 'scaleReveal' | 'slideUp' | 'maskWipe' | 'zoomThrough'
  transitionType: 'fade',

  showTagline: true,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Minima Title">
        {/* Full Title Sequence - 16:9 Landscape */}
        <Composition
          id="MinimaTitle"
          component={MinimaTitle}
          durationInFrames={195}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={defaultTitleProps}
        />

        {/* Full Title Sequence - 9:16 Vertical (TikTok/Reels) */}
        <Composition
          id="MinimaTitleVertical"
          component={MinimaTitle}
          durationInFrames={195}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            ...defaultTitleProps,
            logoFontSize: 80,
          }}
        />

        {/* Full Title Sequence - 1:1 Square (Instagram) */}
        <Composition
          id="MinimaTitleSquare"
          component={MinimaTitle}
          durationInFrames={195}
          fps={30}
          width={1080}
          height={1080}
          defaultProps={{
            ...defaultTitleProps,
            logoFontSize: 90,
          }}
        />
      </Folder>

      <Folder name="Components">
        {/* Logo Animation Only */}
        <Composition
          id="MinimaLogo"
          component={LogoScene}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            theme: themes.dark,
            showTagline: true,
            fontSize: 120,
          }}
        />

        {/* Logo Animation - Light Theme */}
        <Composition
          id="MinimaLogoLight"
          component={LogoScene}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            theme: themes.light,
            showTagline: true,
            fontSize: 120,
          }}
        />

        {/* Title Card Only */}
        <Composition
          id="MinimaTitleCard"
          component={TitleCardScene}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: 'The Rosa Blanca',
            subtitle: 'A Minima Residence',
            accentText: 'Where design meets discipline',
            theme: themes.dark,
            startFrame: 0,
          }}
        />
      </Folder>
    </>
  );
};
