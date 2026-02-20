import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    const { data, error } = await supabase.auth.signUp({
        email: 'admin@goldentier.com',
        password: 'password',
        options: {
            data: {
                full_name: 'Golden Tier Admin'
            }
        }
    });

    if (error) {
        console.error("Signup error:", error);
        process.exit(1);
    }

    console.log("Signup success:", data);
}

createAdmin();
