import React, { useMemo } from 'react';

interface TreeProps {
  lightsOn: boolean;
}

const Tree: React.FC<TreeProps> = ({ lightsOn }) => {
  // Generate random positions for lights on the tree layers
  // Using useMemo so they don't jump around on re-renders
  const lights = useMemo(() => {
    const layers = 4;
    const lightsPerLayer = [8, 12, 16, 20];
    const generatedLights = [];

    const colors = [
      'bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.8)]',
      'bg-yellow-300 shadow-[0_0_8px_2px_rgba(253,224,71,0.8)]',
      'bg-blue-400 shadow-[0_0_8px_2px_rgba(96,165,250,0.8)]',
      'bg-purple-400 shadow-[0_0_8px_2px_rgba(192,132,252,0.8)]',
    ];

    for (let i = 0; i < layers; i++) {
      for (let j = 0; j < lightsPerLayer[i]; j++) {
        // Approximate triangle width at this height
        const widthPercent = 20 + (i * 20); 
        const leftPos = 50 + (Math.random() * widthPercent - (widthPercent / 2)); 
        
        generatedLights.push({
            layerIndex: i,
            left: `${leftPos}%`,
            top: `${Math.random() * 80 + 10}%`, // Avoid very edges
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: `${Math.random() * 2}s`,
            duration: `${Math.random() * 1.5 + 1.5}s`
        });
      }
    }
    return generatedLights;
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-end h-[500px] w-[350px] sm:w-[500px] sm:h-[600px] mt-10 filter drop-shadow-2xl">
      
      {/* Star */}
      <div className="absolute top-[-30px] z-50 animate-pulse">
         <svg width="60" height="60" viewBox="0 0 24 24" fill="#FDE047" className="drop-shadow-[0_0_15px_rgba(253,224,71,0.9)]">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
         </svg>
      </div>

      {/* Tree Layers - Constructed using Clip Path for triangle shapes */}
      {/* Layer 1 (Top) */}
      <div className="relative w-[120px] h-[100px] sm:w-[160px] sm:h-[140px] z-40 -mb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-green-800 w-full h-full" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        {lightsOn && lights.filter(l => l.layerIndex === 0).map((l, idx) => (
             <div key={`l0-${idx}`} className={`absolute w-3 h-3 rounded-full animate-twinkle ${l.color}`} style={{ left: l.left, top: l.top, animationDelay: l.delay, animationDuration: l.duration }} />
        ))}
      </div>

      {/* Layer 2 */}
      <div className="relative w-[180px] h-[140px] sm:w-[240px] sm:h-[180px] z-30 -mb-10">
        <div className="absolute inset-0 bg-gradient-to-b from-green-600 to-green-900 w-full h-full" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
         {lightsOn && lights.filter(l => l.layerIndex === 1).map((l, idx) => (
             <div key={`l1-${idx}`} className={`absolute w-3 h-3 rounded-full animate-twinkle ${l.color}`} style={{ left: l.left, top: l.top, animationDelay: l.delay, animationDuration: l.duration }} />
        ))}
      </div>

      {/* Layer 3 */}
      <div className="relative w-[240px] h-[180px] sm:w-[320px] sm:h-[220px] z-20 -mb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-green-700 to-green-950 w-full h-full" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        {lightsOn && lights.filter(l => l.layerIndex === 2).map((l, idx) => (
             <div key={`l2-${idx}`} className={`absolute w-3 h-3 rounded-full animate-twinkle ${l.color}`} style={{ left: l.left, top: l.top, animationDelay: l.delay, animationDuration: l.duration }} />
        ))}
      </div>

      {/* Layer 4 (Bottom) */}
      <div className="relative w-[300px] h-[220px] sm:w-[400px] sm:h-[260px] z-10">
         <div className="absolute inset-0 bg-gradient-to-b from-green-800 to-black w-full h-full" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
         {lightsOn && lights.filter(l => l.layerIndex === 3).map((l, idx) => (
             <div key={`l3-${idx}`} className={`absolute w-3 h-3 rounded-full animate-twinkle ${l.color}`} style={{ left: l.left, top: l.top, animationDelay: l.delay, animationDuration: l.duration }} />
        ))}
      </div>

      {/* Trunk */}
      <div className="w-12 h-20 sm:w-16 sm:h-24 bg-gradient-to-b from-yellow-900 to-amber-950 rounded-b-lg z-0 relative shadow-inner"></div>
      
      {/* Shadow */}
      <div className="absolute bottom-0 w-[80%] h-4 bg-black opacity-40 blur-lg rounded-[100%] translate-y-2"></div>
    </div>
  );
};

export default Tree;