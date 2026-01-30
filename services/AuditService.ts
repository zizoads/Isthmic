
import { supabase } from './SupabaseClient';
import { AuditLogEntry } from '../types';

export class AuditService {
  static async logAction(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    try {
      const { error } = await supabase.from('audit_logs').insert([{
        ...entry,
        timestamp: new Date().toISOString()
      }]);
      if (error) console.error("Audit Log Failure:", error);
    } catch (e) {
      console.error("Audit Service Critical Exception:", e);
    }
  }

  static async fetchLogs(): Promise<AuditLogEntry[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error("Fetch Audit Logs Error:", error);
      return [];
    }
    return data as AuditLogEntry[];
  }
}
