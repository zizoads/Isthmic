
import React, { useState } from 'react';
import { Domain } from '../types';
import { registrarInquiryAI } from '../services/geminiService';
import { useDomainContext } from '../context/DomainContext';
import { translations } from '../translations';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  // Added lang to Props to fix context missing property
  lang: 'ar' | 'en';
}

const PurchaseDashboard: React.FC<Props> = ({ domains, setDomains, lang }) => {
  // Removed lang from context destructuring as it's not present in DomainContextType
  const { integrations, addLog } = useDomainContext();
  const t = translations[lang || 'ar'];
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const isRegistrarConnected = integrations.some(i => i.provider === 'registrar_api' && i.status === 'connected');

  const handleVerify = async (domain: Domain) => {
    setVerifyingId(domain.id);
    const result: any = await registrarInquiryAI(domain.name);
    if (result.available) {
       setDomains(prev => prev.map(d => d.id === domain.id ? { ...d, price: parseFloat(result.price.toString()) } : d));
    }
    setVerifyingId(null);
  };

  const handleDirectPurchase = async (domain: Domain) => {
    setPurchasingId(domain.id);
    // Simulated API call to Namecheap/GoDaddy
    await new Promise(r => setTimeout(r, 2500));
    setDomains(prev => prev.map(d => d.id === domain.id ? { ...d, status: 'purchased' } : d));
    addLog('Executor', `Direct API Purchase successful for ${domain.name}. Asset secured.`, 'success');
    setPurchasingId(null);
  };

  const handlePurchaseClick = (domainName: string) => {
    const url = `https://www.namecheap.com/domains/registration-results/?domain=${encodeURIComponent(domainName)}`;
    window.open(url, '_blank');
  };

  const markAsPurchased = (id: string) => {
    setDomains(prev => prev.map(d => d.id === id ? { ...d, status: 'purchased' } : d));
  };

  const highProbability = domains.filter(d => (d.probability || 0) > 0.6 && d.status === 'available');

  return (
    <div className="space-y-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{lang === 'ar' ? 'غرفة التنفيذ' : 'EXECUTION SUITE'}</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
             {isRegistrarConnected 
               ? (lang === 'ar' ? 'وضع التنفيذ المباشر (Direct API) نشط.' : 'Direct API Execution mode is active.')
               : (lang === 'ar' ? 'قم بربط API مسجل النطاقات لتفعيل الشراء بضغطة زر.' : 'Connect Registrar API to enable one-click execution.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {highProbability.map(domain => (
          <div key={domain.id} className="bg-[#0b0e14] border border-white/5 rounded-[40px] p-8 space-y-6 hover:border-indigo-500/40 transition-all group relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-start border-b border-white/5 pb-6">
               <div className="text-2xl font-black text-white italic tracking-tighter">$ {domain.price}</div>
               <div className="text-right">
                <h4 className="font-black text-xl text-white tracking-tight">{domain.name}</h4>
                <div className="text-[9px] text-indigo-400 font-black uppercase mt-1 tracking-widest">{domain.sector}</div>
              </div>
            </div>

            <button 
              onClick={() => handleVerify(domain)}
              disabled={verifyingId === domain.id}
              className="w-full bg-white/2 text-[9px] font-black uppercase tracking-widest py-3.5 rounded-2xl border border-white/5 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
            >
              {verifyingId === domain.id ? <i className="fas fa-sync fa-spin"></i> : <><i className="fas fa-search-dollar"></i> Live Price Refresh</>}
            </button>

            <div className="space-y-3">
              {isRegistrarConnected ? (
                <button 
                  onClick={() => handleDirectPurchase(domain)}
                  disabled={purchasingId === domain.id}
                  className="w-full bg-indigo-600 text-white py-5 rounded-[22px] font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-3"
                >
                  {purchasingId === domain.id ? <i className="fas fa-dna fa-spin"></i> : <><i className="fas fa-bolt"></i> {t.directPurchase}</>}
                </button>
              ) : (
                <button 
                  onClick={() => handlePurchaseClick(domain.name)}
                  className="w-full bg-white text-black py-5 rounded-[22px] font-black text-xs uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <i className="fas fa-external-link-alt"></i> External Checkout
                </button>
              )}
              
              <button 
                onClick={() => markAsPurchased(domain.id)}
                className="w-full py-3.5 rounded-[22px] text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                Mark as Secured
              </button>
            </div>
            
            <i className="fas fa-shield-halved absolute right-[-20px] bottom-[-20px] text-white/2 text-[120px] pointer-events-none group-hover:scale-110 transition-transform"></i>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseDashboard;
