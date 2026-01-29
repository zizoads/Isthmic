
import { supabase } from './SupabaseClient';
import { UserProfile } from '../types';

export class AuthService {
  
  static async signup(name: string, email: string, pass: string): Promise<{ user?: UserProfile; needsConfirmation: boolean }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { display_name: name } }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("فشل إنشاء الحساب: لم يتم إرجاع بيانات.");

      const role = email.includes('admin@') ? 'Admin' : 'Executive';
      
      // إنشاء البروفايل فوراً
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

      if (error) {
        if (error.message.includes("Email not confirmed")) {
           // إذا كان الخيار مفعلاً في سوبا بيس ويمنع الدخول تماماً
           throw new Error("⚠️ البريد الإلكتروني غير مؤكد. يرجى تفعيل حسابك من الرابط المرسل إليك (افحص الـ Spam).");
        }
        throw error;
      }

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
    if (error.message?.includes('fetch')) throw new Error("⚠️ خطأ في الاتصال بالسحابة السيادية.");
    if (error.message?.includes("Invalid login credentials")) throw new Error("❌ البيانات المدخلة غير صحيحة.");
    throw error;
  }
}
