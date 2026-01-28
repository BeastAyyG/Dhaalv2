import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
}

const isValidUrl = (url: string) => {
    try { return new URL(url).protocol.startsWith("http"); }
    catch { return false; }
};

// Safe initialization
export const supabase = (supabaseUrl && isValidUrl(supabaseUrl) && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;
