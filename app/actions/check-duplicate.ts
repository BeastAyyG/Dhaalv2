"use server";

import { supabase } from "@/lib/supabase";

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

export interface DuplicateCheckResult {
    isDuplicate: boolean;
    existingReport?: {
        id: string;
        category: string;
        created_at: string;
        status: string;
    };
}

export async function checkDuplicateAction(formData: FormData): Promise<DuplicateCheckResult> {
    const file = formData.get("image") as File;

    if (!file || !supabase) {
        return { isDuplicate: false };
    }

    try {
        const hash = await generateImageHash(file);

        // Check if this hash exists in database
        const { data, error } = await supabase
            .from("reports")
            .select("id, category, created_at, status")
            .eq("image_hash", hash)
            .limit(1)
            .single();

        if (error || !data) {
            return { isDuplicate: false };
        }

        return {
            isDuplicate: true,
            existingReport: data,
        };
    } catch {
        return { isDuplicate: false };
    }
}

export async function getImageHash(formData: FormData): Promise<string> {
    const file = formData.get("image") as File;
    if (!file) return "";
    return generateImageHash(file);
}
