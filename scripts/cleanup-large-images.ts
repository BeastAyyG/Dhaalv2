/**
 * Migration script: Delete oversized base64 images from reports
 * (They're causing all the timeouts)
 * 
 * Run with: npx tsx scripts/cleanup-large-images.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupLargeImages() {
    console.log("🧹 Cleaning up oversized base64 images...\n");

    // Get report IDs
    const { data: reportIds, error: idError } = await supabase
        .from("reports")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(50);

    if (idError || !reportIds) {
        console.error("❌ Error:", idError);
        return;
    }

    let cleaned = 0;
    let skipped = 0;

    for (const { id } of reportIds) {
        try {
            const { data: report } = await supabase
                .from("reports")
                .select("id, image_url")
                .eq("id", id)
                .single();

            if (!report?.image_url || !report.image_url.startsWith("data:image")) {
                skipped++;
                continue;
            }

            // Check size
            const base64Part = report.image_url.split(",")[1] || "";
            const sizeBytes = Math.ceil(base64Part.length * 0.75);
            const sizeMB = sizeBytes / 1024 / 1024;

            if (sizeMB > 1) {
                // Remove the huge base64 image
                const { error: updateError } = await supabase
                    .from("reports")
                    .update({ image_url: null })
                    .eq("id", id);

                if (!updateError) {
                    console.log(`✅ Cleaned ${id} (was ${sizeMB.toFixed(1)}MB)`);
                    cleaned++;
                }
            } else {
                skipped++;
            }
        } catch (err) {
            console.error(`❌ Error with ${id}:`, err);
        }
    }

    console.log(`\n📊 Cleanup complete!`);
    console.log(`   ✅ Cleaned: ${cleaned}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`\n💡 New reports will use compressed images via Supabase Storage`);
}

cleanupLargeImages();
