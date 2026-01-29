import { createClient } from "@/lib/supabase-server";
import { OfficerDashboardClient } from "./officer-dashboard-client";
// import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OfficerPage() {
    const supabase = createClient();



    // Fetch reports
    const { data: reports } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });


    // Silently handle empty errors

    // Transform data to match UI types if needed
    // (Supabase returns snake_case, our types might expect consistent camelCase or match DB)
    // Our types currently match DB mostly, except maybe some optional UI fields.

    return <OfficerDashboardClient initialReports={reports || []} />;
}
