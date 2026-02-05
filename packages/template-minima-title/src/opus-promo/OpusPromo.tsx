import React from 'react';
import { Series, AbsoluteFill } from 'remotion';
import { TestimonialScene } from './scenes/TestimonialScene';
import { OpusIntro } from './scenes/OpusIntro';
import { TestimonialCarousel } from './scenes/TestimonialCarousel';
import { EndCard } from './scenes/EndCard';

interface OpusPromoProps {
  productName?: string;
  version?: string;
  brandName?: string;
}

export const OpusPromo: React.FC<OpusPromoProps> = ({
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
        {/* Testimonial 1: Math */}
        <Series.Sequence durationInFrames={90}>
          <TestimonialScene
            backgroundImage="assets/testimonial-math.png"
            username="ohnohanajo"
            verified={true}
            tweetText="Math just made a little more sense. Thanks Claude."
            profileColor="#E91E63"
            tweetPosition="bottom-left"
          />
        </Series.Sequence>

        {/* Testimonial 2: Hardware */}
        <Series.Sequence durationInFrames={90}>
          <TestimonialScene
            backgroundImage="assets/testimonial-hardware.png"
            username="abe's projects"
            verified={true}
            tweetText="I built the ultimate retro mini PC (it uses game cartridges!)"
            profileColor="#3F51B5"
            tweetPosition="bottom-left"
          />
        </Series.Sequence>

        {/* Testimonial 3: MRI */}
        <Series.Sequence durationInFrames={75}>
          <TestimonialScene
            backgroundImage="assets/testimonial-mri.png"
            username="tobi lutke"
            handle="@tobi"
            verified={true}
            tweetText="My annual MRI scan gives me a USB stick."
            profileColor="#00BCD4"
            tweetPosition="center"
            showGeometricOverlay={false}
          />
        </Series.Sequence>

        {/* Testimonial 4: Ocean */}
        <Series.Sequence durationInFrames={90}>
          <TestimonialScene
            backgroundImage="assets/testimonial-ocean.png"
            username="filmwcolleen"
            verified={true}
            tweetText="Filmed this with the help of one of my favorite tools: Claude."
            profileColor="#9C27B0"
            tweetPosition="bottom-left"
          />
        </Series.Sequence>

        {/* Testimonial 5: Knitter */}
        <Series.Sequence durationInFrames={75}>
          <TestimonialScene
            backgroundImage="assets/testimonial-knitter.png"
            username="(Abi)gail"
            handle="@proofofgail"
            verified={true}
            tweetText={"Most people: I use Claude to vibe code.\nMe: I use Claude to vibe knit."}
            profileColor="#4CAF50"
            tweetPosition="bottom-left"
          />
        </Series.Sequence>

        {/* Testimonial 6: School */}
        <Series.Sequence durationInFrames={75}>
          <TestimonialScene
            backgroundImage="assets/testimonial-folders.png"
            username="inspo_by_jess"
            verified={false}
            tweetText="My whole school adopted Claude."
            profileColor="#FF9800"
            tweetPosition="bottom-center"
            showGeometricOverlay={false}
          />
        </Series.Sequence>

        {/* Testimonial 7: Mountain with quote */}
        <Series.Sequence durationInFrames={75}>
          <TestimonialScene
            backgroundImage="assets/testimonial-mountain.png"
            username="Ryan Wigley"
            verified={true}
            tweetText={"Every morning my wife asks me\nif the mountains are out.\nSo I built her a website."}
            profileColor="#607D8B"
            tweetPosition="center"
            showGeometricOverlay={false}
          />
        </Series.Sequence>

        {/* Mars Rover Feature */}
        <Series.Sequence durationInFrames={90}>
          <TestimonialScene
            backgroundImage="assets/mars-rover.png"
            username="NASA/JPL"
            verified={true}
            tweetText="The first AI-planned drive on Mars was powered by Claude."
            profileColor="#F44336"
            tweetPosition="center"
            showGeometricOverlay={false}
          />
        </Series.Sequence>

        {/* Opus Intro */}
        <Series.Sequence durationInFrames={120}>
          <OpusIntro
            productName={productName}
            version={version}
            screenshotsImage="assets/opus-screenshots.png"
            showScreenshots={true}
          />
        </Series.Sequence>

        {/* Testimonial Carousel */}
        <Series.Sequence durationInFrames={180}>
          <TestimonialCarousel
            productName={productName}
            version={version}
            quotes={quotes}
            framesPerQuote={30}
          />
        </Series.Sequence>

        {/* End Card */}
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
