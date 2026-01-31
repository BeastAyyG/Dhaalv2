'use server'

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Helper to get supabase client
async function getSupabase() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );
}

// Existing comments fetch (assuming it might be here or similar, but adding our new one)

// IMPORTANT: This action is for PUBLIC viewing of official updates. No auth required (RLS allows select)
export async function getPublicReportUpdates(reportId: string) {
    const supabase = await getSupabase();

    // We also want to fetch officer name for the UI, so we join with users
    const { data, error } = await supabase
        .from('report_updates')
        .select(`
            *,
            users:officer_id (name, avatar_url)
        `)
        .eq('report_id', reportId)
        .order('created_at', { ascending: true }); // Chronological

    if (error) {
        console.error("Error fetching updates:", error);
        return { success: false, error: error.message };
    }

    // Flatten logic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates = (data as any[]).map((u) => ({
        ...u,
        officer_name: u.users?.name || 'Officer',
        officer_avatar: u.users?.avatar_url
    }));

    return { success: true, data: updates };
}
