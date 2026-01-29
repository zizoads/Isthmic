
import { supabase } from './SupabaseClient';
import { UserProfile } from '../types';
import { persistence } from './DataService';

export class AuthService {
  
  /**
   * الدخول السريع: ينشئ حساب محلي فوراً دون الحاجة لقاعدة بيانات خارجية
   */
  static async quickStart(): Promise<UserProfile> {
    const guestId = `local_${crypto.randomUUID().split('-')[0]}`;
    const guestUser: UserProfile = {
      id: guestId,
      name: "Commander One",
      email: "local@isthmic.pro",
      role: 'Executive',
      createdAt: new Date().toISOString(),
      isSyncEnabled: false, // الوضع المحلي لا يحتاج مزامنة سحابية
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Commander`
    };

    // حفظ البروفايل محلياً فقط
    await persistence.save('profiles', guestUser);
    return guestUser;
  }

  static async signup(name: string, email: string, pass: string): Promise<{ user: UserProfile }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { display_name: name } }
      });

      if (authError) throw new Error(authError.message);
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
      console.warn("Cloud Auth Failed, suggesting local mode.");
      throw e;
    }
  }

  static async login(email: string, pass: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) throw new Error("بيانات الدخول غير صحيحة.");

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
