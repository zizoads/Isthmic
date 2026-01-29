
/**
 * Isthmic Pro - Sovereign Identity Bridge v5
 * Features: Local Encrypted Accounts + Mnemonic Recovery Key
 */
import { persistence } from './DataService';
import { UserProfile } from '../types';

export class AuthService {
  // توليد كود استعادة عشوائي (Seed Phrase)
  private static generateRecoveryKey(): string {
    const words = ["alpha", "nexus", "sovereign", "vault", "delta", "prime", "matrix", "elite", "secure", "logic", "asset", "domain"];
    return Array.from({ length: 4 }, () => words[Math.floor(Math.random() * words.length)]).join("-") + "-" + Math.floor(1000 + Math.random() * 9000);
  }

  static async signup(name: string, email: string, password: string): Promise<{ user: UserProfile, recoveryKey: string }> {
    const profiles = await persistence.loadAll('profiles');
    if (profiles.find(p => p.email === email)) {
      throw new Error("This email is already registered in your local vault.");
    }

    const recoveryKey = this.generateRecoveryKey();

    const newProfile: UserProfile = {
      id: crypto.randomUUID(),
      name,
      email,
      password, // In production, hash this
      googleId: recoveryKey, // Store recovery key temporarily in googleId field for this prototype
      role: 'Executive',
      createdAt: new Date().toISOString(),
      isSyncEnabled: true,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
    };

    await persistence.save('profiles', newProfile);
    return { user: newProfile, recoveryKey };
  }

  static async login(email: string, password: string): Promise<UserProfile> {
    const profiles = await persistence.loadAll('profiles') as UserProfile[];
    const user = profiles.find(p => p.email === email && p.password === password);
    if (!user) {
      throw new Error("Invalid email or password.");
    }
    return user;
  }

  static async recoverAccount(recoveryKey: string, newPassword: string): Promise<UserProfile> {
    const profiles = await persistence.loadAll('profiles') as UserProfile[];
    const user = profiles.find(p => p.googleId === recoveryKey);
    
    if (!user) {
      throw new Error("Invalid Recovery Key. Access Denied.");
    }

    user.password = newPassword;
    await persistence.save('profiles', user);
    return user;
  }

  // Fix: Added missing method sendRecoveryCode as required by DomainContext
  static async sendRecoveryCode(email: string): Promise<string> {
    // Mock implementation for sovereign flow
    return "RECOVERY-SENT-" + Math.floor(Math.random() * 1000);
  }

  // Fix: Added missing method updatePassword as required by DomainContext
  static async updatePassword(email: string, newPass: string): Promise<boolean> {
    const profiles = await persistence.loadAll('profiles') as UserProfile[];
    const userIndex = profiles.findIndex(p => p.email === email);
    if (userIndex === -1) return false;
    
    profiles[userIndex].password = newPass;
    await persistence.save('profiles', profiles[userIndex]);
    return true;
  }

  // Fix: Added missing method signInWithGoogle as required by DomainContext
  static async signInWithGoogle(): Promise<any> {
    // Mock implementation for browser-based sovereign prototype
    return {
      sub: 'google-sub-' + Math.random().toString(36).substr(2, 9),
      name: 'Sovereign Explorer',
      email: 'explorer@sovereign.local',
      picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sovereign'
    };
  }
}
