
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Activity, Database, AlertTriangle, CheckCircle, ShieldAlert, FileText, RefreshCw, UserCog } from 'lucide-react';
import { StrictTestingEnforcer, QualityReport } from '../../../quality/StrictTestingEnforcer';
import { useAuth } from '../../../context/AuthContext';
import { db } from '@/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

type AdminView = 'MILITARY_BRIEF' | 'INTEGRITY' | 'USER_MANAGEMENT';

const AdminHub: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<AdminView>('MILITARY_BRIEF');
  const [qualityReport, setQualityReport] = useState<QualityReport | null>(null);
  const [isRunningChecks, setIsRunningChecks] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [currentRole, setCurrentRole] = useState<'admin' | 'user'>('admin');

  const isAuthorized = user?.email?.toLowerCase() === 'zizoadszn@gmail.com';

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnap = await getDocs(collection(db, 'users'));
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  const toggleRole = async (userId: string, newRole: 'admin' | 'user') => {
    await updateDoc(doc(db, 'users', userId), { role: newRole });
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const switchMyRole = () => {
    setCurrentRole(currentRole === 'admin' ? 'user' : 'admin');
  };

  const runIntegrityChecks = async () => {
    setIsRunningChecks(true);
    const report = await StrictTestingEnforcer.runProductionGateChecks();
    setQualityReport(report);
    setIsRunningChecks(false);
  };

  useEffect(() => {
    if (activeView === 'INTEGRITY' && !qualityReport) {
      runIntegrityChecks();
    }
  }, [activeView]);

  if (!isAuthorized) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-6 text-red-500 font-black tracking-widest bg-black">
        <ShieldAlert className="w-24 h-24 mb-6 opacity-20 animate-pulse" />
        <div className="text-4xl italic font-black uppercase tracking-tighter">ACCESS_DENIED</div>
        <p className="text-slate-500 text-xs uppercase tracking-widest">Sovereign Authority Required</p>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'MILITARY_BRIEF':
        return (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-10">
                <div className="bg-[#050505] border border-white/5 rounded-[60px] p-12 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-all">
                    <Shield className="w-64 h-64" />
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-5xl font-black text-white leading-tight mb-8 uppercase tracking-tighter">
                      Sovereign<br />Command Center
                    </h2>
                    <p className="text-slate-500 text-lg max-w-xl leading-relaxed italic border-l-2 border-amber-500 pl-8 mb-12">
                      "The ultimate authority over the architecture. Monitor, secure, and deploy with absolute precision."
                    </p>
                    <div className="flex gap-6">
                      <button 
                        onClick={() => setActiveView('INTEGRITY')}
                        className="px-10 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center gap-3"
                      >
                        <Activity className="w-4 h-4" /> System Audit
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-black/40 border border-white/5 p-10 rounded-[50px] group hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-8">
                      <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                        <Database className="w-8 h-8" />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vault Health</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">99.9%</h3>
                    <p className="text-xs text-slate-500">Quantum entropy stable across all buffers.</p>
                  </div>

                  <div className="bg-black/40 border border-white/5 p-10 rounded-[50px] group hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-8">
                      <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <Activity className="w-8 h-8" />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Load</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">14%</h3>
                    <p className="text-xs text-slate-500">Global traffic within nominal parameters.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-10">
                <div className="bg-white text-black rounded-[60px] p-12 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-10">System Integrity</h3>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between border-b border-black/5 pb-6">
                        <span className="text-sm font-bold">Firewall</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-black/5 pb-6">
                        <span className="text-sm font-bold">Quantum Encryption</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Locked</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-black/5 pb-6">
                        <span className="text-sm font-bold">Sovereign Shield</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Engaged</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-10">
                    <button 
                       onClick={() => setActiveView('INTEGRITY')}
                       className="w-full py-5 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-black/90 transition-all"
                    >
                      Run Full System Audit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'INTEGRITY':
        return (
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">System Integrity Audit</h2>
                <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Quality Gate & Security Forensics</p>
              </div>
              <button 
                onClick={runIntegrityChecks}
                disabled={isRunningChecks}
                className="px-8 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRunningChecks ? 'animate-spin' : ''}`} /> 
                {isRunningChecks ? 'Auditing...' : 'Re-Run Audit'}
              </button>
            </div>

            {qualityReport && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-8">
                  <div className={`p-10 rounded-[50px] border ${qualityReport.passed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60">Audit Score</h3>
                      {qualityReport.passed ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <AlertTriangle className="w-6 h-6 text-red-500" />}
                    </div>
                    <h2 className={`text-6xl font-black ${qualityReport.passed ? 'text-emerald-500' : 'text-red-500'}`}>{qualityReport.score}%</h2>
                    <p className="text-xs font-medium mt-4 opacity-60 uppercase tracking-widest">
                      {qualityReport.passed ? 'System meets production standards' : 'Critical deviations detected'}
                    </p>
                  </div>

                  <div className="bg-black/40 border border-white/5 rounded-[50px] p-10 space-y-8">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Checklist Results</h3>
                    <div className="space-y-6">
                      {Object.entries(qualityReport.checks).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${
                            value === 'STABLE' || value === 'ACTIVE' || value === 'OPTIMAL' ? 'text-emerald-500' : 'text-red-500'
                          }`}>
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="bg-white text-black rounded-[60px] p-12 h-full">
                    <h3 className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-10">Audit Log & Findings</h3>
                    <div className="space-y-8">
                      {qualityReport.details.map((detail: string, i: number) => (
                        <div key={i} className="flex items-start gap-6 border-b border-black/5 pb-8 last:border-0">
                          <div className="p-3 rounded-xl bg-black/5 text-black">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold mb-1">{detail}</p>
                            <p className="text-[10px] opacity-40 uppercase tracking-widest">Verified at {new Date(qualityReport.timestamp).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      ))}
                      
                      {qualityReport.vulnerabilities.length > 0 && (
                        <div className="mt-10 p-8 bg-red-50 rounded-3xl border border-red-100">
                          <h4 className="text-red-600 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" /> Security Vulnerabilities Detected
                          </h4>
                          <div className="space-y-4">
                            {qualityReport.vulnerabilities.map((v: { description: string; severity: string }, i: number) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-red-100">
                                <span className="text-xs font-bold">{v.description}</span>
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{v.severity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'USER_MANAGEMENT':
        return (
          <div className="space-y-10">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">User Management</h2>
            <div className="bg-black/40 border border-white/5 rounded-[50px] p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Users</h3>
                <button 
                  onClick={switchMyRole}
                  className="px-6 py-3 bg-[#d4af37] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] transition-all"
                >
                  Switch Role: {currentRole.toUpperCase()}
                </button>
              </div>
              <div className="space-y-4">
                {users.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-white">{u.name}</div>
                      <div className="text-[10px] text-slate-500">{u.email}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-black uppercase ${u.role === 'admin' ? 'text-[#d4af37]' : 'text-slate-500'}`}>{u.role}</span>
                      <button 
                        onClick={() => toggleRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                        className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                      >
                        <UserCog className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white p-10 lg:p-20">
      <div className="max-w-[1600px] mx-auto space-y-16">
        {/* Navigation Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white text-black rounded-3xl flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">Admin Hub</h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sovereign Authority Level 10</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['MILITARY_BRIEF', 'INTEGRITY', 'USER_MANAGEMENT'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeView === view 
                    ? 'bg-white text-black' 
                    : 'bg-white/5 text-slate-500 hover:bg-white/10'
                }`}
              >
                {view.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic View Content */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          {renderView()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminHub;
