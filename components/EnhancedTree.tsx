import React from "react";

interface TreeProps {
  lightsOn: boolean;
  onOpenCard?: () => void;
  showLetter: boolean;
}

const EnhancedTree: React.FC<TreeProps> = ({
  lightsOn,
  onOpenCard,
  showLetter,
}) => {
  return (
    <div className="relative w-full h-[90vh] flex items-center justify-center drop-shadow-2xl overflow-hidden">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; filter: brightness(1.5) drop-shadow(0 0 4px rgba(255,255,255,0.7)); transform: scale(1.2); }
          50% { opacity: 0.3; filter: brightness(0.5); transform: scale(0.8); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes point-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
        .light-anim {
          animation: twinkle 1.5s infinite ease-in-out;
        }
        .tree-sway {
          transform-origin: 100px 220px;
          animation: sway 4s infinite ease-in-out;
        }
        .animate-point {
          animation: point-left 1s infinite ease-in-out;
        }
        .light-anim-delay-1 { animation-delay: 0.5s; }
        .light-anim-delay-2 { animation-delay: 1s; }
        .light-anim-delay-3 { animation-delay: 1.5s; }
        .light-anim-delay-4 { animation-delay: 2s; }
      `}</style>

      <svg viewBox="0 0 200 260" className="w-full h-full overflow-visible">
        {/* Shadow base */}
        <ellipse
          cx="100"
          cy="235"
          rx="80"
          ry="15"
          fill="rgba(0,0,0,0.4)"
          filter="blur(8px)"
        />

        {/* Gifts behind */}
        <g transform="translate(40, 210)">
          <rect width="30" height="25" fill="#ef4444" rx="2" />
          <rect x="13" width="4" height="25" fill="#fcd34d" />
          <rect y="10" width="30" height="4" fill="#fcd34d" />
          <path
            d="M17.5,0 Q10,-10 5,0 Q17.5,5 17.5,0 Q25,-10 30,0 Q17.5,5 17.5,0"
            fill="#fcd34d"
          />
        </g>

        <g className="tree-sway">
          {/* Trunk */}
          <rect
            x="90"
            y="190"
            width="20"
            height="40"
            fill="url(#gradTrunk)"
            rx="2"
          />

          {/* Definitions for Gradients and Filters */}
          <defs>
            <linearGradient id="gradGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="30%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="gradTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3E2723" />
              <stop offset="50%" stopColor="#5D4037" />
              <stop offset="100%" stopColor="#3E2723" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
            </filter>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.9" />
              <stop offset="100%" stopColor="gold" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Leaves Layer 4 (Bottom) */}
          <path
            d="M10,200 L100,120 L190,200 Q100,220 10,200 Z"
            fill="url(#gradGreen)"
            filter="url(#shadow)"
          />

          {/* Leaves Layer 3 */}
          <path
            d="M25,150 L100,80 L175,150 Q100,170 25,150 Z"
            fill="url(#gradGreen)"
            filter="url(#shadow)"
          />

          {/* Leaves Layer 2 */}
          <path
            d="M40,100 L100,40 L160,100 Q100,120 40,100 Z"
            fill="url(#gradGreen)"
            filter="url(#shadow)"
          />

          {/* Leaves Layer 1 (Top) */}
          <path
            d="M55,60 L100,10 L145,60 Q100,80 55,60 Z"
            fill="url(#gradGreen)"
            filter="url(#shadow)"
          />

          {/* Snow patches */}
          <path
            d="M100,10 L110,20 Q100,25 90,20 Z"
            fill="white"
            opacity="0.7"
          />
          <path d="M100,40 L120,60 Q100,70 80,60 Z" fill="white" opacity="0" />

          {/* Ornaments (Baubles) */}
          <g>
            <circle cx="60" cy="180" r="6" fill="#ef4444" />
            <circle cx="140" cy="180" r="6" fill="#eab308" />
            <circle cx="100" cy="160" r="6" fill="#3b82f6" />
            <circle cx="50" cy="130" r="5" fill="#eab308" />
            <circle cx="150" cy="130" r="5" fill="#ef4444" />
            <circle cx="100" cy="110" r="5" fill="#ec4899" />
            <circle cx="70" cy="80" r="5" fill="#3b82f6" />
            <circle cx="130" cy="80" r="5" fill="#eab308" />
            <circle cx="100" cy="50" r="4" fill="#ef4444" />
          </g>

          {/* Letter (Wish Card Trigger) */}
          <g
            className={`transition-opacity duration-500 ${showLetter ? "opacity-100" : "opacity-0"
              }`}
          >
            <g
              transform="translate(115, 135) rotate(5)"
              onClick={onOpenCard}
              className="cursor-pointer transition-transform duration-200"
              style={{
                pointerEvents: showLetter ? "all" : "none",
                transformOrigin: "12px 8px",
              }}
              onMouseEnter={(e) =>
              (e.currentTarget.style.transform =
                "translate(115px, 135px) rotate(5deg) scale(1.1)")
              }
              onMouseLeave={(e) =>
              (e.currentTarget.style.transform =
                "translate(115px, 135px) rotate(5deg) scale(1)")
              }
            >
              <rect
                width="24"
                height="16"
                fill="#f8fafc"
                stroke="#94a3b8"
                strokeWidth="0.5"
                rx="1"
                filter="drop-shadow(0 1px 1px rgba(0,0,0,0.3))"
              />
              <path
                d="M0,0 L12,8 L24,0"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="0.5"
              />
              <circle cx="12" cy="9" r="2.5" fill="#ef4444" />
            </g>

            {/* "Mở đi" Label - Di chuyển xa hơn */}
            <g
              transform="translate(160, 142)"
              className="animate-point"
              style={{ pointerEvents: "none" }}
            >
              <text
                x="150"
                y="150"
                fontFamily="sans-serif"
                fontSize="9"
                fill="#fef08a"
                fontWeight="bold"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}
              >
                Mở đi
              </text>
            </g>
          </g>

          {/* Lights with Animation */}
          <g className={lightsOn ? "" : "opacity-20"}>
            <circle
              cx="80"
              cy="190"
              r="4"
              fill="#fef08a"
              className={lightsOn ? "light-anim" : ""}
            />
            <circle
              cx="120"
              cy="190"
              r="4"
              fill="#60a5fa"
              className={lightsOn ? "light-anim light-anim-delay-1" : ""}
            />
            <circle
              cx="160"
              cy="170"
              r="4"
              fill="#f472b6"
              className={lightsOn ? "light-anim light-anim-delay-2" : ""}
            />
            <circle
              cx="40"
              cy="140"
              r="4"
              fill="#fef08a"
              className={lightsOn ? "light-anim light-anim-delay-3" : ""}
            />
            <circle
              cx="80"
              cy="140"
              r="4"
              fill="#60a5fa"
              className={lightsOn ? "light-anim" : ""}
            />
            <circle
              cx="120"
              cy="140"
              r="4"
              fill="#f472b6"
              className={lightsOn ? "light-anim light-anim-delay-1" : ""}
            />
            <circle
              cx="160"
              cy="120"
              r="3"
              fill="#fef08a"
              className={lightsOn ? "light-anim light-anim-delay-2" : ""}
            />
            <circle
              cx="60"
              cy="90"
              r="3"
              fill="#60a5fa"
              className={lightsOn ? "light-anim light-anim-delay-3" : ""}
            />
            <circle
              cx="100"
              cy="90"
              r="3"
              fill="#f472b6"
              className={lightsOn ? "light-anim" : ""}
            />
            <circle
              cx="140"
              cy="90"
              r="3"
              fill="#fef08a"
              className={lightsOn ? "light-anim light-anim-delay-1" : ""}
            />
            <circle
              cx="80"
              cy="50"
              r="3"
              fill="#60a5fa"
              className={lightsOn ? "light-anim light-anim-delay-2" : ""}
            />
            <circle
              cx="120"
              cy="50"
              r="3"
              fill="#f472b6"
              className={lightsOn ? "light-anim light-anim-delay-3" : ""}
            />
          </g>

          {/* Star on Top */}
          <g transform="translate(100, 10)">
            <path
              d="M0,-12 L3,-3 L12,-3 L5,3 L7,11 L0,6 L-7,11 L-5,3 L-12,-3 L-3,-3 Z"
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth="1"
              className={lightsOn ? "animate-pulse origin-center" : ""}
            />
            {lightsOn && (
              <circle
                cx="0"
                cy="0"
                r="20"
                fill="url(#glow)"
                className="animate-pulse"
                opacity="0.7"
              />
            )}
          </g>
        </g>

        {/* Gifts Front */}
        <g transform="translate(130, 215)">
          <rect width="35" height="30" fill="#3b82f6" rx="2" />
          <rect x="0" y="13" width="35" height="5" fill="#e5e7eb" />
          <rect x="15" y="0" width="5" height="30" fill="#e5e7eb" />
          <path
            d="M17.5,0 Q10,-10 5,0 Q17.5,5 17.5,0 Q25,-10 30,0 Q17.5,5 17.5,0"
            fill="#e5e7eb"
          />
        </g>
        <g transform="translate(80, 225)">
          <rect width="40" height="25" fill="#10b981" rx="2" />
          <rect x="18" width="4" height="25" fill="#ef4444" />
          <path
            d="M20,0 Q10,-10 5,0 Q20,5 20,0 Q30,-10 35,0 Q20,5 20,0"
            fill="#ef4444"
          />
        </g>
      </svg>
    </div>
  );
};

export default EnhancedTree;
