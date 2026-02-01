
import { createClient } from '@supabase/supabase-js';

/**
 * Isthmic Pro - Sovereign Cloud Connection
 * Phase Final: Enhanced with Resilience Wrapper for EWS testing.
 * v2.1: Robust persistence config for cross-session continuity.
 */

const SUPABASE_URL = 'https://weqtcsfynvqconvldmhw.supabase.co'.trim(); 
const SUPABASE_ANON_KEY = 'sb_publishable_fTs-sBuPk0GVRtObWe01wQ_o6MxQkso'.trim(); 

const rawClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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

/**
 * FailureSimulator: Mimics the Supabase fluent API chain to provide a 
 * consistent error response during Chaos Mode without crashing the JS environment.
 */
const createFailureSimulator = () => {
  const simulator: any = {
    then: (onfulfilled: any) => Promise.resolve(onfulfilled({ data: null, error: { message: "SIMULATED_DB_FAILURE: Chaos Mode Active", code: "500" } })),
    select: () => simulator,
    insert: () => simulator,
    update: () => simulator,
    delete: () => simulator,
    upsert: () => simulator,
    eq: () => simulator,
    neq: () => simulator,
    gt: () => simulator,
    lt: () => simulator,
    gte: () => simulator,
    lte: () => simulator,
    like: () => simulator,
    ilike: () => simulator,
    is: () => simulator,
    in: () => simulator,
    contains: () => simulator,
    containedBy: () => simulator,
    rangeGt: () => simulator,
    rangeGte: () => simulator,
    rangeLt: () => simulator,
    rangeLte: () => simulator,
    rangeAdjacent: () => simulator,
    overlaps: () => simulator,
    textSearch: () => simulator,
    match: () => simulator,
    not: () => simulator,
    or: () => simulator,
    filter: () => simulator,
    order: () => simulator,
    limit: () => simulator,
    range: () => simulator,
    abortSignal: () => simulator,
    single: () => simulator,
    maybeSingle: () => simulator,
    csv: () => simulator,
  };
  return simulator;
};

/**
 * Resilience Proxy: Allows the platform to simulate production failures and latency
 * to verify the integrity of the Early Warning System (EWS).
 */
export const supabase = new Proxy(rawClient, {
  get(target, prop, receiver) {
    const original = Reflect.get(target, prop, receiver);

    if (typeof original !== 'function') {
      return original;
    }

    const shouldFail = localStorage.getItem('isthmic_chaos_failure') === 'true';

    if (prop === 'from') {
      return (...args: any[]) => {
        if (shouldFail) {
          console.error("SIMULATED_DB_FAILURE: Chaos Mode Active. Intercepting query chain.");
          return createFailureSimulator();
        }
        return original.apply(target, args);
      };
    }

    return original.bind(target);
  }
});

export const checkSupabaseConnection = async () => {
  try {
    const { data: { session }, error } = await rawClient.auth.getSession();
    if (error && error.message.includes('fetch')) return false;
    return true;
  } catch (err) {
    return false;
  }
};
