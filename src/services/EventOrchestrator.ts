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
  private constructor() {
    this.brandGenerator = ProfessionalBrandGenerator.getInstance();
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
    SignalMonitorService.subscribeToSignals((signals) => {
      const latestSignal = signals[0];
      if (latestSignal) {
        this.handleIntelligenceSignal(latestSignal).catch(e => console.error('Error in handleIntelligenceSignal:', e));
      }
    });

    // Note: In a real server environment, we'd use firebase-admin for better performance
    // but for this applet, the standard SDK works fine.
    onSnapshot(domainsRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const domain = { id: change.doc.id, ...change.doc.data() } as Domain;

        if (change.type === 'added' && domain.status === 'processing') {
          this.handleNewDomain(domain).catch(e => console.error('Error in handleNewDomain:', e));
        } else if (change.type === 'modified') {
          this.handleStatusChange(domain).catch(e => console.error('Error in handleStatusChange:', e));
        }
      });
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, 'domains');
      } catch {
        // Error is logged by handleFirestoreError
      }
    });
  }

  private handleNewDomain(domain: Domain): Promise<void> {
    return new Promise((resolve) => {
      // Simulate Background Audit Work
      setTimeout(async () => {
        try {
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
            try {
              handleFirestoreError(error, OperationType.UPDATE, `domains/${domain.id}`);
            } catch {
              // Error is already logged by handleFirestoreError, prevent unhandled rejection
            }
          }
        } catch (e) {
          console.error('Error in handleNewDomain setTimeout:', e);
        }
        resolve();
      }, 3000);
    });
  }

  private async handleStatusChange(domain: Domain) {
    // If domain is marked as 'purchased', trigger Brand DNA generation automatically
    if (domain.status === 'purchased' && !domain.brandAssets) {
      
      try {
        // Use the brand generator to get real names/taglines
        const names = await this.brandGenerator.generate_for_niche('ai', 'general_ai', 1);
        
        setTimeout(async () => {
          try {
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
              try {
                handleFirestoreError(error, OperationType.UPDATE, `domains/${domain.id}`);
              } catch {
                // Prevent unhandled rejection
              }
            }
          } catch (e) {
            console.error('Error in handleStatusChange setTimeout:', e);
          }
        }, 5000);
      } catch {
        // Ignore error
      }
    }
  }

  private async handleIntelligenceSignal(signal: IntelligenceSignal) {
    
    if (signal.priority === 'CRITICAL' || signal.priority === 'HIGH') {
      // Example: If signal is about AI sector, boost all .ai domains
      if (signal.metadata?.sector === 'AI') {
        const domainsRef = collection(db, 'domains');
        const domainsQuery = query(domainsRef, where('name', '>=', ''), where('name', '<=', '\uffff')); // Simple scan
        try {
          const snapshot = await getDocs(domainsQuery);
          
          snapshot.docs.forEach(async (domainDoc) => {
            const domain = domainDoc.data() as Domain;
            if (domain.name.endsWith('.ai')) {
              try {
                await updateDoc(doc(db, 'domains', domainDoc.id), {
                  probability: Math.min((domain.probability || 0) + 15, 99),
                  justification: `${domain.justification || ''} [SIGNAL BOOST: ${signal.title}]`
                });
              } catch (error) {
                try {
                  handleFirestoreError(error, OperationType.UPDATE, `domains/${domainDoc.id}`);
                } catch {
                  // Prevent unhandled rejection
                }
              }
            }
          });
        } catch (error) {
          try {
            handleFirestoreError(error, OperationType.LIST, 'domains');
          } catch {
            // Prevent unhandled rejection
          }
        }
      }
    }
  }
}
