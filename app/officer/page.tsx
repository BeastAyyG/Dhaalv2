"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import { GlassCard } from "@/components/ui/glass-card";
import { SeverityBadge, StatusBadge } from "@/components/ui/badges";
import {
    Search, Filter, CheckCircle, Clock, AlertTriangle,
    MapPin, Eye, MoreVertical, TrendingUp, Users, FileText
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
        <div className="min-h-screen bg-[var(--background)]">
            <Header />

            <main className="pt-24 pb-8 px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            Officer <span className="gradient-text">Dashboard</span>
                        </h1>
                        <p className="text-[var(--muted)]">Manage and resolve civic reports</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <GlassCard hover={false} className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{stats.total}</div>
                                    <div className="text-xs text-[var(--muted)]">Total Reports</div>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard hover={false} className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-amber-500">{stats.open}</div>
                                    <div className="text-xs text-[var(--muted)]">Open</div>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard hover={false} className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-500">{stats.inProgress}</div>
                                    <div className="text-xs text-[var(--muted)]">In Progress</div>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard hover={false} className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
                                    <div className="text-xs text-[var(--muted)]">Resolved</div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                            <input
                                type="text"
                                placeholder="Search reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] focus:border-[var(--primary)] outline-none transition-colors"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--border)]">
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
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                        filter === key
                                            ? "bg-[var(--card)] shadow-sm"
                                            : "text-[var(--muted)] hover:text-[var(--foreground)]"
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reports Table */}
                    <GlassCard hover={false} className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-[var(--border)]">
                                    <tr className="text-left text-sm text-[var(--muted)]">
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
                                    {filteredReports.map((report, index) => (
                                        <tr
                                            key={report.id}
                                            className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)]/50 transition-colors"
                                        >
                                            <td className="p-4 font-medium">{report.category}</td>
                                            <td className="p-4">
                                                <span className="flex items-center gap-1 text-sm text-[var(--muted)]">
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
                                                <span className="flex items-center gap-1 text-sm">
                                                    <TrendingUp className="w-3.5 h-3.5 text-[var(--primary)]" />
                                                    {report.upvotes}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-[var(--muted)]">{report.date}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1">
                                                    <button className="p-2 rounded-lg hover:bg-[var(--border)] transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 rounded-lg hover:bg-[var(--border)] transition-colors">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>
            </main>
        </div>
    );
}
