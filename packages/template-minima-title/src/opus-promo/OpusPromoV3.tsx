import React from 'react';
import { Series, AbsoluteFill, Img, staticFile } from 'remotion';

// V3 Components
import { NewsArticleMontage, TextZoom } from './scenes/NewsArticleMontage';
import { VideoLayer } from './components/VideoLayer';
import { AnimatedRectangleOverlay } from './components/AnimatedRectangleOverlay';
import { TweetCardWithProfile } from './components/TweetCardWithProfile';
import { PhotoMosaicTransition } from './components/PhotoMosaicTransition';
import { CapabilityShowcase } from './components/CapabilityShowcase';
import { ProductQuoteCarousel } from './ProductQuoteCarousel';
import { EndCard } from './scenes/EndCard';
import { RectangularReveal } from './components/RectangularReveal';

// V2 Components for testimonials
import { AnimatedTestimonialScene } from './scenes/AnimatedTestimonialScene';
import { AnimatedOpusIntro } from './scenes/AnimatedOpusIntro';

interface OpusPromoV3Props {
  productName?: string;
  version?: string;
  brandName?: string;
  // Asset paths - user uploads these
  newsArticles?: string[];
  womanWalkingVideo?: string;
  profileImages?: Record<string, string>;
  mosaicImages?: string[];
  capabilityScreenshots?: string[];
}

/**
 * OpusPromoV3 - Complete reconstruction using all analyzed components
 *
 * Based on comprehensive frame-by-frame analysis:
 * - Frames 1-95: News article montage (hard cuts)
 * - Frames 95-100: Claude text transition
 * - Frames 100-130: Video with rectangle overlay + tweet
 * - Frames 130-550: Testimonials with real profiles
 * - Frames 540-570: Photo mosaic transition
 * - Frames 570-620: Opus intro
 * - Frames 620-750: Capability showcase
 * - Frames 750-900: Quote carousel (instant cuts)
 * - Frames 900-946: End card
 */
export const OpusPromoV3: React.FC<OpusPromoV3Props> = ({
  productName = 'Opus',
  version = '4.5',
  brandName = 'ANTHROPIC',
  newsArticles = [],
  womanWalkingVideo,
  profileImages = {},
  mosaicImages = [],
  capabilityScreenshots = [],
}) => {
  // Default news articles if none provided
  const defaultArticles = [
    { imageSrc: 'assets/news-article-1.png', durationFrames: 15, zoomAmount: 0.03 },
    { imageSrc: 'assets/news-article-2.png', durationFrames: 12, zoomAmount: 0.04 },
    { imageSrc: 'assets/news-article-3.png', durationFrames: 15, zoomAmount: 0.03 },
    { imageSrc: 'assets/news-article-4.png', durationFrames: 12, zoomAmount: 0.05 },
    { imageSrc: 'assets/news-article-5.png', durationFrames: 15, zoomAmount: 0.04 },
    { imageSrc: 'assets/news-article-6.png', durationFrames: 12, zoomAmount: 0.03 },
  ];

  const articles = newsArticles.length > 0
    ? newsArticles.map((src, i) => ({
        imageSrc: src,
        durationFrames: 15,
        zoomAmount: 0.04,
        zoomDirection: i % 2 === 0 ? 'in' as const : 'out' as const,
      }))
    : defaultArticles;

  // Quotes for carousel
  const quotes = [
    { text: 'just gets it.' },
    { text: 'feels state of the art.' },
    { text: 'is a huge leap.' },
    { text: 'flipped the script.' },
    { text: 'is incredible, no notes.' },
    { text: 'is redefining what we thought was possible.' },
  ];

  // Mosaic images config
  const mosaicConfig = mosaicImages.length > 0
    ? mosaicImages.map((src, i) => ({
        src,
        initialX: (i % 3 - 1) * 35,
        initialY: (Math.floor(i / 3) - 1) * 30,
        rotation: (i - 4) * 3,
        scale: 0.9 + (i % 3) * 0.1,
        delay: i * 2,
      }))
    : [
        { src: 'assets/mosaic-1.png', initialX: -30, initialY: -25, rotation: -8, scale: 1.1, delay: 0 },
        { src: 'assets/mosaic-2.png', initialX: 25, initialY: -20, rotation: 5, scale: 1.0, delay: 2 },
        { src: 'assets/mosaic-3.png', initialX: -25, initialY: 20, rotation: -3, scale: 0.9, delay: 4 },
        { src: 'assets/mosaic-4.png', initialX: 30, initialY: 25, rotation: 7, scale: 1.05, delay: 6 },
        { src: 'assets/mosaic-5.png', initialX: 0, initialY: -30, rotation: -2, scale: 0.95, delay: 3 },
        { src: 'assets/mosaic-6.png', initialX: -35, initialY: 0, rotation: 4, scale: 1.0, delay: 5 },
      ];

  // Capability showcase config
  const capabilities = capabilityScreenshots.length > 0
    ? capabilityScreenshots.map((src, i) => ({
        prompt: [
          'Build me a drum machine where I can record my own samples',
          'Help me analyze how our different foams affect the ride and impact levels',
          'I want to build a custom typography generator',
          'Create a style guide for our new brand identity',
          "Let's make an interactive dashboard to track our Q1 campaign",
        ][i % 5],
        screenshotSrc: src,
        x: [-50, 45, 50, -45, -55][i % 5],
        y: [-20, -35, 25, 35, 5][i % 5],
        rotation: [-3, 2, 4, -2, -4][i % 5],
        scale: [0.95, 1.0, 1.0, 0.9, 0.85][i % 5],
        delay: 5 + i * 4,
      }))
    : [
        { prompt: 'Build me a drum machine', screenshotSrc: 'assets/capability-1.png', x: 45, y: -35, rotation: 2, scale: 1.0, delay: 5 },
        { prompt: 'Help me analyze data', screenshotSrc: 'assets/capability-2.png', x: -50, y: -20, rotation: -3, scale: 0.95, delay: 9 },
        { prompt: 'Build a typography tool', screenshotSrc: 'assets/capability-3.png', x: 50, y: 25, rotation: 4, scale: 1.0, delay: 13 },
        { prompt: 'Create a style guide', screenshotSrc: 'assets/capability-4.png', x: -45, y: 35, rotation: -2, scale: 0.9, delay: 17 },
      ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFFFFF' }}>
      <Series>
        {/* ===== SEGMENT 1: NEWS ARTICLE MONTAGE (frames 1-95) ===== */}
        <Series.Sequence durationInFrames={95}>
          <NewsArticleMontage articles={articles} />
        </Series.Sequence>

        {/* ===== SEGMENT 2: CLAUDE TEXT TRANSITION (frames 95-100) ===== */}
        <Series.Sequence durationInFrames={15}>
          <TextZoom
            text="Claude"
            startScale={1}
            endScale={1.5}
            fontSize={140}
            fontFamily="Georgia, serif"
            backgroundColor="#F8F8F8"
          />
        </Series.Sequence>

        {/* ===== SEGMENT 3: VIDEO WITH OVERLAY (frames 100-160) ===== */}
        <Series.Sequence durationInFrames={60}>
          <AbsoluteFill>
            {/* Video layer - falls back to image if no video */}
            {womanWalkingVideo ? (
              <VideoLayer src={womanWalkingVideo} />
            ) : (
              <Img
                src={staticFile('assets/woman-walking-fallback.png')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            {/* Animated rectangle overlay */}
            <AnimatedRectangleOverlay
              strokeColor="#FFFFFF"
              strokeWidth={2}
              drawDuration={15}
            />

            {/* Tweet card appearing */}
            <div
              style={{
                position: 'absolute',
                left: 60,
                bottom: 120,
              }}
            >
              <TweetCardWithProfile
                username="ohnohanajo"
                text="Math just made a little more sense. Thanks Claude."
                verified={true}
                profileImageSrc={profileImages['ohnohanajo']}
                profileColor="#E91E63"
                cardAppearFrame={20}
                textStartFrame={35}
                framesPerWord={3}
                cardWidth={380}
              />
            </div>
          </AbsoluteFill>
        </Series.Sequence>

        {/* ===== SEGMENT 4: TESTIMONIALS (frames 160-500) ===== */}
        {/* Testimonial 1: Math/Chalkboard */}
        <Series.Sequence durationInFrames={60}>
          <RectangularReveal startFrame={0} durationFrames={8}>
            <AnimatedTestimonialScene
              backgroundImage="assets/testimonial-math.png"
              username="ohnohanajo"
              tweetText="Math just made a little more sense. Thanks Claude."
              verified={true}
              profileColor="#E91E63"
              tweetPosition="bottom-left"
              cardAppearFrame={10}
              textStartFrame={25}
              framesPerWord={3}
              zoomAmount={0.05}
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* Testimonial 2: Hardware */}
        <Series.Sequence durationInFrames={55}>
          <RectangularReveal startFrame={0} durationFrames={8}>
            <AnimatedTestimonialScene
              backgroundImage="assets/testimonial-hardware.png"
              username="abe's projects"
              tweetText="I built the ultimate retro mini PC (it uses game cartridges!)"
              verified={true}
              profileColor="#3F51B5"
              tweetPosition="bottom-left"
              cardAppearFrame={10}
              textStartFrame={25}
              framesPerWord={3}
              zoomAmount={0.05}
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* Testimonial 3: MRI */}
        <Series.Sequence durationInFrames={55}>
          <RectangularReveal startFrame={0} durationFrames={8}>
            <AnimatedTestimonialScene
              backgroundImage="assets/testimonial-mri.png"
              username="tobi lutke"
              handle="@tobi"
              tweetText="My annual MRI scan gives me a USB stick."
              verified={true}
              profileColor="#00BCD4"
              tweetPosition="center"
              showGeometricOverlay={false}
              cardAppearFrame={10}
              textStartFrame={25}
              framesPerWord={3}
              zoomAmount={0.05}
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* Testimonial 4: Ocean */}
        <Series.Sequence durationInFrames={55}>
          <RectangularReveal startFrame={0} durationFrames={8}>
            <AnimatedTestimonialScene
              backgroundImage="assets/testimonial-ocean.png"
              username="filmwcolleen"
              tweetText="Filmed this with the help of one of my favorite tools: Claude."
              verified={true}
              profileColor="#9C27B0"
              tweetPosition="center"
              showGeometricOverlay={false}
              cardAppearFrame={10}
              textStartFrame={25}
              framesPerWord={3}
              zoomAmount={0.05}
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* Testimonial 5: Knitter */}
        <Series.Sequence durationInFrames={55}>
          <RectangularReveal startFrame={0} durationFrames={8}>
            <AnimatedTestimonialScene
              backgroundImage="assets/testimonial-knitter.png"
              username="(Abi)gail"
              handle="@proofofgail"
              tweetText={"Most people: I use Claude to vibe code.\nMe: I use Claude to vibe knit."}
              verified={true}
              profileColor="#4CAF50"
              tweetPosition="bottom-left"
              cardAppearFrame={10}
              textStartFrame={25}
              framesPerWord={3}
              zoomAmount={0.05}
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* Testimonial 6: Mountain */}
        <Series.Sequence durationInFrames={55}>
          <RectangularReveal startFrame={0} durationFrames={8}>
            <AnimatedTestimonialScene
              backgroundImage="assets/testimonial-mountain.png"
              username="Ryan Wigley"
              tweetText={"Every morning my wife asks me\nif the mountains are out.\nSo I built her a website."}
              verified={true}
              profileColor="#607D8B"
              tweetPosition="center"
              showGeometricOverlay={false}
              cardAppearFrame={10}
              textStartFrame={25}
              framesPerWord={3}
              zoomAmount={0.05}
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* ===== SEGMENT 5: PHOTO MOSAIC TRANSITION (frames 500-540) ===== */}
        <Series.Sequence durationInFrames={40}>
          <PhotoMosaicTransition
            images={mosaicConfig}
            durationFrames={40}
          />
        </Series.Sequence>

        {/* ===== SEGMENT 6: OPUS INTRO (frames 540-600) ===== */}
        <Series.Sequence durationInFrames={60}>
          <AnimatedOpusIntro
            productName={productName}
            version={version}
            screenshotsImage="assets/opus-screenshots.png"
          />
        </Series.Sequence>

        {/* ===== SEGMENT 7: CAPABILITY SHOWCASE (frames 600-720) ===== */}
        <Series.Sequence durationInFrames={120}>
          <CapabilityShowcase
            centerText={productName}
            centerSubtext="Introducing"
            capabilities={capabilities}
          />
        </Series.Sequence>

        {/* ===== SEGMENT 8: QUOTE CAROUSEL (frames 720-900) ===== */}
        <Series.Sequence durationInFrames={180}>
          <ProductQuoteCarousel
            productName={`${productName} ${version}`}
            quotes={quotes}
            framesPerQuote={30}
            productFontSize={64}
            quoteFontSize={24}
          />
        </Series.Sequence>

        {/* ===== SEGMENT 9: END CARD (frames 900-946) ===== */}
        <Series.Sequence durationInFrames={60}>
          <EndCard
            productName={productName}
            version={version}
            brandName={brandName}
          />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
