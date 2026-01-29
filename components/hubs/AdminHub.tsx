
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

  const toggleUserRole = async (userId: string, currentRole: string) => {
    setUpdatingId(userId);
    const newRole = currentRole === 'Admin' ? 'Executive' : 'Admin';
    
    // Safety: Check if we're trying to remove the last admin
    if (currentRole === 'Admin') {
      const adminCount = users.filter(u => u.role === 'Admin').length;
      if (adminCount <= 1) {
        alert("CRITICAL ERROR: Cannot demote the last remaining Admin. Platform requires at least one Sovereign to exist.");
        setUpdatingId(null);
        return;
      }
    }

    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } else {
      alert(`Database error: ${error.message}`);
    }
    setUpdatingId(null);
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`WARNING: You are about to terminate account [${email}]. This action is irreversible. Proceed?`)) return;
    
    setUpdatingId(userId);
    
    // Safety check for self-deletion if last admin
    const adminCount = users.filter(u => u.role === 'Admin').length;
    const userRole = users.find(u => u.id === userId)?.role;
    
    if (userRole === 'Admin' && adminCount <= 1) {
      alert("ABORTED: Cannot delete the final Admin account. Transfer sovereignty to another account first.");
      setUpdatingId(null);
      return;
    }

    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (!error) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      alert("Personnel record purged from sovereign registry.");
    } else {
      alert(`Purge failed: ${error.message}`);
    }
    setUpdatingId(null);
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Commanders', value: platformStats.totalUsers, icon: 'fa-users' },
          { label: 'Digital Assets', value: platformStats.totalDomains, icon: 'fa-globe' },
          { label: 'Active Sessions', value: platformStats.activeNow, icon: 'fa-bolt' },
          { label: 'Market Inflow', value: `$${platformStats.revenueInflow.toLocaleString()}`, icon: 'fa-vault' }
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
        {/* Full Access Team Management Table */}
        <div className="lg:col-span-2 square-card flex flex-col h-[700px] bg-[#0a0a0c]">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
             <h3 className="text-xl prestige-heading text-white italic">Personnel Authority Control</h3>
             <button onClick={fetchRegistry} className="text-[9px] font-black text-[#c5a059] uppercase tracking-widest hover:underline">Sync Global Registry</button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
             {isLoading ? (
               <div className="h-full flex items-center justify-center opacity-20 italic">Loading Personnel...</div>
             ) : (
               <table className="w-full text-left">
                 <thead>
                    <tr className="text-[9px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5">
                      <th className="p-6">User Identity</th>
                      <th className="p-6">Access Level</th>
                      <th className="p-6">Date Joined</th>
                      <th className="p-6 text-right">Global Actions</th>
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
                           <span className={`px-3 py-1 border rounded-full text-[9px] font-black uppercase ${
                             u.role === 'Admin' ? 'bg-[#c5a059]/10 border-[#c5a059]/20 text-[#c5a059]' : 'bg-white/5 border-white/10 text-slate-400'
                           }`}>
                             {u.role}
                           </span>
                        </td>
                        <td className="p-6 text-[11px] text-slate-500 font-mono">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-6 text-right">
                           <div className="flex justify-end gap-3">
                              <button 
                                disabled={updatingId === u.id}
                                onClick={() => toggleUserRole(u.id, u.role)}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase text-slate-400 hover:bg-white hover:text-black transition-all"
                              >
                                {updatingId === u.id ? 'Updating...' : u.role === 'Admin' ? 'Revoke Power' : 'Grant Full Admin'}
                              </button>
                              <button 
                                disabled={updatingId === u.id}
                                onClick={() => deleteUser(u.id, u.email)}
                                className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[8px] font-black uppercase text-red-500 hover:bg-red-500 hover:text-white transition-all"
                              >
                                {updatingId === u.id ? '...' : 'Purge'}
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             )}
          </div>
        </div>

        {/* Global Control Hub */}
        <div className="flex flex-col gap-10">
           <div className="square-card p-10 flex-1 bg-gradient-to-br from-[#111113] to-[#0a0a0c] flex flex-col justify-between">
              <div className="space-y-8">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sovereignty Protocols</h3>
                 <div className="space-y-4">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                       <div className="text-[8px] font-black text-[#c5a059] uppercase mb-4">Fail-Safe Note</div>
                       <p className="text-xs text-white leading-relaxed italic">
                         "To ensure platform continuity, always maintain at least <b>two</b> Admin accounts. If your primary email is compromised, the second account can act as a recovery anchor."
                       </p>
                    </div>
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-white hover:bg-white hover:text-black transition-all flex justify-between px-6 items-center">
                       Platform Maintenance Mode
                       <i className="fas fa-toggle-off text-slate-600"></i>
                    </button>
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-white hover:bg-white hover:text-black transition-all flex justify-between px-6 items-center">
                       Global API Shield
                       <i className="fas fa-shield-check text-green-500"></i>
                    </button>
                 </div>
              </div>
           </div>

           <div className="square-card p-10 bg-[#c5a059]/5 border-[#c5a059]/10 relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Master Access Info</h3>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#c5a059] rounded-2xl flex items-center justify-center text-black shadow-xl">
                       <i className="fas fa-fingerprint"></i>
                    </div>
                    <div>
                       <div className="text-sm font-bold text-white tracking-tight">Root Authority</div>
                       <div className="text-[8px] text-[#c5a059] font-black uppercase tracking-widest">Level 10 clearance</div>
                    </div>
                 </div>
              </div>
              <i className="fas fa-key absolute right-[-20px] bottom-[-20px] text-white/[0.02] text-[120px] pointer-events-none group-hover:text-[#c5a059]/[0.05] transition-colors duration-1000"></i>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHub;
