
import { supabase } from './SupabaseClient';
import { UserProfile } from '../types';

export class AuthService {
  private static BOOTSTRAP_OWNER = 'azeddinebeldjilali9@gmail.com';
  
  static async signup(name: string, email: string, pass: string): Promise<{ user?: UserProfile; needsConfirmation: boolean }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { display_name: name } }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create identity.");

      const role = (email.toLowerCase() === this.BOOTSTRAP_OWNER.toLowerCase()) ? 'Admin' : 'Executive';
      
      // Attempt to create profile
      await supabase.from('profiles').upsert([{
        id: authData.user.id,
        name: name,
        email: email,
        role: role,
        subscription_tier: 'Free',
        usage_stats: { scansThisMonth: 0, auditsThisMonth: 0 },
        created_at: new Date().toISOString()
      }]);

      const needsConfirmation = !authData.session && !authData.user.email_confirmed_at;

      return { 
        needsConfirmation,
        user: {
          id: authData.user.id,
          name,
          email,
          role: role as any,
          subscriptionTier: 'Free',
          usageStats: { scansThisMonth: 0, auditsThisMonth: 0 },
          preferences: { emailAlerts: true, sniperNotifications: true, reportReadiness: true },
          createdAt: authData.user.created_at,
          isSyncEnabled: true,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
        }
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async login(email: string, pass: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        // Provide more granular error feedback
        if (error.message.includes('Email not confirmed')) {
          throw new Error("IDENTITY_NOT_VERIFIED: Please check your email for the confirmation link.");
        }
        throw error;
      }

      // Profile Recovery Logic: If auth succeeds but profile is missing
      let { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (!profileData) {
        const fallbackRole = (email.toLowerCase() === this.BOOTSTRAP_OWNER.toLowerCase() ? 'Admin' : 'Executive');
        const newProfile = {
          id: data.user.id,
          name: data.user.user_metadata?.display_name || 'Sovereign User',
          email: email,
          role: fallbackRole,
          subscription_tier: 'Free',
          usage_stats: { scansThisMonth: 0, auditsThisMonth: 0 },
          created_at: new Date().toISOString()
        };
        await supabase.from('profiles').insert([newProfile]);
        profileData = newProfile;
      }

      return {
        id: data.user.id,
        email: data.user.email || '',
        name: profileData.name,
        role: profileData.role as any,
        subscriptionTier: profileData.subscription_tier as any,
        usageStats: profileData.usage_stats || { scansThisMonth: 0, auditsThisMonth: 0 },
        preferences: profileData.preferences || { emailAlerts: true, sniperNotifications: true, reportReadiness: true },
        createdAt: data.user.created_at,
        isSyncEnabled: true,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.id}`
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) throw error;
  }
}
