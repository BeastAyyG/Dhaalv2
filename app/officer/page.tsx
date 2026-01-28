"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import { SeverityBadge, StatusBadge, SkeletonRow } from "@/components/ui/badges";
import {
    Search, CheckCircle, Clock, AlertTriangle,
    MapPin, Eye, MoreVertical, TrendingUp, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockReports = [
    { id: "1", category: "Pothole", severity: 8, status: "OPEN", location: "MG Road", date: "2024-01-28", upvotes: 45 },
    { id: "2", category: "Garbage", severity: 6, status: "IN_PROGRESS", location: "Indiranagar", date: "2024-01-27", upvotes: 32 },
    { id: "3", category: "Street Light", severity: 5, status: "OPEN", location: "Koramangala", date: "2024-01-26", upvotes: 28 },
    { id: "4", category: "Water Leak", severity: 9, status: "OPEN", location: "Whitefield", date: "2024-01-25", upvotes: 67 },
    { id: "5", category: "Road Damage", severity: 7, status: "RESOLVED", location: "HSR Layout", date: "2024-01-24", upvotes: 23 },
];

export default function OfficerDashboard() {
    const [filter, setFilter] = useState<"all" | "open" | "progress" | "resolved">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading] = useState(false);

    const stats = {
        total: mockReports.length,
        open: mockReports.filter(r => r.status === "OPEN").length,
        inProgress: mockReports.filter(r => r.status === "IN_PROGRESS").length,
        resolved: mockReports.filter(r => r.status === "RESOLVED").length,
    };

    const filteredReports = mockReports.filter(r => {
        if (filter === "open" && r.status !== "OPEN") return false;
        if (filter === "progress" && r.status !== "IN_PROGRESS") return false;
        if (filter === "resolved" && r.status !== "RESOLVED") return false;
        if (searchQuery && !r.category.toLowerCase().includes(searchQuery.toLowerCase())
            && !r.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-[var(--bg-deep)]">
            <Header />

            <main className="pt-[5.5rem] pb-8 px-4">
                <div className="max-w-7xl mx-auto">

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
                                    <FileText className="w-4 h-4 text-[var(--info)]" aria-hidden="true" />
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
                                    <AlertTriangle className="w-4 h-4 text-[var(--warning)]" aria-hidden="true" />
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
                                    <Clock className="w-4 h-4 text-[var(--info)]" aria-hidden="true" />
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
                                    <CheckCircle className="w-4 h-4 text-[var(--success)]" aria-hidden="true" />
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
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Search reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input pl-10"
                                aria-label="Search reports"
                            />
                        </div>

                        <div
                            className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--glass-border)]"
                            role="tablist"
                        >
                            {[
                                { key: "all", label: "All" },
                                { key: "open", label: "Open" },
                                { key: "progress", label: "Progress" },
                                { key: "resolved", label: "Resolved" },
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key as typeof filter)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap",
                                        filter === key
                                            ? "bg-[var(--brand)] text-white"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                    )}
                                    role="tab"
                                    aria-selected={filter === key}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="glass-card-static overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full" role="grid">
                                <thead className="border-b border-[var(--glass-border)] bg-[var(--bg-surface)]">
                                    <tr className="text-left text-xs text-[var(--text-subtle)]">
                                        <th className="p-3 font-medium">Category</th>
                                        <th className="p-3 font-medium">Location</th>
                                        <th className="p-3 font-medium">Severity</th>
                                        <th className="p-3 font-medium">Status</th>
                                        <th className="p-3 font-medium">Votes</th>
                                        <th className="p-3 font-medium">Date</th>
                                        <th className="p-3 font-medium sr-only">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <>
                                            <tr><td colSpan={7}><SkeletonRow /></td></tr>
                                            <tr><td colSpan={7}><SkeletonRow /></td></tr>
                                            <tr><td colSpan={7}><SkeletonRow /></td></tr>
                                        </>
                                    ) : (
                                        filteredReports.map((report) => (
                                            <tr
                                                key={report.id}
                                                className="border-b border-[var(--glass-border)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors"
                                            >
                                                <td className="p-3 font-medium text-sm text-[var(--text-primary)]">{report.category}</td>
                                                <td className="p-3">
                                                    <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                                                        <MapPin className="w-3 h-3" aria-hidden="true" />
                                                        {report.location}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <SeverityBadge severity={report.severity} size="sm" />
                                                </td>
                                                <td className="p-3">
                                                    <StatusBadge status={report.status as any} size="sm" />
                                                </td>
                                                <td className="p-3">
                                                    <span className="flex items-center gap-1 text-xs font-mono text-[var(--text-primary)]">
                                                        <TrendingUp className="w-3 h-3 text-[var(--info)]" aria-hidden="true" />
                                                        {report.upvotes}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-xs text-[var(--text-muted)] font-mono">{report.date}</td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-1">
                                                        <button className="btn-icon" aria-label={`View details for ${report.category}`}>
                                                            <Eye className="w-4 h-4" aria-hidden="true" />
                                                        </button>
                                                        <button className="btn-icon" aria-label="More actions">
                                                            <MoreVertical className="w-4 h-4" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
