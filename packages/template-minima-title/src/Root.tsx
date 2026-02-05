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
import { z } from 'zod';
import { MinimaTitle } from './MinimaTitle';
import { LogoScene } from './scenes/LogoScene';
import { TitleCardScene } from './scenes/TitleCardScene';

// ============================================
// SCHEMAS - Enable UI editing for all compositions
// ============================================

// Full title sequence schema
const minimaTitleSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  accentText: z.string().optional(),
  videoSrc: z.string().optional(),
  imageSrc: z.string().optional(),
  theme: z.enum(['dark', 'light', 'contrast', 'warm']),
  logoFontSize: z.number(),
  logoDuration: z.number(),
  titleCardDuration: z.number(),
  transitionDuration: z.number(),
  transitionType: z.enum(['fade', 'fadeToBlack', 'scaleReveal', 'slideUp', 'maskWipe', 'zoomThrough']),
  showTagline: z.boolean(),
});

// Logo scene schema
const logoSceneSchema = z.object({
  showTagline: z.boolean(),
  fontSize: z.number(),
  themeName: z.enum(['dark', 'light', 'contrast', 'warm']),
});

// Title card scene schema
const titleCardSceneSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  accentText: z.string().optional(),
  themeName: z.enum(['dark', 'light', 'contrast', 'warm']),
  startFrame: z.number(),
});

// ============================================
// COMPOSITIONS
// ============================================

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Minima-Title">
        {/* Full Title Sequence - 16:9 Landscape */}
        <Composition
          id="MinimaTitle"
          component={MinimaTitle}
          durationInFrames={195}
          fps={30}
          width={1920}
          height={1080}
          schema={minimaTitleSchema}
          defaultProps={{
            title: 'The Rosa Blanca',
            subtitle: 'A Minima Residence',
            accentText: 'Where design meets discipline',
            theme: 'dark',
            logoFontSize: 120,
            logoDuration: 90,
            titleCardDuration: 75,
            transitionDuration: 30,
            transitionType: 'fade',
            showTagline: true,
          }}
        />

        {/* Full Title Sequence - 9:16 Vertical (TikTok/Reels) */}
        <Composition
          id="MinimaTitleVertical"
          component={MinimaTitle}
          durationInFrames={195}
          fps={30}
          width={1080}
          height={1920}
          schema={minimaTitleSchema}
          defaultProps={{
            title: 'The Rosa Blanca',
            subtitle: 'A Minima Residence',
            accentText: 'Where design meets discipline',
            theme: 'dark',
            logoFontSize: 80,
            logoDuration: 90,
            titleCardDuration: 75,
            transitionDuration: 30,
            transitionType: 'fade',
            showTagline: true,
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
          schema={minimaTitleSchema}
          defaultProps={{
            title: 'The Rosa Blanca',
            subtitle: 'A Minima Residence',
            accentText: 'Where design meets discipline',
            theme: 'dark',
            logoFontSize: 90,
            logoDuration: 90,
            titleCardDuration: 75,
            transitionDuration: 30,
            transitionType: 'fade',
            showTagline: true,
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
          schema={logoSceneSchema}
          defaultProps={{
            themeName: 'dark',
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
          schema={logoSceneSchema}
          defaultProps={{
            themeName: 'light',
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
          schema={titleCardSceneSchema}
          defaultProps={{
            title: 'The Rosa Blanca',
            subtitle: 'A Minima Residence',
            accentText: 'Where design meets discipline',
            themeName: 'dark',
            startFrame: 0,
          }}
        />
      </Folder>
    </>
  );
};
