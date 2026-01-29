
import { supabase } from './SupabaseClient';
import { UserProfile } from '../types';

export class AuthService {
  // This email is now only a "Bootstrap" key for the very first login.
  // After that, the 'Admin' role in the database is the source of absolute truth.
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

      // Initial Bootstrap Logic
      const role = (email.toLowerCase() === this.BOOTSTRAP_OWNER.toLowerCase()) ? 'Admin' : 'Executive';
      
      await supabase.from('profiles').upsert([{
        id: authData.user.id,
        name: name,
        email: email,
        role: role,
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

      if (error) throw error;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      // Priority 1: Use Database Role. 
      // Priority 2: Fallback to Admin if it's the bootstrap owner.
      const finalRole = profileData?.role || (email.toLowerCase() === this.BOOTSTRAP_OWNER.toLowerCase() ? 'Admin' : 'Executive');

      return {
        id: data.user.id,
        email: data.user.email || '',
        name: profileData?.name || data.user.user_metadata?.display_name || 'User',
        role: finalRole as any,
        createdAt: data.user.created_at,
        isSyncEnabled: true,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.id}`
      };
    } catch (error: any) {
      throw error;
    }
  }
}
