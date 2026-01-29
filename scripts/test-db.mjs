import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDB() {
    console.log("Testing Supabase connection...\n");

    // Check reports
    const { data: reports, error: reportsError } = await supabase
        .from("reports")
        .select("id, category, status, created_at")
        .limit(5);

    if (reportsError) {
        console.error("❌ Reports Error:", reportsError);
    } else {
        console.log("✅ Reports found:", reports?.length || 0);
        if (reports?.length) {
            console.table(reports);
        }
    }

    // Check comments
    const { data: comments, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .limit(5);

    if (commentsError) {
        console.error("❌ Comments Error:", commentsError);
    } else {
        console.log("\n✅ Comments found:", comments?.length || 0);
    }
}

testDB();
