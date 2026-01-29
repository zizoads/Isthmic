
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * إعدادات الربط الحقيقية المأخوذة من لقطة الشاشة الخاصة بك.
 * Project: isthmic pro
 */
const SUPABASE_URL = 'https://qssnxvnrmuyupvfeaswa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1OZO77bWh3MdHLIAHKw_5rjCFuNZ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
