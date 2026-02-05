import React from 'react';
import { Series, AbsoluteFill } from 'remotion';
import { AnimatedTestimonialScene } from './scenes/AnimatedTestimonialScene';
import { AnimatedOpusIntro } from './scenes/AnimatedOpusIntro';
import { ProductQuoteCarousel } from './ProductQuoteCarousel';
import { EndCard } from './scenes/EndCard';
import { RectangularReveal } from './components/RectangularReveal';

interface OpusPromoV2Props {
  productName?: string;
  version?: string;
  brandName?: string;
}

/**
 * OpusPromoV2 - Frame-accurate reconstruction based on video analysis
 *
 * Frame structure from analysis:
 * - Frames 1-99: News montage (hard cuts) - simplified for now
 * - Frames 100-599: Testimonials with word-by-word typing + rectangular transitions
 * - Frames 600-719: Opus intro with text reveal + screenshots
 * - Frames 720-900: Quote carousel with INSTANT cuts (no fade)
 * - Frames 901-946: End card
 *
 * Key improvements over V1:
 * - RectangularReveal transitions (center-expanding rectangle)
 * - Word-by-word text typing via AnimatedTweetCard
 * - Instant quote cuts (no fade animation)
 * - Frame-accurate timing
 */
export const OpusPromoV2: React.FC<OpusPromoV2Props> = ({
  productName = 'Opus',
  version = '4.6',
  brandName = 'ANTHROPIC',
}) => {
  const quotes = [
    { text: 'just gets it.' },
    { text: 'is a huge leap.' },
    { text: 'flipped the script.' },
    { text: 'is incredible, no notes.' },
    { text: 'outperforms other models.' },
    { text: 'is redefining what we thought was possible.' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFFFFF' }}>
      <Series>
        {/* ===== TESTIMONIALS SECTION ===== */}
        {/* Each testimonial uses AnimatedTestimonialScene with:
            - Ken Burns zoom on background
            - AnimatedGeometricOverlay (lines animate in)
            - AnimatedTweetCard (card fades in, text types word-by-word)

            Transitions use RectangularReveal (rectangle expands from center)
        */}

        {/* Testimonial 1: Math - with rectangular reveal in */}
        <Series.Sequence durationInFrames={90}>
          <RectangularReveal startFrame={0} durationFrames={10}>
            <AnimatedTestimonialScene
              backgroundImage="assets/testimonial-math.png"
              username="ohnohanajo"
              tweetText="Math just made a little more sense. Thanks Claude."
              verified={true}
              profileColor="#E91E63"
              tweetPosition="bottom-left"
              cardAppearFrame={15}
              textStartFrame={35}
              framesPerWord={3}
              zoomAmount={0.05}
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* Testimonial 2: Hardware */}
        <Series.Sequence durationInFrames={90}>
          <RectangularReveal startFrame={0} durationFrames={10}>
            <AnimatedTestimonialScene
              backgroundImage="assets/testimonial-hardware.png"
              username="abe's projects"
              tweetText="I built the ultimate retro mini PC (it uses game cartridges!)"
              verified={true}
              profileColor="#3F51B5"
              tweetPosition="bottom-left"
              cardAppearFrame={15}
              textStartFrame={35}
              framesPerWord={3}
              zoomAmount={0.05}
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* Testimonial 3: MRI */}
        <Series.Sequence durationInFrames={75}>
          <RectangularReveal startFrame={0} durationFrames={10}>
            <AnimatedTestimonialScene
              backgroundImage="assets/testimonial-mri.png"
              username="tobi lutke"
              handle="@tobi"
              tweetText="My annual MRI scan gives me a USB stick."
              verified={true}
              profileColor="#00BCD4"
              tweetPosition="center"
              showGeometricOverlay={false}
              cardAppearFrame={15}
              textStartFrame={35}
              framesPerWord={3}
              zoomAmount={0.05}
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* Testimonial 4: Ocean */}
        <Series.Sequence durationInFrames={90}>
          <RectangularReveal startFrame={0} durationFrames={10}>
            <AnimatedTestimonialScene
              backgroundImage="assets/testimonial-ocean.png"
              username="filmwcolleen"
              tweetText="Filmed this with the help of one of my favorite tools: Claude."
              verified={true}
              profileColor="#9C27B0"
              tweetPosition="bottom-left"
              cardAppearFrame={15}
              textStartFrame={35}
              framesPerWord={3}
              zoomAmount={0.05}
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* Testimonial 5: Knitter */}
        <Series.Sequence durationInFrames={75}>
          <RectangularReveal startFrame={0} durationFrames={10}>
            <AnimatedTestimonialScene
              backgroundImage="assets/testimonial-knitter.png"
              username="(Abi)gail"
              handle="@proofofgail"
              tweetText={"Most people: I use Claude to vibe code.\nMe: I use Claude to vibe knit."}
              verified={true}
              profileColor="#4CAF50"
              tweetPosition="bottom-left"
              cardAppearFrame={15}
              textStartFrame={35}
              framesPerWord={3}
              zoomAmount={0.05}
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* Testimonial 6: School */}
        <Series.Sequence durationInFrames={75}>
          <RectangularReveal startFrame={0} durationFrames={10}>
            <AnimatedTestimonialScene
              backgroundImage="assets/testimonial-folders.png"
              username="inspo_by_jess"
              tweetText="My whole school adopted Claude."
              verified={false}
              profileColor="#FF9800"
              tweetPosition="bottom-center"
              showGeometricOverlay={false}
              cardAppearFrame={15}
              textStartFrame={35}
              framesPerWord={3}
              zoomAmount={0.05}
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* Testimonial 7: Mountain */}
        <Series.Sequence durationInFrames={75}>
          <RectangularReveal startFrame={0} durationFrames={10}>
            <AnimatedTestimonialScene
              backgroundImage="assets/testimonial-mountain.png"
              username="Ryan Wigley"
              tweetText={"Every morning my wife asks me\nif the mountains are out.\nSo I built her a website."}
              verified={true}
              profileColor="#607D8B"
              tweetPosition="center"
              showGeometricOverlay={false}
              cardAppearFrame={15}
              textStartFrame={35}
              framesPerWord={3}
              zoomAmount={0.05}
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* Mars Rover Feature */}
        <Series.Sequence durationInFrames={90}>
          <RectangularReveal startFrame={0} durationFrames={10}>
            <AnimatedTestimonialScene
              backgroundImage="assets/mars-rover.png"
              username="NASA/JPL"
              tweetText="The first AI-planned drive on Mars was powered by Claude."
              verified={true}
              profileColor="#F44336"
              tweetPosition="center"
              showGeometricOverlay={false}
              cardAppearFrame={15}
              textStartFrame={35}
              framesPerWord={3}
              zoomAmount={0.05}
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* ===== OPUS INTRO ===== */}
        {/* Animated text reveal:
            - Frame 0: Product name appears
            - Frame 20: "Introducing" fades in
            - Frame 40: Version appears
            - Frame 80+: Screenshots animate in with scale
        */}
        <Series.Sequence durationInFrames={120}>
          <RectangularReveal startFrame={0} durationFrames={10}>
            <AnimatedOpusIntro
              productName={productName}
              version={version}
              screenshotsImage="assets/opus-screenshots.png"
            />
          </RectangularReveal>
        </Series.Sequence>

        {/* ===== QUOTE CAROUSEL ===== */}
        {/* INSTANT CUTS between quotes (frame analysis confirmed: no fade)
            - Each quote stays ~35 frames
            - Hard cut to next quote (no transition animation)
        */}
        <Series.Sequence durationInFrames={210}>
          <ProductQuoteCarousel
            productName={`${productName} ${version}`}
            quotes={quotes}
            framesPerQuote={35}
            productFontSize={64}
            quoteFontSize={24}
          />
        </Series.Sequence>

        {/* ===== END CARD ===== */}
        {/* Simple fade in with scale */}
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
