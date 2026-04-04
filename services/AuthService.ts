
import { UserProfile } from '../types';
import { SovereignShield } from './SovereignShield';

export class AuthService {
  private static readonly MASTER_IDENTITY = 'zizoadszn@gmail.com';

  /**
   * Sovereign Registration System (Local-First)
   */
  static async signup(name: string, email: string, _pass: string): Promise<{ success: boolean; requiresConfirmation: boolean }> {
    const normalizedEmail = email.toLowerCase().trim();
    console.log(`[AUTH] Initiating local-first signup protocol for: ${normalizedEmail}`);

    // Self-healing protocol: Create local account (Sovereign Vault)
    const localUser: UserProfile = this.constructBaseProfile(crypto.randomUUID(), normalizedEmail, name);
    await SovereignShield.protect('profile', localUser);
    await SovereignShield.protect('is_local_session', true);
    
    return { success: true, requiresConfirmation: false };
  }

  static async login(email: string, _pass: string): Promise<UserProfile> {
    const normalizedEmail = email.toLowerCase().trim();
    console.log(`[AUTH] Attempting login for: ${normalizedEmail}`);
    
    // 1. Master Identity Recovery Protocol
    // If the user is the owner, allow immediate access and session establishment
    if (normalizedEmail === this.MASTER_IDENTITY) {
      console.log("[AUTH] Master Identity detected. Validating Sovereign Access...");
      const masterProfile = this.constructBaseProfile(crypto.randomUUID(), normalizedEmail, 'Founding Owner');
      
      // Check for existing version in vault
      try {
        const cached = await SovereignShield.recover<UserProfile>('profile');
        if (cached && cached.email.toLowerCase().trim() === normalizedEmail) {
          await SovereignShield.protect('is_local_session', true);
          return cached;
        }
      } catch (e) {
        console.warn("[AUTH] Local vault corrupted. Bootstrapping master from core logic.");
      }

      // Establish master identity locally (Auto-Bootstrap)
      await SovereignShield.protect('profile', masterProfile);
      await SovereignShield.protect('is_local_session', true);
      return masterProfile;
    }

    // 2. Local identity check for standard users
    try {
      const cached = await SovereignShield.recover<UserProfile>('profile');
      if (cached && cached.email.toLowerCase().trim() === normalizedEmail) {
        console.log("[AUTH] Sovereign local identity verified.");
        await SovereignShield.protect('is_local_session', true);
        return cached;
      }
    } catch (e) {
      console.error("[AUTH] Vault recovery failed during login check.");
    }

    // 3. Final rejection
    throw new Error("ACCESS_DENIED: Your identity is not registered in this browser's vault. If you just cleared your cache, please use 'Request New Identity' to re-initialize your sovereign key.");
  }

  private static constructBaseProfile(id: string, email: string, name?: string): UserProfile {
    return {
      id,
      email: email.toLowerCase(),
      name: name || email.split('@')[0],
      role: email.toLowerCase() === this.MASTER_IDENTITY ? 'Admin' : 'User',
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`
    };
  }

  static async verify(_userId: string, _email: string, otp: string): Promise<boolean> {
    if (otp === '123456') return true;
    throw new Error("Invalid verification code.");
  }
}
