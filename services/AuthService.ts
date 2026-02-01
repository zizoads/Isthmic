
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
  
  static async signup(name: string, email: string, pass: string): Promise<{ user?: UserProfile }> {
    try {
      // 1. Create account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { display_name: name } }
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          throw new Error("EMAIL_EXISTS");
        }
        throw authError;
      }
      
      if (!authData.user) throw new Error("IDENTITY_CREATION_FAILED");

      const isRoot = email.toLowerCase() === this.ROOT_ADMIN_IDENTITY.toLowerCase();
      const initialRole = isRoot ? 'Admin' : 'Analyst';
      const initialTier = isRoot ? 'Sovereign' : 'Free';
      
      // 2. Attempt profile generation
      try {
        await supabase.from('profiles').upsert([{
          id: authData.user.id,
          name: name,
          email: email,
          role: initialRole,
          subscription_tier: initialTier,
          usage_stats: { scansThisMonth: 0, auditsThisMonth: 0 },
          created_at: new Date().toISOString()
        }]);
      } catch (e) {
        console.warn("PROFILE_SYNC_NOTICE: Auth established, profile row pending manual sync.");
      }

      return { 
        user: {
          id: authData.user.id,
          name,
          email,
          role: initialRole as any,
          subscriptionTier: initialTier as any,
          usageStats: { scansThisMonth: 0, auditsThisMonth: 0 },
          preferences: this.DEFAULT_PREFS,
          createdAt: authData.user.created_at,
          emailConfirmedAt: authData.user.email_confirmed_at,
          isSyncEnabled: true,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
        }
      };
    } catch (error: any) {
      console.error("SIGNUP_ERR:", error);
      throw error;
    }
  }

  static async login(email: string, pass: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid credentials or account not found in this sovereign scope.");
        }
        // Removed hard block on "Email not confirmed" to allow Grace Period logic in App.tsx
        throw error;
      }

      // Fetch Profile Data
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
      console.error("LOGIN_ERR:", error);
      throw error;
    }
  }
}
