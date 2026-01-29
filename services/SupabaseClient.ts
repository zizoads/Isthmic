
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * تم استخراج رابط المشروع والمفتاح تلقائياً بناءً على البيانات المزودة.
 * الرابط: https://weqtcsfynvqcconvldmhw.supabase.co
 */

// رابط المشروع الخاص بك
const SUPABASE_URL = 'https://weqtcsfynvqcconvldmhw.supabase.co'; 

// مفتاح الـ anon العام (JWT)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlcXRjc2Z5bnZxY29udmxkbWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MTIwNjgsImV4cCI6MjA4NTI4ODA2OH0.fzT9Svi7JfFlHrwgFPIKGGKwUNQY5afYVWKKEFh51z0'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
