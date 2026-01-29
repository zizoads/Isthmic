
import { supabase } from './SupabaseClient';
import { UserProfile } from '../types';
import { persistence } from './DataService';

export class AuthService {
  
  static async signup(name: string, email: string, pass: string): Promise<{ user: UserProfile }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { display_name: name } }
      });

      if (authError) {
        if (authError.message.includes("API key")) {
          throw new Error("خطأ في ربط قاعدة البيانات: المفتاح (Anon Key) المستخدم غير صالح لمشروعك.");
        }
        throw new Error(authError.message);
      }
      
      if (!authData.user) throw new Error("فشل إنشاء الحساب.");

      const newUser: UserProfile = {
        id: authData.user.id,
        name,
        email,
        role: 'Executive',
        createdAt: new Date().toISOString(),
        isSyncEnabled: true,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
      };

      await persistence.save('profiles', newUser);
      return { user: newUser };
    } catch (e: any) {
      throw e;
    }
  }

  static async login(email: string, pass: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        if (error.message.includes("API key")) {
          throw new Error("عذراً، مفتاح قاعدة البيانات (Supabase Key) غير صالح. يرجى التأكد من نسخه بشكل صحيح من الإعدادات.");
        }
        throw new Error("بيانات الدخول غير صحيحة.");
      }

      const user: UserProfile = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.display_name || 'Owner',
        role: 'Executive',
        createdAt: data.user.created_at,
        isSyncEnabled: true,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.id}`
      };

      await persistence.save('profiles', user);
      return user;
    } catch (e: any) {
      throw e;
    }
  }
}
