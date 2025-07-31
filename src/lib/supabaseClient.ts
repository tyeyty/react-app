import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://polcehhancopksfstdiq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvbGNlaGhhbmNvcGtzZnN0ZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMTg3NDUsImV4cCI6MjA2MzU5NDc0NX0.si4vfie0eh038QZ5HhhuQwMCU6el3rILc0x7VcWe8Hs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);