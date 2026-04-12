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
  Activity
} from 'lucide-react';
import { translations } from '../../../translations';

interface Trend {
  id: string;
  keyword: string;
  opportunity_score: number;
  platforms: string[];
  velocity: number;
}

interface Opportunity {
  id: string;
  name: string;
  opportunity_score: number;
  positioning: string;
  gap: string;
  supporting_evidence: string[];
}

import { useAuth } from '../../../context/AuthContext';

const ALL_PLATFORMS = [
  { id: 'HackerNews',      tier: 1 },
  { id: 'ArXiv',           tier: 1 },
  { id: 'GitHub Trending', tier: 1 },
  { id: 'ProductHunt',     tier: 1 },
  { id: 'Crunchbase',      tier: 2 },
  { id: 'AngelList',       tier: 2 },
  { id: 'YCombinator',     tier: 2 },
  { id: 'SEC EDGAR',       tier: 2 },
  { id: 'LinkedIn',        tier: 3 },
  { id: 'Wellfound',       tier: 3 },
  { id: 'Indeed',          tier: 3 },
  { id: 'USPTO',           tier: 4 },
  { id: 'Google Patents',  tier: 4 },
  { id: 'WIPO',            tier: 4 },
  { id: 'TechCrunch',      tier: 5 },
  { id: 'TheVerge',        tier: 5 },
  { id: 'Wired',           tier: 5 },
  { id: 'MIT Tech Review', tier: 5 },
  { id: 'VentureBeat',     tier: 5 },
  { id: 'TechRadar',       tier: 5 },
  { id: 'Betalist',        tier: 5 },
]

const TrendCard: React.FC<{ trend: Trend; idx: number }> = ({ trend, idx }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: idx * 0.05 }}
    className="bg-white/2 border border-white/5 p-6 rounded-3xl hover:border-[#0ea5e9]/30 transition-all group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-all">
      <TrendingUp className="w-24 h-24" />
    </div>
    <div className="relative z-10 flex items-start justify-between mb-4">
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
    <div className="relative z-10 flex flex-wrap gap-2 mb-6">
      {trend.platforms.map((p: string) => (
        <span key={p} className="text-[8px] font-black bg-white/5 text-slate-500 px-2 py-1 rounded-lg border border-white/5 uppercase tracking-widest">
          {p}
        </span>
      ))}
    </div>
    <div className="relative z-10 flex items-center gap-6">
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${trend.velocity * 100}%` }}
          className="h-full bg-[#0ea5e9] shadow-[0_0_10px_rgba(14,165,233,0.5)]"
        />
      </div>
      <span className="text-[9px] font-black text-slate-600 font-mono uppercase tracking-widest whitespace-nowrap">VELOCITY: {(trend.velocity * 100).toFixed(0)}%</span>
    </div>
  </motion.div>
);

const OpportunityCard: React.FC<{ opp: Opportunity; idx: number }> = ({ opp, idx }) => (
  <motion.div
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

    <div className="relative z-10 mb-6">
      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-2">Strategic Positioning</span>
      <p className="text-sm text-slate-400 leading-relaxed italic border-l border-[#d4af37]/30 pl-4">{opp.positioning}</p>
    </div>
    <div className="relative z-10 mb-6">
      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-2">Market Gap</span>
      <p className="text-xs text-slate-500 italic font-medium">&quot;{opp.gap}&quot;</p>
    </div>
    <div className="relative z-10 flex flex-wrap gap-2 pt-2 mb-10">
      {opp.supporting_evidence.map((word: string) => (
        <span key={word} className="text-[8px] font-black bg-white/5 text-[#0ea5e9] px-3 py-1 rounded-full border border-white/5 uppercase tracking-widest">
          {word}
        </span>
      ))}
    </div>

    <button className="relative z-10 w-full py-4 bg-white/2 hover:bg-[#d4af37] text-slate-500 hover:text-black text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 border border-white/5 hover:border-[#d4af37]">
      <Download className="w-4 h-4" />
      Export Opportunity
    </button>
  </motion.div>
);

interface BrandIntelTranslations {
  settings: string;
  platforms: string;
  keywords: string;
  min_len: string;
  min_freq: string;
  weights: string;
  weight_art: string;
  weight_pat: string;
  weight_sta: string;
  style: string;
  optimization: string;
  iterations: string;
  target_score: string;
  start: string;
  status_running: string;
  status_idle: string;
  title: string;
  subtitle: string;
  trends: string;
  opportunities: string;
  no_data: string;
}

interface SidebarFiltersProps {
  brandIntelTranslations: BrandIntelTranslations;
  selectedPlatforms: string[];
  togglePlatform: (p: string) => void;
  minLength: number;
  setMinLength: (v: number) => void;
  minFrequency: number;
  setMinFrequency: (v: number) => void;
  weightArticles: number;
  setWeightArticles: (v: number) => void;
  weightPatents: number;
  setWeightPatents: (v: number) => void;
  weightStartups: number;
  setWeightStartups: (v: number) => void;
  weightJobs: number;
  setWeightJobs: (v: number) => void;
  weightFunding: number;
  setWeightFunding: (v: number) => void;
  brandStyle: string;
  setBrandStyle: (v: string) => void;
  comOnly: boolean;
  setComOnly: (v: boolean) => void;
  enableLoop: boolean;
  setEnableLoop: (v: boolean) => void;
  maxIterations: number;
  setMaxIterations: (v: number) => void;
  targetScore: number;
  setTargetScore: (v: number) => void;
  recencyDays: number;
  setRecencyDays: (v: number) => void;
  minValidationSignals: number;
  setMinValidationSignals: (v: number) => void;
  minAlignmentScore: number;
  setMinAlignmentScore: (v: number) => void;
  maxPerSector: number;
  setMaxPerSector: (v: number) => void;
  status: string;
  statusMsg: string;
  toggleFetch: () => void;
}

const PlatformSection: React.FC<{
  translations: BrandIntelTranslations;
  selectedPlatforms: string[];
  togglePlatform: (p: string) => void;
}> = ({ translations, selectedPlatforms, togglePlatform }) => (
  <div>
    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4 block">
      {translations.platforms}
    </label>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map(tier => (
        <div key={tier}>
          <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-600 mb-2 mt-4">
            {tier === 1 && "TIER 1 — EARLY SIGNALS"}
            {tier === 2 && "TIER 2 — MONEY SIGNALS"}
            {tier === 3 && "TIER 3 — JOB MARKET"}
            {tier === 4 && "TIER 4 — PATENTS"}
            {tier === 5 && "TIER 5 — MEDIA"}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {ALL_PLATFORMS.filter(p => p.tier === tier).map(p => (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className={`text-[9px] px-3 py-2 rounded-xl border transition-all font-bold uppercase tracking-tighter ${
                  selectedPlatforms.includes(p.id)
                    ? 'bg-[#d4af37] border-[#d4af37] text-black shadow-lg scale-105'
                    : 'bg-white/2 border-white/5 text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {p.id}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const KeywordSection: React.FC<{
  translations: BrandIntelTranslations;
  minLength: number;
  setMinLength: (v: number) => void;
  minFrequency: number;
  setMinFrequency: (v: number) => void;
}> = ({ translations, minLength, setMinLength, minFrequency, setMinFrequency }) => (
  <div>
    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4 block">
      {translations.keywords}
    </label>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{translations.min_len}</span>
        <input 
          type="number" 
          value={minLength} 
          onChange={e => setMinLength(parseInt(e.target.value))}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#d4af37] text-white"
        />
      </div>
      <div className="space-y-2">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{translations.min_freq}</span>
        <input 
          type="number" 
          value={minFrequency} 
          onChange={e => setMinFrequency(parseInt(e.target.value))}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#d4af37] text-white"
        />
      </div>
    </div>
  </div>
);

const WeightSection: React.FC<{
  translations: BrandIntelTranslations;
  weights: { label: string; value: number; setter: (v: number) => void }[];
}> = ({ translations, weights }) => (
  <div>
    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4 block">
      {translations.weights}
    </label>
    <div className="space-y-3">
      {weights.map((w) => (
        <div key={w.label} className="flex items-center justify-between bg-white/2 p-3 rounded-xl border border-white/5">
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
);

const HubHeader: React.FC<{ translations: BrandIntelTranslations }> = ({ translations }) => (
  <header className="mb-16 border-b border-white/5 pb-10">
    <div className="flex items-center gap-6 mb-4">
      <div className="p-4 bg-white/2 border border-white/5 rounded-3xl">
        <Brain className="w-10 h-10 text-[#d4af37]" />
      </div>
      <div>
        <h1 className="text-5xl prestige-title text-white italic leading-none mb-2">{translations.title}</h1>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">{translations.subtitle}</p>
      </div>
    </div>
  </header>
);

const OptimizationGrid: React.FC<{
  translations: BrandIntelTranslations;
  enableLoop: boolean;
  options: { label: string; value: number; setter: (v: number) => void; step: number; disabled?: boolean }[];
}> = ({ options }) => (
  <div className="grid grid-cols-2 gap-4">
    {options.map(opt => (
      <div key={opt.label} className="space-y-2">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{opt.label}</span>
        <input 
          type="number" step={opt.step}
          value={opt.value} 
          onChange={e => opt.setter(parseFloat(e.target.value))}
          disabled={opt.disabled}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs disabled:opacity-30 text-white"
        />
      </div>
    ))}
  </div>
);

const OptimizationSection: React.FC<{
  translations: BrandIntelTranslations;
  comOnly: boolean;
  setComOnly: (v: boolean) => void;
  enableLoop: boolean;
  setEnableLoop: (v: boolean) => void;
  maxIterations: number;
  setMaxIterations: (v: number) => void;
  targetScore: number;
  setTargetScore: (v: number) => void;
  recencyDays: number;
  setRecencyDays: (v: number) => void;
  minValidationSignals: number;
  setMinValidationSignals: (v: number) => void;
  minAlignmentScore: number;
  setMinAlignmentScore: (v: number) => void;
  maxPerSector: number;
  setMaxPerSector: (v: number) => void;
}> = ({ 
  translations, comOnly, setComOnly, enableLoop, setEnableLoop, 
  maxIterations, setMaxIterations, targetScore, setTargetScore,
  recencyDays, setRecencyDays, minValidationSignals, setMinValidationSignals,
  minAlignmentScore, setMinAlignmentScore, maxPerSector, setMaxPerSector
}) => (
  <div className="pt-6 border-t border-white/5">
    <div className="flex items-center justify-between mb-6">
      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
        {translations.optimization}
      </label>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-black text-slate-500 uppercase">.com Only</span>
          <input type="checkbox" checked={comOnly} onChange={e => setComOnly(e.target.checked)} className="w-4 h-4 accent-[#d4af37]" />
        </div>
        <input type="checkbox" checked={enableLoop} onChange={e => setEnableLoop(e.target.checked)} className="w-4 h-4 accent-[#d4af37]" />
      </div>
    </div>
    <OptimizationGrid 
      translations={translations}
      enableLoop={enableLoop}
      options={[
        { label: translations.iterations, value: maxIterations, setter: setMaxIterations, step: 1, disabled: !enableLoop },
        { label: translations.target_score, value: targetScore, setter: setTargetScore, step: 0.05, disabled: !enableLoop },
        { label: "Recency (Days)", value: recencyDays, setter: setRecencyDays, step: 1 },
        { label: "Min Signals", value: minValidationSignals, setter: setMinValidationSignals, step: 1 },
        { label: "Min Score", value: minAlignmentScore, setter: setMinAlignmentScore, step: 1 },
        { label: "Max/Sector", value: maxPerSector, setter: setMaxPerSector, step: 1 }
      ]}
    />
  </div>
);

const SidebarFooter: React.FC<{
  status: string;
  statusMsg: string;
  translations: BrandIntelTranslations;
  toggleFetch: () => void;
}> = ({ status, statusMsg, translations, toggleFetch }) => (
  <div className="mt-8 space-y-4">
    <button
      onClick={toggleFetch}
      className="w-full bg-white text-black hover:bg-white/90 disabled:bg-slate-800 disabled:text-slate-500 font-black py-5 px-4 rounded-2xl transition-all flex items-center justify-center gap-3 group uppercase text-[10px] tracking-widest shadow-2xl"
    >
      {status === 'running' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />}
      {status === 'running' ? 'Stop Mission' : translations.start}
    </button>

    <div className={`text-center py-3 px-4 rounded-xl text-[8px] font-black uppercase tracking-[0.3em] ${
      status === 'running' ? 'bg-[#d4af37]/20 text-[#d4af37] animate-pulse' : 
      status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-white/2 text-slate-600'
    }`}>
      {status === 'running' ? translations.status_running : status === 'error' ? 'Protocol Interruption' : translations.status_idle}
    </div>

    {statusMsg && <p className="text-[9px] text-center text-[#0ea5e9] italic opacity-60">{statusMsg}</p>}
  </div>
);

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  brandIntelTranslations,
  selectedPlatforms,
  togglePlatform,
  minLength,
  setMinLength,
  minFrequency,
  setMinFrequency,
  weightArticles,
  setWeightArticles,
  weightPatents,
  setWeightPatents,
  weightStartups,
  setWeightStartups,
  weightJobs,
  setWeightJobs,
  weightFunding,
  setWeightFunding,
  brandStyle,
  setBrandStyle,
  comOnly,
  setComOnly,
  enableLoop,
  setEnableLoop,
  maxIterations,
  setMaxIterations,
  targetScore,
  setTargetScore,
  recencyDays,
  setRecencyDays,
  minValidationSignals,
  setMinValidationSignals,
  minAlignmentScore,
  setMinAlignmentScore,
  maxPerSector,
  setMaxPerSector,
  status,
  statusMsg,
  toggleFetch
}) => (
  <aside className="w-80 bg-[#08080a] border-r border-white/5 p-8 overflow-y-auto custom-scrollbar">
    <div className="flex items-center gap-3 mb-10 text-[#d4af37]">
      <Settings className="w-5 h-5" />
      <h3 className="font-black text-[10px] uppercase tracking-[0.3em]">{brandIntelTranslations.settings}</h3>
    </div>

    <div className="space-y-8">
      <PlatformSection translations={brandIntelTranslations} selectedPlatforms={selectedPlatforms} togglePlatform={togglePlatform} />
      <KeywordSection translations={brandIntelTranslations} minLength={minLength} setMinLength={setMinLength} minFrequency={minFrequency} setMinFrequency={setMinFrequency} />
      <WeightSection 
        translations={brandIntelTranslations} 
        weights={[
          { label: brandIntelTranslations.weight_art, value: weightArticles, setter: setWeightArticles },
          { label: brandIntelTranslations.weight_pat, value: weightPatents, setter: setWeightPatents },
          { label: brandIntelTranslations.weight_sta, value: weightStartups, setter: setWeightStartups },
          { label: "Jobs", value: weightJobs, setter: setWeightJobs },
          { label: "Funding", value: weightFunding, setter: setWeightFunding }
        ]} 
      />

      <div>
        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 block">{brandIntelTranslations.style}</label>
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

      <OptimizationSection 
        translations={brandIntelTranslations}
        comOnly={comOnly} setComOnly={setComOnly}
        enableLoop={enableLoop} setEnableLoop={setEnableLoop}
        maxIterations={maxIterations} setMaxIterations={setMaxIterations}
        targetScore={targetScore} setTargetScore={setTargetScore}
        recencyDays={recencyDays} setRecencyDays={setRecencyDays}
        minValidationSignals={minValidationSignals} setMinValidationSignals={setMinValidationSignals}
        minAlignmentScore={minAlignmentScore} setMinAlignmentScore={setMinAlignmentScore}
        maxPerSector={maxPerSector} setMaxPerSector={setMaxPerSector}
      />

      <SidebarFooter status={status} statusMsg={statusMsg} translations={brandIntelTranslations} toggleFetch={toggleFetch} />
    </div>
  </aside>
);


const TrendsSection: React.FC<{
  translations: BrandIntelTranslations;
  trends: Trend[];
}> = ({ translations, trends }) => (
  <section>
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <TrendingUp className="w-5 h-5 text-[#0ea5e9]" />
        <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">{translations.trends}</h2>
      </div>
      <span className="text-[9px] bg-white/2 border border-white/5 px-3 py-1.5 rounded-full text-slate-500 font-black uppercase tracking-widest">
        {trends.length} DETECTED
      </span>
    </div>

    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {trends.length > 0 ? (
          trends.map((trend, idx) => (
            <TrendCard key={trend.id || idx} trend={trend} idx={idx} />
          ))
        ) : (
          <div className="text-center py-24 bg-white/2 rounded-[40px] border border-dashed border-white/5">
            <Search className="w-16 h-16 text-slate-800 mx-auto mb-6" />
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest px-10">{translations.no_data}</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  </section>
);

const OpportunitiesSection: React.FC<{
  translations: BrandIntelTranslations;
  opportunities: Opportunity[];
}> = ({ translations, opportunities }) => (
  <section>
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Lightbulb className="w-5 h-5 text-[#d4af37]" />
        <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">{translations.opportunities}</h2>
      </div>
      <span className="text-[9px] bg-white/2 border border-white/5 px-3 py-1.5 rounded-full text-slate-500 font-black uppercase tracking-widest">
        {opportunities.length} SYNTHESIZED
      </span>
    </div>

    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {opportunities.length > 0 ? (
          opportunities.map((opp, idx) => (
            <OpportunityCard key={opp.id || idx} opp={opp} idx={idx} />
          ))
        ) : (
          <div className="text-center py-24 bg-white/2 rounded-[40px] border border-dashed border-white/5">
            <Activity className="w-16 h-16 text-slate-800 mx-auto mb-6" />
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest px-10">{translations.no_data}</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  </section>
);

const MainContent: React.FC<{
  translations: BrandIntelTranslations;
  trends: Trend[];
  opportunities: Opportunity[];
}> = ({ translations, trends, opportunities }) => (
  <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
    <div className="max-w-6xl mx-auto">
      <HubHeader translations={translations} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <TrendsSection translations={translations} trends={trends} />
        <OpportunitiesSection translations={translations} opportunities={opportunities} />
      </div>
    </div>
  </div>
);


export const BrandIntelligenceHub: React.FC = () => {
  const { user } = useAuth();
  const userApiKeyRef = React.useRef(user?.apiKeys?.gemini);
  
  React.useEffect(() => {
    userApiKeyRef.current = user?.apiKeys?.gemini;
  }, [user?.apiKeys?.gemini]);

  const brandIntelTranslations = translations.en.brand_intel;
  const [status, setStatus] = useState<'idle' | 'running' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [trends, setTrends] = useState<Trend[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  
  // Filters State
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'HackerNews', 'ArXiv', 'ProductHunt',
    'Crunchbase', 'AngelList',
    'LinkedIn',
    'USPTO',
    'TechCrunch', 'TheVerge'
  ])
  const [minLength, setMinLength] = useState(4)
  const [minFrequency, setMinFrequency] = useState(2)
  const [weightArticles, setWeightArticles] = useState(1)
  const [weightPatents, setWeightPatents] = useState(4)
  const [weightStartups, setWeightStartups] = useState(3)
  const [weightJobs, setWeightJobs] = useState(3)
  const [weightFunding, setWeightFunding] = useState(5)
  const [maxPerSector, setMaxPerSector] = useState(2)
  const [recencyDays, setRecencyDays] = useState(60)
  const [minValidationSignals, setMinValidationSignals] = useState(2)
  const [minAlignmentScore, setMinAlignmentScore] = useState(55)
  const [comOnly, setComOnly] = useState(true)
  const [brandStyle, setBrandStyle] = useState('merged');
  const [enableLoop, setEnableLoop] = useState(true);
  const [maxIterations, setMaxIterations] = useState(3);
  const [targetScore, setTargetScore] = useState(0.85);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const fetchData = async () => {
    try {
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setStatus('running');
      setStatusMsg('📡 Connecting to Sovereign Core...');
      
      console.log("📡 [HUB] Fetching trends and opportunities via Gemini...");
      
      const { generateStructuredAI } = await import('../../../services/ai/base');
      const userApiKey = userApiKeyRef.current;
      
      // Generate Trends
      const trendsRes = await generateStructuredAI<Trend[]>(
        "gemini-3-flash-preview",
        "You are an expert market analyst. Generate 3 cutting-edge technology trends based on current market signals.",
        `Generate 3 emerging tech trends. Focus on these platforms: ${selectedPlatforms.join(', ')}. 
         Constraints: Recency(${recencyDays} days), Min Signals(${minValidationSignals}), Min Score(${minAlignmentScore}), Max/Sector(${maxPerSector}), .com Only(${comOnly}). 
         Weights: Jobs(${weightJobs}), Funding(${weightFunding}), Articles(${weightArticles}), Patents(${weightPatents}), Startups(${weightStartups}).`,
        {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              keyword: { type: "string" },
              opportunity_score: { type: "number" },
              platforms: { type: "array", items: { type: "string" } },
              velocity: { type: "number" }
            },
            required: ["id", "keyword", "opportunity_score", "platforms", "velocity"]
          }
        },
        undefined,
        undefined,
        signal,
        userApiKey
      );

      if (signal.aborted) return;

      // Generate Opportunities
      const oppsRes = await generateStructuredAI<Opportunity[]>(
        "gemini-3-flash-preview",
        "You are an expert domain name investor and brand strategist. Generate 2 highly valuable brand/domain opportunities based on the trends.",
        "Generate 2 brand opportunities based on recent tech trends.",
        {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              opportunity_score: { type: "number" },
              positioning: { type: "string" },
              gap: { type: "string" },
              supporting_evidence: { type: "array", items: { type: "string" } }
            },
            required: ["id", "name", "opportunity_score", "positioning", "gap", "supporting_evidence"]
          }
        },
        undefined,
        undefined,
        signal,
        userApiKey
      );

      if (signal.aborted) return;

      setTrends(trendsRes.data || []);
      setOpportunities(oppsRes.data || []);
      
      setStatusMsg('');
      setStatus(prev => prev === 'error' ? 'idle' : prev);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log("Fetch aborted");
        return;
      }
      console.error("Fetch error:", err);
      let errorMsg = err instanceof Error ? err.message : 'Unknown error';
      if (errorMsg.includes('429') || errorMsg.includes('Quota exceeded')) {
        errorMsg = 'Rate limit exceeded. Please wait a minute before trying again (Free Tier limit is 5 requests/min).';
      }
      
      setStatus('error');
      setStatusMsg(`❌ Fetch error: ${errorMsg}`);
    }
  };

  const toggleFetch = () => {
    if (status === 'running') {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setStatus('idle');
      setStatusMsg('Mission aborted by user.');
    } else {
      fetchData();
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      if (!isMounted) return;
      // Only fetch on mount if we don't have data yet
      if (trends.length === 0 && opportunities.length === 0) {
        await fetchData();
      }
    };

    initFetch().catch(e => console.error("initFetch error:", e));
    
    return () => {
      isMounted = false;
    };
  }, []);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  return (
    <div className="flex h-full bg-[#050507] text-slate-200 overflow-hidden" dir="ltr">
      <SidebarFilters 
        brandIntelTranslations={brandIntelTranslations}
        selectedPlatforms={selectedPlatforms}
        togglePlatform={togglePlatform}
        minLength={minLength}
        setMinLength={setMinLength}
        minFrequency={minFrequency}
        setMinFrequency={setMinFrequency}
        weightArticles={weightArticles}
        setWeightArticles={setWeightArticles}
        weightPatents={weightPatents}
        setWeightPatents={setWeightPatents}
        weightStartups={weightStartups}
        setWeightStartups={setWeightStartups}
        weightJobs={weightJobs}
        setWeightJobs={setWeightJobs}
        weightFunding={weightFunding}
        setWeightFunding={setWeightFunding}
        brandStyle={brandStyle}
        setBrandStyle={setBrandStyle}
        comOnly={comOnly}
        setComOnly={setComOnly}
        enableLoop={enableLoop}
        setEnableLoop={setEnableLoop}
        maxIterations={maxIterations}
        setMaxIterations={setMaxIterations}
        targetScore={targetScore}
        setTargetScore={setTargetScore}
        recencyDays={recencyDays}
        setRecencyDays={setRecencyDays}
        minValidationSignals={minValidationSignals}
        setMinValidationSignals={setMinValidationSignals}
        minAlignmentScore={minAlignmentScore}
        setMinAlignmentScore={setMinAlignmentScore}
        maxPerSector={maxPerSector}
        setMaxPerSector={setMaxPerSector}
        status={status}
        statusMsg={statusMsg}
        toggleFetch={toggleFetch}
      />

      <MainContent 
        translations={brandIntelTranslations}
        trends={trends}
        opportunities={opportunities}
      />
    </div>
  );
};
