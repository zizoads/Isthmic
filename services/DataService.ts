
/**
 * Isthmic Pro - Sovereign Data Strategy
 * نظام هجين: تخزين محلي للسرعة، ومزامنة سحابية للخصوصية والأمان.
 */
import { supabase } from './SupabaseClient';

export const persistence = {
  async init() {
    // إعداد أولي إذا لزم الأمر
  },

  async save(table: string, data: any) {
    const { error } = await supabase.from(table).upsert(data);
    if (error) console.error(`Error saving to ${table}:`, error);
  },

  async loadAll(table: string) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error(`Error loading from ${table}:`, error);
      return [];
    }
    return data || [];
  },

  async delete(table: string, id: string) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) console.error(`Error deleting from ${table}:`, error);
  },

  async exportBackup(profileId: string): Promise<string> {
    const { data: domains } = await supabase.from('domains').select('*').eq('workspaceId', profileId);
    return JSON.stringify({
      profileId,
      timestamp: new Date().toISOString(),
      domains
    });
  }
};
