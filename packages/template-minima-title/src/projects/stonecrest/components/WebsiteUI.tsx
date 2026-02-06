/**
 * WebsiteUI Component
 * Minimal website mockup with Stonecrest as hero banner
 */

import React from 'react';
import { Img, staticFile, interpolate, Easing } from 'remotion';

interface WebsiteUIProps {
  bannerImage: string;
  revealProgress: number; // 0 = hidden, 1 = fully visible
  visible: boolean;
}

export const WebsiteUI: React.FC<WebsiteUIProps> = ({
  bannerImage,
  revealProgress,
  visible,
}) => {
  if (!visible || revealProgress <= 0) return null;

  const opacity = interpolate(revealProgress, [0, 1], [0, 1]);
  const translateY = interpolate(revealProgress, [0, 1], [30, 0], {
    easing: Easing.bezier(0, 0, 0.2, 1),
  });

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
