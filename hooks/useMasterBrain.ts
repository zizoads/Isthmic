
import { useState, useCallback } from 'react';
import { Domain, PlatformStrategy, WorkflowState, AgentThought } from '../types';
import { useDomainContext } from '../context/DomainContext';
import { Orchestrator } from '../services/orchestrator';
import { AgentEngine } from '../services/agentEngine';

export const useMasterBrain = (
  strategy: PlatformStrategy, 
  lang: 'ar' | 'en'
) => {
  const { setDomains, addLog } = useDomainContext();
  const [isScanning, setIsScanning] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowState | null>(null);
  const [sessionThoughts, setSessionThoughts] = useState<AgentThought[]>([]);

  const initiateScan = useCallback(async () => {
    if (!strategy.investmentThesis) {
      addLog('Master Brain', lang === 'ar' ? 'يرجى تحديد بوصلة القائد أولاً.' : 'Please define Commander Intent first.', 'warning');
      return;
    }
    
    setIsScanning(true);
    const engine = new AgentEngine((thoughts) => setSessionThoughts(thoughts));
    
    // Define Multi-Agent Workflow
    const nodes = [
      {
        id: 'multi-agent-debate',
        labelAr: 'مناظرة الوكلاء',
        labelEn: 'Multi-Agent Debate',
        task: async (thesis: string) => {
          addLog('Master Brain', lang === 'ar' ? 'بدء جلسة تفكير متعددة الأدوار...' : 'Starting multi-agent reasoning session...', 'info');
          return await engine.runMultiAgentSession("Global Market Sweep", thesis);
        }
      }
    ];

    const orchestrator = new Orchestrator(
      'master-sweep-' + Date.now(),
      'المسح الشامل للذكاء المتعدد',
      'Multi-Agent Global Sweep',
      nodes,
      (state) => setActiveWorkflow(state)
    );

    try {
      const finalResults = await orchestrator.execute(nodes, strategy.investmentThesis);
      
      const formatted: Domain[] = finalResults.map((r: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: r.name,
        price: r.estimatedPrice || 250,
        status: 'available',
        contentStatus: 'none',
        lastChecked: new Date().toISOString(),
        sector: r.sector || r.name.split('.')[0],
        justification: r.justification,
        agentThoughts: sessionThoughts, // حقن سجل الحوار في كل أصل مكتشف
        probability: r.probability || 0.85,
        technicalMetrics: { liquidityScore: Math.round((r.probability || 0.85) * 100) }
      }));
      
      setDomains(prev => [...formatted, ...prev]);
      addLog('Master Brain', lang === 'ar' ? `اكتملت المناظرة. تم إقرار ${formatted.length} أصل استراتيجي.` : `Debate complete. Approved ${formatted.length} strategic assets.`, 'success');
    } catch (e: any) {
      addLog('System', `Multi-Agent Failure: ${e.message}`, 'critical');
    } finally {
      setIsScanning(false);
      setTimeout(() => setActiveWorkflow(null), 5000);
    }
  }, [strategy, lang, setDomains, addLog, sessionThoughts]);

  return { isScanning, initiateScan, activeWorkflow };
};
