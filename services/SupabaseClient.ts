
import { createClient } from '@supabase/supabase-js';

/**
 * Isthmic Pro - Sovereign Cloud Connection
 * Project Ref: qssnxvnrmuyupvfeaswa
 */

// الرابط الرسمي للمشروع بناءً على الكود الذي أرسلته
const SUPABASE_URL = 'https://qssnxvnrmuyupvfeaswa.supabase.co'.trim(); 

// مفتاحك الحقيقي الذي أرسلته (JWT Token)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzc254dm5ybXV5dXB2ZmVhc3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTA3NjQsImV4cCI6MjA4NTI2Njc2NH0.5QN_zfXltW54EH8VyvH95ElvZCZt1OdApFtYNKKVytk'.trim(); 

const rawClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'isthmic_auth_anchor'
  }
});

/**
 * Resilience Proxy: لضمان استقرار الواجهة
 */
export const supabase = new Proxy(rawClient, {
  get(target, prop, receiver) {
    const original = Reflect.get(target, prop, receiver);
    if (typeof original !== 'function') return original;
    return original.bind(target);
  }
});

export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await rawClient.auth.getSession();
    return !error;
  } catch {
    return false;
  }
};
