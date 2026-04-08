import { onSnapshot, collection, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { Domain } from '../types';
import { ProfessionalBrandGenerator } from '../server/services/ProfessionalBrandGenerator';
import { SignalMonitorService, IntelligenceSignal } from './SignalMonitorService';

/**
 * Sovereign Event Orchestrator (Server-Side)
 * This service monitors Firestore changes and triggers background agent tasks.
 */
export class EventOrchestrator {
  private static instance: EventOrchestrator;
  private brandGenerator: ProfessionalBrandGenerator;
  private signalService: SignalMonitorService;

  private constructor() {
    this.brandGenerator = ProfessionalBrandGenerator.getInstance();
    this.signalService = SignalMonitorService.getInstance();
  }

  public static getInstance(): EventOrchestrator {
    if (!EventOrchestrator.instance) {
      EventOrchestrator.instance = new EventOrchestrator();
    }
    return EventOrchestrator.instance;
  }

  public async start() {
    
    // Initialize brand generator
    await this.brandGenerator.init();

    // Monitor ALL domains for automatic audit (Server has global view)
    const domainsRef = collection(db, 'domains');
    
    // Monitor Intelligence Signals (IRONSIGHT Protocol)
    this.signalService.subscribeToSignals((signals) => {
      const latestSignal = signals[0];
      if (latestSignal) {
        this.handleIntelligenceSignal(latestSignal);
      }
    });

    // Note: In a real server environment, we'd use firebase-admin for better performance
    // but for this applet, the standard SDK works fine.
    onSnapshot(domainsRef, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const domain = { id: change.doc.id, ...change.doc.data() } as Domain;

        if (change.type === 'added' && domain.status === 'processing') {
          this.handleNewDomain(domain);
        } else if (change.type === 'modified') {
          this.handleStatusChange(domain);
        }
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'domains');
    });
  }

  private async handleNewDomain(domain: Domain) {
    
    // Simulate Background Audit Work
    setTimeout(async () => {
      const mockMetrics = {
        da: Math.floor(Math.random() * 40) + 10,
        pa: Math.floor(Math.random() * 30) + 5,
        liquidityScore: Math.floor(Math.random() * 100),
        trademarkRisk: Math.random() > 0.8 ? 'High' : 'Low'
      };

      try {
        await updateDoc(doc(db, 'domains', domain.id), {
          status: 'available',
          technicalMetrics: mockMetrics,
          integrityScore: Math.floor(Math.random() * 100),
          lastChecked: new Date().toISOString()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `domains/${domain.id}`);
      }
      
    }, 3000);
  }

  private async handleStatusChange(domain: Domain) {
    // If domain is marked as 'purchased', trigger Brand DNA generation automatically
    if (domain.status === 'purchased' && !domain.brandAssets) {
      
      try {
        // Use the brand generator to get real names/taglines
        const names = await this.brandGenerator.generate_for_niche('ai', 'general_ai', 1);
        
        setTimeout(async () => {
          const brandAssets = {
            tagline: names[0] || "The Future of Digital Sovereignty",
            logoUrl: `https://picsum.photos/seed/${domain.name}/200/200`,
            colors: ['#F27D26', '#050505', '#FFFFFF']
          };

          try {
            await updateDoc(doc(db, 'domains', domain.id), {
              brandAssets,
              lastChecked: new Date().toISOString()
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, `domains/${domain.id}`);
          }
          
        }, 5000);
      } catch (error) {
      }
    }
  }

  private async handleIntelligenceSignal(signal: IntelligenceSignal) {
    
    if (signal.priority === 'CRITICAL' || signal.priority === 'HIGH') {
      // Example: If signal is about AI sector, boost all .ai domains
      if (signal.metadata?.sector === 'AI') {
        const domainsRef = collection(db, 'domains');
        const q = query(domainsRef, where('name', '>=', ''), where('name', '<=', '\uffff')); // Simple scan
        try {
          const snapshot = await getDocs(q);
          
          snapshot.docs.forEach(async (domainDoc) => {
            const domain = domainDoc.data() as Domain;
            if (domain.name.endsWith('.ai')) {
              try {
                await updateDoc(doc(db, 'domains', domainDoc.id), {
                  probability: Math.min((domain.probability || 0) + 15, 99),
                  justification: `${domain.justification || ''} [SIGNAL BOOST: ${signal.title}]`
                });
              } catch (error) {
                handleFirestoreError(error, OperationType.UPDATE, `domains/${domainDoc.id}`);
              }
            }
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.LIST, 'domains');
        }
      }
    }
  }
}
