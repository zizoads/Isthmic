
/**
 * Isthmic Pro - Sovereign Data Strategy
 * Hybrid system: Local storage for speed, Firebase sync for privacy and security.
 */
import { SovereignShield } from './SovereignShield';

export const persistence = {
  async init() {
    // Initial setup if needed
  },

  async save(table: string, data: any) {
    try {
      const current = await SovereignShield.recover<any[]>(table) || [];
      const next = Array.isArray(data) ? data : [data, ...current.filter(i => i.id !== data.id)];
      await SovereignShield.protect(table, next);
    } catch (error) {
      console.error(`Error saving to ${table}:`, error);
    }
  },

  async loadAll(table: string) {
    try {
      const data = await SovereignShield.recover<any[]>(table);
      return data || [];
    } catch (error) {
      console.error(`Error loading from ${table}:`, error);
      return [];
    }
  },

  async delete(table: string, id: string) {
    try {
      const current = await SovereignShield.recover<any[]>(table) || [];
      const next = current.filter(i => i.id !== id);
      await SovereignShield.protect(table, next);
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
    }
  },

  async exportBackup(profileId: string): Promise<string> {
    const domains = await SovereignShield.recover<any[]>('domains') || [];
    return JSON.stringify({
      profileId,
      timestamp: new Date().toISOString(),
      domains
    });
  }
};
