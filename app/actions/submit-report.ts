"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// Simple hash function for image comparison
async function generateImageHash(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Use first 1000 bytes + file size for a quick hash
    let hash = file.size.toString();
    const sampleSize = Math.min(bytes.length, 1000);

    for (let i = 0; i < sampleSize; i += 10) {
        hash += bytes[i].toString(16);
    }

    return hash;
}

export async function submitReportAction(
    prevState: { message: string; success?: boolean } | null,
    formData: FormData
) {
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const severity = parseInt(formData.get("severity") as string);
    const lat = parseFloat(formData.get("lat") as string);
    const lng = parseFloat(formData.get("lng") as string);
    const imageFile = formData.get("image") as File;

    // 1. Handle Image - Use Supabase Storage (not base64 to avoid timeouts)
    let imageUrl = "";
    let imageHash = "";

    const supabase = createClient();
    if (!supabase) {
        console.warn("Supabase not configured. Mock success.");
        return { success: true, message: "Report processed (Mock)" };
    }

    if (imageFile && imageFile.size > 0) {
        // Generate unique filename
        const fileExt = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `reports/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase
            .storage
            .from("report-images")
            .upload(filePath, imageFile, {
                cacheControl: "3600",
                upsert: false
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            // Fallback: store smaller thumbnail or skip image
            imageUrl = "";
        } else {
            // Get public URL
            const { data: urlData } = supabase.storage
                .from("report-images")
                .getPublicUrl(filePath);
            imageUrl = urlData.publicUrl;
        }

        // Generate hash for duplicate detection
        imageHash = await generateImageHash(imageFile);
    }

    // 2. Insert into DB

    const { error } = await supabase
        .from("reports")
        .insert({
            category,
            description,
            severity,
            lat,
            lng,
            image_url: imageUrl,
            image_hash: imageHash,
            status: "OPEN",
        });

    if (error) {
        console.error("Submission Error:", error);
        return { success: false, message: "Failed to save report" };
    }

    // 3. Revalidate
    revalidatePath("/");

    return { success: true, message: "Report saved!" };
}
