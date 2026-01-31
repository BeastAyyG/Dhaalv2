"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function translateAction(text: string): Promise<string> {
    if (!text || !text.trim()) return "";

    try {
        const prompt = `Translate the following Hindi text to English. If the text is already English, return it as is. strictly return ONLY the translated text, no preamble or quotes.

Text: "${text}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Translation Error:", error);
        // Fallback: return original text if translation fails
        return text;
    }
}
