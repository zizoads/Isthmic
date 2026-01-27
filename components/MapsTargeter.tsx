
import React, { useState } from 'react';
import { findLocalBuyersAI } from '../services/geminiService';

interface Props {
  lang: 'ar' | 'en';
}

const MapsTargeter: React.FC<Props> = ({ lang }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Attempt to get user location
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const res = await findLocalBuyersAI(query, pos.coords.latitude, pos.coords.longitude);
          setResults(res);
          setLoading(false);
        },
        async () => {
          const res = await findLocalBuyersAI(query);
          setResults(res);
          setLoading(false);
        }
      );
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
            {lang === 'ar' ? 'رادار المشترين المحليين' : 'Local Buyer Radar'}
          </h3>
          <div className="flex gap-4">
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-primary/50"
              placeholder={lang === 'ar' ? 'أدخل اسم النطاق أو النيش...' : 'Enter domain name or niche...'}
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-map-marker-alt"></i>}
            </button>
          </div>
        </div>
        <i className="fas fa-map-marked-alt absolute right-[-40px] bottom-[-40px] text-white/5 text-[200px] pointer-events-none"></i>
      </div>

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[40px] border dark:border-white/5 shadow-xl">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
              {lang === 'ar' ? 'تحليل الفرص الجغرافية' : 'Geographic Opportunity Analysis'}
            </h4>
            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {results.text}
            </div>
          </div>

          <div className="bg-background border border-border p-8 rounded-[40px] shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
              {lang === 'ar' ? 'المصادر والخرائط' : 'Sources & Maps'}
            </h4>
            <div className="space-y-4">
              {results.sources.map((chunk: any, i: number) => (
                chunk.maps && (
                  <a 
                    key={i} 
                    href={chunk.maps.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-accent/30 rounded-2xl border border-border hover:border-primary transition-all group"
                  >
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary shadow-sm">
                      <i className="fas fa-location-dot"></i>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-black text-foreground group-hover:text-primary transition-colors">{chunk.maps.title || 'View on Maps'}</div>
                      <div className="text-[9px] text-slate-400 uppercase font-bold">{lang === 'ar' ? 'رابط خرائط جوجل' : 'Google Maps Link'}</div>
                    </div>
                  </a>
                )
              ))}
              {results.sources.length === 0 && (
                <div className="py-20 text-center opacity-20">
                  <i className="fas fa-ghost text-4xl mb-2"></i>
                  <p className="text-[10px] font-black uppercase tracking-widest">{lang === 'ar' ? 'لم يتم العثور على مصادر خرائط' : 'No map sources found'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapsTargeter;
