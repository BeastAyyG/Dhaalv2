import ClientHome from "./client-home";
import { createClient } from "@/lib/supabase-server";
import type { Report } from "@/lib/types";

export const revalidate = 0; // Disable cache for real-time feel
export const dynamic = "force-dynamic";

// MOCK MODE: Set to true during Supabase outage to bypass DB calls
const MOCK_MODE = false; // Supabase integration enabled

export default async function Home() {
  // Skip DB during outage/maintenance if flag is on
  if (MOCK_MODE) {
    return <ClientHome reports={[]} />;
  }

  // Fetch Real Data from Supabase
  const supabase = createClient();
  let reports: Report[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50); // Reasonable limit for initial load

      if (error) {
        console.error("Error fetching reports:", error.message);
      } else if (data) {
        reports = data as Report[];
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }

  return <ClientHome reports={reports} />;
}
