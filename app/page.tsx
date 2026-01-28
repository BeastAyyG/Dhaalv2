import ClientHome from "./client-home";
import { supabase } from "@/lib/supabase";
import type { Report } from "@/lib/types";

export const revalidate = 0; // Disable cache for real-time feel

export default async function Home() {
  // Fetch Real Data from Supabase if available
  let reports = null;
  let error = null;

  if (supabase) {
    const response = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });
    reports = response.data;
    error = response.error;
  } else {
    console.warn("Supabase is not configured. Using empty list.");
  }

  if (error) {
    console.error("Supabase Error:", error);
  }

  // Cast and handle null data
  // Since we haven't set up the table yet, this might return null or error, so fallback to empty array
  const safeReports = (reports || []) as Report[];

  return <ClientHome reports={safeReports} />;
}
