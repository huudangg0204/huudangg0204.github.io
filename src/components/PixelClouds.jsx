import { useEffect, useState } from 'react'

/**
 * Authentic 8-bit Mario-style Pixel Clouds background layer.
 * Visible against cream background with proper contrasting fills.
 * Floats gently across the screen with parallax vertical shift on scroll.
 */
export default function PixelClouds() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="retro-clouds-viewport" aria-hidden="true">
      {/* Cloud 1: Top-Left (slow parallax 0.08x) */}
      <div 
        className="cloud-wrapper cloud-pos-1 anim-drift-slow"
        style={{ transform: `translateY(${-(scrollY * 0.08)}px)` }}
      >
        <svg viewBox="0 0 108 52" className="pixel-cloud-svg">
          {/* 8-bit Stepped Pixel Cloud — White fill visible on cream bg */}
          <path 
            d="M 24 44 H 84 V 40 H 96 V 32 H 104 V 20 H 92 V 12 H 76 V 8 H 40 V 12 H 24 V 20 H 12 V 32 H 20 V 40 H 24 Z" 
            fill="#FFFFFF" 
            stroke="#2A2118" 
            strokeWidth="3" 
            strokeLinejoin="miter"
          />
          {/* Pixel Shading bottom portion */}
          <path 
            d="M 24 38 H 84 V 34 H 94 V 26 H 12 V 32 H 20 V 38 Z" 
            fill="#E8E0D4" 
          />
          {/* Classic 8-bit Cloud eyes */}
          <rect x="44" y="22" width="4" height="6" fill="#2A2118" />
          <rect x="64" y="22" width="4" height="6" fill="#2A2118" />
        </svg>
      </div>

      {/* Cloud 2: Top-Right (medium parallax 0.14x) */}
      <div 
        className="cloud-wrapper cloud-pos-2 anim-drift-medium"
        style={{ transform: `translateY(${-(scrollY * 0.14)}px)` }}
      >
        <svg viewBox="0 0 128 60" className="pixel-cloud-svg">
          <path 
            d="M 28 52 H 100 V 46 H 116 V 36 H 124 V 22 H 110 V 14 H 92 V 8 H 48 V 14 H 30 V 22 H 14 V 36 H 24 V 46 H 28 Z" 
            fill="#FFFFFF" 
            stroke="#2A2118" 
            strokeWidth="3" 
            strokeLinejoin="miter"
          />
          <path 
            d="M 28 46 H 100 V 40 H 112 V 30 H 14 V 36 H 24 V 46 Z" 
            fill="#E8E0D4" 
          />
          <rect x="54" y="26" width="4" height="8" fill="#2A2118" />
          <rect x="76" y="26" width="4" height="8" fill="#2A2118" />
        </svg>
      </div>

      {/* Cloud 3: Mid-Left (gentle parallax 0.10x) */}
      <div 
        className="cloud-wrapper cloud-pos-3 anim-drift-reverse"
        style={{ transform: `translateY(${-(scrollY * 0.10)}px)` }}
      >
        <svg viewBox="0 0 96 46" className="pixel-cloud-svg">
          <path 
            d="M 20 40 H 76 V 34 H 86 V 26 H 92 V 16 H 82 V 10 H 68 V 6 H 36 V 10 H 22 V 16 H 10 V 26 H 18 V 34 H 20 Z" 
            fill="#FFFFFF" 
            stroke="#2A2118" 
            strokeWidth="3" 
            strokeLinejoin="miter"
          />
          <path 
            d="M 20 34 H 76 V 28 H 84 V 20 H 10 V 26 H 18 V 34 Z" 
            fill="#E8E0D4" 
          />
          <rect x="40" y="19" width="3" height="5" fill="#2A2118" />
          <rect x="58" y="19" width="3" height="5" fill="#2A2118" />
        </svg>
      </div>

      {/* Cloud 4: Lower-Right (higher parallax 0.16x) */}
      <div 
        className="cloud-wrapper cloud-pos-4 anim-drift-slow"
        style={{ transform: `translateY(${-(scrollY * 0.16)}px)` }}
      >
        <svg viewBox="0 0 116 54" className="pixel-cloud-svg">
          <path 
            d="M 26 46 H 90 V 40 H 104 V 32 H 112 V 20 H 98 V 12 H 82 V 8 H 42 V 12 H 26 V 20 H 12 V 32 H 22 V 40 H 26 Z" 
            fill="#FFFFFF" 
            stroke="#2A2118" 
            strokeWidth="3" 
            strokeLinejoin="miter"
          />
          <path 
            d="M 26 40 H 90 V 34 H 100 V 26 H 12 V 32 H 22 V 40 Z" 
            fill="#E8E0D4" 
          />
          <rect x="50" y="23" width="4" height="6" fill="#2A2118" />
          <rect x="70" y="23" width="4" height="6" fill="#2A2118" />
        </svg>
      </div>

      <style>{`
        .retro-clouds-viewport {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        /* Visible white clouds with retro dark border — stands out on cream */
        .cloud-wrapper {
          position: absolute;
          will-change: transform;
          opacity: 1;
          filter: drop-shadow(4px 4px 0px rgba(42, 33, 24, 0.25));
          transition: transform 0.1s linear;
        }

        .pixel-cloud-svg {
          width: 100%;
          height: 100%;
          display: block;
          shape-rendering: crispEdges;
        }

        /* Positioned at screen margins so they peek behind the main content column */
        .cloud-pos-1 {
          top: 12%;
          left: 2%;
          width: 130px;
          height: 62px;
        }

        .cloud-pos-2 {
          top: 28%;
          right: 2%;
          width: 155px;
          height: 72px;
        }

        .cloud-pos-3 {
          top: 55%;
          left: 3%;
          width: 115px;
          height: 55px;
        }

        .cloud-pos-4 {
          top: 74%;
          right: 3%;
          width: 140px;
          height: 65px;
        }

        /* Horizontal gentle drift keyframes */
        @keyframes driftSlow {
          0%, 100% { margin-left: 0px; }
          50% { margin-left: 24px; }
        }

        @keyframes driftMedium {
          0%, 100% { margin-right: 0px; }
          50% { margin-right: -28px; }
        }

        @keyframes driftReverse {
          0%, 100% { margin-left: 0px; }
          50% { margin-left: -20px; }
        }

        .anim-drift-slow {
          animation: driftSlow 20s ease-in-out infinite;
        }

        .anim-drift-medium {
          animation: driftMedium 15s ease-in-out infinite;
        }

        .anim-drift-reverse {
          animation: driftReverse 17s ease-in-out infinite;
        }

        /* On smaller screens where clouds would overlap content, reduce opacity */
        @media (max-width: 1200px) {
          .cloud-pos-1, .cloud-pos-2, .cloud-pos-3, .cloud-pos-4 {
            opacity: 0.5;
          }
        }

        @media (max-width: 768px) {
          .cloud-pos-1 { width: 80px; height: 38px; top: 10%; left: 0%; }
          .cloud-pos-2 { width: 95px; height: 46px; top: 35%; right: 0%; }
          .cloud-pos-3 { display: none; }
          .cloud-pos-4 { width: 85px; height: 40px; top: 75%; right: 0%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-drift-slow,
          .anim-drift-medium,
          .anim-drift-reverse {
            animation: none !important;
          }
          .cloud-wrapper {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}
