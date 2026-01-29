import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;
console.log("Checking API Key:", apiKey ? `Present (Starts with ${apiKey.substring(0, 5)}...)` : "Missing");

if (!apiKey) {
    console.error("❌ No API Key found");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testRestApi() {
    console.log("\nTesting REST API directly...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`❌ REST API Failed: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Response:", text);
            return;
        }

        const data = await response.json();
        console.log("✅ REST Models available:", data.models?.length || 0);
        console.log("First 3 models:", data.models?.slice(0, 3).map(m => m.name));
    } catch (e) {
        console.error("❌ REST Network Error:", e.message);
    }
}

async function testModel(modelName) {
    console.log(`\nTesting model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log(`✅ ${modelName} Success`);
        return true;
    } catch (error) {
        // Log full error structure
        console.error(`❌ ${modelName} Failed:`);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("StatusText:", error.response.statusText);
        }
        console.error("Message:", error.message);
        return false;
    }
}

async function runTests() {
    await testRestApi();
    await testModel("gemini-1.5-flash");
}

runTests();
