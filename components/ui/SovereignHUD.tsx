
import React, { useEffect, useState } from 'react';
import { SOC } from '../../security/SecurityOperationsCenter';
import { LaunchReadinessService } from '../../services/LaunchReadinessService';

const SovereignHUD: React.FC = () => {
  const [securityStatus, setSecurityStatus] = useState(SOC.getUnifiedSecurityStatus());
  const [phi, setPhi] = useState(0);

  const lastSync = new Date().toLocaleTimeString();
  const schemaStatus = { valid: true };
  const reconnectCloud = () => {};

  useEffect(() => {
    const pulse = setInterval(async () => {
      setSecurityStatus(SOC.getUnifiedSecurityStatus());
      const currentPhi = await LaunchReadinessService.calculateSystemPhi();
      setPhi(currentPhi);
    }, 5000);
    return () => clearInterval(pulse);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-14 z-[1000] flex items-center justify-between px-6 lg:px-12 bg-black/80 backdrop-blur-2xl border-b border-white/5 pointer-events-none select-none">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full shadow-[0_0_8px_#d4af37]"></div>
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">CORE_ID</span>
            <span className="text-[10px] font-mono text-white/80 leading-none uppercase tracking-tighter">SOVEREIGN_v2.3</span>
          </div>
        </div>

        <div className="flex items-center gap-3 group pointer-events-auto cursor-pointer" onClick={reconnectCloud}>
          <div className={`w-2 h-2 rounded-full transition-all duration-1000 bg-sky-500 shadow-[0_0_10px_#0ea5e9]`}></div>
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">
              OFFLINE_VAULT
            </span>
            <span className={`text-[10px] font-mono leading-none uppercase font-bold transition-colors duration-500 text-sky-400`}>
              SOVEREIGN_MODE
            </span>
          </div>
          <i className="fas fa-sync-alt text-[8px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity ml-1"></i>
        </div>

        {/* Real-time System Cohesion Index (PHI) */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/5">
           <div className="flex flex-col">
              <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Cohesion_PHI</span>
              <div className="flex items-center gap-2">
                 <span className={`text-[10px] font-black font-mono ${phi >= 85 ? 'text-indigo-400' : 'text-amber-500'}`}>{phi}%</span>
                 <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${phi}%` }}></div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-8 pointer-events-auto">
        <div className="hidden xl:flex flex-col items-end">
           <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Last_Sync</span>
           <span className="text-[9px] font-mono text-slate-400">{lastSync}</span>
        </div>
        
        {!schemaStatus.valid && (
          <div className="bg-rose-500/10 border border-rose-500/30 px-4 py-1 rounded text-[8px] font-black text-rose-500 uppercase animate-pulse flex items-center gap-2">
            <i className="fas fa-database"></i>
            DB_SCHEMA_MISMATCH
          </div>
        )}
        
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-3 hover:bg-white/10 transition-colors cursor-help">
           <span className="text-[8px] font-black text-white/70 uppercase tracking-[0.2em] italic whitespace-nowrap">
             {securityStatus.overall}
           </span>
           <div className={`w-1 h-1 rounded-full animate-pulse ${securityStatus.soc === 'OPERATIONAL' ? 'bg-emerald-500' : 'bg-rose-600'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default SovereignHUD;
