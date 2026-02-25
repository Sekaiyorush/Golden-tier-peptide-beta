import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key, NOT anon key

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
    process.exit(1);
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Missing env vars: ADMIN_EMAIL and ADMIN_PASSWORD are required");
    console.error("Usage: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=your-strong-password node seed_admin.js");
    process.exit(1);
}

if (ADMIN_PASSWORD.length < 12) {
    console.error("ADMIN_PASSWORD must be at least 12 characters long");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function createAdmin() {
    // Create the user via the admin API (service role)
    const { data, error } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
            full_name: 'Golden Tier Admin'
        }
    });

    if (error) {
        console.error("Create user error:", error);
        process.exit(1);
    }

    // Set the role to admin in profiles
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin', status: 'active' })
        .eq('id', data.user.id);

    if (profileError) {
        console.error("Profile update error:", profileError);
        process.exit(1);
    }

    console.log("Admin created successfully for:", ADMIN_EMAIL);
    console.log("IMPORTANT: Store these credentials securely and rotate the password regularly.");
}

createAdmin();
