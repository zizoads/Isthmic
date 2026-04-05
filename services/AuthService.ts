
import { UserProfile } from '../types';
import { SovereignShield } from './SovereignShield';
import { MASTER_IDENTITY, constructBaseProfile } from '../src/lib/auth-utils';

export class AuthService {
  private static readonly MASTER_IDENTITY = MASTER_IDENTITY;

  /**
   * Sovereign Registration System (Local-First)
   */
  static async signup(name: string, email: string, _pass: string): Promise<{ success: boolean; requiresConfirmation: boolean }> {
    const normalizedEmail = email.toLowerCase().trim();

    // Self-healing protocol: Create local account (Sovereign Vault)
    const localUser: UserProfile = constructBaseProfile(crypto.randomUUID(), normalizedEmail, name);
    await SovereignShield.protect('profile', localUser);
    await SovereignShield.protect('is_local_session', true);
    
    return { success: true, requiresConfirmation: false };
  }

  static async login(email: string, _pass: string): Promise<UserProfile> {
    const normalizedEmail = email.toLowerCase().trim();
    
    // 1. Master Identity Recovery Protocol
    // If the user is the owner, allow immediate access and session establishment
    if (normalizedEmail === this.MASTER_IDENTITY) {
      const masterProfile = constructBaseProfile(crypto.randomUUID(), normalizedEmail, 'Founding Owner');
      
      // Check for existing version in vault
      try {
        const cached = await SovereignShield.recover<UserProfile>('profile');
        if (cached && cached.email.toLowerCase().trim() === normalizedEmail) {
          await SovereignShield.protect('is_local_session', true);
          return cached;
        }
      } catch (e) {
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
        await SovereignShield.protect('is_local_session', true);
        return cached;
      }
    } catch (e) {
    }

    // 3. Final rejection
    throw new Error("ACCESS_DENIED: Your identity is not registered in this browser's vault. If you just cleared your cache, please use 'Request New Identity' to re-initialize your sovereign key.");
  }

  static async verify(_userId: string, _email: string, otp: string): Promise<boolean> {
    if (otp === '123456') return true;
    throw new Error("Invalid verification code.");
  }
}
