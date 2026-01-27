
import { useState, useCallback } from 'react';
import { Domain, PlatformStrategy } from '../types';
import { rigorousDiscoveryAI } from '../services/geminiService';
import { useDomainContext } from '../context/DomainContext';

export const useMasterBrain = (
  strategy: PlatformStrategy, 
  lang: 'ar' | 'en'
) => {
  const { setDomains, addLog } = useDomainContext();
  const [isScanning, setIsScanning] = useState(false);

  const initiateScan = useCallback(async () => {
    if (!strategy.investmentThesis) {
      addLog('Master Brain', lang === 'ar' ? 'يرجى تحديد بوصلة القائد أولاً.' : 'Please define Commander Intent first.', 'warning');
      return;
    }
    
    setIsScanning(true);
    addLog('Master Brain', lang === 'ar' ? 'بدء عملية المسح والتحليل الشامل...' : 'Initiating global sweep and analysis...', 'info');
    
    try {
      const discoveries = await rigorousDiscoveryAI(strategy.investmentThesis, lang);
      const formatted: Domain[] = discoveries.map((r: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: r.name,
        price: r.estimatedPrice || 0,
        status: 'available',
        contentStatus: 'none',
        lastChecked: new Date().toISOString(),
        sector: r.name.split('.')[0],
        justification: r.justification,
        probability: r.probability || 0.5,
        technicalMetrics: { liquidityScore: Math.round((r.probability || 0.5) * 100) }
      }));
      
      setDomains(prev => [...formatted, ...prev]);
      addLog('Master Brain', lang === 'ar' ? `اكتمل المسح. تم العثور على ${formatted.length} أصل جديد.` : `Sweep complete. Injected ${formatted.length} new assets.`, 'success');
    } catch (e) {
      addLog('System', 'Global Scan Failed', 'critical');
    } finally {
      setIsScanning(false);
    }
  }, [strategy, lang, setDomains, addLog]);

  return { isScanning, initiateScan };
};
