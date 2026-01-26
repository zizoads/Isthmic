
import React, { useState } from 'react';
import { Domain, OutreachMessage } from '../types';
import { generateSmartOutreachAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

const MessagingDashboard: React.FC<Props> = ({ domains, setDomains }) => {
  const [messages, setMessages] = useState<OutreachMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<'Formal' | 'Creative' | 'Direct'>('Formal');

  const startCampaign = async (domain: Domain) => {
    setIsGenerating(domain.id);
    const lead = domain.linkedinLeads?.[0] || { name: 'Business Owner', role: 'Decision Maker' };
    
    const content = await generateSmartOutreachAI(
      domain.name, 
      lead, 
      domain.sector || 'Business', 
      selectedTone
    );
    
    const newMessage: OutreachMessage = {
      id: Math.random().toString(),
      domainId: domain.id,
      recipient: lead.name,
      recipientRole: lead.role,
      tone: selectedTone,
      status: 'draft',
      content: content || 'Are you interested in acquiring this asset?'
    };
    
    setMessages([newMessage, ...messages]);
    setIsGenerating(null);
  };

  const handleSend = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'sent', sentDate: new Date().toLocaleDateString() } : m));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Inventory & Config */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="font-black text-slate-800 uppercase tracking-tighter text-sm mb-6 flex items-center gap-2">
              <i className="fas fa-sliders-h text-indigo-500"></i> Smart Engine Config
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Generation Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Formal', 'Creative', 'Direct'] as const).map(tone => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`py-2 rounded-xl text-[10px] font-black border transition-all ${
                        selectedTone === tone 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                          : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <div className="text-[10px] font-black text-indigo-600 uppercase mb-1 italic">Agent Wisdom</div>
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  "{selectedTone} outreach has a {(selectedTone === 'Direct' ? 74 : selectedTone === 'Formal' ? 52 : 61)}% success rate in the {domains[0]?.sector || 'current'} sector."
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-slate-50/50">
              <h3 className="font-black text-slate-800 uppercase tracking-tighter text-sm">Ready Assets</h3>
            </div>
            <div className="divide-y max-h-[400px] overflow-y-auto">
              {domains.filter(d => d.status === 'purchased').map(domain => (
                <div key={domain.id} className="p-4 hover:bg-slate-50 transition-all flex items-center justify-between group">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm truncate">{domain.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-4 h-4 rounded bg-indigo-50 flex items-center justify-center text-[8px] text-indigo-600">
                        <i className="fas fa-user"></i>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate">{domain.linkedinLeads?.[0]?.name || 'Owner'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => startCampaign(domain)}
                    disabled={isGenerating === domain.id}
                    className="ml-4 w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
                  >
                    {isGenerating === domain.id ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
                  </button>
                </div>
              ))}
              {domains.filter(d => d.status === 'purchased').length === 0 && (
                <div className="p-8 text-center text-slate-400 italic text-sm">Buy domains to start outreach.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Message Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border shadow-sm min-h-[600px] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-800 uppercase tracking-tighter">Smart Templates</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Persona-Matched Outreach</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg">Daily Limit: 10</span>
              </div>
            </div>
            
            <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[700px]">
              {messages.map(msg => (
                <div key={msg.id} className="bg-white rounded-2xl border shadow-lg border-slate-100 overflow-hidden animate-fade-in">
                  <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black">
                        {msg.recipient.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-800">{msg.recipient}</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{msg.recipientRole}</div>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter ${
                      msg.status === 'sent' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-indigo-400 mt-1"><i className="fas fa-quote-left text-xs"></i></div>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                        {msg.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex gap-2">
                        <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-black uppercase">TONE: {msg.tone}</span>
                      </div>
                      <div className="flex gap-3">
                        {msg.status === 'draft' && (
                          <button 
                            onClick={() => handleSend(msg.id)}
                            className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
                          >
                            <i className="fas fa-paper-plane text-[10px]"></i> Send Pitch
                          </button>
                        )}
                        <button className="text-slate-400 hover:text-indigo-600 p-2"><i className="fas fa-edit"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                  <i className="fas fa-magic text-5xl mb-4 opacity-20"></i>
                  <p className="italic text-sm">Select a domain to generate a smart template.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MessagingDashboard;
