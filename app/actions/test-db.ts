"use server";

import { supabase } from "@/lib/supabase";

export async function checkConnection() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    if (!supabase) {
        return {
            success: false,
            message: `Client Error. URL: ${url.slice(0, 8)}... Key: ${key.slice(0, 5)}...`
        };
    }

    try {
        const { error } = await supabase.from("reports").select("count").limit(1);

        if (error) {
            return { success: false, message: `Connection Failed: ${error.message}` };
        }

        return { success: true, message: "✅ Connected to Supabase! Reports table found." };
    } catch {
        return { success: false, message: "Unknown error during connection check" };
    }
}
