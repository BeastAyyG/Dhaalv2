'use client';

import { useEffect, useState } from "react";
import { getNearbyReportsForOfficer, claimReport } from "@/app/actions/officer";
import { Report } from "@/lib/types";
import { Loader2, MapPin, Navigation, Locate } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NearbyReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const router = useRouter();

    const loadReports = async (lat: number, lng: number) => {
        setLoading(true);
        const res = await getNearbyReportsForOfficer(lat, lng, 5); // 5km default
        if (res.success && res.data) {
            setReports(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Initial load try
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    loadReports(pos.coords.latitude, pos.coords.longitude);
                },
                (err) => {
                    console.error("GPS Error", err);
                    setPermissionDenied(true);
                    setLoading(false);
                    // Could load default location or empty state
                }
            );
        } else {
            setPermissionDenied(true);
            setLoading(false);
        }
    }, []);

    const handleClaim = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const res = await claimReport(id);
        if (res.success) {
            alert("Report claimed successfully");
            router.push(`/officer`);
        } else {
            // eslint-disable-next-line no-alert
            alert(res.error || "Failed to claim report");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
                <p className="text-slate-500 font-mono text-sm animate-pulse">Scanning Sector...</p>
            </div>
        );
    }

    if (permissionDenied) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
                <div className="bg-red-900/20 p-4 rounded-full mb-4">
                    <MapPin className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-200">Location Access Required</h3>
                <p className="text-slate-400 mt-2 max-w-sm text-sm">
                    To find nearby reports, the console needs access to your GPS location. Please enable location services.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm font-medium transition-colors"
                >
                    Retry Access
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold uppercase tracking-wide text-white flex items-center gap-2">
                        <Locate className="h-5 w-5 text-red-500" />
                        Nearby Reports
                    </h2>
                    <p className="text-xs text-slate-500 font-mono mt-1">
                        SCAN_RADIUS: 5KM // LAT: {location?.lat.toFixed(4)} LNG: {location?.lng.toFixed(4)}
                    </p>
                </div>

                <button
                    onClick={() => location && loadReports(location.lat, location.lng)}
                    className="self-start px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 rounded border border-slate-700 flex items-center gap-2"
                >
                    <Loader2 className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                    REFRESH SCAN
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reports.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        No active reports found in your sector (5km radius).
                    </div>
                ) : (
                    reports.map((report) => (
                        <div
                            key={report.id}
                            className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-slate-200">{report.category}</h3>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${report.severity > 7 ? 'bg-red-900/50 text-red-400 border border-red-900' :
                                    report.severity > 4 ? 'bg-orange-900/50 text-orange-400 border border-orange-900' :
                                        'bg-blue-900/50 text-blue-400 border border-blue-900'
                                    }`}>
                                    Sev: {report.severity}
                                </span>
                            </div>

                            <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-grow">
                                {report.description}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-mono">
                                <Navigation className="h-3 w-3" />
                                {report.location || `${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}`}
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-auto">
                                <Link
                                    href={`/reports/${report.id}`}
                                    className="px-3 py-2 bg-slate-950 hover:bg-slate-900 text-slate-300 text-xs font-medium rounded text-center border border-slate-800 transition-colors"
                                >
                                    View Details
                                </Link>
                                <button
                                    onClick={(e) => handleClaim(report.id, e)}
                                    className="px-3 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-bold rounded uppercase tracking-wider transition-colors shadow-lg shadow-red-900/20"
                                >
                                    Claim Task
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
