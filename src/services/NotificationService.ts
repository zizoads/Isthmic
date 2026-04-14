
import { SovereignShield } from './SovereignShield';

export const NotificationService = {
  /**
   * Log tactical email dispatch.
   * Stored in local vault for reporting and auditing.
   */
  async sendTransactionalEmail(email: string, type: string, payload: unknown) {
    const logEntry = {
      id: Math.random().toString(36).substr(2, 9),
      recipient_email: email,
      subject: type,
      body: typeof payload === 'object' ? JSON.stringify(payload, null, 2) : String(payload),
      sent_at: new Date().toISOString()
    };

    console.log(`%c[MAIL_DISPATCH] 📨 ${type} -> ${email}`, "color: #d4af37; font-weight: bold;", payload);
    
    try {
      const logs = await SovereignShield.recover<unknown[]>('email_logs') || [];
      await SovereignShield.protect('email_logs', [logEntry, ...logs].slice(0, 50));
    } catch {
      console.warn("Mail Log deferred.");
    }

    return true;
  },

  async updatePreferences(userId: string, prefs: unknown) {
    try {
      await SovereignShield.protect(`user_prefs_${userId}`, prefs);
      return true;
    } catch {
      console.warn("Preference sync deferred due to shield error.");
      return false;
    }
  }
};
