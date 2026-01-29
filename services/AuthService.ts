
import { supabase } from './SupabaseClient';
import { UserProfile } from '../types';
import { persistence } from './DataService';

export class AuthService {
  
  static async signup(name: string, email: string, pass: string, question: string, answer: string): Promise<{ user: UserProfile }> {
    // 1. إنشاء الحساب في نظام Auth الخاص بـ Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: pass,
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Signup failed. No user returned.");

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

    // 2. تخزين البيانات الإضافية في جدول profiles العام
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: newUser.id, 
          name: newUser.name, 
          email: newUser.email,
          security_question: question,
          security_answer: newUser.securityAnswer
        }
      ]);

    if (profileError) {
      console.warn("User created but profile data could not be saved to cloud. Saving locally instead.");
    }

    // 3. حفظ نسخة محلية في الخزنة
    await persistence.save('profiles', newUser);
    return { user: newUser };
  }

  static async login(email: string, pass: string): Promise<UserProfile> {
    // 1. التحقق من الهوية عبر Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) throw new Error(error.message);

    // 2. جلب البيانات الإضافية من جدول profiles
    const { data: profileData, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const user: UserProfile = {
      id: data.user.id,
      email: data.user.email || '',
      name: profileData?.name || 'Sovereign Owner',
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

  static async getQuestion(email: string): Promise<string> {
    const { data, error } = await supabase
      .from('profiles')
      .select('security_question')
      .eq('email', email)
      .single();

    if (error || !data) throw new Error("Account not found in our registry.");
    return data.security_question;
  }

  static async recoverWithQuestion(email: string, answer: string, newPass: string): Promise<boolean> {
    // 1. التحقق من الجواب من جدول profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, security_answer')
      .eq('email', email)
      .single();

    if (profileError || !profile) throw new Error("Account lookup failed.");
    if (profile.security_answer !== answer.toLowerCase().trim()) throw new Error("Incorrect answer.");

    // 2. بما أننا لا نستطيع تحديث كلمة السر بدون "جلسة نشطة" في Supabase Auth، 
    // نقوم باستخدام نظام "Admin-Like" أو تحديث الحساب بعد تسجيل الدخول المؤقت.
    // لكن الأفضل هو طلب إعادة تعيين عبر الإيميل أو استخدام "Recovery OTP".
    
    // محاكاة للتحديث (يحتاج إعدادات محددة في Supabase Dashboard):
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPass
    });

    if (updateError) throw new Error("Recovery server denied password update. Please try Email Recovery.");
    
    return true;
  }
}
