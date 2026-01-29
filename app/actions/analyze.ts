"use server";

import { genAI } from "@/lib/gemini";
import { type AnalysisResult } from "@/lib/types";

// MOCK MODE: Set to true during network outage to bypass API calls
const MOCK_MODE = false;
const MAX_RETRIES = 3;

// Helper to clean JSON string
function cleanJsonString(text: string): string {
    return text.replace(/```json\n?|\n?```/g, "").trim();
}

// Helper for delay
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function analyzeImageAction(formData: FormData): Promise<AnalysisResult> {
    // Return mock data during outage
    if (MOCK_MODE) {
        console.log("🔧 MOCK MODE: Returning simulated analysis");
        await delay(1500);
        return {
            category: "Pothole",
            severityScore: 7,
            description: "[MOCK] This is simulated analysis."
        };
    }

    const file = formData.get("image") as File;
    if (!file) {
        throw new Error("No image provided");
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // Newest model with better rate limits
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

    const prompt = `You are an expert Civic Safety Analyst for an emergency reporting system.
    Analyze this image and classify the civic issue or emergency.

    CRITICAL EMERGENCY CATEGORIES (severity 9-10):
    - Stampede, crowd crush, mass panic
    - Earthquake damage, building collapse
    - Fire, explosion, gas leak
    - Flood, tsunami, landslide
    - Terror attack, active shooter
    - Major accident with casualties
    - Infrastructure collapse (bridge, building)

    HIGH PRIORITY CATEGORIES (severity 7-8):
    - Major road blockage, traffic accident
    - Downed power lines, electrical hazard
    - Water main break, flooding street
    - Dangerous construction site
    - Aggressive animals, wildlife threat

    STANDARD CATEGORIES (severity 1-6):
    - Pothole, road damage
    - Garbage overflow, illegal dumping
    - Broken streetlight
    - Water leakage
    - Traffic violation
    - Vandalism, graffiti
    
    Return strictly JSON:
    {
       "category": "String describing the issue (e.g., 'Stampede', 'Earthquake', 'Fire', 'Pothole', 'Garbage')",
       "severityScore": number (1-10, use 9-10 for CRITICAL emergencies),
       "description": "Technical description of the situation and recommended action",
       "priority": "CRITICAL" | "HIGH" | "NORMAL" | "LOW",
       "isEmergency": boolean (true for severity >= 9)
    }`;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`Gemini API attempt ${attempt}/${MAX_RETRIES}...`);

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: file.type
                    }
                }
            ]);

            const response = await result.response;
            let text = response.text();
            console.log("Gemini Success:", text.substring(0, 100) + "...");

            text = cleanJsonString(text);
            const data = JSON.parse(text);
            return data as AnalysisResult;

        } catch (error: unknown) {
            lastError = error as Error;
            const is429 = lastError.message?.includes("429") || lastError.message?.includes("Resource exhausted");
            console.error(`Attempt ${attempt} failed:`, lastError.message);

            if (attempt < MAX_RETRIES) {
                // Longer delay for rate limits (429), shorter for other errors
                const waitTime = is429 ? attempt * 15000 : attempt * 3000; // 15s/30s/45s for 429
                console.log(`${is429 ? "⚠️ Rate limited! " : ""}Retrying in ${waitTime / 1000}s...`);
                await delay(waitTime);
            }
        }
    }

    throw new Error(`AI Analysis Failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}
