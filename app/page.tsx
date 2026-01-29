import ClientHome from "./client-home";
import { createClient } from "@/lib/supabase-server";
import type { Report } from "@/lib/types";

export const revalidate = 0; // Disable cache for real-time feel

// MOCK MODE: Set to true during Supabase outage to bypass DB calls
const MOCK_MODE = false; // Supabase integration enabled

export default async function Home() {
  // Skip DB during outage
  if (MOCK_MODE) {
    console.log("🔧 MOCK MODE: Skipping Supabase, using empty data");
    return <ClientHome reports={[]} />;
  }

  // Fetch Real Data from Supabase if available
  const supabase = createClient();
  let reports = null;
  let error = null;

  if (supabase) {
    // Limit to 5 to prevent timeout from large base64 images
    const response = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    reports = response.data;
    error = response.error;
    error = response.error;
    console.log("Fetched reports:", reports?.length || 0, "Error:", error?.message || "none");
  } else {
    console.warn("Supabase is not configured. Using empty list.");
  }

  // Silently handle errors - app still works with empty array fallback

  // Cast and handle null data
  // Since we haven't set up the table yet, this might return null or error, so fallback to empty array
  const safeReports = (reports || []) as Report[];

  return <ClientHome reports={safeReports} />;
}
