
/**
 * Isthmic Pro - Sovereign Identity Bridge v4
 * Handles Local Auth, Google OAuth, and Simulated Recovery.
 */
import { persistence } from './DataService';
import { UserProfile } from '../types';

export class AuthService {
  static async signup(name: string, email: string, password: string): Promise<UserProfile> {
    const profiles = await persistence.loadAll('profiles');
    if (profiles.find(p => p.email === email)) {
      throw new Error("Email already registered in local vault.");
    }

    const newProfile: UserProfile = {
      id: crypto.randomUUID(),
      name,
      email,
      password, // في تطبيق حقيقي يتم التشفير هنا
      role: 'Executive',
      createdAt: new Date().toISOString(),
      isSyncEnabled: true,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
    };

    await persistence.save('profiles', newProfile);
    return newProfile;
  }

  static async login(email: string, password: string): Promise<UserProfile> {
    const profiles = await persistence.loadAll('profiles') as UserProfile[];
    const user = profiles.find(p => p.email === email && p.password === password);
    if (!user) {
      throw new Error("Invalid credentials or user not found.");
    }
    return user;
  }

  static async signInWithGoogle(): Promise<{ email: string, name: string, sub: string, picture: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          email: "investor@elite.com",
          name: "Sovereign Investor",
          sub: "google_777888999",
          picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isthmic"
        });
      }, 1200);
    });
  }

  static async sendRecoveryCode(email: string): Promise<string> {
    // محاكاة إرسال بريد
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SOVEREIGN_DEBUG] Recovery code for ${email}: ${code}`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(code), 2000);
    });
  }

  static async updatePassword(email: string, newPassword: string): Promise<boolean> {
    const profiles = await persistence.loadAll('profiles') as UserProfile[];
    const user = profiles.find(p => p.email === email);
    if (user) {
      user.password = newPassword;
      await persistence.save('profiles', user);
      return true;
    }
    return false;
  }
}
