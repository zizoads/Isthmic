
import { SovereignShield } from './SovereignShield';

export class NotificationService {
  /**
   * Log tactical email dispatch.
   * Stored in local vault for reporting and auditing.
   */
  static async sendTransactionalEmail(email: string, type: string, payload: any) {
    const logEntry = {
      id: Math.random().toString(36).substr(2, 9),
      recipient_email: email,
      subject: type,
      body: typeof payload === 'object' ? JSON.stringify(payload, null, 2) : String(payload),
      sent_at: new Date().toISOString()
    };

    console.log(`%c[MAIL_DISPATCH] 📨 ${type} -> ${email}`, "color: #d4af37; font-weight: bold;", payload);
    
    try {
      const logs = await SovereignShield.recover<any[]>('email_logs') || [];
      await SovereignShield.protect('email_logs', [logEntry, ...logs].slice(0, 50));
    } catch (e) {
      console.warn("Mail Log deferred.");
    }

    return true;
  }

  static async updatePreferences(userId: string, prefs: any) {
    try {
      await SovereignShield.protect(`prefs_${userId}`, prefs);
    } catch (e) {
      console.warn("Preference sync deferred.");
    }
    return true;
  }
}
