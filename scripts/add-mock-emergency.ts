// Script to add mock emergency reports for testing
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const mockEmergencies = [
    {
        category: "Building Fire",
        severity: 10,
        description: "Major fire reported in residential building. Multiple floors affected. Emergency services en route.",
        lat: 12.9716,
        lng: 77.5946,
        status: "OPEN",
        upvotes: 45,
        image_url: null,
        user_id: null
    },
    {
        category: "Gas Leak Emergency",
        severity: 9,
        description: "Significant gas leak detected near industrial area. Evacuation in progress.",
        lat: 12.9750,
        lng: 77.6010,
        status: "OPEN",
        upvotes: 32,
        image_url: null,
        user_id: null
    }
];

async function addMockEmergencies() {
    console.log("🚨 Adding mock emergency reports...\n");

    for (const emergency of mockEmergencies) {
        const { data, error } = await supabase
            .from("reports")
            .insert(emergency)
            .select()
            .single();

        if (error) {
            console.error(`❌ Failed to add "${emergency.category}":`, error.message);
        } else {
            console.log(`✅ Added: ${emergency.category} (Severity: ${emergency.severity})`);
            console.log(`   ID: ${data.id}`);
        }
    }

    console.log("\n🎉 Done! Refresh your app to see the breaking news banner.");
}

addMockEmergencies();
