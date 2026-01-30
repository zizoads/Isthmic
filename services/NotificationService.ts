
import { supabase } from './SupabaseClient';

export class NotificationService {
  /**
   * Simulation of an email dispatch. 
   * In a live environment, this would call a Supabase Edge Function connected to Resend/SendGrid.
   */
  static async sendTransactionalEmail(email: string, type: 'GOLDEN_SNIPER' | 'REPORT_READY' | 'SYSTEM_ALERT', payload: any) {
    console.log(`[DISPATCH] Sending ${type} email to ${email}`, payload);
    
    // Log the event in a notifications history table
    await supabase.from('email_logs').insert([{
      recipient: email,
      type,
      status: 'queued',
      payload,
      dispatched_at: new Date().toISOString()
    }]);

    return true;
  }

  static async updatePreferences(userId: string, prefs: any) {
    const { error } = await supabase
      .from('profiles')
      .update({ preferences: prefs })
      .eq('id', userId);
    return !error;
  }
}
