import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables! Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

if (!supabaseUrl.startsWith('https://')) {
    throw new Error('Security Error: VITE_SUPABASE_URL must start with https://');
}

if (!supabaseAnonKey.startsWith('eyJ')) {
    throw new Error('Security Error: VITE_SUPABASE_ANON_KEY appears to be invalid. It should be a JWT token starting with "eyJ".');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
