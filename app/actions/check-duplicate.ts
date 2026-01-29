"use server";

import { createClient } from "@/lib/supabase-server";

export interface DuplicateCheckResult {
    isDuplicate: boolean;
    similarityScore?: number;
    existingReport?: {
        id: string;
        category: string;
        created_at: string;
        status: string;
        lat: number;
        lng: number;
    };
    reason?: string;
}

// Generate a simple hash from image bytes for quick comparison
async function generateImageHash(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Hash: file size + sampled bytes
    let hash = file.size.toString(16);
    const sampleSize = Math.min(bytes.length, 2000);

    for (let i = 0; i < sampleSize; i += 20) {
        hash += bytes[i].toString(16).padStart(2, '0');
    }

    return hash;
}

export async function checkDuplicateAction(formData: FormData): Promise<DuplicateCheckResult> {
    const file = formData.get("image") as File;
    const supabase = createClient();

    if (!file || !supabase) {
        return { isDuplicate: false };
    }

    try {
        // Step 1: Generate hash for new image
        const newHash = await generateImageHash(file);

        // Step 2: Check for exact hash match in database (fast, no AI)
        const { data: hashMatches, error: hashError } = await supabase
            .from("reports")
            .select("id, category, created_at, status, lat, lng, image_hash")
            .eq("image_hash", newHash)
            .limit(1);

        if (!hashError && hashMatches && hashMatches.length > 0) {
            // Exact hash match found - definitely a duplicate
            const match = hashMatches[0];
            return {
                isDuplicate: true,
                similarityScore: 100,
                existingReport: {
                    id: match.id,
                    category: match.category,
                    created_at: match.created_at,
                    status: match.status,
                    lat: match.lat,
                    lng: match.lng,
                },
                reason: "Exact image match found (same file uploaded before)",
            };
        }

        // Step 3: Check location-based duplicates (within ~100m radius, last 24h)
        const lat = parseFloat(formData.get("lat") as string) || 0;
        const lng = parseFloat(formData.get("lng") as string) || 0;

        if (lat && lng) {
            const latRadius = 0.001; // ~100m
            const lngRadius = 0.001;
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

            const { data: nearbyReports } = await supabase
                .from("reports")
                .select("id, category, created_at, status, lat, lng")
                .gte("lat", lat - latRadius)
                .lte("lat", lat + latRadius)
                .gte("lng", lng - lngRadius)
                .lte("lng", lng + lngRadius)
                .gte("created_at", yesterday)
                .limit(5);

            if (nearbyReports && nearbyReports.length > 0) {
                // Found reports in same area recently - warn user but don't block
                const match = nearbyReports[0];
                return {
                    isDuplicate: true,
                    similarityScore: 75,
                    existingReport: {
                        id: match.id,
                        category: match.category,
                        created_at: match.created_at,
                        status: match.status,
                        lat: match.lat,
                        lng: match.lng,
                    },
                    reason: `A similar report was made in this area recently (${nearbyReports.length} report(s) nearby)`,
                };
            }
        }

        // No duplicates found
        return { isDuplicate: false };

    } catch (error) {
        console.error("Duplicate check error:", error);
        return { isDuplicate: false };
    }
}

export async function getImageHash(formData: FormData): Promise<string> {
    const file = formData.get("image") as File;
    if (!file) return "";
    return generateImageHash(file);
}
