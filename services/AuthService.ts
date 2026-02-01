
import { supabase } from './SupabaseClient';
import { UserProfile } from '../types';

/**
 * AuthService: Sovereign Identity Management System.
 * Permissions are governed by the Root Admin Identity (Master Key).
 */
export class AuthService {
  // The Root Admin Identity - The absolute authority of the Isthmic Pro ecosystem.
  private static readonly ROOT_ADMIN_IDENTITY = 'azeddinebeldjilali9@gmail.com';
  
  static async signup(name: string, email: string, pass: string): Promise<{ user?: UserProfile }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { display_name: name } }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("IDENTITY_CREATION_FAILED");

      // Sovereign Rule: If email matches Master Identity, grant absolute privileges.
      const isRoot = email.toLowerCase() === this.ROOT_ADMIN_IDENTITY.toLowerCase();
      const initialRole = isRoot ? 'Admin' : 'Analyst';
      const initialTier = isRoot ? 'Sovereign' : 'Free';
      
      const profilePayload = {
        id: authData.user.id,
        name: name,
        email: email,
        role: initialRole,
        subscription_tier: initialTier,
        usage_stats: { scansThisMonth: 0, auditsThisMonth: 0 },
        created_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase.from('profiles').upsert([profilePayload]);
      if (profileError) console.error("SOVEREIGN_REGISTRY_ERR:", profileError.message);

      return { 
        user: {
          id: authData.user.id,
          name,
          email,
          role: initialRole as any,
          subscriptionTier: initialTier as any,
          usageStats: { scansThisMonth: 0, auditsThisMonth: 0 },
          preferences: { emailAlerts: true, sniperNotifications: true, reportReadiness: true },
          createdAt: authData.user.created_at,
          emailConfirmedAt: authData.user.email_confirmed_at,
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

      if (error) throw error;

      let { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (!profileData || fetchError) {
        const userEmail = data.user.email || email;
        const isRoot = userEmail.toLowerCase() === this.ROOT_ADMIN_IDENTITY.toLowerCase();
        
        if (isRoot) {
          const newProfile = {
            id: data.user.id,
            name: "Sovereign Root",
            email: userEmail,
            role: 'Admin',
            subscription_tier: 'Sovereign',
            usage_stats: { scansThisMonth: 0, auditsThisMonth: 0 },
            created_at: new Date().toISOString()
          };
          
          await supabase.from('profiles').upsert([newProfile]);
          profileData = newProfile;
        } else if (!profileData) {
          throw new Error("REGISTRY_NOT_FOUND");
        }
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
        emailConfirmedAt: data.user.email_confirmed_at,
        isSyncEnabled: true,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.id}`
      };
    } catch (error: any) {
      throw error;
    }
  }
}
