
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * هام جداً:
 * اذهب إلى مشروعك في Supabase -> Settings (الترس) -> API
 * انسخ 'Project URL' وضعه مكان SUPABASE_URL
 * انسخ 'anon public' وضعه مكان SUPABASE_ANON_KEY
 */
const SUPABASE_URL = 'https://qssnxvnrmuyupvfeaswa.supabase.co'; // تأكد أن هذا هو رابط مشروعك
const SUPABASE_ANON_KEY = 'YOUR_ACTUAL_ANON_KEY_HERE'; // ضع هنا المفتاح الذي يبدأ بـ eyJ...

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
