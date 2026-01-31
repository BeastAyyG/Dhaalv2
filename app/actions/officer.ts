'use server'

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ReportUpdateType } from "@/lib/types";

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

// 1. Claim a report
export async function claimReport(reportId: string) {
    const supabase = await getSupabase();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Check role (Double check on server action for safety)
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (!userData || (userData.role !== 'official' && userData.role !== 'admin')) {
        return { error: "Unauthorized: Officials only" };
    }

    // Insert assignment
    const { data, error } = await supabase
        .from('report_assignments')
        .insert({
            report_id: reportId,
            officer_id: user.id,
            status: 'ACTIVE'
        })
        .select()
        .single();

    if (error) {
        console.error("Error claiming report:", error);
        return { error: error.message };
    }

    // Update report status to IN_PROGRESS if strictly needed, 
    // or we can rely on assignment presence. Let's update status for clarity.
    await supabase.from('reports').update({ status: 'IN_PROGRESS', officer_id: user.id }).eq('id', reportId);

    return { success: true, data };
}

// 2. Post an update (Progress/Resolution)
export async function postUpdate(reportId: string, type: ReportUpdateType, description: string, imageUrl?: string) {
    const supabase = await getSupabase();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Insert update
    const { data, error } = await supabase
        .from('report_updates')
        .insert({
            report_id: reportId,
            officer_id: user.id,
            type,
            description,
            image_url: imageUrl
        })
        .select()
        .single();

    if (error) {
        console.error("Error posting update:", error);
        return { error: error.message };
    }

    // If resolution, update report status
    if (type === 'resolution') {
        await supabase.from('reports').update({ status: 'RESOLVED' }).eq('id', reportId);

        // Mark assignment completed
        await supabase
            .from('report_assignments')
            .update({ status: 'COMPLETED' })
            .eq('report_id', reportId)
            .eq('officer_id', user.id);
    }

    return { success: true, data };
}

// 3. Get nearby reports (Geospatial)
export async function getNearbyReportsForOfficer(lat: number, lng: number, radiusKm: number = 5) {
    const supabase = await getSupabase();

    // Use RPC if available, or fetch loose box and filter in JS if PostGIS not enabled.
    // For now, assuming standard fetch and basic lat/lng filtering for simplicity
    // PROD: Use PostGIS st_dwithin

    // Approximating: 1 deg lat ~ 111km. 5km ~ 0.045 deg
    const range = radiusKm / 111;

    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .gte('lat', lat - range)
        .lte('lat', lat + range)
        .gte('lng', lng - range)
        .lte('lng', lng + range)
        .neq('status', 'RESOLVED') // Only show active
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) return { error: error.message };

    // Refine distance in memory (basic Euclidean for speed, Haversine better but costly in JS loop)
    const activeReports = data.filter(r => {
        const d = Math.sqrt(Math.pow(r.lat - lat, 2) + Math.pow(r.lng - lng, 2)) * 111;
        return d <= radiusKm;
    });

    return { success: true, data: activeReports };
}

// 4. Get my assignments
export async function getMyAssignments() {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { data, error } = await supabase
        .from('report_assignments')
        .select(`
            *,
            reports (*)
        `)
        .eq('officer_id', user.id)
        .eq('status', 'ACTIVE');

    if (error) return { error: error.message };

    // Flatten structure for easier UI consumption
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const assignments = (data as any[]).map((a) => ({
        ...a.reports,
        assignment_id: a.id,
        assigned_at: a.assigned_at
    }));

    return { success: true, data: assignments };
}
