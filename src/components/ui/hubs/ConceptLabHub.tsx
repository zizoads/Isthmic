import React, { useState, useEffect } from 'react';
import { Brain, History } from 'lucide-react';

interface Trend {
  id: string;
  keyword: string;
}

interface HistoryItem {
  name: string;
  trend: string;
  vibe: string;
  timestamp: number;
}

export const ConceptLabHub: React.FC<{ trends: Trend[] }> = ({ trends }) => {
  const [selectedTrend, setSelectedTrend] = useState(trends[0]?.keyword || '');
  const [selectedVibe, setSelectedVibe] = useState('Minimalist');
  const [results, setResults] = useState<{name: string, status: 'checking' | 'available' | 'taken' | 'error'}[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'error'>('idle');
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('conceptLabHistory') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('conceptLabHistory', JSON.stringify(history));
  }, [history]);

  const checkDomain = async (name: string): Promise<'available' | 'taken' | 'error'> => {
    try {
      const response = await fetch(`/api/check-domain?domain=${name.toLowerCase()}.com`);
      const data = await response.json();
      return data.available ? 'available' : 'taken';
    } catch {
      return 'error';
    }
  };

  const generateBrandableNames = async (trend: string, vibe: string) => {
    setStatus('running');
    setResults([]);
    try {
      const { generateStructuredAI } = await import('../../../services/ai/base');
      const res = await generateStructuredAI<{ names: string[] }>(
        "gemini-3-flash-preview",
        "You are a master brand naming expert specializing in high phonetic entropy.",
        `Generate 15 abstract, highly brandable names inspired by the concept: ${trend}.
         Vibe: ${vibe}.
         
         CRITICAL CONSTRAINTS:
         1. Length: MUST be exactly 5 or 6 letters long.
         2. Phonetic Entropy: DO NOT use dictionary words, common prefixes, or obvious suffixes. Create completely invented, abstract syllable combinations (e.g., Vexlo, Zynta, Quora).
         3. Pronounceability: Must be easy to read and say aloud despite being abstract.
         4. Output: Return exactly 15 unique names.`,
        {
          type: "object",
          properties: {
            names: { type: "array", items: { type: "string" } }
          },
          required: ["names"]
        }
      );
      
      const names = res.data?.names || [];
      
      // Check domains in parallel and only keep available ones
      const checkPromises = names.map(async (name) => {
        const status = await checkDomain(name);
        return { name, status };
      });

      const checkedResults = await Promise.all(checkPromises);
      const availableNames = checkedResults.filter(r => r.status === 'available');
      
      setResults(availableNames);

      if (availableNames.length > 0) {
        const newHistoryItems = availableNames.map(r => ({
          name: r.name,
          trend,
          vibe,
          timestamp: Date.now()
        }));
        setHistory(prev => [...newHistoryItems, ...prev].slice(0, 50)); // Keep last 50
      }
    } catch (e) {
      console.error(e);
      setStatus('error');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="p-12 bg-[#050507] min-h-screen text-white">
      <header className="mb-16 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6 mb-4">
          <div className="p-4 bg-white/2 border border-white/5 rounded-3xl">
            <Brain className="w-10 h-10 text-[#d4af37]" />
          </div>
          <div>
            <h1 className="text-5xl prestige-title italic leading-none mb-2">Concept Lab</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Abstract Brand Synthesis</p>
          </div>
        </div>
      </header>

      <section className="bg-[#08080a] border border-white/5 p-8 rounded-[40px] max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Brain className="w-6 h-6 text-[#d4af37]" />
          <h2 className="text-2xl font-bold uppercase tracking-tighter">Synthesize Names</h2>
        </div>
        
        <div className="flex gap-4 mb-10">
          <select 
            value={selectedTrend}
            onChange={(e) => setSelectedTrend(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-sm text-white"
          >
            {trends.map(t => <option key={t.id} value={t.keyword}>{t.keyword}</option>)}
          </select>
          <select 
            value={selectedVibe}
            onChange={(e) => setSelectedVibe(e.target.value)}
            className="w-40 bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-sm text-white"
          >
            {['Minimalist', 'Tech/Futuristic', 'Organic/Soft'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <button 
            onClick={() => generateBrandableNames(selectedTrend, selectedVibe)}
            disabled={status === 'running'}
            className="bg-[#d4af37] text-black font-black px-8 py-4 rounded-xl uppercase text-sm tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'running' ? 'Synthesizing & Filtering...' : 'Synthesize'}
          </button>
        </div>

        {status === 'idle' && results.length === 0 && (
          <div className="text-center text-slate-500 text-sm py-8">
            Ready to synthesize. Only available domains will be shown.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {results.map(r => (
            <div key={r.name} className="bg-white/5 border border-white/5 p-6 rounded-2xl text-center hover:border-[#d4af37]/50 transition-all">
              <div className="text-lg font-bold text-white mb-2">{r.name}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-green-500">
                AVAILABLE
              </div>
            </div>
          ))}
        </div>
      </section>

      {history.length > 0 && (
        <section className="mt-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-bold text-slate-300 uppercase tracking-tighter">Lab History</h3>
            <span className="text-xs text-slate-500 ml-auto">Last 50 available discoveries</span>
          </div>
          
          <div className="bg-[#08080a] border border-white/5 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <div>Domain</div>
              <div>Trend</div>
              <div>Vibe</div>
              <div className="text-right">Discovered</div>
            </div>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {history.map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center">
                  <div className="font-bold text-[#d4af37]">{item.name}.com</div>
                  <div className="text-xs text-slate-300 truncate">{item.trend}</div>
                  <div className="text-xs text-slate-400">{item.vibe}</div>
                  <div className="text-xs text-slate-500 text-right">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
