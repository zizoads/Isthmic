
import { supabase } from './SupabaseClient';
import { UserProfile } from '../types';

export class AuthService {
  
  static async signup(name: string, email: string, pass: string): Promise<{ user: UserProfile }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { display_name: name } }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("فشل إنشاء الحساب: لم يتم إرجاع بيانات.");

      const role = email.includes('admin@') ? 'Admin' : 'Executive';
      
      const { error: dbError } = await supabase.from('profiles').upsert([{
        id: authData.user.id,
        name: name,
        email: email,
        role: role,
        created_at: new Date().toISOString()
      }]);

      if (dbError) console.error("Database Profile Error:", dbError);
      
      return { 
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
      this.handleDetailedError(error, "Signup");
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

      return {
        id: data.user.id,
        email: data.user.email || '',
        name: profileData?.name || data.user.user_metadata?.display_name || 'User',
        role: profileData?.role || 'Executive',
        createdAt: data.user.created_at,
        isSyncEnabled: true,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.id}`
      };
    } catch (error: any) {
      this.handleDetailedError(error, "Login");
      throw error;
    }
  }

  private static handleDetailedError(error: any, context: string) {
    console.error(`${context} Diagnostic:`, error);
    
    if (error.message?.includes('fetch') || error.name === 'TypeError') {
      throw new Error("⚠️ لا يزال هناك فشل في الاتصال. يرجى التأكد من أن مشروعك في Supabase ليس في وضع 'Paused'. إذا كان نشطاً، فقد تكون المشكلة في جدار حماية الإنترنت لديك.");
    }
    
    throw error;
  }
}
