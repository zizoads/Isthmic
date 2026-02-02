
import { supabase } from './SupabaseClient';
import { UserProfile } from '../types';

export class AuthService {
  private static readonly ROOT_ADMIN_IDENTITY = 'azeddinebeldjilali9@gmail.com';
  private static readonly DEFAULT_PREFS = { 
    emailAlerts: true, 
    sniperNotifications: true, 
    reportReadiness: true,
    tourCompleted: false 
  };
  
  /**
   * Phase 1: Identity Registration
   * Creates the auth record and generates a 6-digit verification code.
   * Handles re-generation for existing unconfirmed identities.
   */
  static async signup(name: string, email: string, pass: string): Promise<{ success: boolean, codeSent: boolean }> {
    try {
      // 1. Attempt to create account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { display_name: name } }
      });

      let userId = authData.user?.id;

      if (authError) {
        // If user already exists, we check if we can still help them verify
        if (authError.message.toLowerCase().includes("already registered")) {
          // We don't have the UUID here easily without a successful call, 
          // but we can proceed with simulation since we have the email.
          // Note: In a production env, you'd trigger a real 'resend' via Supabase.
        } else if (authError.status === 429 || authError.message.toLowerCase().includes("rate limit")) {
          throw new Error("SYSTEM_COOLDOWN: The infrastructure is currently processing high traffic. Please pause for 5 minutes before re-initiating.");
        } else {
          throw authError;
        }
      }

      // 2. Generate 6-Digit OTP
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // 3. Securely store for the session
      sessionStorage.setItem(`verify_${email}`, JSON.stringify({
        code: verificationCode,
        userId: userId, // Might be undefined if existing, handled in verify
        expiry: Date.now() + (15 * 60 * 1000), // 15 mins
        name,
        pass
      }));

      // 4. Simulated Dispatch
      console.log(`%c[SOVEREIGN_DISPATCH] Verification sequence for ${email}: ${verificationCode}`, "color: #d4af37; font-weight: bold; font-size: 14px;");

      return { success: true, codeSent: true };
    } catch (error: any) {
      console.error("SIGNUP_PHASE1_ERR:", error.message);
      throw error;
    }
  }

  /**
   * Phase 2: Identity Activation
   */
  static async verifyEmailCode(email: string, code: string): Promise<boolean> {
    try {
      const stored = sessionStorage.getItem(`verify_${email}`);
      if (!stored) throw new Error("VERIFICATION_EXPIRED: The session sequence has timed out. Please re-initiate signup.");

      const { code: savedCode, expiry, name, userId, pass } = JSON.parse(stored);

      if (Date.now() > expiry) {
        sessionStorage.removeItem(`verify_${email}`);
        throw new Error("VERIFICATION_EXPIRED: The code is no longer valid.");
      }

      if (code !== savedCode) {
        throw new Error("INVALID_CODE: The entered sequence does not match our records.");
      }

      // If we didn't have a userId (due to 'already registered' error during signup),
      // we attempt a quick login to get it, or use the email to find the profile.
      let finalUserId = userId;
      if (!finalUserId) {
        const { data: signInData } = await supabase.auth.signInWithPassword({ email, password: pass });
        finalUserId = signInData.user?.id;
      }

      if (finalUserId) {
        const isRoot = email.toLowerCase() === this.ROOT_ADMIN_IDENTITY.toLowerCase();
        await supabase.from('profiles').upsert([{
          id: finalUserId,
          name: name,
          email: email,
          role: isRoot ? 'Admin' : 'Analyst',
          subscription_tier: isRoot ? 'Sovereign' : 'Free',
          usage_stats: { scansThisMonth: 0, auditsThisMonth: 0 },
          created_at: new Date().toISOString()
        }]);
      }

      sessionStorage.removeItem(`verify_${email}`);
      return true;
    } catch (error: any) {
      console.error("VERIFICATION_PHASE2_ERR:", error.message);
      throw error;
    }
  }

  static async login(email: string, pass: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      
      if (error) {
        const msg = error.message.toLowerCase();
        
        if (msg.includes("email not confirmed")) {
           // Check if a profile exists (meaning they already verified via OTP)
           const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .maybeSingle();

           if (profileData) {
              const isRoot = email.toLowerCase() === this.ROOT_ADMIN_IDENTITY.toLowerCase();
              return {
                id: profileData.id,
                email: email,
                name: profileData.name,
                role: profileData.role || (isRoot ? 'Admin' : 'Analyst'),
                subscriptionTier: profileData.subscription_tier || (isRoot ? 'Sovereign' : 'Free'),
                usageStats: profileData.usage_stats || { scansThisMonth: 0, auditsThisMonth: 0 },
                preferences: profileData.preferences || this.DEFAULT_PREFS,
                createdAt: profileData.created_at,
                emailConfirmedAt: new Date().toISOString(),
                isSyncEnabled: true,
                avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${profileData.id}`
              };
           }
           // Throw specific error to allow UI to handle redirect to Step 2
           throw new Error("IDENTITY_PENDING");
        }

        if (msg.includes("invalid login credentials")) {
          throw new Error("ACCESS_DENIED: Credentials unrecognized.");
        }
        throw error;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      const isRoot = (data.user.email || email).toLowerCase() === this.ROOT_ADMIN_IDENTITY.toLowerCase();

      return {
        id: data.user.id,
        email: data.user.email || '',
        name: profileData?.name || (isRoot ? "Sovereign Root" : "Sovereign User"),
        role: profileData?.role || (isRoot ? 'Admin' : 'Analyst'),
        subscriptionTier: profileData?.subscription_tier || (isRoot ? 'Sovereign' : 'Free'),
        usageStats: profileData?.usage_stats || { scansThisMonth: 0, auditsThisMonth: 0 },
        preferences: profileData?.preferences || this.DEFAULT_PREFS,
        createdAt: profileData?.created_at || data.user.created_at,
        emailConfirmedAt: data.user.email_confirmed_at,
        isSyncEnabled: true,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.id}`
      };
    } catch (error: any) {
      console.error("LOGIN_ERR:", error.message);
      throw error;
    }
  }
}
