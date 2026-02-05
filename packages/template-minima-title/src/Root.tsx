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
import { OpusPromo } from './opus-promo/OpusPromo';
import { OpusPromoV2 } from './opus-promo/OpusPromoV2';
import { TestimonialScene } from './opus-promo/scenes/TestimonialScene';
import { AnimatedTestimonialScene } from './opus-promo/scenes/AnimatedTestimonialScene';
import { OpusIntro } from './opus-promo/scenes/OpusIntro';
import { AnimatedOpusIntro } from './opus-promo/scenes/AnimatedOpusIntro';
import { TestimonialCarousel } from './opus-promo/scenes/TestimonialCarousel';
import { EndCard } from './opus-promo/scenes/EndCard';
import { ProductQuoteCarousel } from './opus-promo/ProductQuoteCarousel';

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

// Opus Promo schema
const opusPromoSchema = z.object({
  productName: z.string(),
  version: z.string(),
  brandName: z.string(),
});

// Testimonial scene schema
const testimonialSceneSchema = z.object({
  backgroundImage: z.string(),
  username: z.string(),
  handle: z.string().optional(),
  tweetText: z.string(),
  verified: z.boolean(),
  profileColor: z.string(),
  showGeometricOverlay: z.boolean(),
  tweetPosition: z.enum(['center', 'bottom-left', 'bottom-center']),
  zoomAmount: z.number(),
});

// Animated Testimonial scene schema (V2 with word-by-word typing)
const animatedTestimonialSceneSchema = z.object({
  backgroundImage: z.string(),
  username: z.string(),
  handle: z.string().optional(),
  tweetText: z.string(),
  verified: z.boolean(),
  profileColor: z.string(),
  showGeometricOverlay: z.boolean(),
  tweetPosition: z.enum(['center', 'bottom-left', 'bottom-center']),
  zoomAmount: z.number(),
  cardAppearFrame: z.number(),
  textStartFrame: z.number(),
  framesPerWord: z.number(),
});

// Opus intro schema
const opusIntroSchema = z.object({
  productName: z.string(),
  version: z.string(),
  screenshotsImage: z.string(),
  showScreenshots: z.boolean(),
});

// End card schema
const endCardSchema = z.object({
  productName: z.string(),
  version: z.string(),
  brandName: z.string(),
});

// Product Quote Carousel schema - the clean rotating quotes format
const productQuoteCarouselSchema = z.object({
  productName: z.string(),
  framesPerQuote: z.number(),
  productFontSize: z.number(),
  quoteFontSize: z.number(),
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

      <Folder name="Opus-Promo">
        {/* Full Opus Promo Video V2 - Frame-accurate with new animations */}
        <Composition
          id="OpusPromoV2"
          component={OpusPromoV2}
          durationInFrames={1050}
          fps={30}
          width={1920}
          height={1080}
          schema={opusPromoSchema}
          defaultProps={{
            productName: 'Opus',
            version: '4.6',
            brandName: 'ANTHROPIC',
          }}
        />

        {/* Full Opus Promo Video (Original) */}
        <Composition
          id="OpusPromo"
          component={OpusPromo}
          durationInFrames={1020}
          fps={30}
          width={1920}
          height={1080}
          schema={opusPromoSchema}
          defaultProps={{
            productName: 'Opus',
            version: '4.6',
            brandName: 'ANTHROPIC',
          }}
        />

        {/* Single Testimonial Scene */}
        <Composition
          id="TestimonialScene"
          component={TestimonialScene}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
          schema={testimonialSceneSchema}
          defaultProps={{
            backgroundImage: 'assets/testimonial-math.png',
            username: 'ohnohanajo',
            handle: undefined,
            tweetText: 'Math just made a little more sense. Thanks Claude.',
            verified: true,
            profileColor: '#E91E63',
            showGeometricOverlay: true,
            tweetPosition: 'bottom-left',
            zoomAmount: 0.05,
          }}
        />

        {/* Animated Testimonial Scene V2 - with word-by-word typing */}
        <Composition
          id="AnimatedTestimonialScene"
          component={AnimatedTestimonialScene}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
          schema={animatedTestimonialSceneSchema}
          defaultProps={{
            backgroundImage: 'assets/testimonial-math.png',
            username: 'ohnohanajo',
            handle: undefined,
            tweetText: 'Math just made a little more sense. Thanks Claude.',
            verified: true,
            profileColor: '#E91E63',
            showGeometricOverlay: true,
            tweetPosition: 'bottom-left',
            zoomAmount: 0.05,
            cardAppearFrame: 10,
            textStartFrame: 30,
            framesPerWord: 3,
          }}
        />

        {/* Animated Opus Intro V2 - text reveal + screenshots */}
        <Composition
          id="AnimatedOpusIntro"
          component={AnimatedOpusIntro}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          schema={opusIntroSchema}
          defaultProps={{
            productName: 'Opus',
            version: '4.6',
            screenshotsImage: 'assets/opus-screenshots.png',
            showScreenshots: true,
          }}
        />

        {/* Opus Intro */}
        <Composition
          id="OpusIntro"
          component={OpusIntro}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
          schema={opusIntroSchema}
          defaultProps={{
            productName: 'Opus',
            version: '4.6',
            screenshotsImage: 'assets/opus-screenshots.png',
            showScreenshots: true,
          }}
        />

        {/* End Card */}
        <Composition
          id="OpusEndCard"
          component={EndCard}
          durationInFrames={60}
          fps={30}
          width={1920}
          height={1080}
          schema={endCardSchema}
          defaultProps={{
            productName: 'Opus',
            version: '4.6',
            brandName: 'ANTHROPIC',
          }}
        />

        {/* Product Quote Carousel - Clean rotating quotes */}
        <Composition
          id="ProductQuoteCarousel"
          component={ProductQuoteCarousel}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
          schema={productQuoteCarouselSchema}
          calculateMetadata={() => {
            return {
              props: {
                productName: 'Opus 4.6',
                quotes: [
                  { text: 'just gets it.' },
                  { text: 'is a huge leap.' },
                  { text: 'flipped the script.' },
                  { text: 'is incredible, no notes.' },
                  { text: 'outperforms other models.' },
                  { text: 'is redefining what we thought was possible.' },
                ],
                framesPerQuote: 35,
                productFontSize: 64,
                quoteFontSize: 24,
              },
            };
          }}
          defaultProps={{
            productName: 'Opus 4.6',
            quotes: [
              { text: 'just gets it.' },
              { text: 'is a huge leap.' },
              { text: 'flipped the script.' },
              { text: 'is incredible, no notes.' },
              { text: 'outperforms other models.' },
              { text: 'is redefining what we thought was possible.' },
            ],
            framesPerQuote: 35,
            productFontSize: 64,
            quoteFontSize: 24,
          }}
        />
      </Folder>
    </>
  );
};
