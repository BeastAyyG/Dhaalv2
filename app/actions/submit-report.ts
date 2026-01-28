"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function submitReportAction(
    prevState: any,
    formData: FormData
) {
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const severity = parseInt(formData.get("severity") as string);
    const lat = parseFloat(formData.get("lat") as string);
    const lng = parseFloat(formData.get("lng") as string);
    const imageFile = formData.get("image") as File;

    // 1. Handle Image
    // Ideally: Upload to Supabase Storage.
    // Prototype: Convert to Base64 String and store in Text Column
    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        imageUrl = `data:${imageFile.type};base64,${base64}`;
    }

    // 2. Insert into DB
    if (!supabase) {
        console.warn("Supabase not configured. Mock success.");
        return { success: true, message: "Report processed (Mock)" };
    }

    const { error } = await supabase
        .from("reports")
        .insert({
            category,
            description,
            severity,
            lat,
            lng,
            image_url: imageUrl,
            status: "OPEN",
        });

    if (error) {
        console.error("Submission Error:", error);
        return { success: false, message: "Failed to save report" };
    }

    // 3. Revalidate
    revalidatePath("/");

    return { success: true, message: "Report saved!" };
}
