"use client";

import { useState } from "react";
import { SeverityBadge, StatusBadge } from "@/components/ui/badges";
import { ReportActions } from "@/components/officer/report-actions";
import {
    Search, CheckCircle, Clock, AlertTriangle,
    MapPin, TrendingUp, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Report } from "@/lib/types";

interface OfficerDashboardClientProps {
    initialReports: Report[];
}

export function OfficerDashboardClient({ initialReports }: OfficerDashboardClientProps) {
    const [filter, setFilter] = useState<"all" | "open" | "progress" | "resolved">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const reports = initialReports;

    const stats = {
        total: reports.length,
        open: reports.filter(r => r.status === "OPEN").length,
        inProgress: reports.filter(r => r.status === "IN_PROGRESS").length,
        resolved: reports.filter(r => r.status === "RESOLVED").length,
    };

    const filteredReports = reports.filter(r => {
        if (filter === "open" && r.status !== "OPEN") return false;
        if (filter === "progress" && r.status !== "IN_PROGRESS") return false;
        if (filter === "resolved" && r.status !== "RESOLVED") return false;
        if (searchQuery && !r.category.toLowerCase().includes(searchQuery.toLowerCase())
            && !r.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="bg-[var(--bg-deep)] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <header className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-1">
                        Officer <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p className="text-sm text-[var(--text-muted)]">Manage and resolve civic reports</p>
                </header>

                {/* Stats */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" aria-label="Report statistics">
                    <div className="glass-card-static p-3.5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[var(--info-bg)] flex items-center justify-center">
                                <FileText className="w-4 h-4 text-[var(--info)]" />
                            </div>
                            <div>
                                <div className="text-xl font-semibold font-mono text-[var(--text-primary)]">{stats.total}</div>
                                <div className="text-[11px] text-[var(--text-subtle)]">Total</div>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card-static p-3.5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[var(--warning-bg)] flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                            </div>
                            <div>
                                <div className="text-xl font-semibold font-mono text-[var(--warning)]">{stats.open}</div>
                                <div className="text-[11px] text-[var(--text-subtle)]">Open</div>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card-static p-3.5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[var(--info-bg)] flex items-center justify-center">
                                <Clock className="w-4 h-4 text-[var(--info)]" />
                            </div>
                            <div>
                                <div className="text-xl font-semibold font-mono text-[var(--info)]">{stats.inProgress}</div>
                                <div className="text-[11px] text-[var(--text-subtle)]">Progress</div>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card-static p-3.5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[var(--success-bg)] flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                            </div>
                            <div>
                                <div className="text-xl font-semibold font-mono text-[var(--success)]">{stats.resolved}</div>
                                <div className="text-[11px] text-[var(--text-subtle)]">Resolved</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-3 mb-5">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
                        <input
                            type="search"
                            placeholder="Search reports..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-10 w-full"
                        />
                    </div>
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--glass-border)]">
                        {["all", "open", "progress", "resolved"].map((key) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key as "all" | "open" | "progress" | "resolved")}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize",
                                    filter === key ? "bg-[var(--brand)] text-white" : "text-[var(--text-muted)]"
                                )}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="glass-card-static overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-[var(--glass-border)] bg-[var(--bg-surface)]">
                                <tr className="text-left text-xs text-[var(--text-subtle)]">
                                    <th className="p-3 font-medium">Category</th>
                                    <th className="p-3 font-medium">Location</th>
                                    <th className="p-3 font-medium">Severity</th>
                                    <th className="p-3 font-medium">Status</th>
                                    <th className="p-3 font-medium">Votes</th>
                                    <th className="p-3 font-medium">Date</th>
                                    <th className="p-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.length === 0 ? (
                                    <tr><td colSpan={7} className="p-8 text-center text-[var(--text-muted)]">No reports found</td></tr>
                                ) : (
                                    filteredReports.map((report) => (
                                        <tr key={report.id} className="border-b border-[var(--glass-border)] last:border-0 hover:bg-[var(--bg-hover)]">
                                            <td className="p-3 font-medium text-sm text-[var(--text-primary)]">{report.category}</td>
                                            <td className="p-3">
                                                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                                                    <MapPin className="w-3 h-3" />
                                                    {report.location || `${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}`}
                                                </span>
                                            </td>
                                            <td className="p-3"><SeverityBadge severity={report.severity} size="sm" /></td>
                                            <td className="p-3"><StatusBadge status={report.status} size="sm" /></td>
                                            <td className="p-3">
                                                <span className="flex items-center gap-1 text-xs font-mono text-[var(--text-primary)]">
                                                    <TrendingUp className="w-3 h-3 text-[var(--info)]" />
                                                    {report.upvotes}
                                                </span>
                                            </td>
                                            <td className="p-3 text-xs text-[var(--text-muted)] font-mono">{new Date(report.created_at).toLocaleDateString()}</td>
                                            <td className="p-3">
                                                <ReportActions reportId={report.id} currentStatus={report.status} currentPriority={report.priority} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
