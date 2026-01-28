"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import { SeverityBadge, StatusBadge } from "@/components/ui/badges";
import {
    Search, CheckCircle, Clock, AlertTriangle,
    MapPin, Eye, MoreVertical, TrendingUp, FileText, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for officer dashboard
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

            <main className="pt-24 pb-8 px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                            Officer <span className="gradient-text">Dashboard</span>
                        </h1>
                        <p className="text-[var(--text-muted)]">Manage and resolve civic reports</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                        <div className="glass-card p-4 hover-lift cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-[var(--brand-light)]" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</div>
                                    <div className="text-xs text-[var(--text-muted)]">Total Reports</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-4 hover-lift cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--warning-bg)] flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[var(--warning)]">{stats.open}</div>
                                    <div className="text-xs text-[var(--text-muted)]">Open</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-4 hover-lift cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-[var(--brand-light)]" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[var(--brand-light)]">{stats.inProgress}</div>
                                    <div className="text-xs text-[var(--text-muted)]">In Progress</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-4 hover-lift cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--success-bg)] flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[var(--success)]">{stats.resolved}</div>
                                    <div className="text-xs text-[var(--text-muted)]">Resolved</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-subtle)]" />
                            <input
                                type="text"
                                placeholder="Search reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input pl-12"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--glass-border)]">
                            {[
                                { key: "all", label: "All" },
                                { key: "open", label: "Open" },
                                { key: "progress", label: "In Progress" },
                                { key: "resolved", label: "Resolved" },
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key as typeof filter)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer",
                                        filter === key
                                            ? "bg-[var(--brand)] text-white shadow-lg"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reports Table */}
                    <div className="glass-card-static overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-[var(--glass-border)]">
                                    <tr className="text-left text-sm text-[var(--text-muted)]">
                                        <th className="p-4 font-medium">Category</th>
                                        <th className="p-4 font-medium">Location</th>
                                        <th className="p-4 font-medium">Severity</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium">Upvotes</th>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReports.map((report) => (
                                        <tr
                                            key={report.id}
                                            className="border-b border-[var(--glass-border)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors"
                                        >
                                            <td className="p-4 font-medium text-[var(--text-primary)]">{report.category}</td>
                                            <td className="p-4">
                                                <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {report.location}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <SeverityBadge severity={report.severity} size="sm" />
                                            </td>
                                            <td className="p-4">
                                                <StatusBadge status={report.status as any} size="sm" />
                                            </td>
                                            <td className="p-4">
                                                <span className="flex items-center gap-1.5 text-sm text-[var(--text-primary)]">
                                                    <TrendingUp className="w-3.5 h-3.5 text-[var(--brand-light)]" />
                                                    {report.upvotes}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-[var(--text-muted)]">{report.date}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1">
                                                    <button className="p-2 rounded-lg hover:bg-[var(--bg-surface)] transition-colors cursor-pointer text-[var(--text-muted)]">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 rounded-lg hover:bg-[var(--bg-surface)] transition-colors cursor-pointer text-[var(--text-muted)]">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
