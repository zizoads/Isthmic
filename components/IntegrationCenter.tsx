
import React, { useState } from 'react';
import { ServiceIntegration } from '../types';

interface Props {
  integrations: ServiceIntegration[];
  onConnect: (id: string, key: string) => void;
  // Fix: Added lang property to Props
  lang: 'ar' | 'en';
}

const IntegrationCenter: React.FC<Props> = ({ integrations, onConnect, lang }) => {
  const [activeKeyInput, setActiveKeyInput] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const strategicTools = [
    { id: 'nb-1', name: 'NameBio Premium', provider: 'namebio', impact: 'Historical sales data grounding.', icon: 'fa-history' },
    { id: 'hi-1', name: 'Hunter Intelligence', provider: 'hunter', impact: 'Direct corporate email extraction.', icon: 'fa-envelope-open-text' },
    { id: 'mz-1', name: 'Moz SEO Pro', provider: 'moz', impact: 'Authority metrics and SEO health.', icon: 'fa-chart-line' },
    { id: 'tr-1', name: 'Trademark Watch', provider: 'wipo', impact: 'Intellectual property safety.', icon: 'fa-gavel' },
    { id: 'es-1', name: 'Escrow Secure', provider: 'escrow', impact: 'Financial transaction settlement.', icon: 'fa-shield-halved' }
  ];

  return (
    <div className="space-y-6 lg:space-y-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-indigo-600 dark:bg-indigo-600 p-8 lg:p-12 rounded-[32px] lg:rounded-[40px] text-white shadow-2xl relative overflow-hidden border border-white/10">
        <div className="relative z-10 max-w-3xl">
          <h3 className="text-2xl lg:text-4xl font-black tracking-tighter uppercase mb-4 lg:mb-6 leading-tight">
            {lang === 'ar' ? 'الأدوات الاستراتيجية' : 'Strategic Tools'}
          </h3>
          <p className="text-indigo-100 text-xs lg:text-sm leading-relaxed font-medium">
            {lang === 'ar' 
              ? 'قم بتوصيل حساباتك المهنية لتفعيل وضع "القناص" الكامل. في حال غياب المفتاح، سيقوم الذكاء الاصطناعي بمحاكاة البيانات عبر الاستنباط المتقدم.'
              : 'Connect your professional accounts to enable full "Sniper" mode. In the absence of a key, AI will simulate data via advanced inference.'}
          </p>
        </div>
        <i className="fas fa-plug absolute left-[-40px] top-[-40px] text-white/10 text-[200px] lg:text-[280px]"></i>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        {strategicTools.map((tool) => {
          const isConnected = integrations.find(i => i.provider === tool.provider)?.status === 'connected';
          return (
            <div key={tool.id} className="bg-white dark:bg-white/5 p-6 lg:p-10 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl dark:hover:bg-white/10 transition-all group flex flex-col justify-between h-auto sm:h-[350px] lg:h-[380px] relative overflow-hidden">
              <div>
                <div className="flex justify-between items-start mb-6 lg:mb-8">
                  <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-[20px] lg:rounded-[24px] flex items-center justify-center text-xl lg:text-2xl shadow-inner transition-all group-hover:scale-110 ${
                    isConnected ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-400'
                  }`}>
                    <i className={`fas ${tool.icon}`}></i>
                  </div>
                  <div className={`px-3 py-1 lg:px-4 lg:py-1.5 rounded-full text-[8px] lg:text-[9px] font-black uppercase tracking-widest ${
                    isConnected ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-white/10 text-slate-500'
                  }`}>
                    {isConnected ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'وضع المحاكاة' : 'Simulated')}
                  </div>
                </div>
                <h4 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mb-2 lg:mb-3">{tool.name}</h4>
                <p className="text-[10px] lg:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic border-r-2 border-indigo-500 pr-4">
                  "{tool.impact}"
                </p>
              </div>

              <div className="mt-6 lg:pt-6">
                {activeKeyInput === tool.id ? (
                  <div className="space-y-3 animate-slide-up">
                    <input 
                      type="password" 
                      placeholder={lang === 'ar' ? 'لصق الـ API هنا...' : 'Paste API here...'}
                      className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500/20 text-right"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <div className="flex gap-2">
                       <button 
                        onClick={() => { onConnect(tool.id, inputValue); setActiveKeyInput(null); setInputValue(''); }}
                        className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
                       >
                         {lang === 'ar' ? 'حفظ' : 'Save'}
                       </button>
                       <button onClick={() => { setActiveKeyInput(null); setInputValue(''); }} className="px-4 py-2.5 bg-slate-100 dark:bg-white/10 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all">
                         {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                       </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setActiveKeyInput(tool.id)}
                    className={`w-full py-4 lg:py-5 rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all ${
                      isConnected ? 'bg-slate-900 dark:bg-white/10 text-white' : 'bg-white dark:bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    {isConnected ? (lang === 'ar' ? 'تحديث المفتاح' : 'Update Key') : (lang === 'ar' ? 'توصيل الآن' : 'Connect Now')}
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
