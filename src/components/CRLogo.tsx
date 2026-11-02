import type { SVGProps } from 'react'

interface CRLogoProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  showReticle?: boolean
  showBadge?: boolean
  accentColor?: string
}

export default function CRLogo({
  size = 36,
  showReticle = true,
  showBadge = true,
  accentColor = '#38bdf8',
  className = '',
  ...props
}: CRLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={`shrink-0 select-none ${className}`}
      role="img"
      aria-label="Chintan Rathod Monogram (CR)"
      {...props}
    >
      <defs>
        {/* Subtle chassis gradient for the studio bezel */}
        <linearGradient id="cr-chassis" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1d22" />
          <stop offset="100%" stopColor="#0e1013" />
        </linearGradient>
        {/* Optical bevel ring */}
        <linearGradient id="cr-bevel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
        </linearGradient>
      </defs>

      {/* 1. Industrial Chassis Frame */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="10"
        fill="url(#cr-chassis)"
        stroke="url(#cr-bevel)"
        strokeWidth="1.5"
      />

      {/* 2. Viewfinder Reticle Corners (Camera / CAD Framing) */}
      {showReticle && (
        <g stroke="rgba(255,255,255,0.22)" strokeWidth="1.25" strokeLinecap="round" fill="none">
          {/* Top-Left */}
          <path d="M 6.5 10.5 V 6.5 H 10.5" />
          {/* Top-Right */}
          <path d="M 37.5 6.5 H 41.5 V 10.5" />
          {/* Bottom-Left */}
          <path d="M 6.5 37.5 V 41.5 H 10.5" />
          {/* Bottom-Right */}
          <path d="M 37.5 41.5 H 41.5 V 37.5" />
        </g>
      )}

      {/* 3. The "C" and "R" Precision Monogram */}
      {/* Letter "C" (Optical Sweep) */}
      <path
        d="M 23 15.5 H 17.5 C 13.8 15.5 11 18.8 11 24 C 11 29.2 13.8 32.5 17.5 32.5 H 23"
        fill="none"
        stroke="#f1f5f9"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Letter "R" (Vertical Stem + Lens Bowl + Dynamic Kick) */}
      <g
        fill="none"
        stroke="#f1f5f9"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* R Vertical Stem */}
        <path d="M 27 15.5 V 32.5" />
        {/* R Optical Bowl */}
        <path d="M 27 15.5 H 32.5 C 35.2 15.5 37 17.3 37 20 C 37 22.7 35.2 24.5 32.5 24.5 H 27" />
        {/* R Dynamic Kick */}
        <path d="M 31.8 24.5 L 37 32.5" />
      </g>

      {/* 4. Optical Telemetry Point / Aperture Index */}
      {showBadge && (
        <circle
          cx="39"
          cy="9"
          r="2.2"
          fill={accentColor}
        />
      )}
    </svg>
  )
}
