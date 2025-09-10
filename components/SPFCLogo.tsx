interface SPFCLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export function SPFCLogo({ size = 'md', className = '', animated = false }: SPFCLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} ${animated ? 'animate-float' : ''}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Outer circle - SPFC colors */}
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke="#C10016"
          strokeWidth="4"
          fill="white"
          className={animated ? 'animate-pulse-slow' : ''}
        />
        
        {/* Inner shield */}
        <path
          d="M30 25 L70 25 L75 35 L75 65 L70 75 L50 85 L30 75 L25 65 L25 35 Z"
          fill="#C10016"
          stroke="#000"
          strokeWidth="1"
        />
        
        {/* SPFC letters */}
        <text
          x="50"
          y="45"
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          SPFC
        </text>
        
        {/* Tricolor stripes */}
        <rect x="35" y="50" width="30" height="3" fill="white" />
        <rect x="35" y="55" width="30" height="3" fill="#000" />
        <rect x="35" y="60" width="30" height="3" fill="#C10016" />
        
        {/* Stars */}
        <polygon
          points="50,20 51,23 54,23 52,25 53,28 50,26 47,28 48,25 46,23 49,23"
          fill="#FFD700"
          className={animated ? 'animate-pulse' : ''}
        />
        <polygon
          points="35,30 36,32 38,32 37,33 37.5,35 35,34 32.5,35 33,33 32,32 34,32"
          fill="#FFD700"
          className={animated ? 'animate-pulse' : ''}
        />
        <polygon
          points="65,30 66,32 68,32 67,33 67.5,35 65,34 62.5,35 63,33 62,32 64,32"
          fill="#FFD700"
          className={animated ? 'animate-pulse' : ''}
        />
      </svg>
    </div>
  );
}

export function SPTricolorStripes({ className = '' }: { className?: string }) {
  return (
    <div className={`flex h-4 w-full ${className}`}>
      <div className="flex-1 bg-sp-red-600"></div>
      <div className="flex-1 bg-sp-black"></div>
      <div className="flex-1 bg-sp-white border border-gray-200"></div>
    </div>
  );
}
