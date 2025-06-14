import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xbenxlukvzqbipzeczzv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZW54bHVrdnpxYmlwemVjenp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjg2MTMsImV4cCI6MjA2Mzk0NDYxM30.C2_uqx7PzLoOv6Ckg8dUv-cBNc9W6292hzmSHcxPh3w';

console.log('Supabase Client Init: URL =', supabaseUrl);
console.log('Supabase Client Init: Anon Key (first 10 chars) =', supabaseAnonKey.substring(0, 10));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);