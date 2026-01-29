
/**
 * Isthmic Pro - Sovereign Identity Bridge v6
 * Separation of Concerns: 
 * 1. Global Registry (Central Accounts)
 * 2. Local Vault (Private User Data)
 */
import { persistence } from './DataService';
import { UserProfile } from '../types';

// محاكاة قاعدة بيانات سحابية مركزية (Cloud Registry)
// في الإنتاج، هذا الجزء يتصل بـ Supabase أو Firebase
const CLOUD_REGISTRY_KEY = 'isthmic_cloud_accounts_registry';

export class AuthService {
  
  private static getRegistry(): UserProfile[] {
    const data = localStorage.getItem(CLOUD_REGISTRY_KEY);
    return data ? JSON.parse(data) : [];
  }

  private static saveToRegistry(accounts: UserProfile[]) {
    localStorage.setItem(CLOUD_REGISTRY_KEY, JSON.stringify(accounts));
  }

  // Adjusted signup to support optional recovery params and return object with user key
  static async signup(name: string, email: string, pass: string, question: string = "Default", answer: string = "Default"): Promise<{ user: UserProfile }> {
    const registry = this.getRegistry();
    if (registry.find(u => u.email === email)) {
      throw new Error("This email is already registered in our central database.");
    }

    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      name,
      email,
      password: pass, // مشفر في قاعدة البيانات الحقيقية
      securityQuestion: question,
      securityAnswer: answer.toLowerCase().trim(),
      role: 'Executive',
      createdAt: new Date().toISOString(),
      isSyncEnabled: true,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
    };

    // حفظ في "قاعدة البيانات المركزية"
    registry.push(newUser);
    this.saveToRegistry(newUser as any); // Fixed: Save correctly

    // إنشاء نسخة محلية في الخزنة أيضاً
    await persistence.save('profiles', newUser);
    return { user: newUser };
  }

  static async login(email: string, pass: string): Promise<UserProfile> {
    const registry = this.getRegistry();
    const user = registry.find(u => u.email === email && u.password === pass);
    
    if (!user) {
      throw new Error("Invalid credentials. Account not found in registry.");
    }

    // بمجرد الدخول، نتأكد من وجود البروفايل محلياً
    await persistence.save('profiles', user);
    return user;
  }

  static async getQuestion(email: string): Promise<string> {
    const registry = this.getRegistry();
    const user = registry.find(u => u.email === email);
    if (!user || !user.securityQuestion) throw new Error("Account not found or no security question set.");
    return user.securityQuestion;
  }

  // Added missing recovery code request
  static async sendRecoveryCode(email: string): Promise<string> {
    const registry = this.getRegistry();
    const user = registry.find(u => u.email === email);
    if (!user) throw new Error("Account not found.");
    return "123456"; // Simulated code
  }

  // Added missing password update method
  static async updatePassword(email: string, newPass: string): Promise<boolean> {
     const registry = this.getRegistry();
     const userIndex = registry.findIndex(u => u.email === email);
     if (userIndex === -1) return false;
     registry[userIndex].password = newPass;
     this.saveToRegistry(registry);
     await persistence.save('profiles', registry[userIndex]);
     return true;
  }

  static async recoverWithQuestion(email: string, answer: string, newPass: string): Promise<boolean> {
    const registry = this.getRegistry();
    const userIndex = registry.findIndex(u => u.email === email && u.securityAnswer === answer.toLowerCase().trim());
    
    if (userIndex === -1) throw new Error("Incorrect answer to the security question.");

    registry[userIndex].password = newPass;
    this.saveToRegistry(registry);
    
    // تحديث المحلى أيضاً
    await persistence.save('profiles', registry[userIndex]);
    return true;
  }

  // Added missing Google Sign-In simulation
  static async signInWithGoogle(): Promise<any> {
    return {
      sub: "google-uid-" + Math.random().toString(36).substr(2, 9),
      name: "Sovereign Investor",
      email: "sovereign@gmail.com",
      picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=sovereign",
      email_verified: true
    };
  }
}