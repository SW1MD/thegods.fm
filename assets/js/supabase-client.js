const SUPABASE_URL = 'https://xgparfncmrkqzsxhblct.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhncGFyZm5jbXJrcXpzeGhibGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0MzUyMTMsImV4cCI6MjA0MzAxMTIxM30.k05aVebxnvk_dK_qaAvl97msNfvEkbAP1qi_jzxIXMs';

// Import createClient from the Supabase library
const { createClient } = supabase;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function addLinkToSupabase(linkName, linkUrl, icon, iconSize, position) {
    console.log('Adding link:', { linkName, linkUrl, icon, iconSize, position });
    const { data, error } = await supabaseClient
        .from('links')
        .insert([
            { 
                name: linkName, 
                url: linkUrl, 
                icon: icon,
                iconSize: iconSize,
                position: position !== '' ? parseInt(position) : null
            }
        ])
        .select();  // Add this line to return the inserted data
    
    console.log('Supabase response:', { data, error });
    if (error) throw error;
    return data[0];  // Return the first (and only) inserted item
}

async function getLinksFromSupabase() {
    const { data, error } = await supabaseClient
        .from('links')
        .select('*')
        .order('position', { ascending: true, nullsLast: true });
    
    if (error) throw error;
    return data;
}

async function loadDynamicLinks() {
    console.log('loadDynamicLinks function called');
    try {
        const links = await getLinksFromSupabase();
        console.log('Fetched links:', links);
        const container = document.getElementById('main-buttons');
        const dynamicLinksContainer = document.getElementById('dynamic-links-container');

        if (container && dynamicLinksContainer) {
            console.log('Containers found, processing links');
            dynamicLinksContainer.innerHTML = '';

            if (links.length === 0) {
                console.log('No links found in Supabase');
                dynamicLinksContainer.style.display = 'none';
            } else {
                dynamicLinksContainer.style.display = 'block';

                // Sort links by position
                links.sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity));

                links.forEach(link => {
                    console.log('Processing link:', link);
                    let iconHtml = '';
                    if (link.icon) {
                        if (link.icon.startsWith('mdi-')) {
                            iconHtml = `<i class="mdi ${link.icon}" style="font-size: ${link.iconSize || 24}px; color: white;"></i>`;
                        } else if (link.icon.trim() !== '') {
                            iconHtml = `<img src="${link.icon}" alt="" style="width: ${link.iconSize || 24}px; height: ${link.iconSize || 24}px;">`;
                        }
                    }

                    const linkElement = document.createElement('div');
                    linkElement.className = 'mt-3 pt-2';
                    linkElement.innerHTML = `
                        <a href="${link.url}" style="width: 100%; color: white;" class="btn btn-round btn-c btn-custom">
                            ${link.name} 
                            ${iconHtml}
                        </a>
                    `;

                    dynamicLinksContainer.appendChild(linkElement);

                    console.log('Link added to container:', linkElement.innerHTML);
                });
            }
        } else {
            console.error('Main buttons container or dynamic links container not found');
        }
    } catch (error) {
        console.error('Error loading dynamic links:', error);
    }
}

async function removeLinkFromSupabase(linkId) {
    const { data, error } = await supabaseClient
        .from('links')
        .delete()
        .eq('id', linkId);
    
    if (error) throw error;
    return data;
}

async function removeLink(linkId) {
    try {
        await removeLinkFromSupabase(linkId);
        await loadDynamicLinks();
    } catch (error) {
        console.error('Error removing link:', error);
        alert('Error removing link. Please try again.');
    }
}

// Export the functions
window.loadDynamicLinks = loadDynamicLinks;
window.removeLink = removeLink;