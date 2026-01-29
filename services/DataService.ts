
/**
 * Isthmic Pro - Sovereign Multi-Profile Persistence
 */

const DB_NAME = 'Isthmic_Elite_Vault';
const DB_VERSION = 4; // Upgraded for profiles

const STORES = {
  PROFILES: 'profiles',
  DOMAINS: 'domains',
  STRATEGY: 'strategy',
  INTEGRATIONS: 'integrations'
};

class DataService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        Object.values(STORES).forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  async save(store: string, data: any): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);
      
      if (Array.isArray(data)) {
        // We usually filter arrays by workspaceId before saving,
        // but for indexedDB, we'll put each item to maintain keyPath integrity.
        data.forEach(item => objectStore.put(item));
      } else {
        objectStore.put(data);
      }

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async loadAll(store: string): Promise<any[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(store, 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(store: string, id: string): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(store, 'readwrite');
      transaction.objectStore(store).delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async exportBackup(profileId: string): Promise<string> {
    const domains = (await this.loadAll(STORES.DOMAINS)).filter(d => d.workspaceId === profileId);
    const strategy = (await this.loadAll(STORES.STRATEGY)).find(s => s.id === profileId);
    const integrations = (await this.loadAll(STORES.INTEGRATIONS)).filter(i => i.workspaceId === profileId);
    
    return JSON.stringify({
      version: DB_VERSION,
      profileId,
      timestamp: new Date().toISOString(),
      data: { domains, strategy, integrations }
    });
  }
}

export const persistence = new DataService();
