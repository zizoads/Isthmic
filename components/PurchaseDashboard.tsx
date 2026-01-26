
import React, { useState } from 'react';
import { Domain } from '../types';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

const PurchaseDashboard: React.FC<Props> = ({ domains, setDomains }) => {
  const [activeFolder, setActiveFolder] = useState<'All' | 'Quick Flip' | 'Long Term' | 'Premium'>('All');

  const handlePurchase = (id: string) => {
    setDomains(prev => prev.map(d => d.id === id ? { ...d, status: 'purchased', folder: 'Quick Flip' } : d));
  };

  const handleMoveFolder = (id: string, folder: Domain['folder']) => {
    setDomains(prev => prev.map(d => d.id === id ? { ...d, folder } : d));
  };

  const highProbability = domains.filter(d => (d.probability || 0) > 0.6 && d.status === 'available');
  const inventory = domains.filter(d => d.status === 'purchased' && (activeFolder === 'All' || d.folder === activeFolder));

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Market Execution</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">High-Confidence Acquisitions</p>
        </div>
        <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            Auto-Buy: Supervised
          </div>
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-indigo-100">
            Available: $12,450.00
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {highProbability.map(domain => (
          <div key={domain.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-6 hover:shadow-xl hover:border-indigo-200 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-black text-xl text-slate-900 tracking-tight">{domain.name}</h4>
                <div className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em] mt-1">{domain.sector}</div>
              </div>
              <div className="text-indigo-600 font-black text-2xl tracking-tighter">${domain.price}</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                <span>Confidence Index</span>
                <span className="text-slate-900">{(domain.probability! * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full" 
                  style={{ width: `${domain.probability! * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Potential</div>
                  <div className="text-xs font-black text-slate-800">${domain.estimatedProfit?.toFixed(0)}</div>
               </div>
               <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-[8px] font-black text-slate-400 uppercase mb-1">SEO Health</div>
                  <div className="text-xs font-black text-green-600">Excellent</div>
               </div>
            </div>

            <button 
              onClick={() => handlePurchase(domain.id)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 group-hover:scale-[1.02]"
            >
              Acquire Asset
            </button>
            
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <i className="fas fa-crown text-amber-400 text-xs"></i>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Management Section */}
      <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden mt-10">
        <div className="px-10 py-8 border-b bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg">Active Portfolio</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Asset Management & Categorization</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-inner">
            {(['All', 'Quick Flip', 'Long Term', 'Premium'] as const).map(f => (
              <button 
                key={f}
                onClick={() => setActiveFolder(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeFolder === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b">
                <th className="px-10 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Asset Name</th>
                <th className="px-10 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Acquisition</th>
                <th className="px-10 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Portfolio Category</th>
                <th className="px-10 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest">Current Status</th>
                <th className="px-10 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {inventory.map(domain => (
                <tr key={domain.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-10 py-6">
                    <div className="font-black text-slate-900">{domain.name}</div>
                    <div className="text-[10px] text-indigo-500 font-bold uppercase mt-0.5">{domain.sector}</div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="text-sm font-black text-slate-800">${domain.price}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Spot Price</div>
                  </td>
                  <td className="px-10 py-6">
                    <select 
                      value={domain.folder || 'Quick Flip'}
                      onChange={(e) => handleMoveFolder(domain.id, e.target.value as any)}
                      className="bg-transparent border-none text-[10px] font-black text-slate-600 uppercase focus:ring-0 cursor-pointer hover:text-indigo-600"
                    >
                      <option>Quick Flip</option>
                      <option>Long Term</option>
                      <option>Premium</option>
                    </select>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full uppercase border border-amber-100">
                      Idle / No Campaign
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg opacity-0 group-hover:opacity-100">
                       <i className="fas fa-bullhorn text-[10px]"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {inventory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-slate-300 italic font-medium">
                    No assets found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDashboard;
