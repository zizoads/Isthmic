
import React, { useState } from 'react';
import { ServiceIntegration } from '../types';
import { translations } from '../translations';
import { useDomainContext } from '../context/DomainContext';

interface Props {
  integrations: ServiceIntegration[];
  lang: 'ar' | 'en';
}

const IntegrationCenter: React.FC<Props> = ({ integrations, lang }) => {
  const { activeProfile, connectService } = useDomainContext();
  const t = translations[lang];
  const [activeKeyInput, setActiveKeyInput] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const canModify = activeProfile?.role !== 'Analyst';

  const strategicTools = [
    { 
      id: 'google', 
      name: 'Gemini Master Key', 
      provider: 'google', 
      impact: lang === 'ar' ? 'الذكاء الأساسي والاستنتاج السيادي.' : 'Core Intelligence & Sovereign Reasoning.', 
      icon: 'fa-brain', 
      isEssential: true 
    },
    { 
      id: 'wayback', 
      name: 'Wayback Machine API', 
      provider: 'wayback', 
      impact: lang === 'ar' ? 'تحليل التاريخ السلوكي والمحتوى السابق.' : 'Analyzing historical behavior and content.', 
      icon: 'fa-clock-rotate-left' 
    },
    { 
      id: 'virustotal', 
      name: 'VirusTotal API', 
      provider: 'virustotal', 
      impact: lang === 'ar' ? 'التحقق من حالة السمعة الأمنية.' : 'Verifying security reputation status.', 
      icon: 'fa-shield-virus' 
    },
    { 
      id: 'registrar', 
      name: 'Registrar API (Namecheap/GoDaddy)', 
      provider: 'registrar_api', 
      impact: lang === 'ar' ? 'يسمح للوكيل بشراء النطاقات المتاحة فوراً.' : 'Allows the agent to purchase available domains instantly.', 
      icon: 'fa-shopping-cart' 
    },
    { 
      id: 'drop', 
      name: 'Drop Sniper (Dynadot)', 
      provider: 'drop_api', 
      impact: lang === 'ar' ? 'إرسال عروض المزايدة التلقائية.' : 'Send automated backorder bids.', 
      icon: 'fa-bolt-lightning' 
    },
    { 
      id: 'market', 
      name: 'Marketplace Sync', 
      provider: 'market_api', 
      impact: lang === 'ar' ? 'مزامنة المحفظة مع المنصات العالمية.' : 'Sync portfolio with global platforms.', 
      icon: 'fa-globe' 
    }
  ];

  const handleVerifyAndConnect = async (provider: string) => {
    if (!inputValue) return;
    await connectService(provider, inputValue);
    setActiveKeyInput(null);
    setInputValue('');
  };

  return (
    <div className="space-y-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-[#111113] border border-white/5 p-10 lg:p-14 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <h3 className="text-3xl lg:text-5xl prestige-heading italic mb-6 text-white">
            {lang === 'ar' ? 'بوابات التنفيذ السيادية' : 'Sovereign Execution Gateways'}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium italic border-r-2 border-[#c5a059] pr-8">
            {lang === 'ar' 
              ? 'اربط مفاتيح الـ API لتحويل المنصة من محلل إلى منفذ صفقات. قمنا بتوحيد تجربة الربط لجميع الأدوات لضمان الخصوصية والتحكم الكامل.'
              : 'Connect API keys to transform the platform from an analyzer to a deal executor. Unified linking experience for all tools ensuring full sovereignty.'}
          </p>
        </div>
        <div className="absolute right-[-40px] top-[-40px] text-white/5 text-[300px] opacity-10">
           <i className="fas fa-plug"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {strategicTools.map((tool) => {
          const integration = integrations.find(i => i.provider === tool.provider);
          const isConnected = integration?.status === 'connected';
          
          return (
            <div key={tool.id} className={`square-card p-10 flex flex-col justify-between h-[450px] group transition-all duration-500 border border-white/5 shadow-2xl relative ${
              isConnected ? 'border-[#c5a059]/30 bg-[#c5a059]/5' : 'hover:border-white/20'
            }`}>
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-2xl shadow-2xl transition-all group-hover:scale-110 ${
                    isConnected ? 'bg-[#c5a059] text-black' : 'bg-white/5 text-slate-500'
                  }`}>
                    <i className={`fas ${tool.icon}`}></i>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    isConnected ? 'bg-[#c5a059] text-black shadow-lg shadow-[#c5a059]/20' : 'bg-white/5 text-slate-600'
                  }`}>
                    {isConnected ? (lang === 'ar' ? 'متصل بنجاح' : 'ESTABLISHED') : (lang === 'ar' ? 'بانتظار الإشارة' : 'DISCONNECTED')}
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
                    <div className="relative">
                      <input 
                        type="password" 
                        autoFocus
                        placeholder={lang === 'ar' ? 'أدخل مفتاح الـ API هنا...' : 'Insert Secret API Key...'}
                        className="w-full bg-[#0a0a0c] border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono outline-none focus:border-[#c5a059] text-white shadow-inner"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerifyAndConnect(tool.provider)}
                      />
                      <i className="fas fa-key absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 text-xs"></i>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => handleVerifyAndConnect(tool.provider)}
                        className="flex-1 bg-[#c5a059] text-black py-4 rounded-2xl text-[10px] font-black uppercase hover:bg-white transition-all shadow-xl"
                       >
                         {lang === 'ar' ? 'تفعيل الاتصال' : 'Verify & Lock'}
                       </button>
                       <button onClick={() => { setActiveKeyInput(null); setInputValue(''); }} className="px-6 py-4 bg-white/5 text-slate-500 rounded-2xl text-[10px] font-black uppercase hover:text-white transition-all">
                         <i className="fas fa-times"></i>
                       </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    disabled={!canModify}
                    onClick={() => setActiveKeyInput(tool.id)}
                    className={`w-full py-5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all group-hover:scale-[1.02] active:scale-95 ${
                      !canModify ? 'opacity-20 cursor-not-allowed grayscale' :
                      isConnected ? 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10' : 'bg-white text-black hover:bg-[#c5a059] hover:text-white shadow-2xl'
                    }`}
                  >
                    {!canModify ? (lang === 'ar' ? 'محرّم للمحللين' : 'RESTRICTED') : 
                     isConnected ? (lang === 'ar' ? 'تحديث المفتاح' : 'Rotate Secret') : (lang === 'ar' ? 'إضافة مفتاح الربط' : 'Add Connection Key')}
                  </button>
                )}
              </div>
              
              {isConnected && !activeKeyInput && (
                <div className="absolute bottom-4 right-10 text-[8px] font-mono text-green-500/40 uppercase tracking-tighter">
                   Encrypted_Anchor_ID: {integration?.id?.slice(0, 8)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntegrationCenter;
