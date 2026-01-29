/**
 * Migration script: Move base64 images to Supabase Storage (Batch version)
 * 
 * Run with: npx tsx scripts/migrate-images.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateImages() {
    console.log("🔄 Starting image migration...\n");

    // 1. Get just IDs first (fast query)
    const { data: reportIds, error: idError } = await supabase
        .from("reports")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(50);

    if (idError || !reportIds) {
        console.error("❌ Error fetching report IDs:", idError);
        return;
    }

    console.log(`Found ${reportIds.length} reports to check\n`);

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    // 2. Process each report individually
    for (const { id } of reportIds) {
        try {
            // Fetch single report with image
            const { data: report, error: fetchError } = await supabase
                .from("reports")
                .select("id, image_url")
                .eq("id", id)
                .single();

            if (fetchError || !report) {
                console.log(`⏭️  Skipped ${id}: fetch error`);
                skipped++;
                continue;
            }

            // Check if already migrated or no image
            if (!report.image_url || !report.image_url.startsWith("data:image")) {
                console.log(`⏭️  Skipped ${id}: already migrated or no image`);
                skipped++;
                continue;
            }

            // Extract base64 data
            const [header, base64Data] = report.image_url.split(",");
            const mimeType = header.match(/data:(.*?);/)?.[1] || "image/jpeg";
            const extension = mimeType.split("/")[1] || "jpg";

            // Convert base64 to buffer
            const buffer = Buffer.from(base64Data, "base64");

            // Check size - skip if too large (> 5MB)
            if (buffer.length > 5 * 1024 * 1024) {
                console.log(`⏭️  Skipped ${id}: image too large (${(buffer.length / 1024 / 1024).toFixed(1)}MB)`);
                skipped++;
                continue;
            }

            // Generate unique filename
            const fileName = `migrated/${id}.${extension}`;

            // Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from("report-images")
                .upload(fileName, buffer, {
                    contentType: mimeType,
                    upsert: true
                });

            if (uploadError) {
                console.error(`❌ Failed to upload ${id}:`, uploadError.message);
                failed++;
                continue;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from("report-images")
                .getPublicUrl(fileName);

            // Update report with new URL
            const { error: updateError } = await supabase
                .from("reports")
                .update({ image_url: urlData.publicUrl })
                .eq("id", id);

            if (updateError) {
                console.error(`❌ Failed to update ${id}:`, updateError.message);
                failed++;
                continue;
            }

            migrated++;
            console.log(`✅ Migrated: ${id}`);

        } catch (err) {
            console.error(`❌ Error processing ${id}:`, err);
            failed++;
        }
    }

    console.log(`\n📊 Migration complete!`);
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
}

migrateImages();
