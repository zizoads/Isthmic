/**
 * Isthmic Pro - Sovereign Shield v2.0
 * يتم الآن تضمين "بصمة النزاهة" (Integrity Fingerprint) لمنع التلاعب الخارجي بالبيانات المخزنة.
 */

export class SovereignShield {
  private static readonly SECRET_SALT = 'ISTHMIC_PRO_SOVEREIGN_2025_ALGO_V2';

  /**
   * حساب بصمة النزاهة (Simple Adler-32 implementation for speed)
   */
  private static generateFingerprint(str: string): string {
    let a = 1, b = 0;
    for (let i = 0; i < str.length; i++) {
        a = (a + str.charCodeAt(i)) % 65521;
        b = (b + a) % 65521;
    }
    return (b << 16 | a).toString(16);
  }

  static protect(key: string, data: any): void {
    try {
      const jsonString = JSON.stringify(data);
      const fingerprint = this.generateFingerprint(jsonString);
      
      // تغليف البيانات مع بصمتها قبل التشفير
      const payload = JSON.stringify({ d: jsonString, f: fingerprint });
      const encoded = btoa(this.xorCipher(payload, this.SECRET_SALT));
      
      localStorage.setItem(`shield_${key}`, encoded);
    } catch (e) {
      console.error("SHIELD_CRITICAL_ERR: Storage isolation failed.", e);
    }
  }

  static recover<T>(key: string): T | null {
    try {
      const protectedData = localStorage.getItem(`shield_${key}`);
      if (!protectedData) return null;
      
      const decoded = atob(protectedData);
      const decrypted = this.xorCipher(decoded, this.SECRET_SALT);
      const payload = JSON.parse(decrypted);
      
      // التحقق من سلامة البصمة
      const currentFingerprint = this.generateFingerprint(payload.d);
      if (currentFingerprint !== payload.f) {
        console.error("SHIELD_SECURITY_BREACH: Local data signature mismatch. Access Denied.");
        return null;
      }

      return JSON.parse(payload.d) as T;
    } catch (e) {
      return null;
    }
  }

  static purge(key: string): void {
    localStorage.removeItem(`shield_${key}`);
  }

  private static xorCipher(text: string, key: string): string {
    return text.split('').map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('');
  }
}
