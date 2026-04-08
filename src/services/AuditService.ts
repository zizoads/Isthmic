
import { SovereignShield } from './SovereignShield';
import { AuditLogEntry } from '../types';

export class AuditService {
  static async logAction(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    try {
      const logs = await SovereignShield.recover<AuditLogEntry[]>('audit_logs') || [];
      const newEntry: AuditLogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        action: entry.action,
        user: entry.user,
        details: entry.details || {}
      };
      await SovereignShield.protect('audit_logs', [newEntry, ...logs].slice(0, 100));
    } catch (e) {
      console.error("Audit Exception:", e);
    }
  }

  static async fetchLogs(): Promise<AuditLogEntry[]> {
    try {
      const logs = await SovereignShield.recover<AuditLogEntry[]>('audit_logs');
      return logs || [];
    } catch (e) {
      console.error("Audit Fetch Error:", e);
      return [];
    }
  }
}
