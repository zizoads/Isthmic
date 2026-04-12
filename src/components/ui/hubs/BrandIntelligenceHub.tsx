import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Search, 
  TrendingUp, 
  Lightbulb, 
  RefreshCw, 
  Download, 
  Activity
} from 'lucide-react';
import { translations } from '../../../translations';
import { useAuth } from '../../../context/AuthContext';

interface BrandIntelligenceHubProps {}

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
];

const TIER_LABELS: Record<number, string> = {
  1: 'TIER 1 — EARLY SIGNALS',
  2: 'TIER 2 — MONEY SIGNALS',
  3: 'TIER 3 — JOB MARKET',
  4: 'TIER 4 — PATENTS',
  5: 'TIER 5 — MEDIA',
};

const TIER_COLORS: Record<number, string> = {
  1: 'text-red-400',
  2: 'text-orange-400',
  3: 'text-yellow-400',
  4: 'text-blue-400',
  5: 'text-slate-500',
};

export const BrandIntelligenceHub: React.FC<BrandIntelligenceHubProps> = () => {
  const { user } = useAuth();
  const userApiKeyRef = React.useRef(user?.apiKeys?.gemini);

  React.useEffect(() => {
    userApiKeyRef.current = user?.apiKeys?.gemini;
  }, [user?.apiKeys?.gemini]);

  const t = translations.en.brand_intel;
  const [status, setStatus] = useState<'idle' | 'running' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [trends, setTrends] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);

  // Filters State
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'HackerNews', 'ArXiv', 'ProductHunt',
    'Crunchbase', 'AngelList',
    'LinkedIn',
    'USPTO',
    'TechCrunch', 'TheVerge'
  ]);
  const [minLength, setMinLength] = useState(4);
  const [minFrequency, setMinFrequency] = useState(2);
  const [weightArticles, setWeightArticles] = useState(1);
  const [weightPatents, setWeightPatents] = useState(4);
  const [weightStartups, setWeightStartups] = useState(3);
  const [weightJobs, setWeightJobs] = useState(3);
  const [weightFunding, setWeightFunding] = useState(5);
  const [maxPerSector, setMaxPerSector] = useState(2);
  const [recencyDays, setRecencyDays] = useState(60);
  const [minValidationSignals, setMinValidationSignals] = useState(2);
  const [minAlignmentScore, setMinAlignmentScore] = useState(55);
  const [comOnly] = useState(true);
  const [brandStyle, setBrandStyle] = useState('merged');
  const [enableLoop, setEnableLoop] = useState(true);
  const [maxIterations, setMaxIterations] = useState(3);
  const [targetScore, setTargetScore] = useState(0.85);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleFetch = () => {
    if (status === 'running') {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setStatus('idle');
      setStatusMsg('Mission aborted by user.');
    } else {
      fetchData();
    }
  };

  const fetchData = async () => {
    try {
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      setStatus('running');
      setStatusMsg('📡 Connecting to Sovereign Core...');

      const { generateStructuredAI } = await import('../../../services/ai/base');
      const userApiKey = userApiKeyRef.current;

      const TEMPORAL_CUTOFF = new Date(
        Date.now() - recencyDays * 24 * 60 * 60 * 1000
      ).toISOString().split('T')[0];

      const platformsByTier = [1, 2, 3, 4, 5].map(tier => ({
        tier,
        label: TIER_LABELS[tier],
        platforms: selectedPlatforms.filter(
          p => ALL_PLATFORMS.find(ap => ap.id === p && ap.tier === tier)
        )
      })).filter(t => t.platforms.length > 0);

      const platformContext = platformsByTier
        .map(t => `${t.label}: ${t.platforms.join(', ')}`)
        .join('\n');

      // Generate Trends
      setStatusMsg('🔍 Scanning intelligence tiers...');
      const trendsRes = await generateStructuredAI<any[]>(
        'gemini-2.5-pro-preview-03-25',
        `You are a Sovereign Market Intelligence Agent.
         TEMPORAL PROTOCOL — CRITICAL:
         Only use signals from the last ${recencyDays} days (after ${TEMPORAL_CUTOFF}).
         REJECT any trend older than this window. Apply -50 penalty for stale signals.
         
         PLATFORM TIERS TO SCAN:
         ${platformContext}
         
         CROSS-SIGNAL VALIDATION:
         A trend is CONFIRMED only if found in ${minValidationSignals}+ different tiers.
         Flag as SPECULATIVE if found in only 1 tier.
         
         SCORING WEIGHTS:
         Funding signals: ${weightFunding}x
         Patent signals: ${weightPatents}x
         Job market signals: ${weightJobs}x
         Startup signals: ${weightStartups}x
         Article signals: ${weightArticles}x
         
         DIVERSITY RULE: Maximum ${maxPerSector} results per sector.
         KEYWORD RULE: Minimum length ${minLength} chars, minimum frequency ${minFrequency}.
         MINIMUM SCORE: Only return trends with opportunity_score >= ${minAlignmentScore / 100}.
         TLD RULE: ${comOnly ? 'Focus on .com domains only.' : 'All TLDs allowed.'}
         
         +30 bonus: Confirmed across 3+ tiers simultaneously.
         +20 bonus: Found in TIER 1 or TIER 2.
         +15 bonus: Job market shows 500+ postings.`,
        `Scan all selected platform tiers and generate the top emerging tech trends 
         with domain investment potential. Each trend must be verified across multiple tiers.`,
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              keyword: { type: 'string' },
              opportunity_score: { type: 'number' },
              platforms: { type: 'array', items: { type: 'string' } },
              velocity: { type: 'number' },
              firstSignalDate: { type: 'string' },
              recencyScore: { type: 'number' },
              confirmedTiers: { type: 'number' },
              validationStatus: {
                type: 'string',
                enum: ['CONFIRMED', 'SPECULATIVE']
              },
              searchVolumeTrajectory: {
                type: 'string',
                enum: ['exploding', 'rising', 'stable', 'declining']
              }
            },
            required: ['id', 'keyword', 'opportunity_score', 'platforms', 'velocity']
          }
        },
        [{ googleSearch: {} }],
        undefined,
        signal,
        userApiKey
      );

      if (signal.aborted) return;

      // Generate Opportunities
      setStatusMsg('⚡ Synthesizing brand opportunities...');
      const oppsRes = await generateStructuredAI<any[]>(
        'gemini-2.5-pro-preview-03-25',
        `You are a Sovereign Domain Investment Strategist.
         RULES:
         - Only suggest .com domains available for hand-registration ($10-$13).
         - Max 10 characters (excluding .com).
         - Focus on "Unconventional Semantic Pairings" — clear meaning, non-obvious combination.
         - Minimum strategicAlignmentScore: ${minAlignmentScore}.
         - Maximum ${maxPerSector} opportunities per sector.
         - All signals must be from the last ${recencyDays} days.
         
         SCORING:
         +25: Unconventional Semantic .com <= 10 chars hand-reg available.
         +20: Confirmed by TIER 1 or TIER 2 signal.
         +15: Job market shows 500+ postings.
         -50: Signal older than ${recencyDays} days.`,
        `Based on the most recent platform signals, generate high-value brand and domain 
         opportunities with strong flip potential.`,
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              opportunity_score: { type: 'number' },
              positioning: { type: 'string' },
              gap: { type: 'string' },
              supporting_evidence: { type: 'array', items: { type: 'string' } },
              estimatedPrice: { type: 'number' },
              strategicAlignmentScore: { type: 'number' },
              validationMatrix: {
                type: 'object',
                properties: {
                  mediaSignal: { type: 'boolean' },
                  patentSignal: { type: 'boolean' },
                  jobSignal: { type: 'boolean' },
                  fundingSignal: { type: 'boolean' },
                  earlySignal: { type: 'boolean' },
                  confirmedValid: { type: 'boolean' }
                }
              }
            },
            required: ['id', 'name', 'opportunity_score', 'positioning', 'gap', 'supporting_evidence']
          }
        },
        [{ googleSearch: {} }],
        undefined,
        signal,
        userApiKey
      );

      if (signal.aborted) return;

      setTrends(trendsRes.data || []);
      setOpportunities(oppsRes.data || []);
      setStatus('idle');
      setStatusMsg('');
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      setStatus('error');
      setStatusMsg(err?.message || 'Unknown error');
    }
  };

  const tiers = [1, 2, 3, 4, 5];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 border-r border-white/5 p-6 overflow-y-auto custom-scrollbar space-y-8">

        {/* Platforms */}
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4 block">
            Target Platforms
          </label>
          {tiers.map(tier => {
            const tierPlatforms = ALL_PLATFORMS.filter(p => p.tier === tier);
            return (
              <div key={tier} className="mb-4">
                <p className={`text-[8px] font-black uppercase tracking-widest mb-2 ${TIER_COLORS[tier]}`}>
                  {TIER_LABELS[tier]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tierPlatforms.map(p => (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`text-[8px] font-black px-2 py-1 rounded-lg border uppercase tracking-widest transition-all ${
                        selectedPlatforms.includes(p.id)
                          ? 'bg-[#d4af37] text-black border-[#d4af37]'
                          : 'bg-white/2 text-slate-500 border-white/5 hover:border-white/20'
                      }`}
                    >
                      {p.id}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Keyword Criteria */}
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4 block">
            Keyword Criteria
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Min Length</span>
              <input
                type="number"
                value={minLength}
                onChange={e => setMinLength(parseInt(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Min Frequency</span>
              <input
                type="number"
                value={minFrequency}
                onChange={e => setMinFrequency(parseInt(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>

        {/* Recency */}
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4 block">
            Signal Recency
          </label>
          <div className="flex gap-2">
            {[30, 60, 90].map(d => (
              <button
                key={d}
                onClick={() => setRecencyDays(d)}
                className={`flex-1 text-[8px] font-black py-2 rounded-xl border uppercase tracking-widest transition-all ${
                  recencyDays === d
                    ? 'bg-[#d4af37] text-black border-[#d4af37]'
                    : 'bg-white/2 text-slate-500 border-white/5 hover:border-white/20'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Source Weights */}
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4 block">
            Source Weights
          </label>
          <div className="space-y-3">
            {[
              { label: 'Funding', value: weightFunding, setter: setWeightFunding },
              { label: 'Patents', value: weightPatents, setter: setWeightPatents },
              { label: 'Jobs', value: weightJobs, setter: setWeightJobs },
              { label: 'Startups', value: weightStartups, setter: setWeightStartups },
              { label: 'Articles', value: weightArticles, setter: setWeightArticles },
            ].map((w, i) => (
              <div key={i} className="flex items-center justify-between bg-white/2 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{w.label}</span>
                <input
                  type="number"
                  step="1"
                  value={w.value}
                  onChange={e => w.setter(parseFloat(e.target.value))}
                  className="w-12 bg-transparent text-xs text-right font-mono text-[#d4af37] focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Validation */}
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4 block">
            Validation
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white/2 p-3 rounded-xl border border-white/5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Min Signals</span>
              <input
                type="number"
                value={minValidationSignals}
                onChange={e => setMinValidationSignals(parseInt(e.target.value))}
                className="w-12 bg-transparent text-xs text-right font-mono text-[#d4af37] focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between bg-white/2 p-3 rounded-xl border border-white/5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Min Score</span>
              <input
                type="number"
                value={minAlignmentScore}
                onChange={e => setMinAlignmentScore(parseInt(e.target.value))}
                className="w-12 bg-transparent text-xs text-right font-mono text-[#d4af37] focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between bg-white/2 p-3 rounded-xl border border-white/5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Max/Sector</span>
              <input
                type="number"
                value={maxPerSector}
                onChange={e => setMaxPerSector(parseInt(e.target.value))}
                className="w-12 bg-transparent text-xs text-right font-mono text-[#d4af37] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Naming Style */}
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 block">
            Naming Style
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

        {/* Optimization Loop */}
        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-6">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Optimization Loop
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
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Iterations</span>
              <input
                type="number"
                value={maxIterations}
                onChange={e => setMaxIterations(parseInt(e.target.value))}
                disabled={!enableLoop}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs disabled:opacity-30 text-white"
              />
            </div>
            <div className="space-y-2">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Target Score</span>
              <input
                type="number"
                step="0.05"
                value={targetScore}
                onChange={e => setTargetScore(parseFloat(e.target.value))}
                disabled={!enableLoop}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs disabled:opacity-30 text-white"
              />
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <button
          onClick={toggleFetch}
          className="w-full bg-white text-black hover:bg-white/90 disabled:bg-slate-800 disabled:text-slate-500 font-black py-5 px-4 rounded-2xl transition-all flex items-center justify-center gap-3 group uppercase text-[10px] tracking-widest shadow-2xl"
        >
          {status === 'running'
            ? <RefreshCw className="w-4 h-4 animate-spin" />
            : <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />}
          {status === 'running' ? 'Stop Mission' : t.start}
        </button>

        <div className={`text-center py-3 px-4 rounded-xl text-[8px] font-black uppercase tracking-[0.3em] ${
          status === 'running' ? 'bg-[#d4af37]/20 text-[#d4af37] animate-pulse' :
          status === 'error'   ? 'bg-red-500/20 text-red-400' :
                                 'bg-white/2 text-slate-600'
        }`}>
          {status === 'running' ? t.status_running : status === 'error' ? 'Protocol Interruption' : t.status_idle}
        </div>

        {statusMsg && (
          <p className="text-[9px] text-center text-[#0ea5e9] italic opacity-60">{statusMsg}</p>
        )}
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
            {/* Trends */}
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
                  {trends.length > 0 ? trends.map((trend, idx) => (
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
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Opportunity</span>
                            <span className="text-xl font-mono font-black text-[#d4af37]">
                              {(trend.opportunity_score * 100).toFixed(1)}%
                            </span>
                            {trend.validationStatus && (
                              <span className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                                trend.validationStatus === 'CONFIRMED'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {trend.validationStatus}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {trend.platforms.map((p: string) => (
                            <span key={p} className="text-[8px] font-black bg-white/5 text-slate-500 px-2 py-1 rounded-lg border border-white/5 uppercase tracking-widest">
                              {p}
                            </span>
                          ))}
                        </div>
                        {trend.firstSignalDate && (
                          <p className="text-[8px] text-slate-600 mb-3">
                            First signal: <span className="text-[#0ea5e9]">{trend.firstSignalDate}</span>
                            {trend.searchVolumeTrajectory && (
                              <span className="ml-3 uppercase font-black text-[7px] px-2 py-0.5 rounded-full bg-white/5">
                                {trend.searchVolumeTrajectory}
                              </span>
                            )}
                          </p>
                        )}
                        <div className="flex items-center gap-6">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${trend.velocity * 100}%` }}
                              className="h-full bg-[#0ea5e9] shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                            />
                          </div>
                          <span className="text-[9px] font-black text-slate-600 font-mono uppercase tracking-widest whitespace-nowrap">
                            VELOCITY: {(trend.velocity * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-24 bg-white/2 rounded-[40px] border border-dashed border-white/5">
                      <Search className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                      <p className="text-slate-600 text-xs font-bold uppercase tracking-widest px-10">{t.no_data}</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Opportunities */}
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
                  {opportunities.length > 0 ? opportunities.map((opp, idx) => (
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
                        <div className="flex flex-col items-end gap-1">
                          <div className="bg-[#d4af37]/10 text-[#d4af37] text-[9px] font-black px-3 py-1.5 rounded-full border border-[#d4af37]/20 uppercase tracking-widest">
                            SCORE: {(opp.opportunity_score * 100).toFixed(1)}
                          </div>
                          {opp.estimatedPrice && (
                            <span className="text-[8px] text-green-400 font-black">${opp.estimatedPrice}</span>
                          )}
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
                        {opp.validationMatrix && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(opp.validationMatrix)
                              .filter(([k]) => k !== 'confirmedValid')
                              .map(([key, val]) => (
                                <span key={key} className={`text-[7px] font-black px-2 py-1 rounded-full border uppercase tracking-widest ${
                                  val ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/2 text-slate-600 border-white/5'
                                }`}>
                                  {key.replace('Signal', '')}
                                </span>
                              ))}
                          </div>
                        )}
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
                  )) : (
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
```
