// Opus Promo Template
// Social media testimonial video format

// Main compositions
export { OpusPromo } from './OpusPromo';
export { OpusPromoV2 } from './OpusPromoV2';
export { OpusPromoV3 } from './OpusPromoV3';
export { ProductQuoteCarousel } from './ProductQuoteCarousel';

// Original components
export { TweetCard } from './components/TweetCard';
export { GeometricOverlay } from './components/GeometricOverlay';

// V2 Animated components (frame-accurate)
export { TypewriterText } from './components/TypewriterText';
export { RectangularReveal } from './components/RectangularReveal';
export { AnimatedTweetCard } from './components/AnimatedTweetCard';
export { AnimatedGeometricOverlay } from './components/AnimatedGeometricOverlay';

// V3 Advanced components (from comprehensive analysis)
export { PhotoMosaicTransition, defaultMosaicImages } from './components/PhotoMosaicTransition';
export { AnimatedRectangleOverlay, defaultRectangles, boldRectangles } from './components/AnimatedRectangleOverlay';
export { CapabilityShowcase, defaultCapabilities } from './components/CapabilityShowcase';
export { VideoLayer, VideoLayerWithZoom } from './components/VideoLayer';
export { TweetCardWithProfile } from './components/TweetCardWithProfile';

// Original scenes
export { TestimonialScene } from './scenes/TestimonialScene';
export { OpusIntro } from './scenes/OpusIntro';
export { TestimonialCarousel } from './scenes/TestimonialCarousel';
export { EndCard } from './scenes/EndCard';

// V2 Animated scenes (frame-accurate)
export { AnimatedTestimonialScene } from './scenes/AnimatedTestimonialScene';
export { AnimatedOpusIntro } from './scenes/AnimatedOpusIntro';

// V3 Advanced scenes (from comprehensive analysis)
export { NewsArticleMontage, TextZoom, defaultNewsArticles } from './scenes/NewsArticleMontage';

// Asset Management
export {
  defaultAssetManifest,
  getAssetPath,
  checkRequiredAssets,
  getUploadProgress,
  markAssetUploaded,
} from './assets/AssetManager';
export type { AssetDefinition, AssetManifest } from './assets/AssetManager';
