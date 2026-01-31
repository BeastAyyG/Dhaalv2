'use client';

import { useEffect, useState } from "react";
import WorkConsole from "@/components/officer/work-console";
import { Report } from "@/lib/types";
import { Loader2, Calendar, MapPin, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function OfficerReportDetail({ params }: { params: { id: string } }) {
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch for MVP since we don't have a GetById action available yet in the context
        const fetchReport = async () => {
            // In real app: const data = await getReportById(params.id);
            setLoading(false);
        };
        fetchReport();
    }, [params.id]);

    const mockReport: Report = {
        id: params.id,
        user_id: "u-123",
        category: "Pothole",
        severity: 8,
        description: "Large pothole causing traffic slowdown. Dangerous for bikes.",
        lat: 28.6139,
        lng: 77.2090,
        image_url: "/placeholder.png",
        status: "IN_PROGRESS",
        priority: "HIGH",
        upvotes: 12,
        created_at: new Date().toISOString()
    };

    if (false && loading) {
        return <Loader2 className="h-8 w-8 animate-spin m-auto" />;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link
                href="/officer"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Console
            </Link>

            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <div className="h-48 bg-slate-800 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-mono text-xs">
                        [ SCENE EVIDENCE IMAGE ]
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">{mockReport.category}</h1>
                            <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(mockReport.created_at).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    Sector 4
                                </span>
                            </div>
                        </div>
                        <Badge className={`${mockReport.priority === 'URGENT' ? 'bg-red-900 text-red-200' :
                                'bg-blue-900 text-blue-200'
                            } border-0 uppercase`}>
                            {mockReport.priority} PRIORITY
                        </Badge>
                    </div>

                    <div className="bg-slate-950 p-4 rounded border border-slate-800 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                            <p className="text-slate-300 text-sm leading-relaxed">
                                {mockReport.description}
                            </p>
                        </div>
                    </div>

                    {/* OFFICER WORK CONSOLE COMPONENT */}
                    <WorkConsole reportId={params.id} />

                </div>
            </div>
        </div>
    );
}
