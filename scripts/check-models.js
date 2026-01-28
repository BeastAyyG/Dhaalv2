const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const models = await genAI.getGenerativeModelFactory().listModels();
        console.log("Available Models:");
        for await (const model of models) {
            if (model.supportedGenerationMethods.includes("generateContent")) {
                console.log(`- ${model.name}`);
            }
        }
    } catch (e) {
        console.error("Error listing models:", e.message);
    }
}
listModels();
