
import React, { useState } from 'react';
import { NexusOpportunity, Domain } from '../types';
import { nexusPrimeIntelligenceAI } from '../services/geminiService';
import { translations } from '../translations';

interface Props {
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical', payload?: any) => void;
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

const NexusPrimeDashboard: React.FC<Props> = ({ addLog, setDomains }) => {
  const t = translations.en;
  const [isThinking, setIsThinking] = useState(false);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<NexusOpportunity[]>([]);
  const [activeMode, setActiveMode] = useState<'Arbitrage' | 'Temporal' | 'Forensic' | 'DNA_Audit'>('Temporal');

  const handleActivateNexus = async () => {
    setIsThinking(true);
    addLog('Nexus Prime', `Launching ${activeMode}...`, 'info');
    try {
      const result: any = await nexusPrimeIntelligenceAI(activeMode, "Global Sweep");
      if (result) {
        setVerdict(result.analysisVerdict);
        setOpportunities(result.opportunities.map((o: any) => ({ ...o, id: globalThis.crypto.randomUUID() })));
        addLog('Nexus Prime', 'Strategy synthesis complete.', 'success');
      }
    } catch {
      addLog('Nexus Prime', 'Engine Error', 'warning');
    } finally {
      setIsThinking(false);
    }
  };

  const NIL_UUID = '00000000-0000-0000-0000-000000000000';

  return (
    <div className="space-y-12 animate-fade-in">
      <div className={`relative bg-[#0b0b14] p-16 rounded-[48px] border border-white/5 overflow-hidden ${isThinking ? 'scanning-effect' : ''}`}>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1">
            <h2 className="text-4xl font-black uppercase text-white mb-6">NEXUS PRIME <span className="text-indigo-500 font-light">CORE</span></h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {['Temporal', 'DNA_Audit', 'Arbitrage', 'Forensic'].map(mode => (
                <button key={mode} onClick={() => setActiveMode(mode as any)} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase border ${activeMode === mode ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500'}`}>
                  {mode.replace('_', ' ')}
                </button>
              ))}
            </div>
            <button onClick={handleActivateNexus} disabled={isThinking} className="bg-white text-black px-12 py-5 rounded-2xl font-black text-xs uppercase hover:bg-indigo-600 hover:text-white transition-all">
              {isThinking ? 'Thinking...' : t.startInference}
            </button>
          </div>
        </div>
      </div>

      {verdict && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {opportunities.map((opp) => (
            <div key={opp.id} className="p-8 bg-[#0b0b14] rounded-[40px] border border-white/5 flex flex-col hover:border-indigo-500 transition-all">
              <span className="bg-indigo-600/20 text-indigo-400 px-4 py-1.5 rounded-xl text-[9px] font-black w-fit mb-6">{opp.type}</span>
              <h4 className="font-black text-xl text-white mb-4">{opp.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-10 italic flex-1">"{opp.description}"</p>
              <button onClick={() => setDomains(p => [...p, { id: globalThis.crypto.randomUUID(), workspaceId: NIL_UUID, name: opp.title, price: 500, status: 'available', contentStatus: 'none' } as Domain])} className="w-full py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white">
                {t.inject}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NexusPrimeDashboard;
