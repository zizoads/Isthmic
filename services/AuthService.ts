
import { supabase } from './SupabaseClient';
import { UserProfile } from '../types';
import { persistence } from './DataService';

export class AuthService {
  
  static async signup(name: string, email: string, pass: string, question: string, answer: string): Promise<{ user: UserProfile }> {
    // 1. محاولة إنشاء الحساب في Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          display_name: name
        }
      }
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        throw new Error("هذا الحساب موجود بالفعل، جرب تسجيل الدخول.");
      }
      // التحقق من حالة طلب التأكيد
      if (authError.message.toLowerCase().includes("confirmation") || authError.status === 422) {
        throw new Error("تنبيه: يجب إغلاق خيار 'Confirm sign up' في إعدادات Supabase (Authentication -> Confirm sign up).");
      }
      throw new Error("خطأ في التسجيل: " + authError.message);
    }
    
    // إذا نجح الـ Auth ولكن الجلسة فارغة، فهذا يعني أن التأكيد لا يزال مطلوباً في الإعدادات
    if (!authData.user || (!authData.session && authData.user.identities?.length === 0)) {
       throw new Error("الحساب يحتاج تأكيد. يرجى إيقاف خيار 'Confirm sign up' في Supabase ثم المحاولة بإيميل جديد.");
    }

    const newUser: UserProfile = {
      id: authData.user.id,
      name,
      email,
      securityQuestion: question,
      securityAnswer: answer.toLowerCase().trim(),
      role: 'Executive',
      createdAt: new Date().toISOString(),
      isSyncEnabled: true,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
    };

    // 2. محاولة حفظ البيانات في جدول profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email,
        security_question: question,
        security_answer: newUser.securityAnswer
      });

    if (profileError) {
      console.warn("Profile Sync Note:", profileError.message);
    }

    await persistence.save('profiles', newUser);
    return { user: newUser };
  }

  static async login(email: string, pass: string): Promise<UserProfile> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        throw new Error("البريد غير مؤكد. يرجى تعطيل 'Confirm sign up' في Supabase.");
      }
      throw new Error("خطأ: " + error.message);
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const user: UserProfile = {
      id: data.user.id,
      email: data.user.email || '',
      name: profileData?.name || data.user.user_metadata?.display_name || 'Owner',
      securityQuestion: profileData?.security_question,
      securityAnswer: profileData?.security_answer,
      role: 'Executive',
      createdAt: data.user.created_at,
      isSyncEnabled: true,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${profileData?.name || 'User'}`
    };

    await persistence.save('profiles', user);
    return user;
  }
}
