import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ApiKeys, ToolDefinition, ToolType } from '../../types';
import { Plus, Trash2, Zap } from 'lucide-react';

const RECOMMENDED_TOOLS: { name: string; type: ToolType }[] = [
  { name: 'Estibot', type: 'ANALYTICS' },
  { name: 'Semrush', type: 'ANALYTICS' },
  { name: 'Ahrefs', type: 'ANALYTICS' },
  { name: 'USPTO', type: 'OTHER' },
  { name: 'Hunter.io', type: 'OTHER' },
];

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setApiKeys(docSnap.data().apiKeys || {});
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
      await updateDoc(doc(db, 'users', user.uid), { apiKeys });
      setStatus({ type: 'success', msg: 'API Keys updated successfully.' });
    } catch (e: any) {
      setStatus({ type: 'error', msg: e.message });
    } finally {
      setIsLoading(false);
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
    <div className="bg-[#08080a] border border-white/5 p-10 rounded-[40px] shadow-2xl space-y-8">
      <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Sovereign Profile</h2>
      
      {status && (
        <div className={`p-6 rounded-3xl text-[11px] font-black uppercase tracking-widest text-center border ${
          status.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {status.msg}
        </div>
      )}

      {/* ... (Existing static inputs) ... */}
      
      <div className="pt-8 border-t border-white/5 space-y-4">
        <div className="flex justify-between items-center">
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
          <div key={tool.id} className="flex gap-2 items-center bg-white/5 p-3 rounded-2xl border border-white/5">
            <input type="text" value={tool.name} onChange={e => updateCustomTool(index, 'name', e.target.value)} className="flex-1 bg-transparent text-white text-xs outline-none" placeholder="Tool Name" />
            <input type="password" value={tool.apiKey} onChange={e => updateCustomTool(index, 'apiKey', e.target.value)} className="flex-1 bg-transparent text-white text-xs outline-none" placeholder="API Key" />
            <div className={`w-2 h-2 rounded-full ${tool.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <button onClick={() => removeCustomTool(index)} className="text-red-500 hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={handleSave} 
        disabled={isLoading}
        className="w-full bg-[#d4af37] text-black hover:bg-[#c5a059] font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl"
      >
        {isLoading ? 'SAVING...' : 'SAVE CONFIGURATION'}
      </button>
    </div>
  );
};
