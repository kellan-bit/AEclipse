/**
 * Asset Manager for Video Reverse Engineering
 *
 * Tracks required assets, uploaded assets, and provides
 * a bridge between the manifest and Remotion components.
 */

export interface AssetDefinition {
  id: string;
  category: 'background' | 'video' | 'profile' | 'screenshot' | 'texture';
  description: string;
  required: boolean;
  uploaded: boolean;
  path?: string;
  fallback?: string;
}

export interface AssetManifest {
  backgrounds: AssetDefinition[];
  videos: AssetDefinition[];
  profiles: AssetDefinition[];
  screenshots: AssetDefinition[];
  textures: AssetDefinition[];
}

/**
 * Default asset manifest based on comprehensive video analysis
 * Assets marked as uploaded: false need to be provided by the user
 */
export const defaultAssetManifest: AssetManifest = {
  backgrounds: [
    {
      id: 'news_website_1',
      category: 'background',
      description: 'Tech news website with Claude headline',
      required: true,
      uploaded: false,
      fallback: 'assets/placeholder-news.png',
    },
    {
      id: 'newspaper_article',
      category: 'background',
      description: 'Newspaper-style article with Claude headline',
      required: true,
      uploaded: false,
      fallback: 'assets/placeholder-news.png',
    },
    {
      id: 'chalkboard_math',
      category: 'background',
      description: 'Chalkboard with mathematical equations',
      required: true,
      uploaded: false,
      fallback: 'assets/testimonial-math.png',
    },
    {
      id: 'hardware_workspace',
      category: 'background',
      description: 'Electronics/PCB workspace with hands',
      required: true,
      uploaded: false,
      fallback: 'assets/testimonial-hardware.png',
    },
    {
      id: 'mri_scan',
      category: 'background',
      description: 'MRI brain scan on dark display',
      required: true,
      uploaded: false,
      fallback: 'assets/testimonial-mri.png',
    },
    {
      id: 'ocean_sky_split',
      category: 'background',
      description: 'Ocean waves / blue sky split image',
      required: true,
      uploaded: false,
      fallback: 'assets/testimonial-ocean.png',
    },
    {
      id: 'knitter_photo',
      category: 'background',
      description: 'Woman laughing in knitted sweater',
      required: true,
      uploaded: false,
      fallback: 'assets/testimonial-knitter.png',
    },
    {
      id: 'plumbing_system',
      category: 'background',
      description: 'Copper plumbing and heating system',
      required: false,
      uploaded: false,
      fallback: 'assets/placeholder-industrial.png',
    },
    {
      id: 'mountain_landscape',
      category: 'background',
      description: 'Mount Rainier with town in foreground',
      required: true,
      uploaded: false,
      fallback: 'assets/testimonial-mountain.png',
    },
  ],
  videos: [
    {
      id: 'woman_walking',
      category: 'video',
      description: 'Woman walking past stone wall (2-3 seconds)',
      required: true,
      uploaded: false,
      fallback: undefined, // No fallback for video
    },
  ],
  profiles: [
    {
      id: 'profile_ohnohanajo',
      category: 'profile',
      description: 'Profile picture for @ohnohanajo',
      required: true,
      uploaded: false,
      fallback: undefined, // Will use colored circle
    },
    {
      id: 'profile_abes_projects',
      category: 'profile',
      description: 'Cartoon avatar for abe\'s projects',
      required: true,
      uploaded: false,
      fallback: undefined,
    },
    {
      id: 'profile_tobi_lutke',
      category: 'profile',
      description: 'Profile picture for @tobi',
      required: true,
      uploaded: false,
      fallback: undefined,
    },
    {
      id: 'profile_filmwcolleen',
      category: 'profile',
      description: 'Profile picture for @filmwcolleen',
      required: true,
      uploaded: false,
      fallback: undefined,
    },
    {
      id: 'profile_abigail',
      category: 'profile',
      description: 'Profile picture for @proofofgail',
      required: true,
      uploaded: false,
      fallback: undefined,
    },
    {
      id: 'profile_ryan_wigley',
      category: 'profile',
      description: 'Profile picture for Ryan Wigley',
      required: true,
      uploaded: false,
      fallback: undefined,
    },
  ],
  screenshots: [
    {
      id: 'drum_machine_app',
      category: 'screenshot',
      description: 'Drum machine / piano keyboard app UI',
      required: true,
      uploaded: false,
      fallback: 'assets/placeholder-screenshot.png',
    },
    {
      id: 'data_dashboard',
      category: 'screenshot',
      description: 'Data analysis dashboard with charts',
      required: true,
      uploaded: false,
      fallback: 'assets/placeholder-screenshot.png',
    },
    {
      id: 'typography_tool',
      category: 'screenshot',
      description: 'Typography generator interface',
      required: true,
      uploaded: false,
      fallback: 'assets/placeholder-screenshot.png',
    },
    {
      id: 'brand_guide',
      category: 'screenshot',
      description: 'Brand style guide mockup',
      required: true,
      uploaded: false,
      fallback: 'assets/placeholder-screenshot.png',
    },
    {
      id: 'analytics_dashboard',
      category: 'screenshot',
      description: 'Analytics/campaign dashboard',
      required: true,
      uploaded: false,
      fallback: 'assets/placeholder-screenshot.png',
    },
  ],
  textures: [
    {
      id: 'paper_grain',
      category: 'texture',
      description: 'Subtle paper grain texture',
      required: false,
      uploaded: false,
      fallback: undefined, // Can generate procedurally
    },
    {
      id: 'newspaper_texture',
      category: 'texture',
      description: 'Newspaper paper texture',
      required: false,
      uploaded: false,
      fallback: undefined,
    },
  ],
};

/**
 * Get asset path with fallback support
 */
export function getAssetPath(
  manifest: AssetManifest,
  assetId: string
): string | undefined {
  const allAssets = [
    ...manifest.backgrounds,
    ...manifest.videos,
    ...manifest.profiles,
    ...manifest.screenshots,
    ...manifest.textures,
  ];

  const asset = allAssets.find((a) => a.id === assetId);
  if (!asset) return undefined;

  if (asset.uploaded && asset.path) {
    return asset.path;
  }

  return asset.fallback;
}

/**
 * Check if all required assets are uploaded
 */
export function checkRequiredAssets(manifest: AssetManifest): {
  complete: boolean;
  missing: AssetDefinition[];
} {
  const allAssets = [
    ...manifest.backgrounds,
    ...manifest.videos,
    ...manifest.profiles,
    ...manifest.screenshots,
    ...manifest.textures,
  ];

  const missing = allAssets.filter((a) => a.required && !a.uploaded);

  return {
    complete: missing.length === 0,
    missing,
  };
}

/**
 * Get upload progress
 */
export function getUploadProgress(manifest: AssetManifest): {
  total: number;
  uploaded: number;
  percentage: number;
} {
  const allAssets = [
    ...manifest.backgrounds,
    ...manifest.videos,
    ...manifest.profiles,
    ...manifest.screenshots,
    ...manifest.textures,
  ];

  const required = allAssets.filter((a) => a.required);
  const uploaded = required.filter((a) => a.uploaded);

  return {
    total: required.length,
    uploaded: uploaded.length,
    percentage: required.length > 0 ? (uploaded.length / required.length) * 100 : 100,
  };
}

/**
 * Mark an asset as uploaded
 */
export function markAssetUploaded(
  manifest: AssetManifest,
  assetId: string,
  path: string
): AssetManifest {
  const updateCategory = <T extends AssetDefinition>(assets: T[]): T[] =>
    assets.map((a) =>
      a.id === assetId ? { ...a, uploaded: true, path } : a
    );

  return {
    backgrounds: updateCategory(manifest.backgrounds),
    videos: updateCategory(manifest.videos),
    profiles: updateCategory(manifest.profiles),
    screenshots: updateCategory(manifest.screenshots),
    textures: updateCategory(manifest.textures),
  };
}
