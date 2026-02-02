
import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/SupabaseClient';
import { useDomainContext } from '../../context/DomainContext';
import { AuditLogEntry } from '../../types';
import { LaunchReadinessService } from '../../services/LaunchReadinessService';
import { safeAICall } from '../../services/ai/base';
import LaunchControlHub from '../LaunchControlHub';
import AutopsyLab from '../AutopsyLab';

const AdminHub: React.FC = () => {
  const { activeProfile, addLog, activityLogs } = useDomainContext();
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [activeView, setActiveView] = useState<'overview' | 'users' | 'audit' | 'resilience' | 'diagnostics'>('overview');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isAborting, setIsAborting] = useState(false);
  const [diagLatency, setDiagLatency] = useState<number | null>(null);
  
  const isAuthorized = activeProfile?.role === 'Admin' && activeProfile?.email.toLowerCase() === 'azeddinebeldjilali9@gmail.com';
  const isSafeMode = localStorage.getItem('isthmic_chaos_failure') === 'true';

  const fetchData = async () => {
    if (!isAuthorized) return;
    try {
      const [usersRes, auditRes] = await Promise.all([
        supabase.from('profiles').select('id, name, email, role, subscription_tier, usage_stats, created_at').order('created_at', { ascending: false }),
        supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(100)
      ]);
      
      if (usersRes.data) setUsers(usersRes.data);
      if (auditRes.data) setAuditLogs(auditRes.data);
    } catch (e) {
      addLog('Admin', 'Failed to sync sovereign registry.', 'critical');
    }
  };

  const handleSystemPulse = async () => {
    setDiagLatency(0);
    try {
      const res: any = await safeAICall({
        model: 'gemini-3-flash-preview',
        contents: "Pulse check. Return 'OK'."
      });
      if (res?._telemetry?.latency) {
        setDiagLatency(res._telemetry.latency);
        addLog('Diagnostics', `System Pulse Successful. Latency: ${res._telemetry.latency}ms`, 'success', { latency: res._telemetry.latency });
      }
    } catch (e) {
      addLog('Diagnostics', 'Pulse Failed.', 'critical');
    }
  };

  const handleEmergencyAbort = () => {
    setIsAborting(true);
    setTimeout(() => {
      localStorage.setItem('isthmic_chaos_failure', 'true');
      window.location.reload();
    }, 1500);
  };

  const handleRecovery = () => {
    localStorage.removeItem('isthmic_chaos_failure');
    window.location.reload();
  };

  const updateUserRole = async (userId: string, newRole: string, newTier: string) => {
    setIsUpdating(userId);
    try {
      await supabase.from('profiles').update({ role: newRole, subscription_tier: newTier }).eq('id', userId);
      await fetchData();
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
         <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-[32px] flex items-center justify-center text-red-500 text-4xl shadow-2xl"><i className="fas fa-user-lock"></i></div>
         <h3 className="text-2xl prestige-heading text-white italic">Sovereign Access Denied</h3>
      </div>
    );
  }

  const systemHealth = LaunchReadinessService.monitorTelemetry(activityLogs);

  return (
    <div className="space-y-12 animate-precision pb-24" dir="ltr">
      <section className="relative bg-[#111113] border border-white/5 rounded-[48px] p-10 lg:p-14 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-10">
          <div className="text-left space-y-4">
            <div className="flex items-center gap-6">
              <h2 className="text-4xl lg:text-7xl prestige-heading text-white italic">Sovereign Hub</h2>
              {isSafeMode ? (
                <button onClick={handleRecovery} className="bg-green-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">RECOVER SYSTEM</button>
              ) : (
                <button onClick={handleEmergencyAbort} disabled={isAborting} className="bg-red-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">EMERGENCY ABORT</button>
              )}
            </div>
          </div>

          <div className="flex bg-[#0a0a0c] p-1.5 rounded-[22px] border border-white/5 shadow-2xl overflow-x-auto">
            {[
              { id: 'overview', label: 'OVERVIEW', icon: 'fa-gauge-high' },
              { id: 'users', label: 'REGISTRY', icon: 'fa-users' },
              { id: 'resilience', label: 'LAUNCH_CONTROL', icon: 'fa-shield-halved' },
              { id: 'diagnostics', label: 'PULSE_LAB', icon: 'fa-microscope' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveView(tab.id as any)} className={`flex items-center gap-3 px-6 py-3 rounded-[16px] text-[9px] font-black uppercase tracking-widest transition-all ${activeView === tab.id ? 'bg-[#d4af37] text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}>
                <i className={`fas ${tab.icon}`}></i> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="min-h-[600px] animate-slide-up">
        {activeView === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             <div className="square-card p-10 bg-indigo-500/10 border-indigo-500/20 text-center">
                <div className="text-[10px] font-black text-indigo-400 uppercase mb-4">Total Nodes</div>
                <div className="text-5xl font-black text-white italic">{users.length}</div>
             </div>
             <div className="square-card p-10 bg-[#d4af37]/10 border-[#d4af37]/20 text-center">
                <div className="text-[10px] font-black text-[#d4af37] uppercase mb-4">EWS Status</div>
                <div className={`text-5xl font-black italic ${systemHealth.status === 'NOMINAL' ? 'text-green-500' : 'text-red-500'}`}>{systemHealth.status}</div>
             </div>
          </div>
        )}

        {activeView === 'users' && (
          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left font-mono text-[10px]">
              <thead className="bg-white/5 text-slate-500 uppercase">
                <tr><th className="p-6">Identity</th><th className="p-6">Role</th><th className="p-6">Tier</th><th className="p-6">Inferences</th><th className="p-6">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/2 transition-colors">
                    <td className="p-6"><div className="text-white font-bold">{u.name}</div><div className="text-slate-500 italic">{u.email}</div></td>
                    <td className="p-6"><span className={`px-3 py-1 rounded-full ${u.role === 'Admin' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-slate-400'}`}>{u.role}</span></td>
                    <td className="p-6 text-white">{u.subscription_tier}</td>
                    <td className="p-6 text-slate-400">{u.usage_stats?.scansThisMonth || 0}</td>
                    <td className="p-6"><button onClick={() => updateUserRole(u.id, 'Admin', 'Sovereign')} className="bg-white/5 p-2 rounded text-[#d4af37]"><i className="fas fa-crown"></i></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeView === 'resilience' && <LaunchControlHub />}

        {activeView === 'diagnostics' && (
          <div className="space-y-12 animate-precision">
             <div className="square-card p-14 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
                   <div className="space-y-6 flex-1">
                      <h3 className="text-4xl prestige-heading text-white italic leading-tight">API Telemetry Diagnostic</h3>
                      <p className="text-slate-400 text-lg italic leading-relaxed">
                        "Perform a surgical 'ping' to the Gemini 3 logic engine to verify connectivity, latency thresholds, and structural alignment."
                      </p>
                      <button onClick={handleSystemPulse} className="prestige-btn prestige-btn-gold !px-14 !py-5">
                         <i className="fas fa-bolt mr-3"></i> SYSTEM PULSE TEST
                      </button>
                   </div>
                   {diagLatency !== null && (
                     <div className="w-64 h-64 bg-black/60 rounded-[50px] border-2 border-white/10 flex flex-col items-center justify-center space-y-4 shadow-2xl animate-slide-up">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logic Latency</div>
                        <div className={`text-6xl font-black italic ${diagLatency > 2000 ? 'text-red-500' : 'text-green-500'}`}>{diagLatency}ms</div>
                        <div className="text-[9px] font-black text-slate-600 uppercase">THRESHOLD: 2500ms</div>
                     </div>
                   )}
                </div>
             </div>
             <AutopsyLab />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHub;
