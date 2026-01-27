
import React from 'react';
import { Domain } from '../types';

interface Props {
  domains: Domain[];
  lang: 'ar' | 'en';
}

const LiquidationWarRoom: React.FC<Props> = ({ domains, lang }) => {
  const activeLeads = [
    { domain: 'AI-Logic.net', prospect: 'Microsoft M&A', status: 'Opened', sentiment: 85, lastTouch: '2h ago' },
    { domain: 'MetaHealth.io', prospect: 'Vitality Group', status: 'Replied', sentiment: 40, lastTouch: '5m ago' },
    { domain: 'CloudScale.tech', prospect: 'DigitalOcean', status: 'Sent', sentiment: 0, lastTouch: '1d ago' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Target Decision Makers Grid */}
      <div className="lg:col-span-8 bg-[#0b0e14] border border-white/10 rounded-2xl p-6">
        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">
          {lang === 'ar' ? 'رادار المراسلات النشطة' : 'ACTIVE OUTREACH RADAR'}
        </h3>
        <div className="space-y-4">
          {activeLeads.map((lead, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-xl hover:border-indigo-500/50 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${lead.status === 'Replied' ? 'bg-green-500 animate-pulse' : 'bg-indigo-500'}`}></div>
                <div>
                  <div className="text-white text-xs font-black uppercase">{lead.domain}</div>
                  <div className="text-[10px] text-slate-500">{lead.prospect}</div>
                </div>
              </div>
              <div className="flex gap-10 items-center">
                 <div className="text-right">
                    <div className="text-[8px] text-slate-600 uppercase">Sentiment</div>
                    <div className={`text-xs font-black ${lead.sentiment > 70 ? 'text-green-500' : 'text-slate-400'}`}>{lead.sentiment}%</div>
                 </div>
                 <div className="text-right">
                    <div className="text-[8px] text-slate-600 uppercase">Status</div>
                    <div className="text-[10px] font-black text-white uppercase">{lead.status}</div>
                 </div>
                 <div className="text-[8px] text-slate-600 uppercase w-12">{lead.lastTouch}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exit Velocity Panel */}
      <div className="lg:col-span-4 bg-[#05070a] border border-red-500/20 rounded-2xl p-6 flex flex-col justify-between">
        <div>
           <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6 underline decoration-red-500/50 underline-offset-8">
             {lang === 'ar' ? 'تحليلات سرعة الخروج' : 'EXIT VELOCITY ANALYTICS'}
           </h3>
           <div className="space-y-6">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-500 text-[10px]">{lang === 'ar' ? 'متوسط زمن البيع' : 'AVG TIME TO EXIT'}</span>
                <span className="text-xl font-black text-white">14.2 Days</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-500 text-[10px]">{lang === 'ar' ? 'معدل التحويل' : 'CONVERSION RATE'}</span>
                <span className="text-xl font-black text-green-500">8.4%</span>
              </div>
           </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5">
           <button className="w-full py-4 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-500 transition-all rounded-xl shadow-lg shadow-red-900/20">
             {lang === 'ar' ? 'تفعيل محرك التصفية الجماعية' : 'ACTIVATE BULK LIQUIDATION'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default LiquidationWarRoom;
