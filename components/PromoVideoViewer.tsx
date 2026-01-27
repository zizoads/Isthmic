
import React, { useState } from 'react';
import { generatePromoVideoAI } from '../services/geminiService';
import { Domain } from '../types';

interface Props {
  domain: Domain;
  onUpdate: (updated: Domain) => void;
  lang: 'ar' | 'en';
}

const PromoVideoViewer: React.FC<Props> = ({ domain, onUpdate, lang }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSynthesize = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const videoUrl = await generatePromoVideoAI(domain.name, domain.justification || domain.sector || 'Luxury tech');
      onUpdate({
        ...domain,
        brandAssets: {
          ...domain.brandAssets,
          promoVideoUrl: videoUrl
        }
      });
    } catch (e: any) {
      setError(e.message || 'Synthesis failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-[#0b0e14] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl flex flex-col group relative">
      <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
        {domain.brandAssets?.promoVideoUrl ? (
          <video 
            src={domain.brandAssets.promoVideoUrl} 
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
          />
        ) : isGenerating ? (
          <div className="flex flex-col items-center space-y-6">
             <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">
               {lang === 'ar' ? 'جاري تركيب المشاهد السينمائية...' : 'Synthesizing Cinematic Frames...'}
             </p>
          </div>
        ) : (
          <div className="text-center p-10 space-y-6">
             <i className="fas fa-video text-white/10 text-6xl"></i>
             <div className="text-white/30 text-xs font-black uppercase tracking-widest">Promo Asset Required</div>
             <button 
                onClick={handleSynthesize}
                className="bg-white text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-2xl"
             >
                Synthesize Promo (Veo 3.1)
             </button>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-red-900/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
             <i className="fas fa-exclamation-triangle text-white text-2xl mb-4"></i>
             <p className="text-xs text-white font-bold leading-relaxed">{error}</p>
             <button onClick={handleSynthesize} className="mt-4 text-[10px] font-black uppercase underline text-white">Retry Synthesis</button>
          </div>
        )}
      </div>

      <div className="p-8 flex justify-between items-center bg-white/2">
         <div>
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Cinematic Pulse</div>
            <div className="text-sm font-black text-white uppercase mt-1">Status: {domain.brandAssets?.promoVideoUrl ? 'LIVE' : 'IDLE'}</div>
         </div>
         {domain.brandAssets?.promoVideoUrl && (
           <button onClick={handleSynthesize} className="text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase">
             Re-Synthesize
           </button>
         )}
      </div>
    </div>
  );
};

export default PromoVideoViewer;
