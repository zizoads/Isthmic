import React, { useState } from 'react';
import { Brain, BookmarkPlus, Check } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface Trend {
  id: string;
  keyword: string;
}

const ConceptLabHeader: React.FC = () => (
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
);

export const ConceptLabHub: React.FC<{ trends: Trend[] }> = ({ trends }) => {
  const { user } = useAuth();
  const [selectedTrend, setSelectedTrend] = useState(trends[0]?.keyword || '');
  const [selectedVibe, setSelectedVibe] = useState('Minimalist');
  const [results, setResults] = useState<{name: string, status: 'checking' | 'available' | 'taken' | 'error'}[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'error'>('idle');
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const checkDomain = async (name: string): Promise<'available' | 'taken' | 'error'> => {
    try {
      const response = await fetch(`/api/check-domain?domain=${name.toLowerCase()}.com`);
      const data = await response.json();
      return data.available ? 'available' : 'taken';
    } catch {
      return 'error';
    }
  };

  const handleSaveDomain = async (name: string) => {
    if (!user) return;
    setSaving(prev => ({ ...prev, [name]: true }));
    try {
      const userRef = doc(db, 'users', user.id);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const savedDomains = userData.savedDomains || [];
        
        // Check if already saved
        if (!savedDomains.some((d: any) => d.name === name)) {
          const newDomain = {
            name,
            trend: selectedTrend,
            vibe: selectedVibe,
            savedAt: Date.now()
          };
          await updateDoc(userRef, {
            savedDomains: [...savedDomains, newDomain]
          });
        }
        setSaved(prev => ({ ...prev, [name]: true }));
      }
    } catch (e) {
      console.error("Failed to save domain", e);
    } finally {
      setSaving(prev => ({ ...prev, [name]: false }));
    }
  };

  const generateBrandableNames = async (trend: string, vibe: string) => {
    setStatus('running');
    setResults([]);
    setSaved({});
    try {
      const { generateStructuredAI } = await import('../../../services/ai/base');
      const res = await generateStructuredAI<{ names: string[] }>(
        "gemini-3-flash-preview",
        "You are a master brand naming expert specializing in high phonetic entropy.",
        `Generate 25 abstract, highly brandable names inspired by the concept: ${trend}.
         Vibe: ${vibe}.
         
         CRITICAL CONSTRAINTS:
         1. Length: MUST be exactly 5 or 6 letters long.
         2. Phonetic Entropy: DO NOT use dictionary words, common prefixes, or obvious suffixes. Create completely invented, abstract syllable combinations (e.g., Vexlo, Zynta, Quora).
         3. Pronounceability: Must be easy to read and say aloud despite being abstract.
         4. Output: Return exactly 25 unique names.`,
        {
          type: "object",
          properties: {
            names: { type: "array", items: { type: "string" } }
          },
          required: ["names"]
        }
      );
      
      const names = res.data?.names || [];
      
      // Show them immediately as checking
      setResults(names.map(name => ({ name, status: 'checking' })));
      
      // Check domains in parallel and update UI progressively
      const checkPromises = names.map(async (name) => {
        const status = await checkDomain(name);
        setResults(prev => prev.map(r => r.name === name ? { ...r, status } : r));
        return { name, status };
      });

      await Promise.all(checkPromises);
    } catch (e) {
      console.error(e);
      setStatus('error');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="p-12 bg-[#050507] min-h-screen text-white">
      <ConceptLabHeader />

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
            Ready to synthesize. Results will be checked against DNS records in real-time.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {results.map(r => (
            <div key={r.name} className={`relative border p-6 rounded-2xl text-center transition-all group ${
              r.status === 'available' ? 'bg-[#d4af37]/10 border-[#d4af37]' :
              r.status === 'taken' ? 'bg-white/2 border-white/5 opacity-50' :
              'bg-white/5 border-white/10'
            }`}>
              {r.status === 'available' && (
                <button 
                  onClick={() => handleSaveDomain(r.name)}
                  disabled={saving[r.name] || saved[r.name]}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-slate-400 hover:text-[#d4af37] hover:bg-black transition-all opacity-0 group-hover:opacity-100 disabled:opacity-100"
                  title="Save to Profile"
                >
                  {saved[r.name] ? <Check className="w-4 h-4 text-green-500" /> : <BookmarkPlus className="w-4 h-4" />}
                </button>
              )}
              <div className={`text-lg font-bold mb-2 ${r.status === 'available' ? 'text-[#d4af37]' : 'text-white'}`}>
                {r.name}
              </div>
              <div className={`text-[10px] font-black uppercase tracking-widest ${
                r.status === 'available' ? 'text-green-500' : 
                r.status === 'taken' ? 'text-red-500' : 'text-yellow-500 animate-pulse'
              }`}>
                {r.status === 'checking' ? 'Checking...' : r.status}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
