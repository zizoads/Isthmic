import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Search, 
  TrendingUp, 
  Lightbulb, 
  Settings, 
  RefreshCw, 
  Download, 
  Zap,
  Activity
} from 'lucide-react';
import { translations } from '../../translations';

interface BrandIntelligenceHubProps {
}

const PLATFORMS = [
  "TechCrunch", "The Verge", "Engadget", "TechRadar", "GeekWire", 
  "CNET", "Mashable", "Gizmodo", "Lifewire", "PatentsView", 
  "Crunchbase", "BetaList", "Product Hunt", "AngelList"
];

export const BrandIntelligenceHub: React.FC<BrandIntelligenceHubProps> = () => {
  const t = translations.en.brand_intel;
  const [status, setStatus] = useState<'idle' | 'running' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [trends, setTrends] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  
  // Filters State
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(PLATFORMS);
  const [minKeywordLength, setMinKeywordLength] = useState(5);
  const [minKeywordFrequency, setMinKeywordFrequency] = useState(3);
  const [weightArticles, setWeightArticles] = useState(1.0);
  const [weightPatents, setWeightPatents] = useState(2.0);
  const [weightStartups, setWeightStartups] = useState(3.0);
  const [brandStyle, setBrandStyle] = useState('merged');
  const [enableLoop, setEnableLoop] = useState(true);
  const [maxIterations, setMaxIterations] = useState(3);
  const [targetScore, setTargetScore] = useState(0.85);

  const fetchData = async () => {
    try {
      const [trendsRes, oppsRes] = await Promise.all([
        fetch('/api/trends'),
        fetch('/api/opportunities')
      ]);
      
      if (!trendsRes.ok) throw new Error(`Trends API error: ${trendsRes.status}`);
      if (!oppsRes.ok) throw new Error(`Opportunities API error: ${oppsRes.status}`);
      
      const trendsData = await trendsRes.json();
      const oppsData = await oppsRes.json();
      setTrends(trendsData);
      setOpportunities(oppsData);
    } catch (err) {
      console.error("Fetch error:", err);
      setStatus('error');
      setStatusMsg(`❌ Fetch error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartMission = async () => {
    setStatus('running');
    setStatusMsg('');
    
    const payload = {
      selected_platforms: selectedPlatforms,
      min_keyword_length: minKeywordLength,
      min_keyword_frequency: minKeywordFrequency,
      weight_articles: weightArticles,
      weight_patents: weightPatents,
      weight_startups: weightStartups,
      brand_name_style: brandStyle,
      enable_loop: enableLoop,
      max_iterations: maxIterations,
      target_score: targetScore,
      max_brands: 5,
      limit_per_source: 10
    };

    try {
      const res = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Failed to start crawl");
      
      setStatusMsg('✅ Mission started successfully.');
      
      // Auto-refresh after a delay
      setTimeout(fetchData, 5000);
      
      // Reset status after some time or based on polling (simplified here)
      setTimeout(() => setStatus('idle'), 30000);
    } catch (err) {
      setStatus('error');
      setStatusMsg('❌ Connection error.');
    }
  };

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  return (
    <div className="flex h-full bg-[#050507] text-slate-200 overflow-hidden" dir="ltr">
      {/* Sidebar Filters */}
      <aside className="w-80 bg-[#08080a] border-r border-white/5 p-8 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 mb-10 text-[#d4af37]">
          <Settings className="w-5 h-5" />
          <h3 className="font-black text-[10px] uppercase tracking-[0.3em]">{t.settings}</h3>
        </div>

        <div className="space-y-8">
          {/* Platforms */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4 block">
              {t.platforms}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`text-[9px] px-3 py-2 rounded-xl border transition-all font-bold uppercase tracking-tighter ${
                    selectedPlatforms.includes(p)
                      ? 'bg-[#d4af37] border-[#d4af37] text-black shadow-lg scale-105'
                      : 'bg-white/2 border-white/5 text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4 block">
              {t.keywords}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{t.min_len}</span>
                <input 
                  type="number" 
                  value={minKeywordLength} 
                  onChange={e => setMinKeywordLength(parseInt(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#d4af37] text-white"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{t.min_freq}</span>
                <input 
                  type="number" 
                  value={minKeywordFrequency} 
                  onChange={e => setMinKeywordFrequency(parseInt(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#d4af37] text-white"
                />
              </div>
            </div>
          </div>

          {/* Weights */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4 block">
              {t.weights}
            </label>
            <div className="space-y-3">
              {[
                { label: t.weight_art, value: weightArticles, setter: setWeightArticles },
                { label: t.weight_pat, value: weightPatents, setter: setWeightPatents },
                { label: t.weight_sta, value: weightStartups, setter: setWeightStartups }
              ].map((w, i) => (
                <div key={i} className="flex items-center justify-between bg-white/2 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{w.label}</span>
                  <input 
                    type="number" step="0.1" 
                    value={w.value} 
                    onChange={e => w.setter(parseFloat(e.target.value))}
                    className="w-12 bg-transparent text-xs text-right font-mono text-[#d4af37] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 block">
              {t.style}
            </label>
            <select 
              value={brandStyle}
              onChange={e => setBrandStyle(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#d4af37] text-white appearance-none"
            >
              <option value="merged">Merged (TechCrunch)</option>
              <option value="acronym">Acronym (TC TechCrunch)</option>
              <option value="compound">Compound (Tech Crunch)</option>
            </select>
          </div>

          {/* Optimization */}
          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-6">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                {t.optimization}
              </label>
              <input 
                type="checkbox" 
                checked={enableLoop} 
                onChange={e => setEnableLoop(e.target.checked)}
                className="w-4 h-4 accent-[#d4af37]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{t.iterations}</span>
                <input 
                  type="number" 
                  value={maxIterations} 
                  onChange={e => setMaxIterations(parseInt(e.target.value))}
                  disabled={!enableLoop}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs disabled:opacity-30 text-white"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{t.target_score}</span>
                <input 
                  type="number" step="0.05" 
                  value={targetScore} 
                  onChange={e => setTargetScore(parseFloat(e.target.value))}
                  disabled={!enableLoop}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs disabled:opacity-30 text-white"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleStartMission}
            disabled={status === 'running'}
            className="w-full bg-white text-black hover:bg-white/90 disabled:bg-slate-800 disabled:text-slate-500 font-black py-5 px-4 rounded-2xl transition-all flex items-center justify-center gap-3 group uppercase text-[10px] tracking-widest shadow-2xl"
          >
            {status === 'running' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            {t.start}
          </button>

          <div className={`mt-4 text-center py-3 px-4 rounded-xl text-[8px] font-black uppercase tracking-[0.3em] ${
            status === 'running' ? 'bg-[#d4af37]/20 text-[#d4af37] animate-pulse' : 
            status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-white/2 text-slate-600'
          }`}>
            {status === 'running' ? t.status_running : t.status_idle}
          </div>
          
          {statusMsg && (
            <p className="text-[9px] text-center mt-4 text-[#0ea5e9] italic opacity-60">{statusMsg}</p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          <header className="mb-16 border-b border-white/5 pb-10">
            <div className="flex items-center gap-6 mb-4">
              <div className="p-4 bg-white/2 border border-white/5 rounded-3xl">
                <Brain className="w-10 h-10 text-[#d4af37]" />
              </div>
              <div>
                <h1 className="text-5xl prestige-title text-white italic leading-none mb-2">{t.title}</h1>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">{t.subtitle}</p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Trends Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <TrendingUp className="w-5 h-5 text-[#0ea5e9]" />
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">{t.trends}</h2>
                </div>
                <span className="text-[9px] bg-white/2 border border-white/5 px-3 py-1.5 rounded-full text-slate-500 font-black uppercase tracking-widest">
                  {trends.length} DETECTED
                </span>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {trends.length > 0 ? (
                    trends.map((trend, idx) => (
                      <motion.div
                        key={trend.id || idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white/2 border border-white/5 p-6 rounded-3xl hover:border-[#0ea5e9]/30 transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-all">
                           <TrendingUp className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <h4 className="text-2xl font-black text-[#0ea5e9] group-hover:text-white transition-colors tracking-tighter">
                              #{trend.keyword}
                            </h4>
                            <div className="flex flex-col items-end">
                              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Opportunity</span>
                              <span className="text-xl font-mono font-black text-[#d4af37]">
                                {(trend.opportunity_score * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {trend.platforms.map((p: string) => (
                              <span key={p} className="text-[8px] font-black bg-white/5 text-slate-500 px-2 py-1 rounded-lg border border-white/5 uppercase tracking-widest">
                                {p}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${trend.velocity * 100}%` }}
                                className="h-full bg-[#0ea5e9] shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                              />
                            </div>
                            <span className="text-[9px] font-black text-slate-600 font-mono uppercase tracking-widest whitespace-nowrap">VELOCITY: {(trend.velocity * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-24 bg-white/2 rounded-[40px] border border-dashed border-white/5">
                      <Search className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                      <p className="text-slate-600 text-xs font-bold uppercase tracking-widest px-10">{t.no_data}</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Opportunities Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Lightbulb className="w-5 h-5 text-[#d4af37]" />
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">{t.opportunities}</h2>
                </div>
                <span className="text-[9px] bg-white/2 border border-white/5 px-3 py-1.5 rounded-full text-slate-500 font-black uppercase tracking-widest">
                  {opportunities.length} SYNTHESIZED
                </span>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {opportunities.length > 0 ? (
                    opportunities.map((opp, idx) => (
                      <motion.div
                        key={opp.id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-[#08080a] border border-white/5 p-8 rounded-[40px] relative overflow-hidden group hover:border-[#d4af37]/30 transition-all shadow-2xl"
                      >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/5 blur-3xl -mr-24 -mt-24 group-hover:bg-[#d4af37]/10 transition-all" />
                        
                        <div className="flex items-center justify-between mb-6 relative z-10">
                          <h3 className="text-3xl font-black text-white tracking-tighter group-hover:text-[#d4af37] transition-colors">
                            {opp.name}
                          </h3>
                          <div className="bg-[#d4af37]/10 text-[#d4af37] text-[9px] font-black px-3 py-1.5 rounded-full border border-[#d4af37]/20 uppercase tracking-widest">
                            SCORE: {(opp.opportunity_score * 100).toFixed(1)}
                          </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                          <div>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-2">Strategic Positioning</span>
                            <p className="text-sm text-slate-400 leading-relaxed italic border-l border-[#d4af37]/30 pl-4">{opp.positioning}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-2">Market Gap</span>
                            <p className="text-xs text-slate-500 italic font-medium">"{opp.gap}"</p>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {opp.supporting_evidence.map((word: string) => (
                              <span key={word} className="text-[8px] font-black bg-white/5 text-[#0ea5e9] px-3 py-1 rounded-full border border-white/5 uppercase tracking-widest">
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button className="mt-10 w-full py-4 bg-white/2 hover:bg-[#d4af37] text-slate-500 hover:text-black text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 border border-white/5 hover:border-[#d4af37]">
                          <Download className="w-4 h-4" />
                          Export Opportunity
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-24 bg-white/2 rounded-[40px] border border-dashed border-white/5">
                      <Activity className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                      <p className="text-slate-600 text-xs font-bold uppercase tracking-widest px-10">{t.no_data}</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
