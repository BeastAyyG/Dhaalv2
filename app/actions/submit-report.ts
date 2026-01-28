"use server";

import { supabase } from "@/lib/supabase";
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
    prevState: any,
    formData: FormData
) {
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const severity = parseInt(formData.get("severity") as string);
    const lat = parseFloat(formData.get("lat") as string);
    const lng = parseFloat(formData.get("lng") as string);
    const imageFile = formData.get("image") as File;

    // 1. Handle Image
    // Ideally: Upload to Supabase Storage.
    // Prototype: Convert to Base64 String and store in Text Column
    let imageUrl = "";
    let imageHash = "";

    if (imageFile && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        imageUrl = `data:${imageFile.type};base64,${base64}`;

        // Generate hash for duplicate detection
        imageHash = await generateImageHash(imageFile);
    }

    // 2. Insert into DB
    if (!supabase) {
        console.warn("Supabase not configured. Mock success.");
        return { success: true, message: "Report processed (Mock)" };
    }

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
