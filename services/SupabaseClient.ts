
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * دليل الربط للمبتدئين:
 * 1. افتح مشروعك في Supabase.
 * 2. اذهب إلى Settings (الترس) -> API.
 * 3. انسخ Project URL وضعه في المتغير SUPABASE_URL أدناه.
 * 4. انسخ anon public key وضعه في المتغير SUPABASE_ANON_KEY أدناه.
 */

// ضع رابط المشروع هنا (يبدأ بـ https://)
const SUPABASE_URL = 'https://qssnxvnrmuyupvfeaswa.supabase.co'; 

// ضع مفتاح الـ anon هنا (سلسلة طويلة من الحروف والأرقام)
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
