import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://xgparfncmrkqzsxhblct.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhncGFyZm5jbXJrcXpzeGhibGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0MzUyMTMsImV4cCI6MjA0MzAxMTIxM30.k05aVebxnvk_dK_qaAvl97msNfvEkbAP1qi_jzxIXMs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function authenticateUser(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        return { success: true, user: data.user };
    } catch (error) {
        console.error('Authentication error:', error.message);
        return { success: false, message: error.message };
    }
}

export function checkSession() {
    const session = supabase.auth.getSession();
    return session !== null;
}

export async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error.message);
        return { success: false, message: error.message };
    }
}