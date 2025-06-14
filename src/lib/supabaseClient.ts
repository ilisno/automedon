import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xbenxlukvzqbipzeczzv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZW54bHVrdnpxYmlwemVjenp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjg2MTMsImV4cCI6MjA2Mzk0NDYxM30.C2_uqx7PzLoOv6Ckg8dUv-cBNc9W6292hzmSHcxPh3w';

// Use a global variable to ensure singleton pattern
let _supabase: SupabaseClient | undefined;

export const supabase = (() => {
  if (!_supabase) {
    console.log('Supabase Client Init: Creating new instance...');
    console.log('Supabase Client Init: URL =', supabaseUrl);
    console.log('Supabase Client Init: Anon Key (first 10 chars) =', supabaseAnonKey.substring(0, 10));
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.log('Supabase Client Init: Using existing instance.');
  }
  return _supabase;
})();