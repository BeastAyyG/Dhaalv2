"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { ReportStatus, ReportPriority } from "@/lib/types";

export type UpdateReportState = {
    message: string;
    success: boolean;
};

export async function updateReportStatusAction(
    reportId: string,
    status: ReportStatus
): Promise<UpdateReportState> {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from("reports")
            .update({ status })
            .eq("id", reportId);

        if (error) throw error;

        revalidatePath("/officer");
        revalidatePath("/"); // Update home feed too
        return { success: true, message: "Status updated successfully" };
    } catch (e) {
        console.error("Error updating status:", e);
        return { success: false, message: "Failed to update status" };
    }
}

export async function updateReportPriorityAction(
    reportId: string,
    priority: ReportPriority
): Promise<UpdateReportState> {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from("reports")
            .update({ priority })
            .eq("id", reportId);

        if (error) throw error;

        revalidatePath("/officer");
        return { success: true, message: "Priority updated successfully" };
    } catch (e) {
        console.error("Error updating priority:", e);
        return { success: false, message: "Failed to update priority" };
    }
}
