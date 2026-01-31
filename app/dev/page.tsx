'use client';

import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";

export default function DevTools() {
    const [user, setUser] = useState<any>(null);
    const [message, setMessage] = useState("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single();
                setUser({ ...data.user, ...profile });
            }
        };
        getUser();
    }, [supabase]);

    const promoteToOfficial = async () => {
        if (!user) return;

        // Try to update role via RLS (Assuming 'Users can update own data' policy exists and allows this column for now)
        // In PROD, this column should be protected from self-update!
        const { error } = await supabase
            .from('users')
            .update({ role: 'official' })
            .eq('id', user.id);

        if (error) {
            setMessage("Error: " + error.message + " (You might need to update RLS or do this in Dashboard)");
        } else {
            setMessage("Success! You are now an Official. Refreshing...");
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Dev Tools</h1>

            {!user ? (
                <p>Please login first.</p>
            ) : (
                <div className="space-y-4">
                    <div className="bg-slate-100 p-4 rounded">
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>Role:</strong> {user.role || 'citizen'}</p>
                    </div>

                    <button
                        onClick={promoteToOfficial}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Promote Self to Official
                    </button>

                    {message && <p className="text-sm p-2 bg-yellow-100 rounded">{message}</p>}

                    <div className="mt-8 pt-8 border-t text-sm text-slate-500">
                        <p>Note: This only works if RLS allows users to update their own role.</p>
                        <p>If this fails, go to Supabase Dashboard {'>'} SQL Editor and run:</p>
                        <pre className="bg-slate-900 text-slate-200 p-2 rounded mt-2 overflow-x-auto">
                            update users set role = 'official' where id = '{user.id}';
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
