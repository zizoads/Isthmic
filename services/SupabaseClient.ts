
import { createClient } from '@supabase/supabase-js';

/**
 * Isthmic Pro - Sovereign Cloud Connection
 * تم تصحيح الرابط بناءً على البيانات المكتشفة: weqtcsfynvqconvldmhw
 */

// الرابط الصحيح (بدون حرف c الزائد)
const SUPABASE_URL = 'https://weqtcsfynvqconvldmhw.supabase.co'.trim(); 

// المفتاح الجديد (sb_publishable...)
const SUPABASE_ANON_KEY = 'sb_publishable_fTs-sBuPk0GVRtObWe01wQ_o6MxQkso'.trim(); 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'isthmic-pro' }
  }
});

/**
 * دالة لفحص حالة الاتصال بالخادم يدوياً مع تشخيص دقيق
 */
export const checkSupabaseConnection = async () => {
  try {
    // محاولة جلب الجلسة الحالية للتأكد من أن الخادم يستجيب
    const { data, error } = await supabase.auth.getSession();
    if (error && error.message.includes('fetch')) return false;
    return true;
  } catch (err) {
    return false;
  }
};
