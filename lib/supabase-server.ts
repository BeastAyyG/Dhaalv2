import { createClient as createClientPrimitive } from "@supabase/supabase-js";

export const createClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClientPrimitive(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
        },
    });
};
