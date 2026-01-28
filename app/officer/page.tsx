import { createClient } from "@/lib/supabase-server";
import { OfficerDashboardClient } from "./officer-dashboard-client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OfficerPage() {
    const supabase = createClient();

    // Check auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        // In a real app, we'd check for specific officer role here
        // redirect("/login");
    }

    // Fetch reports
    const { data: reports, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching reports:", error);
    }

    // Transform data to match UI types if needed
    // (Supabase returns snake_case, our types might expect consistent camelCase or match DB)
    // Our types currently match DB mostly, except maybe some optional UI fields.

    return <OfficerDashboardClient initialReports={reports || []} />;
}
