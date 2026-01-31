import { createClient } from '@supabase/supabase-js';

/**
 * Isthmic Pro - Sovereign Cloud Connection
 * Phase Final: Enhanced with Resilience Wrapper for EWS testing.
 */

const SUPABASE_URL = 'https://weqtcsfynvqconvldmhw.supabase.co'.trim(); 
const SUPABASE_ANON_KEY = 'sb_publishable_fTs-sBuPk0GVRtObWe01wQ_o6MxQkso'.trim(); 

const rawClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
 * Resilience Proxy: Allows the platform to simulate production failures and latency
 * to verify the integrity of the Early Warning System (EWS).
 */
export const supabase = new Proxy(rawClient, {
  get(target, prop, receiver) {
    const original = Reflect.get(target, prop, receiver);
    
    // Check for Chaos Mode simulation
    const simulatedLatency = localStorage.getItem('isthmic_chaos_latency');
    const shouldFail = localStorage.getItem('isthmic_chaos_failure') === 'true';

    if (typeof original === 'function' && (prop === 'from' || prop === 'auth')) {
      return (...args: any[]) => {
        if (shouldFail) throw new Error("SIMULATED_DB_FAILURE: Chaos Mode Active");
        
        if (simulatedLatency) {
          const ms = parseInt(simulatedLatency);
          return new Promise(resolve => setTimeout(() => resolve(original.apply(target, args)), ms));
        }
        
        return original.apply(target, args);
      };
    }
    return original;
  }
});

export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error && error.message.includes('fetch')) return false;
    return true;
  } catch (err) {
    return false;
  }
};