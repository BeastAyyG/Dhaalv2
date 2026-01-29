"use server";

import { createClient } from "@/lib/supabase-server";
import type { Report } from "@/lib/types";

export async function getReportByIdAction(id: string): Promise<Report | null> {
    const supabase = createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Failed to fetch report:", error);
        return null;
    }

    return data as Report;
}
