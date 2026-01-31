'use client';

import { useState } from "react";
import { postUpdate } from "@/app/actions/officer";
import { ReportUpdateType } from "@/lib/types";
import { Camera, Send, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WorkConsole({ reportId }: { reportId: string }) {
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState<ReportUpdateType>('progress');
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description) return;

        setLoading(true);

        // Upload image logic placeholder as before
        let imageUrl = undefined;
        if (file) {
            // imageUrl = await uploadFile(file);
        }

        const res = await postUpdate(reportId, type, description, imageUrl);

        if (res.success) {
            alert("Update posted successfully");
            setDescription("");
            setFile(null);
            router.refresh();
        } else {
            // eslint-disable-next-line no-alert
            alert(res.error || "Failed to post update");
        }
        setLoading(false);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                Post Status Update
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setType('progress')}
                        className={`flex-1 py-2 text-xs font-medium rounded border ${type === 'progress'
                                ? 'bg-blue-900/40 border-blue-800 text-blue-400'
                                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                            }`}
                    >
                        PROGRESS UPDATE
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('resolution')}
                        className={`flex-1 py-2 text-xs font-medium rounded border ${type === 'resolution'
                                ? 'bg-emerald-900/40 border-emerald-800 text-emerald-400'
                                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                            }`}
                    >
                        RESOLUTION (FIXED)
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('note')}
                        className={`flex-1 py-2 text-xs font-medium rounded border ${type === 'note'
                                ? 'bg-slate-800 border-slate-700 text-slate-300'
                                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                            }`}
                    >
                        INTERNAL NOTE
                    </button>
                </div>

                <div className="relative">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the action taken..."
                        className="w-full h-24 bg-slate-950 border border-slate-800 rounded p-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 font-mono resize-none"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="cursor-pointer flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <div className="p-2 bg-slate-800 rounded group-hover:bg-slate-700">
                            <Camera className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium">
                            {file ? file.name : "Add Photo Evidence"}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </label>
                    {file && (
                        <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="text-slate-500 hover:text-red-400"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || !description}
                    className="w-full py-3 bg-red-700 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded flex items-center justify-center gap-2 uppercase tracking-wide transition-colors"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {type === 'resolution' ? 'Close Ticket' : 'Post Update'}
                </button>
            </form>
        </div>
    );
}
