
import React, { useState, useEffect } from 'react';

interface SantaClausProps {
  isReading: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const SantaClaus: React.FC<SantaClausProps> = ({ isReading, className, style }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Auto blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, Math.random() * 2000 + 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div
      className={`relative transition-transform duration-500 ${!isReading ? 'animate-sway' : ''} ${className}`}
      style={{
        width: '150px',
        height: '150px',
        transform: isReading ? 'scale(1.1)' : 'scale(1)',
        ...style
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-xl"
      >
        {/* Hat */}
        <path d="M20 45 L50 15 L80 45 L75 50 L50 50 L25 50 Z" fill="#E31C23" />
        <ellipse cx="50" cy="50" rx="28" ry="5" fill="#FFFFFF" />
        <circle cx="50" cy="15" r="6" fill="#FFFFFF" />

        {/* Face */}
        <circle cx="50" cy="62" r="24" fill="#FFDAB9" />

        {/* Beard */}
        <path d="M26 65 Q23 72 28 78 Q35 83 50 81 Q65 83 72 78 Q77 72 74 65 Z" fill="#FFFFFF" />
        <ellipse cx="33" cy="74" rx="10" ry="11" fill="#FFFFFF" />
        <ellipse cx="67" cy="74" rx="10" ry="11" fill="#FFFFFF" />

        {/* Eyes */}
        {!isBlinking ? (
          <>
            <circle cx="42" cy="58" r="3" fill="#000000" />
            <circle cx="58" cy="58" r="3" fill="#000000" />
            <circle cx="43" cy="57" r="1.5" fill="#FFFFFF" />
            <circle cx="59" cy="57" r="1.5" fill="#FFFFFF" />
          </>
        ) : (
          <>
            <line x1="39" y1="58" x2="45" y2="58" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
            <line x1="55" y1="58" x2="61" y2="58" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {/* Nose */}
        <circle cx="50" cy="63" r="2.5" fill="#FF6B6B" />

        {/* Mouth */}
        <path d="M45 67 Q50 70 55 67" stroke="#FF6B6B" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Body/Coat */}
        <rect x="30" y="80" width="40" height="22" rx="5" fill="#E31C23" />
        <rect x="48" y="80" width="4" height="22" fill="#FFFFFF" />
        <circle cx="50" cy="87" r="2" fill="#FFD700" />
        <circle cx="50" cy="94" r="2" fill="#FFD700" />
      </svg>

      {/* Letter in hand (Only visible when reading) */}
      <div
        className={`absolute bottom-[-10px] left-1/2 -translate-x-1/2 transition-opacity duration-500 ${isReading ? 'opacity-100' : 'opacity-0'}`}
      >
        <svg width="40" height="30" viewBox="0 0 40 30">
          <rect x="2" y="5" width="36" height="22" rx="2" fill="#FFF8DC" stroke="#D4A574" strokeWidth="2" />
          <line x1="8" y1="12" x2="32" y2="12" stroke="#8B4513" strokeWidth="1.5" />
          <line x1="8" y1="17" x2="32" y2="17" stroke="#8B4513" strokeWidth="1.5" />
          <circle cx="20" cy="16" r="3" fill="#ef4444" />
        </svg>
      </div>

      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SantaClaus;
