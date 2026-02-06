/**
 * WebsiteUI Component - v0.17
 *
 * CHANGELOG:
 * - v0.17: Spring physics for reveal
 *   - Uses SPRING.gentle for smooth, substantial arrival
 *   - translateY springs to 0 with natural settle
 *   - Opacity kept as interpolate (works well linear)
 *
 * Minimal website mockup with Stonecrest as hero banner
 */

import React from 'react';
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { createSpring, springTo } from '../motion';

interface WebsiteUIProps {
  bannerImage: string;
  revealStartFrame: number; // v0.17: Frame when reveal starts (for spring)
  visible: boolean;
}

export const WebsiteUI: React.FC<WebsiteUIProps> = ({
  bannerImage,
  revealStartFrame,
  visible,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // v0.17: Spring-based reveal (SPRING.gentle for substantial arrival)
  const isRevealing = revealStartFrame > 0 && frame >= revealStartFrame;
  const revealSpring = isRevealing
    ? createSpring(frame - revealStartFrame, fps, 'gentle', 0)
    : 0;

  if (!visible || revealSpring <= 0) return null;

  // Opacity fades in (kept as interpolate - works well)
  const opacity = interpolate(revealSpring, [0, 0.8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Position springs up with natural settle
  const translateY = springTo(revealSpring, [30, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#FFFFFF',
        opacity,
        transform: `translateY(${translateY}px)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height: 40,
          background: '#F5F5F7',
          borderBottom: '1px solid #E0E0E0',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 8,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
        </div>

        {/* URL bar */}
        <div
          style={{
            flex: 1,
            maxWidth: 600,
            margin: '0 auto',
            height: 28,
            background: '#FFFFFF',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            color: '#666',
          }}
        >
          minimahomes.com
        </div>
      </div>

      {/* Website content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {/* Navigation */}
        <div
          style={{
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 60px',
            borderBottom: '1px solid #F0F0F0',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 24,
              fontWeight: 400,
              letterSpacing: '0.1em',
              color: '#1A1A1A',
            }}
          >
            MINIMA
          </div>

          {/* Nav links */}
          <div
            style={{
              display: 'flex',
              gap: 40,
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: 14,
              color: '#666',
            }}
          >
            <span>Properties</span>
            <span>About</span>
            <span>Contact</span>
          </div>
        </div>

        {/* Hero banner with Stonecrest */}
        <div
          style={{
            position: 'relative',
            height: 500,
            overflow: 'hidden',
          }}
        >
          <Img
            src={staticFile(bannerImage)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Overlay text */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 50%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 60,
            }}
          >
            <div
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 48,
                fontWeight: 400,
                color: '#FFFFFF',
                letterSpacing: '0.15em',
                marginBottom: 12,
              }}
            >
              STONECREST
            </div>
            <div
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: 16,
                color: 'rgba(255,255,255,0.8)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
              }}
            >
              A Minima Residence
            </div>
          </div>
        </div>

        {/* Property details section */}
        <div
          style={{
            padding: '60px',
            display: 'flex',
            gap: 60,
          }}
        >
          {/* Stats */}
          {[
            { label: 'Bedrooms', value: '5' },
            { label: 'Bathrooms', value: '4.5' },
            { label: 'Sq Ft', value: '6,200' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 36,
                  color: '#1A1A1A',
                  marginBottom: 8,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: 12,
                  color: '#999',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
