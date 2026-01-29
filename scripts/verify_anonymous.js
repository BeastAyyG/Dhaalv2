const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verify() {
    console.log("🔍 Verifying Anonymous Reporting...");

    const { data, error } = await supabase
        .from('reports')
        .select('id, category, user_id, description')
        .is('user_id', null)
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("❌ Verification Failed: DB Error", error.message);
        process.exit(1);
    }

    if (data.length > 0) {
        console.log(`✅ Success! Found ${data.length} recent anonymous reports.`);
        data.forEach(r => {
            console.log(`   - [${r.category}] ${r.description} (User: ${r.user_id})`);
        });

        // Verify Gas Leak presence
        const hasGas = data.some(r => r.category === 'Gas Leak');
        const hasFire = data.some(r => r.category.includes('Fire'));

        if (hasGas && hasFire) {
            console.log("✅ CONFIRMED: Gas Leak and Fire reports are present.");
        } else {
            console.warn("⚠️ Warning: Could not find specific Gas/Fire reports in top 5.");
        }
    } else {
        console.error("❌ Failure: No anonymous reports found.");
        process.exit(1);
    }
}

verify();
