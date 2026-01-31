'use client';

import { useEffect, useState } from "react";
import { getMyAssignments } from "@/app/actions/officer";
import { Report } from "@/lib/types";
import { Loader2, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function OfficerDashboard() {
    const [assignments, setAssignments] = useState<(Report & { assignment_id: string, assigned_at: string })[]>([]);
    const [loading, setLoading] = useState(true);

    const loadAssignments = async () => {
        const res = await getMyAssignments();
        if (res.success && res.data) {
            setAssignments(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadAssignments();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
                <p className="text-slate-500 font-mono text-sm animate-pulse">SYNCING ASSIGNMENTS...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold uppercase tracking-wide text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-red-600 rounded-sm inline-block"></span>
                    Current Assignments
                </h2>
                <Badge variant="outline" className="border-slate-700 text-slate-300 font-mono">
                    {assignments.length} ACTIVE
                </Badge>
            </div>

            {assignments.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-lg p-12 text-center bg-slate-900/50">
                    <CheckCircle2 className="h-12 w-12 text-emerald-900/50 mx-auto mb-4" />
                    <h3 className="text-slate-300 font-medium">No Active Assignments</h3>
                    <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                        You have no pending reports. Check nearby reports to claim new work.
                    </p>
                    <Link
                        href="/officer/nearby"
                        className="inline-flex mt-6 items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                    >
                        Find Reports Nearby
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {assignments.map((report) => (
                        <Link
                            key={report.assignment_id}
                            href={`/officer/reports/${report.id}`}
                            className="group relative bg-slate-900 border border-slate-800 hover:border-red-900/50 rounded-lg p-4 transition-all hover:bg-slate-900/80"
                        >
                            <div className="absolute top-4 right-4">
                                <span className={`h-2 w-2 rounded-full absolute top-0 right-0 ${report.priority === 'URGENT' ? 'bg-red-500 animate-ping' :
                                    report.priority === 'HIGH' ? 'bg-orange-500' : 'bg-blue-500'
                                    }`} />
                                <span className={`h-2 w-2 rounded-full ${report.priority === 'URGENT' ? 'bg-red-500' :
                                    report.priority === 'HIGH' ? 'bg-orange-500' : 'bg-blue-500'
                                    }`} />
                            </div>

                            <div className="flex items-start gap-3 mb-3">
                                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                                    <AlertTriangle className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-200 line-clamp-1 group-hover:text-red-400 transition-colors">
                                        {report.category}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-mono">
                                        ID: {report.id.slice(0, 8)}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">
                                {report.description}
                            </p>

                            <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-3 mt-2">
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>
                                        {new Date(report.assigned_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className="font-mono text-emerald-500">
                                    IN PROGRESS
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
