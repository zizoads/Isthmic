
import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/SupabaseClient';
import { useDomainContext } from '../../context/DomainContext';
import { PlatformMonetizationSettings } from '../../types';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  subscription_tier: string;
}

const AdminHub: React.FC = () => {
  const { monetization, updateMonetization } = useDomainContext();
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalDomains: 0,
    activeNow: 0,
    revenueInflow: 124500
  });
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchRegistry = async () => {
    setIsLoading(true);
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: domainsCount } = await supabase.from('domains').select('*', { count: 'exact', head: true });
    const { data: usersData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    
    setPlatformStats(prev => ({
      ...prev,
      totalUsers: usersCount || 0,
      totalDomains: domainsCount || 0,
      activeNow: Math.floor(Math.random() * 8) + 3
    }));

    if (usersData) setUsers(usersData as UserRow[]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  const handleToggleMonetization = async () => {
    const nextSettings = { ...monetization, isMonetizationActive: !monetization.isMonetizationActive };
    await updateMonetization(nextSettings);
  };

  const handleUpdatePlan = async (tier: string, key: string, value: any) => {
    const nextPlans = {
      ...monetization.plans,
      [tier]: { ...monetization.plans[tier as keyof typeof monetization.plans], [key]: value }
    };
    await updateMonetization({ ...monetization, plans: nextPlans as any });
  };

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
                Mode: Total Sovereignty
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
              <div className="text-[8px] font-black text-[#c5a059] uppercase mb-1">Fail-Safe Status</div>
              <div className="text-xl font-black text-[#c5a059] uppercase italic">Ready</div>
            </div>
          </div>
        </div>
        <i className="fas fa-shield-halved absolute left-[-60px] top-[-60px] text-white/5 text-[350px] pointer-events-none -rotate-12"></i>
      </section>

      {/* Monetization Command Center */}
      <section className="square-card p-10 lg:p-14 bg-[#0a0a0c]">
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-2xl prestige-heading text-white italic">Sovereign Revenue Command</h3>
          <button 
            onClick={handleToggleMonetization}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
              ${monetization.isMonetizationActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}
            `}
          >
            {monetization.isMonetizationActive ? 'DISABLE BILLING' : 'ACTIVATE BILLING PROTOCOL'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {(Object.entries(monetization.plans) as [string, any][]).map(([tier, details]) => (
            <div key={tier} className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-6">
              <div className="text-sm font-black text-[#c5a059] uppercase tracking-widest">{tier} Access</div>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-2">Price (USD)</label>
                    <input 
                      type="number" 
                      value={details.price}
                      onChange={(e) => handleUpdatePlan(tier, 'price', Number(e.target.value))}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white font-bold"
                    />
                 </div>
                 <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-2">Scan Limit</label>
                    <input 
                      type="number" 
                      value={details.maxScans}
                      onChange={(e) => handleUpdatePlan(tier, 'maxScans', Number(e.target.value))}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white font-bold"
                    />
                 </div>
                 <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-2">Audit Limit</label>
                    <input 
                      type="number" 
                      value={details.maxAudits}
                      onChange={(e) => handleUpdatePlan(tier, 'maxAudits', Number(e.target.value))}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white font-bold"
                    />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Personnel Authority Control Table */}
      <div className="lg:col-span-2 square-card flex flex-col h-[700px] bg-[#0a0a0c]">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="text-xl prestige-heading text-white italic">Personnel Registry</h3>
            <button onClick={fetchRegistry} className="text-[9px] font-black text-[#c5a059] uppercase tracking-widest hover:underline">Sync Registry</button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
            {isLoading ? (
              <div className="h-full flex items-center justify-center opacity-20 italic">Loading Personnel...</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5">
                    <th className="p-6">Identity</th>
                    <th className="p-6">Subscription</th>
                    <th className="p-6">Access</th>
                    <th className="p-6 text-right">Actions</th>
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
                         <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-300 uppercase">
                           {u.subscription_tier || 'Free'}
                         </span>
                      </td>
                      <td className="p-6">
                          <span className={`px-3 py-1 border rounded-full text-[9px] font-black uppercase ${
                            u.role === 'Admin' ? 'bg-[#c5a059]/10 border-[#c5a059]/20 text-[#c5a059]' : 'bg-white/5 border-white/10 text-slate-400'
                          }`}>
                            {u.role}
                          </span>
                      </td>
                      <td className="p-6 text-right">
                          <div className="flex justify-end gap-3">
                            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase text-slate-400">Manage</button>
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminHub;
