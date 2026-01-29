"use server";

import { genAI } from "@/lib/gemini";

export async function translateAction(text: string, targetLang: string = "English"): Promise<string> {
    if (!text.trim()) return "";

    try {
        // Use a faster model without JSON enforcement for translation if possible, 
        // but since lib/gemini exports a configured model, we'll create a new instance here for text.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Translate the following text to ${targetLang}. Only return the translated text, nothing else. Text: "${text}"`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Translation Error:", error);
        return text; // Fallback to original
    }
}
