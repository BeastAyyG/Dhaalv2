"use server";

import { genAI } from "@/lib/gemini";
import { type AnalysisResult } from "@/lib/types";

export async function analyzeImageAction(formData: FormData): Promise<AnalysisResult> {
    // DEBUG: Log which key is being used
    console.log("API Key being used starts with:", process.env.GEMINI_API_KEY?.substring(0, 10));

    const file = formData.get("image") as File;

    if (!file) {
        throw new Error("No image provided");
    }

    // Convert File to ArrayBuffer -> Base64 for Gemini
    // In production, you'd upload to S3/Supabase Storage and send the URI
    // But Gemini supports inline data for small payloads (< 20MB)
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

    const prompt = `
    You are an expert Civic Engineer and City Planner.
    Analyze this image of a civic issue.
    Return a JSON object with:
    1. "category": One of [Pothole, Garbage, broken_streetlight, water_leakage, traffic_violation, other]
    2. "severityScore": A number 1-10 based on urgency.
    3. "description": A short, technical, and objective description of the issue (max 2 sentences).
  `;

    try {
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
        const text = response.text();

        // Parse JSON
        const data = JSON.parse(text);
        return data as AnalysisResult;

    } catch (error: any) {
        console.error("Gemini Analysis Failed Full:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        console.error("Gemini Message:", error.message);
        console.error("Gemini Cause:", error.cause);
        throw new Error(`Failed to analyze image: ${error.message}`);
    }
}
