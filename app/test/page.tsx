"use client";

import { useState } from "react";
import { checkConnection } from "@/app/actions/test-db";

export default function TestPage() {
    const [status, setStatus] = useState<{ success?: boolean; message: string } | null>(null);

    return (
        <div className="p-10 flex flex-col items-center justify-center min-h-screen space-y-4">
            <h1 className="text-2xl font-bold">System Diagnostics</h1>

            <button
                onClick={async () => {
                    setStatus({ message: "Checking..." });
                    const result = await checkConnection();
                    setStatus(result);
                }}
                className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:opacity-80"
            >
                Test Database Connection
            </button>

            {status && (
                <div className={`p-4 rounded border ${status.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {status.message}
                </div>
            )}
        </div>
    );
}
