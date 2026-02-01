
import { createClient } from '@supabase/supabase-js';

/**
 * Isthmic Pro - Sovereign Cloud Connection
 * v2.2: Robust persistence config for cross-session continuity.
 */

const SUPABASE_URL = 'https://weqtcsfynvqconvldmhw.supabase.co'.trim(); 
const SUPABASE_ANON_KEY = 'sb_publishable_fTs-sBuPk0GVRtObWe01wQ_o6MxQkso'.trim(); 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'isthmic_auth_anchor'
  },
  global: {
    headers: { 'x-application-name': 'isthmic-pro' }
  }
});

export const checkSupabaseConnection = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error && error.message.includes('fetch')) return false;
    return true;
  } catch (err) {
    return false;
  }
};
