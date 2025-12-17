import React, { useState } from 'react';
import { generateChristmasWish } from '../services/geminiService';

interface WishCardProps {
  onClose: () => void;
}

const WishCard: React.FC<WishCardProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('người yêu');
  const [wish, setWish] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const result = await generateChristmasWish({ name, relationship });
    setWish(result);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(255,255,255,0.4)] border border-white/50 relative animate-float">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!wish ? (
          <>
            <h3 className="font-script text-4xl text-christmas-red text-center mb-6">Gửi lời yêu thương</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Tên người nhận</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-christmas-red/50 bg-white/50"
                  placeholder="Ví dụ: Em yêu, Lan, Minh..."
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Mối quan hệ</label>
                <select 
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-christmas-red/50 bg-white/50"
                >
                  <option value="người yêu">Người yêu</option>
                  <option value="vợ/chồng">Vợ / Chồng</option>
                  <option value="crush">Crush</option>
                  <option value="bạn thân">Bạn thân</option>
                  <option value="gia đình">Gia đình</option>
                </select>
              </div>
              
              <button 
                onClick={handleGenerate}
                disabled={loading || !name}
                className={`w-full py-3 rounded-full text-white font-semibold shadow-lg transform transition-all 
                  ${loading || !name ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 hover:shadow-red-500/50'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang viết...
                  </span>
                ) : 'Tạo lời chúc phép màu ✨'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="font-script text-4xl text-christmas-gold mb-4">Gửi tới {name}</h3>
            <div className="p-6 bg-red-50/50 rounded-xl border border-red-100 mb-6 italic text-gray-800 font-serif leading-relaxed">
              "{wish}"
            </div>
            <button 
              onClick={() => { setWish(null); setName(''); }}
              className="text-sm text-gray-500 hover:text-red-500 underline"
            >
              Tạo lời chúc khác
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishCard;