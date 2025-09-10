interface AnimatedBackgroundProps {
  variant?: 'football' | 'geometric' | 'particles';
  className?: string;
}

export function AnimatedBackground({ variant = 'geometric', className = '' }: AnimatedBackgroundProps) {
  switch (variant) {
    case 'football':
      return <FootballBackground className={className} />;
    case 'particles':
      return <ParticlesBackground className={className} />;
    case 'geometric':
    default:
      return <GeometricBackground className={className} />;
  }
}

function GeometricBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tricolorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C10016" stopOpacity="0.1" />
            <stop offset="33%" stopColor="#000000" stopOpacity="0.05" />
            <stop offset="66%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#C10016" stopOpacity="0.1" />
          </linearGradient>
          
          <pattern id="dots" patternUnits="userSpaceOnUse" width="50" height="50">
            <circle cx="25" cy="25" r="2" fill="#C10016" fillOpacity="0.1">
              <animate
                attributeName="r"
                values="2;4;2"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          </pattern>
        </defs>

        {/* Animated geometric shapes */}
        <g>
          <circle cx="200" cy="200" r="150" fill="url(#tricolorGradient)" opacity="0.3">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 200 200;360 200 200"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>
          
          <polygon 
            points="600,100 700,300 500,300" 
            fill="#C10016" 
            fillOpacity="0.1"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 600 200;360 600 200"
              dur="15s"
              repeatCount="indefinite"
            />
          </polygon>
          
          <rect x="750" y="600" width="100" height="100" fill="#000" fillOpacity="0.05" rx="20">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 800 650;360 800 650"
              dur="12s"
              repeatCount="indefinite"
            />
          </rect>
        </g>

        {/* Dotted pattern overlay */}
        <rect width="100%" height="100%" fill="url(#dots)" />
        
        {/* Floating elements */}
        <g>
          <circle cx="150" cy="700" r="5" fill="#C10016" fillOpacity="0.6">
            <animate
              attributeName="cy"
              values="700;650;700"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="850" cy="150" r="8" fill="#FFD700" fillOpacity="0.4">
            <animate
              attributeName="cy"
              values="150;100;150"
              dur="5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </div>
  );
}

function FootballBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Football/Soccer ball pattern */}
        <g>
          {Array.from({ length: 12 }, (_, i) => (
            <g key={i}>
              <circle
                cx={100 + (i % 4) * 250}
                cy={100 + Math.floor(i / 4) * 250}
                r="40"
                fill="none"
                stroke="#C10016"
                strokeWidth="2"
              >
                <animate
                  attributeName="r"
                  values="40;50;40"
                  dur={`${3 + i * 0.5}s`}
                  repeatCount="indefinite"
                />
              </circle>
              
              {/* Hexagon pattern inside circle */}
              <polygon
                points={`${100 + (i % 4) * 250 - 20},${100 + Math.floor(i / 4) * 250 - 15} ${100 + (i % 4) * 250 + 20},${100 + Math.floor(i / 4) * 250 - 15} ${100 + (i % 4) * 250 + 25},${100 + Math.floor(i / 4) * 250} ${100 + (i % 4) * 250 + 20},${100 + Math.floor(i / 4) * 250 + 15} ${100 + (i % 4) * 250 - 20},${100 + Math.floor(i / 4) * 250 + 15} ${100 + (i % 4) * 250 - 25},${100 + Math.floor(i / 4) * 250}`}
                fill="#000"
                fillOpacity="0.3"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values={`0 ${100 + (i % 4) * 250} ${100 + Math.floor(i / 4) * 250};360 ${100 + (i % 4) * 250} ${100 + Math.floor(i / 4) * 250}`}
                  dur={`${8 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </polygon>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

function ParticlesBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="particleGradient">
            <stop offset="0%" stopColor="#C10016" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C10016" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Animated particles */}
        <g>
          {Array.from({ length: 20 }, (_, i) => (
            <circle
              key={i}
              cx={Math.random() * 1000}
              cy={Math.random() * 1000}
              r="3"
              fill="url(#particleGradient)"
            >
              <animate
                attributeName="cy"
                values={`${Math.random() * 1000};${Math.random() * 1000 - 200};${Math.random() * 1000}`}
                dur={`${5 + Math.random() * 5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur={`${3 + Math.random() * 3}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Connecting lines */}
        <g stroke="#C10016" strokeWidth="1" strokeOpacity="0.2" fill="none">
          {Array.from({ length: 10 }, (_, i) => (
            <path
              key={i}
              d={`M${Math.random() * 1000},${Math.random() * 1000} Q${Math.random() * 1000},${Math.random() * 1000} ${Math.random() * 1000},${Math.random() * 1000}`}
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,100;50,50;100,0"
                dur={`${8 + Math.random() * 4}s`}
                repeatCount="indefinite"
              />
            </path>
          ))}
        </g>
      </svg>
    </div>
  );
}
