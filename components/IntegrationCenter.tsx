
import React, { useState } from 'react';
import { ServiceIntegration } from '../types';

interface Props {
  integrations: ServiceIntegration[];
  onConnect: (id: string, key: string) => void;
  lang: 'ar' | 'en';
}

const IntegrationCenter: React.FC<Props> = ({ integrations, onConnect, lang }) => {
  const [activeKeyInput, setActiveKeyInput] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const strategicTools = [
    { id: 'gm-1', name: 'Gemini Master Key', provider: 'google', impact: 'Core Intelligence & Reasoning (Bring your own key).', icon: 'fa-brain', isEssential: true },
    { id: 'hi-1', name: 'Hunter.io / Free Alt', provider: 'hunter', impact: 'Email extraction. Can use free credits or manual mode.', icon: 'fa-envelope-open-text' },
    { id: 'mz-1', name: 'Moz / SEO Open', provider: 'moz', impact: 'Domain authority metrics. Supports community APIs.', icon: 'fa-chart-line' },
    { id: 'tr-1', name: 'Trademark Search', provider: 'wipo', impact: 'Legal safety. Default: Open database access.', icon: 'fa-gavel' },
    { id: 'ox-1', name: 'Custom LLM Gateway', provider: 'openai', impact: 'Optional: Connect OpenAI or local LLMs for reasoning.', icon: 'fa-robot' }
  ];

  return (
    <div className="space-y-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-[#111113] border border-white/5 p-10 lg:p-14 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <h3 className="text-3xl lg:text-5xl prestige-heading italic mb-6">
            {lang === 'ar' ? 'بوابات القوة السيادية' : 'Sovereign Power Gateways'}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium italic border-r-2 border-[#c5a059] pr-8">
            {lang === 'ar' 
              ? 'المرونة هي جوهر الاستراتيجية. يمكنك استخدام مفاتيحك الخاصة، أو الاعتماد على الأدوات المجانية المدمجة. المنصة تتكيف مع الموارد المتاحة لديك.'
              : 'Flexibility is the heart of strategy. Connect your private keys or rely on integrated community tools. The platform adapts to your available resources.'}
          </p>
        </div>
        <div className="absolute right-[-40px] top-[-40px] text-white/5 text-[300px] opacity-10">
           <i className="fas fa-network-wired"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {strategicTools.map((tool) => {
          const isConnected = integrations.find(i => i.provider === tool.provider)?.status === 'connected';
          return (
            <div key={tool.id} className="square-card p-10 flex flex-col justify-between h-[420px] group hover:border-[#c5a059]/30 transition-all duration-500">
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className={`icon-box rounded-[24px] text-2xl shadow-2xl transition-all group-hover:scale-110 ${
                    isConnected ? 'bg-[#c5a059] text-black' : 'bg-white/5 text-slate-500'
                  }`}>
                    <i className={`fas ${tool.icon}`}></i>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    isConnected ? 'bg-[#c5a059]/10 text-[#c5a059]' : 'bg-white/5 text-slate-600'
                  }`}>
                    {isConnected ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'جاهز للربط' : 'Ready')}
                  </div>
                </div>
                <h4 className="text-xl font-black text-white mb-3 prestige-heading italic">{tool.name}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase tracking-tight opacity-70">
                  {tool.impact}
                </p>
              </div>

              <div className="mt-8">
                {activeKeyInput === tool.id ? (
                  <div className="space-y-4 animate-precision">
                    <input 
                      type="password" 
                      placeholder={lang === 'ar' ? 'أدخل المفتاح هنا...' : 'Insert Key here...'}
                      className="w-full bg-[#0a0a0c] border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono outline-none focus:ring-1 focus:ring-[#c5a059]/50 text-white"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <div className="flex gap-2">
                       <button 
                        onClick={() => { onConnect(tool.id, inputValue); setActiveKeyInput(null); setInputValue(''); }}
                        className="flex-1 bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase hover:bg-[#c5a059] hover:text-white transition-all"
                       >
                         {lang === 'ar' ? 'تفعيل' : 'Activate'}
                       </button>
                       <button onClick={() => { setActiveKeyInput(null); setInputValue(''); }} className="px-6 py-4 bg-white/5 text-slate-500 rounded-2xl text-[10px] font-black uppercase hover:text-white transition-all">
                         <i className="fas fa-times"></i>
                       </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      if (tool.provider === 'google') {
                        (window as any).aistudio.openSelectKey();
                      } else {
                        setActiveKeyInput(tool.id);
                      }
                    }}
                    className={`w-full py-5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all ${
                      isConnected ? 'bg-white/5 text-slate-400' : 'bg-white text-black hover:bg-[#c5a059] hover:text-white shadow-xl'
                    }`}
                  >
                    {isConnected ? (lang === 'ar' ? 'تحديث الإعدادات' : 'Update Settings') : (lang === 'ar' ? 'ربط الخدمة' : 'Connect Service')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntegrationCenter;
