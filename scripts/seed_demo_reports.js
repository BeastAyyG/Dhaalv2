const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function uploadAndInsert(filePath, category, severity, description, lat, lng) {
    console.log(`Processing ${category}...`);

    // Skip upload securely since bucket is known missing
    const imageUrl = "";

    // 4. Insert Report
    const { data, error } = await supabase
        .from('reports')
        .insert({
            category,
            severity,
            description,
            lat,
            lng,
            image_url: imageUrl,
            status: 'OPEN',
            user_id: null,
            // is_emergency removed
        })
        .select()
        .single();

    if (error) {
        console.error(`❌ Insert failed for ${category}:`, error.message);
    } else {
        console.log(`✅ Success! Created report ID: ${data.id} (${category})`);
    }
}

async function main() {
    // Gas Leak (Severity 8)
    await uploadAndInsert(
        null,
        'Gas Leak',
        8,
        'Active gas leak detected near industrial pipe. Visible smoke. (Demo Report)',
        28.6139,
        77.2090
    );

    // Fire (Severity 10)
    await uploadAndInsert(
        null,
        'Fire / Explosion',
        10,
        'Massive building fire, immediate assistance required! (Demo Report)',
        28.6200,
        77.2100
    );
}

main();
