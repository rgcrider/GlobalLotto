import React from 'react';

interface IllinoisLotteryLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'header';
  size?: 'sm' | 'md' | 'lg';
}

export const IllinoisLotteryLogo: React.FC<IllinoisLotteryLogoProps> = ({
  className = '',
  variant = 'header',
  size = 'md'
}) => {
  const isDark = variant === 'dark' || variant === 'header';

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${sizeClasses[size]} ${className}`}>
      {/* Authentic Illinois Lottery Rainbow Arc & Pot of Gold Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 48 40"
          className="w-10 h-9 filter drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E52521" />
              <stop offset="20%" stopColor="#F37023" />
              <stop offset="40%" stopColor="#FFCE00" />
              <stop offset="60%" stopColor="#00A651" />
              <stop offset="80%" stopColor="#00AEEF" />
              <stop offset="100%" stopColor="#92278F" />
            </linearGradient>
            <linearGradient id="goldPot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* Rainbow Arc Swoop */}
          <path
            d="M 6 30 C 6 12, 22 4, 38 10 C 42 12, 44 15, 43 19 C 41 14, 34 8, 22 10 C 13 12, 10 22, 11 30 Z"
            fill="url(#rainbowGrad)"
          />

          {/* Gold Sparkles above pot */}
          <circle cx="34" cy="14" r="3" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="0.75" />
          <circle cx="38" cy="18" r="2.8" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="0.75" />
          <circle cx="28" cy="18" r="2.5" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="0.75" />
          <circle cx="32" cy="19" r="3.2" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="0.75" />

          {/* Pot of Gold Body */}
          <path
            d="M 23 21 C 23 20, 39 20, 39 21 C 41 21, 42 27, 40 33 C 38 37, 24 37, 22 33 C 20 27, 21 21, 23 21 Z"
            fill="url(#goldPot)"
            stroke="#475569"
            strokeWidth="0.75"
          />

          {/* Gold rim on pot */}
          <ellipse cx="31" cy="21" rx="8.5" ry="2.2" fill="#F59E0B" />

          {/* Star Sparkle */}
          <path
            d="M 40 8 L 41 11 L 44 12 L 41 13 L 40 16 L 39 13 L 36 12 L 39 11 Z"
            fill="#FDE047"
          />
        </svg>
      </div>

      {/* Illinois Lottery Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1">
          <span className={`font-extrabold tracking-tight text-lg sm:text-xl font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>
            illinois
          </span>
          <span className="font-extrabold tracking-tight text-lg sm:text-xl font-sans text-amber-400">
            lottery
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-0.5">
          Anything's Possible®
        </span>
      </div>
    </div>
  );
};
