import React from 'react';

export const AppLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Hexagon Background */}
      <path
        d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 Z"
        stroke="url(#logo-gradient)"
        strokeWidth="4"
        fill="none"
        transform="scale(0.85) translate(8.5, -2.5)"
        opacity="0.8"
      />

      {/* Internal Circuitry / AI Brain Connections */}
      <g filter="url(#glow)">
        <circle cx="50" cy="50" r="8" fill="url(#logo-gradient)" />
        <path
          d="M50 42 V25 M50 58 V75 M42 50 H25 M58 50 H75 M44 44 L32 32 M56 44 L68 32 M44 56 L32 68 M56 56 L68 68"
          stroke="url(#logo-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="25" cy="25" r="3" fill="#3B82F6" />
        <circle cx="75" cy="25" r="3" fill="#8B5CF6" />
        <circle cx="25" cy="75" r="3" fill="#3B82F6" />
        <circle cx="75" cy="75" r="3" fill="#EC4899" />
        <circle cx="50" cy="20" r="3" fill="#3B82F6" />
        <circle cx="50" cy="80" r="3" fill="#EC4899" />
        <circle cx="20" cy="50" r="3" fill="#3B82F6" />
        <circle cx="80" cy="50" r="3" fill="#8B5CF6" />
      </g>
    </svg>
  );
};
