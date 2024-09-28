import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://xgparfncmrkqzsxhblct.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhncGFyZm5jbXJrcXpzeGhibGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0MzUyMTMsImV4cCI6MjA0MzAxMTIxM30.k05aVebxnvk_dK_qaAvl97msNfvEkbAP1qi_jzxIXMs';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function addLinkToSupabase(linkName, linkUrl, icon, position, upcoming) {
    console.log('Adding link:', { linkName, linkUrl, icon, position, upcoming });
    const { data, error } = await supabaseClient
        .from('links')
        .insert([
            { 
                name: linkName, 
                url: linkUrl, 
                icon: icon, 
                position: position !== '' ? parseInt(position) : null,
                upcoming: upcoming
            }
        ]);
    
    console.log('Supabase response:', { data, error });
    if (error) throw error;
    return data;
}

export async function getLinksFromSupabase() {
    const { data, error } = await supabaseClient
        .from('links')
        .select('*')
        .order('position', { ascending: true, nullsLast: true });
    
    console.log('Links from Supabase:', data);
    
    if (error) throw error;
    return data;
}

export async function removeLinkFromSupabase(linkId) {
    console.log('Removing link with ID:', linkId);
    const { data, error } = await supabaseClient
        .from('links')
        .delete()
        .eq('id', linkId);
    
    console.log('Supabase response:', { data, error });
    if (error) throw error;
    return data;
}

// The loadDynamicLinks function should be exported if it's used in other files
export async function loadDynamicLinks() {
    console.log('loadDynamicLinks function called');
    try {
        const links = await getLinksFromSupabase();
        // ... rest of the function ...
    } catch (error) {
        console.error('Error loading dynamic links:', error);
    }
}

// Export removeLink if it's used in other files
export async function removeLink(linkId) {
    try {
        await removeLinkFromSupabase(linkId);
        await loadDynamicLinks();
    } catch (error) {
        console.error('Error removing link:', error);
        alert('Error removing link. Please try again.');
    }
}