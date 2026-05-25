import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fnipaefcuvjgpflqwcey.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuaXBhZWZjdXZqZ3BmbHF3Y2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDgxMDksImV4cCI6MjA5NTE4NDEwOX0.dcoMBe2adtAYKXgC0U-WbhumRoZwmNZw8i6bhl_A4Cg';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials are not set. Check your .env.local file.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
