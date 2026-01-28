"use server";

import { supabase } from "@/lib/supabase";
import { genAI } from "@/lib/gemini";

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

export async function checkDuplicateAction(formData: FormData): Promise<DuplicateCheckResult> {
    const file = formData.get("image") as File;

    if (!file || !supabase) {
        return { isDuplicate: false };
    }

    try {
        // 1. Fetch recent reports with images (last 20)
        const { data: recentReports, error } = await supabase
            .from("reports")
            .select("id, category, created_at, status, lat, lng, image_url")
            .not("image_url", "is", null)
            .order("created_at", { ascending: false })
            .limit(20);

        if (error || !recentReports || recentReports.length === 0) {
            return { isDuplicate: false };
        }

        // 2. Convert new image to base64
        const arrayBuffer = await file.arrayBuffer();
        const newImageBase64 = Buffer.from(arrayBuffer).toString("base64");

        // 3. Use Gemini to compare with recent reports
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        // Check against each recent report's image
        for (const report of recentReports) {
            if (!report.image_url || !report.image_url.startsWith("data:image")) {
                continue;
            }

            // Extract base64 from data URL
            const existingBase64 = report.image_url.split(",")[1];
            if (!existingBase64) continue;

            const prompt = `
            You are a fraud detection AI for a civic reporting system.
            Compare these two images and determine if they show the SAME physical location or issue.
            
            Be strict: They should be the same place/problem, not just similar categories.
            
            Return JSON with:
            - "isSame": boolean (true if same location/issue, false otherwise)
            - "confidence": number 0-100 (how confident you are)
            - "reason": string (brief explanation)
            
            Consider:
            - Same pothole/garbage/issue in slightly different angles = SAME
            - Same building/street in both photos = SAME
            - Different locations with similar issues = DIFFERENT
            - Edited/cropped version of same photo = SAME
            `;

            try {
                const result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            data: newImageBase64,
                            mimeType: file.type
                        }
                    },
                    {
                        inlineData: {
                            data: existingBase64,
                            mimeType: "image/jpeg" // Assume JPEG for stored images
                        }
                    }
                ]);

                const response = await result.response;
                const text = response.text();
                const comparison = JSON.parse(text);

                if (comparison.isSame && comparison.confidence >= 70) {
                    return {
                        isDuplicate: true,
                        similarityScore: comparison.confidence,
                        existingReport: {
                            id: report.id,
                            category: report.category,
                            created_at: report.created_at,
                            status: report.status,
                            lat: report.lat,
                            lng: report.lng,
                        },
                        reason: comparison.reason,
                    };
                }
            } catch (comparisonError) {
                // If comparison fails for one image, continue to next
                console.error("Comparison failed for report:", report.id, comparisonError);
                continue;
            }
        }

        // No duplicates found
        return { isDuplicate: false };

    } catch (error) {
        console.error("Duplicate check error:", error);
        return { isDuplicate: false };
    }
}

// Keep the simple hash function as a fallback/quick check
async function generateImageHash(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    let hash = file.size.toString();
    const sampleSize = Math.min(bytes.length, 1000);

    for (let i = 0; i < sampleSize; i += 10) {
        hash += bytes[i].toString(16);
    }

    return hash;
}

export async function getImageHash(formData: FormData): Promise<string> {
    const file = formData.get("image") as File;
    if (!file) return "";
    return generateImageHash(file);
}
