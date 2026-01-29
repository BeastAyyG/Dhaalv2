import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load .env.local manually since we are outside Next.js
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing env vars");
    process.exit(1);
}

console.log(`Checking connection to: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.time("Query Time");
    // Try to fetch 1 report. If table missing, should error fast.
    const { data, error } = await supabase.from("reports").select("id").limit(1);
    console.timeEnd("Query Time");

    if (error) {
        console.error("❌ Supabase Error:", JSON.stringify(error, null, 2));
    } else {
        console.log("✅ Connection Successful. Data:", data);
    }
}

testConnection();
