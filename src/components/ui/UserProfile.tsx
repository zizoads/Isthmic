import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ApiKeys, ToolDefinition, ToolType, SavedDomain } from '../../types';
import { Plus, Trash2, Zap, Bookmark } from 'lucide-react';

const RECOMMENDED_TOOLS: { name: string; type: ToolType }[] = [
  { name: 'Estibot', type: 'ANALYTICS' },
  { name: 'Semrush', type: 'ANALYTICS' },
  { name: 'Ahrefs', type: 'ANALYTICS' },
  { name: 'USPTO', type: 'OTHER' },
  { name: 'Hunter.io', type: 'OTHER' },
];

export const UserProfile: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [savedDomains, setSavedDomains] = useState<SavedDomain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setApiKeys(data.apiKeys || {});
            setSavedDomains(data.savedDomains || []);
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    setStatus(null);
    try {
      await updateDoc(doc(db, 'users', user.id), { apiKeys, savedDomains });
      await refreshProfile();
      setStatus({ type: 'success', msg: 'Profile updated successfully.' });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  const removeSavedDomain = async (name: string) => {
    if (!user) return;
    const newSavedDomains = savedDomains.filter(d => d.name !== name);
    setSavedDomains(newSavedDomains);
    try {
      await updateDoc(doc(db, 'users', user.id), { savedDomains: newSavedDomains });
    } catch (e) {
      console.error("Failed to remove saved domain", e);
    }
  };

  const addCustomTool = (template?: { name: string; type: ToolType }) => {
    const newTool: ToolDefinition = {
      id: Math.random().toString(36).substr(2, 9),
      name: template?.name || '',
      type: template?.type || 'OTHER',
      apiKey: '',
      status: 'verifying'
    };
    setApiKeys({
      ...apiKeys,
      customTools: [...(apiKeys.customTools || []), newTool]
    });
  };

  const updateCustomTool = (index: number, field: keyof ToolDefinition, value: string) => {
    const tools = [...(apiKeys.customTools || [])];
    (tools[index] as any)[field] = value;
    setApiKeys({ ...apiKeys, customTools: tools });
  };

  const removeCustomTool = (index: number) => {
    const tools = apiKeys.customTools?.filter((_, i) => i !== index);
    setApiKeys({ ...apiKeys, customTools: tools });
  };

  return (
    <div className="bg-[#08080a] border border-white/5 p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-2xl space-y-6 md:space-y-8">
      <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Sovereign Profile</h2>
      
      {status && (
        <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl text-[9px] md:text-[11px] font-black uppercase tracking-widest text-center border ${
          status.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {status.msg}
        </div>
      )}

      <div className="space-y-4">
        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Gemini API Key (BYOK)</label>
        <p className="text-[10px] md:text-xs text-slate-400 mb-2">Enter your personal Gemini API key to power the AI features. This key is stored securely in your profile.</p>
        <input 
          type="password" 
          value={apiKeys.gemini || ''} 
          onChange={e => setApiKeys({ ...apiKeys, gemini: e.target.value })} 
          className="w-full bg-[#111113] border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white placeholder-slate-500 focus:border-[#d4af37]/50 outline-none transition-all text-xs md:text-sm" 
          placeholder="AIzaSy..." 
        />
      </div>
      
      <div className="pt-6 md:pt-8 border-t border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Custom Tools</label>
          <div className="flex gap-2">
            <button onClick={() => addCustomTool()} className="text-[#d4af37] hover:text-white transition-colors flex items-center gap-2 text-[9px] font-black uppercase">
              <Plus className="w-4 h-4" /> Add Custom
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {RECOMMENDED_TOOLS.map(tool => (
            <button key={tool.name} onClick={() => addCustomTool(tool)} className="bg-white/5 hover:bg-[#d4af37]/20 border border-white/10 rounded-xl px-3 py-2 text-[9px] font-bold text-white transition-all flex items-center gap-2">
              <Zap className="w-3 h-3 text-[#d4af37]" /> {tool.name}
            </button>
          ))}
        </div>

        {apiKeys.customTools?.map((tool, index) => (
          <div key={tool.id} className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-start sm:items-center bg-white/5 p-4 sm:p-3 rounded-2xl border border-white/5">
            <input type="text" value={tool.name} onChange={e => updateCustomTool(index, 'name', e.target.value)} className="w-full sm:flex-1 bg-transparent text-white text-xs outline-none border-b sm:border-none border-white/10 pb-2 sm:pb-0" placeholder="Tool Name" />
            <div className="flex items-center gap-2 w-full sm:flex-1">
              <input type="password" value={tool.apiKey} onChange={e => updateCustomTool(index, 'apiKey', e.target.value)} className="flex-1 bg-transparent text-white text-xs outline-none" placeholder="API Key" />
              <div className={`w-2 h-2 rounded-full shrink-0 ${tool.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <button onClick={() => removeCustomTool(index)} className="text-red-500 hover:text-red-400 transition-colors shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 md:pt-8 border-t border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block flex items-center gap-2">
            <Bookmark className="w-3 h-3" /> Saved Domains
          </label>
        </div>
        
        {savedDomains.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-4 border border-white/5 rounded-2xl bg-white/2">
            No domains saved yet. Use Concept Lab to find and save domains.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedDomains.map((domain) => (
              <div key={domain.name} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <div>
                  <div className="font-bold text-[#d4af37] text-sm">{domain.name}.com</div>
                  <div className="text-[10px] text-slate-400 mt-1">{domain.trend} • {domain.vibe}</div>
                </div>
                <button 
                  onClick={() => removeSavedDomain(domain.name)}
                  className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        onClick={handleSave} 
        disabled={isLoading}
        className="w-full bg-[#d4af37] text-black hover:bg-[#c5a059] font-black py-4 md:py-5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl"
      >
        {isLoading ? 'SAVING...' : 'SAVE CONFIGURATION'}
      </button>
    </div>
  );
};
