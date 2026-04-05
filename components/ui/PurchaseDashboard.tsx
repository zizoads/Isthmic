
import React, { useState } from 'react';
import { Domain } from '../../types';
import { registrarInquiryAI } from '../../services/geminiService';
import { useDomainContext } from '../../context/DomainContext';
import { translations } from '../../translations';

interface Props {
  domains: Domain[];
}

const PurchaseDashboard: React.FC<Props> = ({ domains }) => {
  const { addLog, updateDomain } = useDomainContext();
  const t = translations.en;
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerify = async (domain: Domain) => {
    setVerifyingId(domain.id);
    const result: any = await registrarInquiryAI(domain.name);
    if (result.available) {
       await updateDomain({ ...domain, price: parseFloat(result.price.toString()) });
    }
    setVerifyingId(null);
  };

  const handleExternalRedirect = (domainName: string) => {
    addLog('Redirector', `Redirecting to Namecheap for ${domainName}...`, 'info');
    const url = `https://www.namecheap.com/domains/registration-results/?domain=${encodeURIComponent(domainName)}`;
    window.open(url, '_blank');
  };

  const markAsPurchased = async (id: string) => {
    const domain = domains.find(d => d.id === id);
    if (domain) {
      await updateDomain({ ...domain, status: 'purchased' });
    }
  };

  const highProbability = domains.filter(d => (d.probability || 0) > 0.6 && d.status === 'available');

  return (
    <div className="space-y-10 animate-fade-in" dir="ltr">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">EXECUTION SUITE</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
             External redirection mode active. You will be redirected to the registrar.
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
              <button 
                onClick={() => handleExternalRedirect(domain.name)}
                className="w-full bg-indigo-600 text-white py-5 rounded-[22px] font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-3"
              >
                <i className="fas fa-external-link-alt"></i> {t.checkoutExternal}
              </button>
              
              <button 
                onClick={() => markAsPurchased(domain.id)}
                className="w-full py-3.5 rounded-[22px] text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                Mark as Secured in Portfolio
              </button>
            </div>
            
            <i className="fas fa-external-link-square-alt absolute right-[-20px] bottom-[-20px] text-white/2 text-[120px] pointer-events-none group-hover:scale-110 transition-transform"></i>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseDashboard;
