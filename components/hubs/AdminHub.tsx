
import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/SupabaseClient';

const AdminHub: React.FC = () => {
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalDomains: 0,
    activeNow: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: domainsCount } = await supabase.from('domains').select('*', { count: 'exact', head: true });
      
      setPlatformStats({
        totalUsers: usersCount || 0,
        totalDomains: domainsCount || 0,
        activeNow: Math.floor(Math.random() * 5) + 1 // محاكاة للمستخدمين النشطين
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-10 p-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter">Platform Oversight</h2>
          <p className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.4em] mt-2">Administrative Command Center</p>
        </div>
        <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
           Sovereign Access Only
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#111113] border border-white/5 p-10 rounded-[32px] space-y-4">
           <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Registered Commanders</div>
           <div className="text-5xl font-light prestige-heading text-white">{platformStats.totalUsers}</div>
        </div>
        <div className="bg-[#111113] border border-white/5 p-10 rounded-[32px] space-y-4">
           <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Assets Tracked</div>
           <div className="text-5xl font-light prestige-heading text-white">{platformStats.totalDomains}</div>
        </div>
        <div className="bg-[#111113] border border-white/5 p-10 rounded-[32px] space-y-4">
           <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Active Ops Real-time</div>
           <div className="text-5xl font-light prestige-heading text-green-500">{platformStats.activeNow}</div>
        </div>
      </div>

      <div className="bg-[#111113] border border-white/5 rounded-[40px] p-10 overflow-hidden relative">
         <h3 className="text-white prestige-heading text-2xl italic mb-6">Network Growth Strategy</h3>
         <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-medium italic">
           As an administrator, you can observe the macro-trends of the domainer community. Focus on high-frequency sectors like AI and Bio-tech to optimize the platform's autonomous discovery engines.
         </p>
         <i className="fas fa-network-wired absolute right-[-40px] bottom-[-40px] text-white/5 text-[200px]"></i>
      </div>
    </div>
  );
};

export default AdminHub;
