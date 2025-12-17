import React, { useState, useRef,useEffect } from 'react';
import Snowfall from './components/Snowfall';
import EnhancedTree from './components/EnhancedTree';
import SantaClaus from './components/SantaClaus';
import HeartAnimation from './components/HeartAnimation';

const App: React.FC = () => {
  const [showWishCard, setShowWishCard] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [santaState, setSantaState] = useState<'idle' | 'reading'>('idle');
  const [isLetterFlying, setIsLetterFlying] = useState(false);
  const [isLetterOnTree, setIsLetterOnTree] = useState(true);
  const [showHeart, setShowHeart] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [flyCoords, setFlyCoords] = useState<{startX: number, startY: number, endX: number, endY: number} | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const santaRef = useRef<HTMLDivElement>(null);
  const lastClickPos = useRef({ x: 0, y: 0 });

  const startExperience = () => {
    setHasStarted(true);
    setIsMusicPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Audio play failed:", e));
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => console.log("Audio play failed:", e));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  // Effect to trigger heart animation 7 seconds after wish card opens
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showWishCard) {
      timer = setTimeout(() => {
        setShowFlash(true); // Bắt đầu chớp sáng
        setTimeout(() => {
          setShowHeart(true); // Hiện trái tim khi màn hình đang trắng xóa
          setTimeout(() => {
            setShowFlash(false); // Tắt chớp sáng dần dần
          }, 50);
        }, 250); // Đợi 250ms để màn hình trắng hoàn toàn
      }, 7000);
    } else {
      setShowHeart(false);
      setShowFlash(false);
    }
    return () => clearTimeout(timer);
  }, [showWishCard]);

  const handleOpenCard = () => {
    if (santaRef.current) {
      const santaRect = santaRef.current.getBoundingClientRect();
      // Tính toán điểm đích là tay ông già Noel (ước lượng từ vị trí khung bao)
      setFlyCoords({
        startX: lastClickPos.current.x - 20, // Trừ 1/2 chiều rộng lá thư để tâm trùng chuột
        startY: lastClickPos.current.y - 15,
        endX: santaRect.left + santaRect.width / 2 - 20,
        endY: santaRect.top + santaRect.height / 2
      });
    }

    // 1. Start the flying animation
    setIsLetterFlying(true);
    setIsLetterOnTree(false); // Ẩn lá thư trên cây ngay khi bắt đầu bay

    // 2. After animation duration (1s), Santa catches it
    setTimeout(() => {
      setIsLetterFlying(false);
      setSantaState('reading');

      // 3. Santa reads for a bit (800ms), then show the modal
      setTimeout(() => {
        setShowWishCard(true);
      }, 800);
    }, 1000);
  };

  const handleCloseCard = () => {
    setShowWishCard(false);
    // Reset Santa after a short delay so it looks natural
    setTimeout(() => {
      setIsLetterOnTree(true); // Hiện lại lá thư trên cây
      setSantaState('idle');
    }, 300);
  };

  return (
    <div className="relative h-[100vh] w-full bg-[#2c1810] overflow-hidden flex flex-col items-center justify-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&family=Quicksand:wght@300;400;500;700&display=swap');
        .font-christmas { font-family: 'Mountains of Christmas', cursive; }
        .font-body { font-family: 'Quicksand', sans-serif; }
        .wood-plank {
           background: repeating-linear-gradient(0deg, #3E2723, #3E2723 48px, #271c19 50px);
        }
        @keyframes fire-flicker {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-fire {
          animation: fire-flicker 0.2s infinite alternate;
        }
        @keyframes fly-to-santa {
          0% { transform: translate(var(--start-x), var(--start-y)) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(var(--end-x), var(--end-y)) rotate(720deg) scale(1); opacity: 0; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>
      
      {/* Music Control */}
      <button 
        onClick={toggleMusic}
        className="absolute top-4 right-4 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all shadow-lg hover:scale-110"
        title={isMusicPlaying ? "Tắt nhạc" : "Bật nhạc"}
      >
        {isMusicPlaying ? '🎵' : '🔇'}
      </button>
      <audio ref={audioRef} loop>
        <source src="/assests/piano.mp3" type="audio/mp3" />
      </audio>

      {/* Room Walls (Wood Texture) */}
      <div className="absolute inset-0 wood-plank z-0"></div>
      
      {/* Window with Forest View */}
      <div className="absolute top-8 left-4 md:left-16 w-48 h-64 md:w-64 md:h-80 bg-slate-900 border-8 border-[#5D4037] rounded-t-full shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden z-0">
        {/* Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] to-[#1E293B]"></div>
        {/* Snowfall contained in window */}
        <div className="absolute inset-0 opacity-80">
            <Snowfall />
        </div>
        {/* Distant Trees (CSS) */}
        <div className="absolute bottom-0 left-0 right-0 h-20 flex items-end justify-center opacity-60">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[60px] border-b-[#064e3b] mx-[-10px]"></div>
            <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[90px] border-b-[#065f46] mx-[-10px] z-10"></div>
            <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[70px] border-b-[#047857] mx-[-10px]"></div>
        </div>
        {/* Window Frame Cross */}
        <div className="absolute inset-0 border-r-4 border-[#5D4037] left-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="absolute inset-0 border-b-4 border-[#5D4037] top-1/2 -translate-y-1/2 pointer-events-none"></div>
      </div>

      {/* Fireplace */}
      <div className="absolute bottom-0 right-4 md:right-16 w-64 h-56 md:w-80 md:h-72 bg-[#4e342e] z-0 flex flex-col items-center justify-end rounded-t-lg shadow-2xl border-x-4 border-t-4 border-[#3e2723]">
         {/* Mantle */}
         <div className="absolute top-[-10px] w-[110%] h-6 bg-[#5d4037] rounded shadow-lg border border-[#3e2723]"></div>
         {/* Hearth Opening */}
         <div className="relative w-40 h-32 md:w-52 md:h-40 bg-[#1a100e] rounded-t-full overflow-hidden flex justify-center items-end shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] mb-0">
            {/* Fire Glow */}
            <div className="absolute bottom-0 w-full h-full bg-orange-500/20 blur-xl animate-pulse"></div>
            {/* Flames */}
            <div className="w-24 h-24 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-300 blur-md rounded-full animate-fire opacity-90 mb-4"></div>
            {/* Logs */}
            <div className="absolute bottom-2 w-32 h-6 bg-[#3e2723] rounded-full rotate-6 shadow-lg"></div>
            <div className="absolute bottom-2 w-32 h-6 bg-[#4e342e] rounded-full -rotate-6 shadow-lg"></div>
         </div>
      </div>

      {/* Santa Claus - Standing left of the tree */}
      <div ref={santaRef} className="absolute bottom-10 left-4 md:left-[15%] z-20">
        <SantaClaus isReading={santaState === 'reading'} />
        {/* Gift boxes near Santa */}
        <div className="absolute -right-8 bottom-0 text-4xl drop-shadow-lg">🎁</div>
        <div className="absolute -right-2 bottom-0 text-3xl drop-shadow-lg">🧸</div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-8">
        
        {/* Title */}
        {/* <h1 className="font-christmas text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-200 to-green-500 animate-float drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] mb-2 text-center">
          Merry Christmas
        </h1> */}

        {/* The Tree */}
        <div 
          className="transform transition-transform duration-700 hover:scale-105"
          onClickCapture={(e) => { lastClickPos.current = { x: e.clientX, y: e.clientY }; }}
        >
          <EnhancedTree lightsOn={true} onOpenCard={handleOpenCard} showLetter={isLetterOnTree} />
        </div>

      </div>

      {/* Flying Letter Animation Element */}
      {isLetterFlying && flyCoords && (
        <div 
          className="fixed left-0 top-0 z-50 pointer-events-none" 
          style={{ 
            '--start-x': `${flyCoords.startX}px`,
            '--start-y': `${flyCoords.startY}px`,
            '--end-x': `${flyCoords.endX}px`,
            '--end-y': `${flyCoords.endY}px`,
            animation: 'fly-to-santa 1s ease-in-out forwards' 
          } as React.CSSProperties}
        >
          <svg width="40" height="30" viewBox="0 0 40 30" className="drop-shadow-xl">
            <rect x="2" y="5" width="36" height="22" rx="2" fill="#FFF8DC" stroke="#D4A574" strokeWidth="2" />
            <line x1="8" y1="12" x2="32" y2="12" stroke="#8B4513" strokeWidth="1.5" />
            <line x1="8" y1="17" x2="32" y2="17" stroke="#8B4513" strokeWidth="1.5" />
            <circle cx="20" cy="16" r="3" fill="#ef4444" />
          </svg>
        </div>
      )}

      {/* Warm Room Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-black/40 pointer-events-none z-0"></div>

      {/* Modal Overlay */}
      {showWishCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={handleCloseCard}>
          <div 
            className="relative bg-[#fffaf0] p-1 rounded-lg max-w-md w-full text-center shadow-[0_0_50px_rgba(255,255,255,0.5)] transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Border Container */}
            <div className="border-4 border-dashed border-red-400 p-6 rounded-lg h-full flex flex-col items-center relative overflow-hidden">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#ff0000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-2 left-2 text-2xl animate-pulse">❄️</div>
                <div className="absolute top-2 right-2 text-2xl animate-pulse delay-75">❄️</div>
                <div className="absolute bottom-2 left-2 text-2xl animate-pulse delay-150">❄️</div>
                <div className="absolute bottom-2 right-2 text-2xl animate-pulse delay-300">❄️</div>

                {/* Santa & Bells Header */}
                <div className="flex items-center justify-center space-x-4 mb-4 z-10">
                    <div className="text-4xl" style={{ animation: 'wiggle 1s ease-in-out infinite' }}>🔔</div>
                    <div className="w-24 h-24 bg-red-50 rounded-full border-4 border-red-500 flex items-center justify-center shadow-lg overflow-hidden relative">
                        {/* Mini Santa SVG */}
                        <svg viewBox="0 0 100 100" className="w-20 h-20">
                            <circle cx="50" cy="50" r="40" fill="#fecaca" />
                            <path d="M10,40 Q50,0 90,40" fill="#ef4444" />
                            <circle cx="50" cy="10" r="8" fill="white" />
                            <path d="M10,50 Q50,90 90,50" fill="white" />
                            <circle cx="35" cy="45" r="3" fill="black" />
                            <circle cx="65" cy="45" r="3" fill="black" />
                            <circle cx="50" cy="55" r="4" fill="#ef4444" />
                        </svg>
                    </div>
                    <div className="text-4xl" style={{ animation: 'wiggle 1s ease-in-out infinite', animationDelay: '0.5s' }}>🔔</div>
                </div>

                {/* Title */}
                <h2 className="font-christmas text-5xl text-red-600 mb-2 drop-shadow-sm z-10">
                    Dear my beloved,
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-red-300 to-transparent mb-6"></div>

                {/* Content */}
                <div className="font-body text-lg text-slate-700 leading-relaxed space-y-3 z-10 relative bg-white/60 p-4 rounded-xl shadow-sm">
                    <p className="text-red-500 font-bold text-xl font-christmas">
                        "Ho Ho Ho! Merry Christmas! 🎄"
                    </p>
                    <p className="text-slate-600">
                        Santa đã nhận được điều ước của em rồi!
                    </p>
                    <p className="italic font-medium text-slate-800 border-l-4 border-red-400 pl-3 py-1 my-2 bg-red-50/50">
                        "Cảm ơn em vì đã là món quà giáng sinh tuyệt vời nhất mà anh nhận được cho mùa đông năm nay."
                    </p>
                    <div className="flex justify-end items-center mt-4 text-red-600 font-bold font-christmas text-xl">
                        <span>- Santa Claus -</span>
                        <span className="ml-2 text-2xl">🎅</span>
                    </div>
                </div>
                
                {/* Button */}
                <button 
                    onClick={handleCloseCard}
                    className="mt-6 px-8 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-full transition-all shadow-lg hover:scale-105 hover:shadow-red-500/30 z-10 flex items-center gap-2"
                >
                    <span>Đóng thư</span>
                    <span>✨</span>
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Flash Effect Overlay - Hiệu ứng chớp sáng bất ngờ */}
      <div 
        className={`fixed inset-0 z-[300] bg-white pointer-events-none transition-opacity ${showFlash ? 'duration-100 opacity-100' : 'duration-1000 opacity-0'}`}
      ></div>

      {/* Heart Animation Overlay */}
      {showHeart && <HeartAnimation onClose={() => setShowHeart(false)} />}

      {/* Welcome Screen Overlay */}
      {!hasStarted && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1a0b08] cursor-pointer transition-opacity duration-1000"
          onClick={startExperience}
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-yellow-500/20 blur-[60px] rounded-full animate-pulse group-hover:bg-yellow-500/40 transition-all duration-500"></div>
            
            {/* Mystery Gift Box SVG */}
            <svg width="120" height="120" viewBox="0 0 100 100" className="relative transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 drop-shadow-2xl">
              <rect x="20" y="40" width="60" height="50" rx="4" fill="#ef4444" />
              <rect x="15" y="30" width="70" height="15" rx="2" fill="#dc2626" />
              <rect x="45" y="40" width="10" height="50" fill="#fcd34d" />
              <rect x="45" y="30" width="10" height="15" fill="#fbbf24" />
              <path d="M50,30 C50,30 30,10 20,20 C15,25 30,35 50,35 C70,35 85,25 80,20 C70,10 50,30 50,30" fill="#fcd34d" />
              <circle cx="50" cy="32" r="4" fill="#fbbf24" />
            </svg>
            
            {/* Floating particles */}
            <div className="absolute -top-10 -left-10 text-yellow-200 animate-bounce text-2xl">✨</div>
            <div className="absolute -bottom-5 -right-10 text-yellow-200 animate-bounce delay-700 text-xl">✨</div>
          </div>
          
          <p className="mt-12 font-christmas text-3xl text-orange-100/60 animate-pulse tracking-widest select-none">
            Chạm nhẹ để mở...
          </p>
        </div>
      )}
    </div>
  );
};

export default App;