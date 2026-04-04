
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Shield, Target, Award, Info, RefreshCw } from 'lucide-react';
import { brandForge, GeneratedBrand } from '../services/BrandForgeService';
import { useDomainContext } from '../context/DomainContext';

export const BrandForgeHub: React.FC = () => {
  const { addLog, addThought } = useDomainContext();
  const [niche, setNiche] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isForging, setIsForging] = useState(false);
  const [results, setResults] = useState<GeneratedBrand[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'semantic', label: 'Semantic Brainstorming', icon: Sparkles },
    { id: 'markov', label: 'Markov Chain Synthesis', icon: Zap },
    { id: 'phonetic', label: 'Phonetic Resonance Audit', icon: Target },
    { id: 'ai', label: 'AI Strategy Synthesis', icon: Award }
  ];

  const templates = [
    { name: 'AI & Neural Tech', niche: 'Neural Network Infrastructure', keywords: 'synapse, cortex, logic, flow' },
    { name: 'Fintech Elite', niche: 'High-Frequency Trading Platform', keywords: 'vault, gold, swift, pulse' },
    { name: 'Cyber Security', niche: 'Zero-Trust Defense Systems', keywords: 'shield, guard, cipher, lock' }
  ];

  const applyTemplate = (t: typeof templates[0]) => {
    setNiche(t.niche);
    setKeywords(t.keywords);
  };

  const handleForge = async () => {
    if (!niche) return;
    
    setIsForging(true);
    setResults([]);
    setCurrentStep(0);
    
    addThought('Acquisition', `Initiating Brand Forge for niche: ${niche}`, 'high');
    addLog('Acquisition', 'Identity Forge sequence activated.', 'info');

    // Simulate steps for visual effect
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, 1500));
    }

    const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
    const brands = await brandForge.forgeBrand(niche, keywordList);
    
    setResults(brands);
    setIsForging(false);
    addLog('Acquisition', `Forge complete. ${brands.length} high-prestige identities synthesized.`, 'success');
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <h1 className="text-5xl prestige-title text-white italic leading-none mb-2">
            Brand Forge.
          </h1>
          <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.5em]">
            Sovereign Identity Synthesis Engine
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-white/2 border border-white/5 rounded-2xl flex items-center gap-3 shadow-xl">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Secure Protocol: <span className="text-emerald-500">Active</span></span>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#08080a] border border-white/5 rounded-[40px] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-all">
               <Target className="w-32 h-32" />
            </div>
            
            <h3 className="text-2xl font-bold text-white uppercase tracking-tighter flex items-center gap-4 relative z-10">
              Parameters
            </h3>
            
            <div className="space-y-3 relative z-10">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Market Niche</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. AI-Powered Logistics"
                className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#d4af37]/50 outline-none transition-all text-sm italic"
              />
            </div>

            <div className="space-y-4 relative z-10">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Quick Templates</label>
              <div className="flex flex-wrap gap-2">
                {templates.map(t => (
                  <button
                    key={t.name}
                    onClick={() => applyTemplate(t)}
                    className="px-4 py-2 bg-white/2 border border-white/5 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-[#d4af37]/10 hover:border-[#d4af37]/30 hover:text-[#d4af37] transition-all"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Seed Keywords</label>
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. speed, neural, global (comma separated)"
                className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-white h-40 focus:border-[#d4af37]/50 outline-none transition-all resize-none text-sm italic leading-relaxed"
              />
            </div>

            <button
              onClick={handleForge}
              disabled={isForging || !niche}
              className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-4 transition-all uppercase text-[10px] tracking-widest shadow-2xl relative z-10 ${
                isForging || !niche 
                ? 'bg-white/2 text-slate-700 cursor-not-allowed border border-white/5' 
                : 'bg-white text-black hover:bg-white/90 active:scale-95'
              }`}
            >
              {isForging ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Forging...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Forge Identity
                </>
              )}
            </button>
          </div>

          <div className="bg-[#d4af37]/5 border border-[#d4af37]/10 rounded-[30px] p-8">
            <div className="flex gap-4">
              <Info className="w-5 h-5 text-[#d4af37] shrink-0" />
              <p className="text-[10px] text-[#d4af37]/60 leading-relaxed font-medium uppercase tracking-widest italic">
                The Brand Forge uses a hybrid Markov-AI synthesis protocol. It ensures phonetic resonance, 
                semantic alignment, and market prestige for every generated identity.
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-8 space-y-8">
          {isForging ? (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center space-y-12 bg-white/2 border border-white/5 rounded-[60px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/5 to-transparent" />
              <div className="relative">
                <div className="w-32 h-32 border-2 border-[#d4af37]/20 rounded-full animate-ping" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-12 h-12 text-[#d4af37] animate-pulse" />
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-8 relative z-10">
                <div className="flex gap-4">
                  {steps.map((step, idx) => (
                    <div 
                      key={step.id}
                      className={`w-2 h-2 rounded-full transition-all duration-700 ${
                        idx <= currentStep ? 'bg-[#d4af37] scale-150 shadow-[0_0_15px_#d4af37]' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-center space-y-2">
                  <p className="text-4xl prestige-title text-white italic tracking-tight">
                    {steps[currentStep].label}
                  </p>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] animate-pulse">
                    Processing neural pathways...
                  </p>
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {results.map((brand, idx) => (
                  <motion.div
                    key={brand.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-[#08080a] border border-white/5 hover:border-[#d4af37]/30 rounded-[40px] p-10 transition-all shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-all">
                       <Award className="w-32 h-32" />
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
                      <div className="space-y-6 flex-1">
                        <div className="flex items-center gap-6">
                          <h2 className="text-4xl font-black text-white tracking-tighter group-hover:text-[#d4af37] transition-colors italic">
                            {brand.name}
                          </h2>
                          <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                            High Prestige
                          </div>
                        </div>
                        <p className="text-slate-400 text-lg leading-relaxed italic border-l border-[#d4af37]/30 pl-6">
                          "{brand.thesis}"
                        </p>
                      </div>

                      <div className="flex items-center gap-10 lg:border-l lg:border-white/5 lg:pl-10">
                        <div className="text-center">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Phonetic</p>
                          <p className="text-2xl font-black text-white font-mono">{brand.score.phonetic}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Semantic</p>
                          <p className="text-2xl font-black text-white font-mono">{brand.score.semantic}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Overall</p>
                          <p className="text-4xl font-black text-[#d4af37] font-mono">{Math.round(brand.score.total)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center space-y-8 bg-white/2 border border-white/5 border-dashed rounded-[60px]">
              <Target className="w-20 h-20 text-slate-800" />
              <div className="text-center space-y-2">
                <p className="text-2xl prestige-title text-white italic">Ready for Synthesis.</p>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Enter a niche and keywords to begin the forge sequence.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
