
import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/SupabaseClient';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const AdminHub: React.FC = () => {
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalDomains: 0,
    activeNow: 0,
    revenueInflow: 124500
  });
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: domainsCount } = await supabase.from('domains').select('*', { count: 'exact', head: true });
      const { data: usersData } = await supabase.from('profiles').select('*').limit(10).order('created_at', { ascending: false });
      
      setPlatformStats(prev => ({
        ...prev,
        totalUsers: usersCount || 0,
        totalDomains: domainsCount || 0,
        activeNow: Math.floor(Math.random() * 8) + 3
      }));

      if (usersData) setUsers(usersData as UserRow[]);
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-12 animate-precision pb-24" dir="ltr">
      {/* Admin Header Section */}
      <section className="relative bg-[#111113] border border-white/5 rounded-[48px] p-10 lg:p-14 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="text-left space-y-4">
            <h2 className="text-4xl lg:text-6xl prestige-heading text-white italic leading-none">
              System Architect Console
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.3em] bg-[#c5a059]/10 px-4 py-1.5 rounded-full border border-[#c5a059]/20">
                Rank: Platform Overlord
              </span>
              <div className="h-[1px] w-12 bg-[#c5a059]/30"></div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-3xl text-center min-w-[140px]">
              <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Network Health</div>
              <div className="text-xl font-black text-green-500 uppercase italic">Nominal</div>
            </div>
            <div className="px-6 py-4 bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-3xl text-center min-w-[140px]">
              <div className="text-[8px] font-black text-[#c5a059] uppercase mb-1">Global Sync</div>
              <div className="text-xl font-black text-[#c5a059] uppercase italic">Active</div>
            </div>
          </div>
        </div>
        <i className="fas fa-shield-halved absolute left-[-60px] top-[-60px] text-white/5 text-[350px] pointer-events-none -rotate-12"></i>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Registered Commanders', value: platformStats.totalUsers, icon: 'fa-users', color: 'indigo' },
          { label: 'Tracked Digital Assets', value: platformStats.totalDomains, icon: 'fa-globe', color: 'blue' },
          { label: 'Real-time Active Ops', value: platformStats.activeNow, icon: 'fa-bolt', color: 'green' },
          { label: 'Market Capital Inflow', value: `$${platformStats.revenueInflow.toLocaleString()}`, icon: 'fa-vault', color: 'gold' }
        ].map((stat, i) => (
          <div key={i} className="square-card p-10 flex flex-col justify-between bg-gradient-to-br from-[#161618] to-[#0a0a0c] group hover:scale-[1.02] transition-all duration-500">
             <div className="flex justify-between items-start mb-6">
                <div className="icon-box bg-white/5 border border-white/10 text-slate-500 group-hover:text-white transition-colors">
                  <i className={`fas ${stat.icon}`}></i>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             </div>
             <div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat.label}</div>
                <div className="text-4xl font-light prestige-heading text-white">{stat.value}</div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* User Registry Table */}
        <div className="lg:col-span-2 square-card flex flex-col h-[600px] bg-[#0a0a0c]">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
             <h3 className="text-xl prestige-heading text-white italic">Commander Registry</h3>
             <button className="text-[9px] font-black text-[#c5a059] uppercase tracking-widest hover:underline">View Global Directory</button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
             {isLoading ? (
               <div className="h-full flex items-center justify-center opacity-20 italic">Loading Registry...</div>
             ) : (
               <table className="w-full text-left">
                 <thead>
                    <tr className="text-[9px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5">
                      <th className="p-6">Commander</th>
                      <th className="p-6">Classification</th>
                      <th className="p-6">Deployment Date</th>
                      <th className="p-6">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6">
                          <div className="font-bold text-white text-sm">{u.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{u.email}</div>
                        </td>
                        <td className="p-6">
                           <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-400 uppercase">
                             {u.role}
                           </span>
                        </td>
                        <td className="p-6 text-[11px] text-slate-500 font-mono">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              Online
                           </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             )}
          </div>
        </div>

        {/* System Protocols & Alerts */}
        <div className="flex flex-col gap-10">
           <div className="square-card p-10 flex-1 bg-gradient-to-br from-[#111113] to-[#0a0a0c] flex flex-col justify-between">
              <div className="space-y-8">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Control Protocols</h3>
                 <div className="space-y-4">
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-white hover:bg-white hover:text-black transition-all flex justify-between px-6 items-center">
                       Platform Maintenance Mode
                       <i className="fas fa-toggle-off text-slate-600"></i>
                    </button>
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-white hover:bg-white hover:text-black transition-all flex justify-between px-6 items-center">
                       Alpha Discovery Multiplier
                       <span className="text-[#c5a059]">2.5x</span>
                    </button>
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-white hover:bg-white hover:text-black transition-all flex justify-between px-6 items-center">
                       Global API Sentinel
                       <i className="fas fa-shield-check text-green-500"></i>
                    </button>
                 </div>
              </div>
              <div className="mt-10 p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                 <h4 className="text-[9px] font-black text-red-500 uppercase mb-2">Emergency Shutdown</h4>
                 <p className="text-[10px] text-slate-600 italic">Immediate severance of all sovereign sync anchors.</p>
              </div>
           </div>

           <div className="square-card p-10 bg-[#c5a059]/5 border-[#c5a059]/10 relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Supervisor Note</h3>
                 <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-[#c5a059] pl-6">
                   "Focus on optimizing the <b>Liquidity Engine</b> across global markets. Current data suggests a significant uptick in Fintech-based assets."
                 </p>
              </div>
              <i className="fas fa-brain absolute right-[-20px] bottom-[-20px] text-white/[0.02] text-[120px] pointer-events-none group-hover:text-[#c5a059]/[0.02] transition-colors duration-1000"></i>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHub;
