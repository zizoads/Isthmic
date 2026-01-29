
import { supabase } from './SupabaseClient';
import { UserProfile } from '../types';
import { persistence } from './DataService';

export class AuthService {
  
  static async signup(name: string, email: string, pass: string): Promise<{ user: UserProfile }> {
    // 1. محاولة إنشاء الحساب في Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { display_name: name }
      }
    });

    if (authError) {
      console.error("Supabase Auth Error:", authError);
      // تخصيص رسالة الخطأ لتكون مفهومة
      if (authError.message.includes("Email confirmation")) {
        throw new Error("يجب عليك تعطيل خاصية 'Confirm Email' من لوحة تحكم Supabase لتتمكن من الدخول فوراً.");
      }
      throw new Error(authError.message);
    }
    
    if (!authData.user) throw new Error("فشلت عملية إنشاء المستخدم.");

    // 2. إنشاء بيانات البروفايل محلياً وسحابياً
    const newUser: UserProfile = {
      id: authData.user.id,
      name,
      email,
      role: 'Executive',
      createdAt: new Date().toISOString(),
      isSyncEnabled: true,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
    };

    // محاولة الحفظ في الجدول (إذا كان موجوداً)
    await supabase.from('profiles').insert([
      { id: newUser.id, name: newUser.name, email: newUser.email }
    ]);

    await persistence.save('profiles', newUser);
    return { user: newUser };
  }

  static async login(email: string, pass: string): Promise<UserProfile> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        throw new Error("تم إنشاء الحساب، لكنه يتطلب تفعيل الإيميل. اذهب للإعدادات في Supabase وعطل 'Confirm Email'.");
      }
      throw new Error("خطأ في البيانات: تأكد من الإيميل وكلمة السر.");
    }

    // جلب البيانات الإضافية
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const user: UserProfile = {
      id: data.user.id,
      email: data.user.email || '',
      name: profileData?.name || data.user.user_metadata?.display_name || 'Owner',
      role: 'Executive',
      createdAt: data.user.created_at,
      isSyncEnabled: true,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${profileData?.name || 'User'}`
    };

    await persistence.save('profiles', user);
    return user;
  }
}
