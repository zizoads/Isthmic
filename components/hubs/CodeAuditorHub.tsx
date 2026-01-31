import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useDomainContext } from '../../context/DomainContext';

const CodeAuditorHub: React.FC = () => {
  const { addLog } = useDomainContext();
  const [code, setCode] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const runAudit = async () => {
    if (!code) return;
    setIsAuditing(true);
    addLog('Auditor', 'Initiating Sovereign Audit Protocol...', 'info');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Audit this code for FAANG quality, security, and performance: \n\n ${code}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              findings: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    message: { type: Type.STRING },
                    severity: { type: Type.STRING }
                  }
                } 
              },
              refactorSuggestion: { type: Type.STRING }
            }
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      setReport(result);
      addLog('Auditor', `Audit Complete. Integrity Score: ${result.score}%`, 'success');
    } catch (e) {
      addLog('Auditor', 'Audit Interrupted: Engine failure.', 'critical');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-10 animate-precision">
      <header className="flex justify-between items-end border-b border-white/10 pb-8">
        <div className="space-y-2">
           <h2 className="text-4xl prestige-heading text-white italic">Sovereign Auditor</h2>
           <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Neural Quality Control Gate</p>
        </div>
        <button 
          onClick={runAudit}
          disabled={isAuditing || !code}
          className="prestige-btn prestige-btn-gold !py-4 !px-10"
        >
          {isAuditing ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-shield-check"></i>}
          <span className="ml-2">Execute Forensic Audit</span>
        </button>
      </header>

      <div className="grid grid-cols-12 gap-8 h-[600px]">
        <div className="col-span-7 flex flex-col bg-black/40 border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-4 bg-white/5 border-b border-white/5 text-[9px] font-black uppercase text-slate-500">Source_Input_Terminal</div>
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-transparent border-none p-8 font-mono text-sm text-blue-100/80 outline-none resize-none custom-scrollbar"
            placeholder="// Paste AI-generated code here for forensic validation..."
          />
        </div>

        <div className="col-span-5 space-y-6 overflow-y-auto no-scrollbar">
          {!report ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10 border-2 border-dashed border-white/10 rounded-3xl">
               <i className="fas fa-microchip text-6xl mb-4"></i>
               <p className="text-[10px] uppercase font-black">Awaiting_Analysis</p>
            </div>
          ) : (
            <div className="space-y-6 animate-slide-up">
              <div className="p-8 bg-blue-500/10 border border-blue-500/20 rounded-3xl text-center">
                <div className="text-[10px] font-black text-blue-400 uppercase mb-2">Integrity Score</div>
                <div className="text-6xl font-black text-white italic">{report.score}%</div>
              </div>
              
              <div className="space-y-4">
                {report.findings.map((f: any, i: number) => (
                  <div key={i} className="p-5 bg-white/2 border border-white/5 rounded-2xl flex gap-4 items-start">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${f.severity === 'critical' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-amber-500'}`}></div>
                    <div className="flex-1">
                       <div className="text-[9px] font-black uppercase text-slate-500">{f.type}</div>
                       <div className="text-xs text-white/80 mt-1 italic leading-relaxed">"{f.message}"</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeAuditorHub;
