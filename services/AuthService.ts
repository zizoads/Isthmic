
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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { display_name: name } }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("IDENTITY_CREATION_FAILED");

      const isRoot = email.toLowerCase() === this.ROOT_ADMIN_IDENTITY.toLowerCase();
      const initialRole = isRoot ? 'Admin' : 'Analyst';
      const initialTier = isRoot ? 'Sovereign' : 'Free';
      
      const profilePayload: any = {
        id: authData.user.id,
        name: name,
        email: email,
        role: initialRole,
        subscription_tier: initialTier,
        usage_stats: { scansThisMonth: 0, auditsThisMonth: 0 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // تجاهل عمود preferences حالياً لضمان نجاح التسجيل
      const { error: profileError } = await supabase.from('profiles').upsert([profilePayload]);
      if (profileError) throw profileError;

      return { 
        user: {
          id: authData.user.id,
          name,
          email,
          role: initialRole as any,
          subscriptionTier: initialTier as any,
          usageStats: profilePayload.usage_stats,
          preferences: this.DEFAULT_PREFS,
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;

      // اختيار الأعمدة الموجودة فقط لتجنب خطأ Schema Cache
      let { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('id, name, email, role, subscription_tier, usage_stats, created_at')
        .eq('id', data.user.id)
        .single();

      if (!profileData) {
        const isRoot = (data.user.email || email).toLowerCase() === this.ROOT_ADMIN_IDENTITY.toLowerCase();
        if (isRoot) {
          const newProfile = {
            id: data.user.id,
            name: "Sovereign Root",
            email: data.user.email || email,
            role: 'Admin',
            subscription_tier: 'Sovereign',
            usage_stats: { scansThisMonth: 0, auditsThisMonth: 0 },
            created_at: new Date().toISOString()
          };
          await supabase.from('profiles').upsert([newProfile]);
          profileData = newProfile as any;
        } else {
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
        preferences: this.DEFAULT_PREFS,
        createdAt: profileData.created_at,
        emailConfirmedAt: data.user.email_confirmed_at,
        isSyncEnabled: true,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.id}`
      };
    } catch (error: any) {
      throw error;
    }
  }
}
