import React from 'react';

export interface BloomLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  withText?: boolean;
  withSparkles?: boolean;
  variant?: 'flower' | 'badge';
  src?: string;
}

export const BloomLogo: React.FC<BloomLogoProps> = ({
  size = 'md',
  className = '',
  withText = false,
  withSparkles,
  variant = 'flower',
  src,
}) => {
  // Dimension mappings
  const dimensionMap: Record<string, { sizePx: number; textClass: string }> = {
    xs: { sizePx: 24, textClass: 'text-sm' },
    sm: { sizePx: 32, textClass: 'text-base' },
    md: { sizePx: 44, textClass: 'text-lg' },
    lg: { sizePx: 60, textClass: 'text-xl' },
    xl: { sizePx: 80, textClass: 'text-2xl' },
  };

  const currentDim = typeof size === 'number'
    ? { sizePx: size, textClass: 'text-lg' }
    : dimensionMap[size] || dimensionMap.md;

  const showSparkles = withSparkles !== undefined
    ? withSparkles
    : currentDim.sizePx >= 36;

  // Custom image override if provided
  if (src) {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <img
          src={src}
          alt="Bloom Logo"
          style={{ width: `${currentDim.sizePx}px`, height: `${currentDim.sizePx}px` }}
          className="object-contain"
        />
        {withText && (
          <span className={`font-serif font-bold text-[#2B2523] tracking-tight ${currentDim.textClass}`}>
            Bloom
          </span>
        )}
      </div>
    );
  }

  // The 4-petal flower SVG matching the user's uploaded image
  const flowerSvg = (
    <svg
      viewBox="0 0 100 100"
      width={currentDim.sizePx}
      height={currentDim.sizePx}
      className="shrink-0 transition-transform duration-300 hover:scale-105 select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Bloom 4-petal flower logo"
    >
      <defs>
        <radialGradient id={`bloomGlow-${currentDim.sizePx}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A6524A" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#A6524A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow matching uploaded image */}
      {showSparkles && (
        <circle cx="50" cy="50" r="46" fill={`url(#bloomGlow-${currentDim.sizePx})`} />
      )}

      {/* Decorative Sparkle Stars */}
      {showSparkles && (
        <g className="animate-pulse duration-1000">
          {/* Top-Left Amber/Gold Sparkle */}
          <path
            d="M13 3 Q13 9 17 9 Q13 9 13 15 Q13 9 9 9 Q13 9 13 3 Z"
            fill="#BA8238"
          />

          {/* Top-Right Dusty Rose Sparkle */}
          <path
            d="M94 18 Q94 22 97.5 22 Q94 22 94 26 Q94 22 90.5 22 Q94 22 94 18 Z"
            fill="#C58C84"
          />

          {/* Bottom-Left Amber Sparkle */}
          <path
            d="M6 89 Q6 94 10 94 Q6 94 6 99 Q6 94 2 94 Q6 94 6 89 Z"
            fill="#BA8238"
          />
        </g>
      )}

      {/* 4 Elliptical Petals (Terracotta Brick Rose #A6524A) */}
      <g fill="#A6524A">
        {/* North Petal (Vertical Ellipse) */}
        <ellipse cx="50" cy="33.5" rx="13.5" ry="21.5" />
        {/* South Petal (Vertical Ellipse) */}
        <ellipse cx="50" cy="66.5" rx="13.5" ry="21.5" />
        {/* West Petal (Horizontal Ellipse) */}
        <ellipse cx="33.5" cy="50" rx="21.5" ry="13.5" />
        {/* East Petal (Horizontal Ellipse) */}
        <ellipse cx="66.5" cy="50" rx="21.5" ry="13.5" />
      </g>

      {/* Center Core Disc (Golden Mustard / Warm Ochre #BA8336) */}
      <circle cx="50" cy="50" r="10.5" fill="#BA8336" />
    </svg>
  );

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {variant === 'badge' ? (
        <div className="p-2 rounded-2xl bg-[#FAF6F3] border border-[#EBD9D3] shadow-xs flex items-center justify-center">
          {flowerSvg}
        </div>
      ) : (
        flowerSvg
      )}

      {withText && (
        <span className={`font-serif font-bold text-[#2B2523] tracking-tight ${currentDim.textClass}`}>
          Bloom
        </span>
      )}
    </div>
  );
};

export default BloomLogo;
