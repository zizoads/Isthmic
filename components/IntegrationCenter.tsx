
import React, { useState } from 'react';
import { ServiceIntegration } from '../types';
import { translations } from '../translations';

interface Props {
  integrations: ServiceIntegration[];
  onConnect: (id: string, key: string) => void;
  lang: 'ar' | 'en';
}

const IntegrationCenter: React.FC<Props> = ({ integrations, onConnect, lang }) => {
  const t = translations[lang];
  const [activeKeyInput, setActiveKeyInput] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const strategicTools = [
    { 
      id: 'gm-1', 
      name: 'Gemini Master Key', 
      provider: 'google', 
      impact: lang === 'ar' ? 'الذكاء الأساسي والاستنتاج.' : 'Core Intelligence & Reasoning.', 
      icon: 'fa-brain', 
      isEssential: true 
    },
    { 
      id: 'wb-1', 
      name: 'Wayback Machine API', 
      provider: 'wayback', 
      impact: lang === 'ar' ? 'تحليل التاريخ السلوكي والمحتوى السابق للنطاق.' : 'Analyzing historical behavior and previous content of the domain.', 
      icon: 'fa-clock-rotate-left' 
    },
    { 
      id: 'vt-1', 
      name: 'VirusTotal API', 
      provider: 'virustotal', 
      impact: lang === 'ar' ? 'التحقق من حالة القوائم السوداء والسمعة الأمنية.' : 'Verifying blacklist status and security reputation.', 
      icon: 'fa-shield-virus' 
    },
    { 
      id: 'nc-1', 
      name: 'Namecheap / GoDaddy API', 
      provider: 'registrar_api', 
      impact: lang === 'ar' ? 'يسمح للوكيل بشراء النطاقات المتاحة فوراً.' : 'Allows the agent to purchase available domains instantly.', 
      icon: 'fa-shopping-cart' 
    },
    { 
      id: 'dyn-1', 
      name: 'Dynadot / DropCatch', 
      provider: 'drop_api', 
      impact: lang === 'ar' ? 'إرسال عروض Backorder تلقائية فور سقوط النطاق.' : 'Send automated backorder bids the millisecond a domain drops.', 
      icon: 'fa-bolt-lightning' 
    },
    { 
      id: 'aft-1', 
      name: 'Afternic / Sedo Sync', 
      provider: 'market_api', 
      impact: lang === 'ar' ? 'مزامنة محفظتك مع أكبر منصات البيع العالمية بضغطة زر.' : 'Sync your portfolio with global marketplaces in one click.', 
      icon: 'fa-globe' 
    },
    { 
      id: 'gsc-1', 
      name: t.searchConsole, 
      provider: 'gsc', 
      impact: lang === 'ar' ? 'أداة حاسمة لتقييم الأصول المملوكة بناءً على الزوار.' : 'Critical tool for valuing owned assets based on traffic.', 
      icon: 'fa-chart-line'
    },
    { 
      id: 'hi-1', 
      name: 'Hunter.io / Apollo', 
      provider: 'hunter', 
      impact: lang === 'ar' ? 'استخراج بيانات صناع القرار للتواصل المباشر.' : 'Extracting decision-maker data for direct outreach.', 
      icon: 'fa-envelope-open-text' 
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-[#111113] border border-white/5 p-10 lg:p-14 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <h3 className="text-3xl lg:text-5xl prestige-heading italic mb-6">
            {lang === 'ar' ? 'بوابات التنفيذ السيادية' : 'Sovereign Execution Gateways'}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium italic border-r-2 border-[#c5a059] pr-8">
            {lang === 'ar' 
              ? 'اربط مفاتيح الـ API لتحويل المنصة من محلل إلى منفذ صفقات. هذه المفاتيح تمكن الوكلاء من الشراء، المزايدة، والمزامنة العالمية تلقائياً.'
              : 'Connect API keys to transform the platform from an analyzer to a deal executor. These keys enable agents to buy, bid, and sync globally automatically.'}
          </p>
        </div>
        <div className="absolute right-[-40px] top-[-40px] text-white/5 text-[300px] opacity-10">
           <i className="fas fa-microchip"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {strategicTools.map((tool) => {
          const isConnected = integrations.find(i => i.provider === tool.provider)?.status === 'connected';
          return (
            <div key={tool.id} className="square-card p-10 flex flex-col justify-between h-[420px] group transition-all duration-500 border border-white/5 hover:border-[#c5a059]/30 shadow-2xl">
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
                    {isConnected ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'بانتظار الربط' : 'Awaiting')}
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
                      placeholder={lang === 'ar' ? 'أدخل مفتاح الـ API هنا...' : 'Insert API Key here...'}
                      className="w-full bg-[#0a0a0c] border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono outline-none focus:ring-1 focus:ring-[#c5a059]/50 text-white"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <div className="flex gap-2">
                       <button 
                        onClick={() => { onConnect(tool.id, inputValue); setActiveKeyInput(null); setInputValue(''); }}
                        className="flex-1 bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase hover:bg-[#c5a059] hover:text-white transition-all"
                       >
                         {lang === 'ar' ? 'تفعيل الاتصال' : 'Verify & Connect'}
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
                      isConnected ? 'bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20' : 'bg-white text-black hover:bg-[#c5a059] hover:text-white shadow-xl'
                    }`}
                  >
                    {isConnected ? (lang === 'ar' ? 'تحديث المفتاح' : 'Rotate Key') : (lang === 'ar' ? 'ربط الخدمة' : 'Secure Connection')}
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
