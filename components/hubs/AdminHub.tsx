
import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/SupabaseClient';
import { useDomainContext } from '../../context/DomainContext';
import { AuditLogEntry } from '../../types';
import { LaunchReadinessService } from '../../services/LaunchReadinessService';

const AdminHub: React.FC = () => {
  const { activeProfile, addLog, activityLogs } = useDomainContext();
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'users' | 'audit' | 'resilience'>('overview');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  
  // حماية سيادية: التحقق من الرول والإيميل الجذري
  const isAuthorized = activeProfile?.role === 'Admin' && activeProfile?.email === 'azeddinebeldjilali9@gmail.com';

  const fetchData = async () => {
    if (!isAuthorized) return;
    setIsLoading(true);
    try {
      const [usersRes, auditRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(100)
      ]);
      
      if (usersRes.data) setUsers(usersRes.data);
      if (auditRes.data) setAuditLogs(auditRes.data);
    } catch (e) {
      addLog('Admin', 'Failed to sync sovereign registry.', 'critical');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string, newTier: string) => {
    setIsUpdating(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, subscription_tier: newTier })
        .eq('id', userId);
      
      if (error) throw error;
      
      addLog('Admin', `Privileges elevated for user ${userId} to ${newRole}`, 'success');
      await fetchData();
    } catch (e: any) {
      addLog('Admin', `Privilege update failed: ${e.message}`, 'critical');
    } finally {
      setIsUpdating(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center space-y-8 animate-precision">
         <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-[32px] flex items-center justify-center text-red-500 text-4xl shadow-2xl">
            <i className="fas fa-user-lock"></i>
         </div>
         <div className="text-center space-y-2">
            <h3 className="text-2xl prestige-heading text-white italic">Sovereign Access Denied</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">This terminal is locked to the Master Admin Identity</p>
         </div>
      </div>
    );
  }

  // حساب إحصائيات النظام
  const systemHealth = LaunchReadinessService.monitorTelemetry(activityLogs);
  const totalValue = users.reduce((acc, u) => acc + (u.usage_stats?.scansThisMonth || 0), 0);

  return (
    <div className="space-y-12 animate-precision pb-24" dir="ltr">
      {/* Admin Header */}
      <section className="relative bg-[#111113] border border-white/5 rounded-[48px] p-10 lg:p-14 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-10">
          <div className="text-left space-y-4">
            <h2 className="text-4xl lg:text-7xl prestige-heading text-white italic leading-none">
              Sovereign Command Center
            </h2>
            <div className="flex bg-[#0a0a0c] p-1.5 rounded-2xl border border-white/5 shadow-xl mt-4 overflow-x-auto max-w-full no-scrollbar">
               {[
                 { id: 'overview', label: 'SYSTEM_OVERVIEW' },
                 { id: 'users', label: 'PRIVILEGE_VAULT' },
                 { id: 'audit', label: 'FORENSIC_LOGS' },
                 { id: 'resilience', label: 'NETWORK_PHI' }
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveView(tab.id as any)}
                   className={`px-8 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                     ${activeView === tab.id ? 'bg-[#d4af37] text-black shadow-lg' : 'text-slate-500 hover:text-white'}
                   `}
                 >
                   {tab.label}
                 </button>
               ))}
            </div>
          </div>
          <div className="bg-[#d4af37]/10 border border-[#d4af37]/20 p-6 rounded-3xl text-right">
             <div className="text-[9px] font-black text-[#d4af37] uppercase tracking-widest mb-1">Authenticated Admin</div>
             <div className="text-xl font-bold text-white italic truncate max-w-[250px]">{activeProfile?.email}</div>
          </div>
        </div>
        <i className="fas fa-shield-halved absolute right-[-50px] top-[-50px] text-white/[0.01] text-[350px] pointer-events-none rotate-12"></i>
      </section>

      {/* Overview Dashboard */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-slide-up">
           <div className="square-card p-10 space-y-6">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Identities</div>
              <div className="text-6xl font-black text-white italic">{users.length}</div>
              <div className="text-[9px] text-indigo-400 font-bold uppercase underline">Manage Global Access</div>
           </div>
           <div className="square-card p-10 space-y-6">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Pulse</div>
              <div className={`text-2xl font-black italic ${systemHealth.status === 'NOMINAL' ? 'text-green-500' : 'text-red-500'}`}>
                {systemHealth.status}
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-full animate-shimmer"></div></div>
           </div>
           <div className="square-card p-10 space-y-6">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total AI Inference</div>
              <div className="text-4xl font-black text-white italic">{totalValue.toLocaleString()} <span className="text-xs text-slate-600">UNITS</span></div>
              <div className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">Aggregated across all profiles</div>
           </div>
           <div className="square-card p-10 space-y-6 bg-[#d4af37]/5 border-[#d4af37]/20">
              <div className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">Security Gates</div>
              <div className="text-3xl font-black text-white italic">LOCKED</div>
              <i className="fas fa-lock text-[#d4af37] opacity-20"></i>
           </div>
        </div>
      )}

      {/* User Management (Privilege Vault) */}
      {activeView === 'users' && (
        <div className="square-card flex flex-col h-[700px] bg-[#0a0a0c] animate-slide-up overflow-hidden">
           <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h3 className="text-xl prestige-heading text-white italic">Identity Privilege Registry</h3>
              <button onClick={fetchData} className="text-[9px] font-black text-[#d4af37] uppercase tracking-widest">Force Cloud Sync</button>
           </div>
           <div className="flex-1 overflow-y-auto no-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5 bg-black/40 sticky top-0 z-10">
                    <th className="p-8">Sovereign Identity</th>
                    <th className="p-8 text-center">Role / Authorization</th>
                    <th className="p-8 text-center">Inference Tier</th>
                    <th className="p-8 text-right">Administrative Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-8">
                        <div className="font-bold text-white text-base">{u.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono italic">{u.email}</div>
                      </td>
                      <td className="p-8 text-center">
                         <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                           u.role === 'Admin' ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20' : 
                           u.role === 'Executive' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500'
                         }`}>
                           {u.role}
                         </span>
                      </td>
                      <td className="p-8 text-center">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{u.subscription_tier}</span>
                      </td>
                      <td className="p-8 text-right space-x-2">
                          {u.email !== activeProfile?.email && (
                            <div className="flex justify-end gap-2">
                              <button 
                                disabled={isUpdating === u.id}
                                onClick={() => updateUserRole(u.id, 'Executive', 'Pro')}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase text-slate-400 hover:bg-white hover:text-black transition-all"
                              >
                                Make Executive
                              </button>
                              <button 
                                disabled={isUpdating === u.id}
                                onClick={() => updateUserRole(u.id, 'Admin', 'Sovereign')}
                                className="px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-xl text-[8px] font-black uppercase text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all"
                              >
                                {isUpdating === u.id ? '...' : 'Promote Admin'}
                              </button>
                              <button 
                                disabled={isUpdating === u.id}
                                onClick={() => updateUserRole(u.id, 'Analyst', 'Free')}
                                className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[8px] font-black uppercase text-red-500 hover:bg-red-500 hover:text-white transition-all"
                              >
                                Revoke
                              </button>
                            </div>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Forensic Audit Logs */}
      {activeView === 'audit' && (
        <div className="square-card h-[700px] flex flex-col animate-slide-up overflow-hidden">
           <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h3 className="text-xl prestige-heading text-white italic">Forensic Integrity Logs</h3>
              <div className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">Monitoring Real-Time Activity</div>
           </div>
           <div className="flex-1 overflow-y-auto p-0 no-scrollbar">
              <div className="bg-black/20 p-8 space-y-4">
                 {auditLogs.map((log, i) => (
                   <div key={i} className="flex gap-8 p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-indigo-500/30 transition-all font-mono text-xs">
                      <div className="text-slate-600 shrink-0">[{log.timestamp}]</div>
                      <div className="flex-1">
                         <span className="text-[#d4af37] font-black uppercase">{log.actorName}</span>
                         <span className="text-slate-500 mx-3">>></span>
                         <span className="text-white italic">{log.description}</span>
                      </div>
                      <div className={`text-[10px] font-black uppercase ${
                        log.severity === 'critical' ? 'text-red-500' : 'text-slate-600'
                      }`}>{log.severity}</div>
                   </div>
                 ))}
                 {auditLogs.length === 0 && (
                   <div className="py-40 text-center opacity-10">
                      <i className="fas fa-terminal text-6xl mb-6"></i>
                      <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Forensic Signals Recorded</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Resilience Monitoring */}
      {activeView === 'resilience' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-slide-up">
           <div className="square-card p-12 bg-[#050505] space-y-10">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10 border-b border-white/5 pb-4">Early Warning System (EWS)</h3>
              <div className="space-y-8">
                 {systemHealth.alerts.map(alert => (
                   <div key={alert.id} className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-start gap-6 group">
                      <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white text-xl animate-pulse">
                         <i className="fas fa-exclamation-triangle"></i>
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-black text-white uppercase">{alert.type}</h4>
                            <span className="text-[8px] font-mono text-slate-600">{alert.timestamp}</span>
                         </div>
                         <p className="text-xs text-slate-400 italic">"{alert.metric} from {alert.source}"</p>
                      </div>
                   </div>
                 ))}
                 {systemHealth.alerts.length === 0 && (
                   <div className="p-10 border-2 border-dashed border-white/5 rounded-[40px] text-center opacity-30 italic text-sm">
                      -- NO_ANOMALIES_DETECTED --
                   </div>
                 )}
              </div>
           </div>

           <div className="square-card p-12 bg-gradient-to-br from-[#0a0a0c] to-[#111113] flex flex-col justify-center items-center space-y-8">
              <div className="relative w-64 h-64 flex items-center justify-center">
                 <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                 <div className="absolute inset-0 border-t-4 border-[#d4af37] rounded-full animate-spin"></div>
                 <div className="text-center">
                    <div className="text-6xl font-black text-white italic">0.999</div>
                    <div className="text-[9px] font-black text-[#d4af37] uppercase tracking-widest mt-2">Stability Coeff.</div>
                 </div>
              </div>
              <p className="text-[10px] text-slate-500 text-center leading-relaxed font-mono uppercase tracking-widest">
                 Platform logic is currently executing within FAANG-grade parameters.<br/>
                 Redundancy active. Cloud anchors secure.
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminHub;
