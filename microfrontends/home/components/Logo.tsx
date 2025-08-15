interface LogoProps {
  variant?: 'constellation' | 'orbital' | 'telescope' | 'starburst' | 'stellar' | 'horologium' | 'pyxis' | 'stylized-s' | 'geometric-s';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ variant = 'constellation', size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const logoComponents = {
    constellation: (
      <svg
        viewBox="0 0 40 40"
        className={`${sizeClasses[size]} ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Constellation dots */}
        <circle cx="8" cy="12" r="2" fill="#770ff5" />
        <circle cx="20" cy="8" r="2.5" fill="#FFB400" />
        <circle cx="32" cy="15" r="2" fill="#A239CA" />
        <circle cx="15" cy="25" r="2" fill="#770ff5" />
        <circle cx="28" cy="30" r="2.5" fill="#FFB400" />
        
        {/* Connecting lines */}
        <path
          d="M10 12 L18 8 L30 15 M18 8 L15 25 M30 15 L28 30 M15 25 L28 30"
          stroke="#770ff5"
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>
    ),

    orbital: (
      <svg
        viewBox="0 0 40 40"
        className={`${sizeClasses[size]} ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central star */}
        <circle cx="20" cy="20" r="3" fill="#FFB400" />
        
        {/* Orbital rings */}
        <ellipse
          cx="20"
          cy="20"
          rx="12"
          ry="8"
          stroke="#770ff5"
          strokeWidth="2"
          opacity="0.7"
        />
        <ellipse
          cx="20"
          cy="20"
          rx="8"
          ry="12"
          stroke="#A239CA"
          strokeWidth="2"
          opacity="0.7"
        />
        
        {/* Orbiting elements */}
        <circle cx="32" cy="20" r="1.5" fill="#770ff5" />
        <circle cx="20" cy="8" r="1.5" fill="#A239CA" />
      </svg>
    ),

    telescope: (
      <svg
        viewBox="0 0 40 40"
        className={`${sizeClasses[size]} ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Telescope body */}
        <rect
          x="8"
          y="16"
          width="20"
          height="4"
          rx="2"
          fill="#770ff5"
          transform="rotate(-15 18 18)"
        />
        <rect
          x="22"
          y="12"
          width="8"
          height="2"
          rx="1"
          fill="#A239CA"
          transform="rotate(-15 26 13)"
        />
        
        {/* Tripod legs */}
        <path
          d="M12 24 L12 32 M16 24 L20 32 M20 24 L16 32"
          stroke="#770ff5"
          strokeWidth="2"
        />
        
        {/* Stars in view */}
        <circle cx="30" cy="8" r="1" fill="#FFB400" />
        <circle cx="34" cy="12" r="1.5" fill="#FFB400" />
        <circle cx="32" cy="6" r="0.8" fill="#A239CA" />
      </svg>
    ),

    starburst: (
      <svg
        viewBox="0 0 40 40"
        className={`${sizeClasses[size]} ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central core */}
        <circle cx="20" cy="20" r="4" fill="#FFB400" />
        
        {/* Star rays */}
        <path
          d="M20 4 L20 12 M20 28 L20 36 M4 20 L12 20 M28 20 L36 20"
          stroke="#770ff5"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M8.8 8.8 L14.1 14.1 M25.9 25.9 L31.2 31.2 M8.8 31.2 L14.1 25.9 M25.9 14.1 L31.2 8.8"
          stroke="#A239CA"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),

    stellar: (
      <svg
        viewBox="0 0 40 40"
        className={`${sizeClasses[size]} ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Geometric star pattern */}
        <polygon
          points="20,6 24,14 32,14 26,20 28,28 20,24 12,28 14,20 8,14 16,14"
          fill="url(#stellarGradient)"
        />
        
        <defs>
          <linearGradient id="stellarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#770ff5" />
            <stop offset="50%" stopColor="#A239CA" />
            <stop offset="100%" stopColor="#FFB400" />
          </linearGradient>
        </defs>
        
        {/* Small accent stars */}
        <circle cx="30" cy="10" r="1" fill="#FFB400" />
        <circle cx="10" cy="30" r="1" fill="#770ff5" />
      </svg>
    ),

    horologium: (
      <svg
        viewBox="0 0 40 40"
        className={`${sizeClasses[size]} ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Horologium constellation pattern - Clock shape */}
        {/* Main stars of the clock */}
        <circle cx="12" cy="10" r="2" fill="#770ff5" />
        <circle cx="28" cy="12" r="2.5" fill="#FFB400" />
        <circle cx="30" cy="28" r="2" fill="#A239CA" />
        <circle cx="14" cy="30" r="2" fill="#770ff5" />
        <circle cx="20" cy="18" r="1.5" fill="#FFB400" />
        
        {/* Clock outline connecting lines */}
        <path
          d="M12 10 L28 12 L30 28 L14 30 L12 10"
          stroke="#770ff5"
          strokeWidth="1.5"
          opacity="0.6"
        />
        
        {/* Clock hands from center */}
        <path
          d="M20 18 L20 14 M20 18 L24 18"
          stroke="#A239CA"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Time markers */}
        <circle cx="20" cy="8" r="0.8" fill="#A239CA" opacity="0.7" />
        <circle cx="32" cy="20" r="0.8" fill="#A239CA" opacity="0.7" />
        <circle cx="20" cy="32" r="0.8" fill="#A239CA" opacity="0.7" />
        <circle cx="8" cy="20" r="0.8" fill="#A239CA" opacity="0.7" />
      </svg>
    ),

    pyxis: (
      <svg
        viewBox="0 0 40 40"
        className={`${sizeClasses[size]} ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pyxis constellation pattern - Compass */}
        {/* Main compass stars */}
        <circle cx="20" cy="8" r="2.5" fill="#FFB400" />
        <circle cx="16" cy="18" r="2" fill="#770ff5" />
        <circle cx="24" cy="18" r="2" fill="#A239CA" />
        <circle cx="20" cy="28" r="2" fill="#770ff5" />
        
        {/* Compass needle/pointer */}
        <path
          d="M20 8 L16 18 L20 28 L24 18 L20 8"
          stroke="#770ff5"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        
        {/* Compass rose directions */}
        <path
          d="M20 8 L20 4 M20 32 L20 36 M12 16 L8 16 M28 20 L32 20"
          stroke="#A239CA"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        
        {/* Center pivot */}
        <circle cx="20" cy="18" r="2" fill="none" stroke="#FFB400" strokeWidth="1" />
        <circle cx="20" cy="18" r="1" fill="#FFB400" />
        
        {/* Directional markers */}
        <polygon points="20,4 18,8 22,8" fill="#A239CA" opacity="0.8" />
      </svg>
    ),

    'stylized-s': (
      <svg
        viewBox="0 0 40 40"
        className={`${sizeClasses[size]} ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stylized S made from orbital arcs */}
        {/* Upper arc of S */}
        <path
          d="M12 12 Q20 8 28 12 Q24 16 16 16"
          stroke="#770ff5"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Lower arc of S */}
        <path
          d="M24 24 Q16 28 8 24 Q12 20 20 20"
          stroke="#A239CA"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Connecting middle section */}
        <path
          d="M16 16 Q20 20 24 24"
          stroke="#FFB400"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Orbital dots along the path */}
        <circle cx="12" cy="12" r="1.5" fill="#770ff5" />
        <circle cx="28" cy="12" r="1.5" fill="#770ff5" />
        <circle cx="20" cy="18" r="1.5" fill="#FFB400" />
        <circle cx="8" cy="24" r="1.5" fill="#A239CA" />
        <circle cx="24" cy="24" r="1.5" fill="#A239CA" />
        
        {/* Small constellation lines extending from S */}
        <path
          d="M28 12 L32 8 M8 24 L4 28 M20 18 L22 14"
          stroke="#770ff5"
          strokeWidth="1"
          opacity="0.5"
          strokeLinecap="round"
        />
        
        {/* Small stars at line ends */}
        <circle cx="32" cy="8" r="0.8" fill="#FFB400" />
        <circle cx="4" cy="28" r="0.8" fill="#A239CA" />
        <circle cx="22" cy="14" r="0.8" fill="#770ff5" />
      </svg>
    ),

    'geometric-s': (
      <svg
        viewBox="0 0 40 40"
        className={`${sizeClasses[size]} ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow effect for stars */}
          <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Radial gradient for star centers */}
          <radialGradient id="starCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB400" />
            <stop offset="70%" stopColor="#FFB400" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFB400" stopOpacity="0.3" />
          </radialGradient>
        </defs>

        {/* Geometric S shape made from angular lines */}
        {/* Upper rectangle/diamond of the S */}
        <path
          d="M8 8 L24 8 L28 12 L28 16 L12 16 L8 12 Z"
          stroke="#770ff5"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />
        
        {/* Lower rectangle/diamond of the S */}
        <path
          d="M12 24 L28 24 L32 28 L32 32 L16 32 L12 28 Z"
          stroke="#A239CA"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />

        {/* Connecting diagonal line */}
        <path
          d="M28 16 L12 24"
          stroke="#770ff5"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Glowing star bursts at key points */}
        {/* Top left star */}
        <g filter="url(#starGlow)">
          <circle cx="8" cy="8" r="3" fill="url(#starCenter)" opacity="0.6" />
          <path d="M8 4 L8 12 M4 8 L12 8 M6 6 L10 10 M10 6 L6 10" stroke="#FFB400" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Top right star */}
        <g filter="url(#starGlow)">
          <circle cx="28" cy="12" r="3" fill="url(#starCenter)" opacity="0.6" />
          <path d="M28 8 L28 16 M24 12 L32 12 M26 10 L30 14 M30 10 L26 14" stroke="#FFB400" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Bottom left star */}
        <g filter="url(#starGlow)">
          <circle cx="12" cy="28" r="3" fill="url(#starCenter)" opacity="0.6" />
          <path d="M12 24 L12 32 M8 28 L16 28 M10 26 L14 30 M14 26 L10 30" stroke="#FFB400" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Bottom right star */}
        <g filter="url(#starGlow)">
          <circle cx="32" cy="32" r="3" fill="url(#starCenter)" opacity="0.6" />
          <path d="M32 28 L32 36 M28 32 L36 32 M30 30 L34 34 M34 30 L30 34" stroke="#FFB400" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Additional accent stars */}
        <circle cx="24" cy="8" r="1" fill="#FFB400" opacity="0.8" />
        <circle cx="16" cy="32" r="1" fill="#FFB400" opacity="0.8" />
      </svg>
    )
  };

  return logoComponents[variant];
}