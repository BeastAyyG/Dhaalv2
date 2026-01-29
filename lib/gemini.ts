import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Missing GEMINI_API_KEY environment variable. AI features will not work.");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");

export const geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", // Updated to working model
    generationConfig: {
        // Force JSON output for structured data
        responseMimeType: "application/json",
    }
});
