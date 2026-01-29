
import { supabase } from './SupabaseClient';
import { UserProfile } from '../types';

export class AuthService {
  
  static async signup(name: string, email: string, pass: string): Promise<{ user: UserProfile }> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { display_name: name } }
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Authentication failed.");

    // إنشاء البروفايل في جدول السحاب
    const role = email.includes('admin@') ? 'Admin' : 'Executive';
    const newUser: UserProfile = {
      id: authData.user.id,
      name,
      email,
      role: role as any,
      createdAt: new Date().toISOString(),
      isSyncEnabled: true,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
    };

    const { error: dbError } = await supabase.from('profiles').upsert([{
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      created_at: newUser.createdAt
    }]);

    if (dbError) console.error("Database Profile Error:", dbError);
    return { user: newUser };
  }

  static async login(email: string, pass: string): Promise<UserProfile> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) throw new Error("Invalid credentials or database connection failure.");

    // جلب بيانات الرتبة من جدول الـ profiles
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const user: UserProfile = {
      id: data.user.id,
      email: data.user.email || '',
      name: profileData?.name || data.user.user_metadata?.display_name || 'Owner',
      role: profileData?.role || 'Executive',
      createdAt: data.user.created_at,
      isSyncEnabled: true,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.id}`
    };

    return user;
  }
}
