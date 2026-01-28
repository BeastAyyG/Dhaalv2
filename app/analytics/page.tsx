"use client";

import { Header } from "@/components/ui/header";
import { GlassCard } from "@/components/ui/glass-card";
import {
    TrendingUp, Users, FileText, CheckCircle,
    PieChart, BarChart3, Activity, ArrowUp, ArrowDown
} from "lucide-react";

// Mock analytics data
const categoryData = [
    { name: "Pothole", count: 45, color: "#EF4444" },
    { name: "Garbage", count: 32, color: "#F59E0B" },
    { name: "Street Light", count: 28, color: "#3B82F6" },
    { name: "Water Leak", count: 20, color: "#10B981" },
    { name: "Other", count: 15, color: "#8B5CF6" },
];

const weeklyData = [
    { day: "Mon", count: 12 },
    { day: "Tue", count: 18 },
    { day: "Wed", count: 15 },
    { day: "Thu", count: 25 },
    { day: "Fri", count: 20 },
    { day: "Sat", count: 8 },
    { day: "Sun", count: 5 },
];

export default function AnalyticsPage() {
    const total = categoryData.reduce((sum, c) => sum + c.count, 0);
    const maxWeekly = Math.max(...weeklyData.map(d => d.count));

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Header />

            <main className="pt-24 pb-8 px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            <span className="gradient-text">Analytics</span> Dashboard
                        </h1>
                        <p className="text-[var(--muted)]">Track civic reporting trends and patterns</p>
                    </div>

                    {/* Top Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <GlassCard hover={false} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <FileText className="w-5 h-5 text-[var(--primary)]" />
                                <span className="flex items-center gap-1 text-xs text-green-500">
                                    <ArrowUp className="w-3 h-3" /> 12%
                                </span>
                            </div>
                            <div className="text-2xl font-bold">{total}</div>
                            <div className="text-xs text-[var(--muted)]">Total Reports</div>
                        </GlassCard>

                        <GlassCard hover={false} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="flex items-center gap-1 text-xs text-green-500">
                                    <ArrowUp className="w-3 h-3" /> 8%
                                </span>
                            </div>
                            <div className="text-2xl font-bold">72%</div>
                            <div className="text-xs text-[var(--muted)]">Resolution Rate</div>
                        </GlassCard>

                        <GlassCard hover={false} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <Activity className="w-5 h-5 text-blue-500" />
                                <span className="flex items-center gap-1 text-xs text-red-500">
                                    <ArrowDown className="w-3 h-3" /> 3%
                                </span>
                            </div>
                            <div className="text-2xl font-bold">2.4 days</div>
                            <div className="text-xs text-[var(--muted)]">Avg Resolution Time</div>
                        </GlassCard>

                        <GlassCard hover={false} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <Users className="w-5 h-5 text-purple-500" />
                                <span className="flex items-center gap-1 text-xs text-green-500">
                                    <ArrowUp className="w-3 h-3" /> 25%
                                </span>
                            </div>
                            <div className="text-2xl font-bold">1,234</div>
                            <div className="text-xs text-[var(--muted)]">Active Citizens</div>
                        </GlassCard>
                    </div>

                    {/* Charts Row */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">

                        {/* Category Distribution */}
                        <GlassCard hover={false} className="p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <PieChart className="w-5 h-5 text-[var(--primary)]" />
                                <h3 className="font-semibold">Reports by Category</h3>
                            </div>

                            {/* Simple Bar Chart */}
                            <div className="space-y-4">
                                {categoryData.map(cat => (
                                    <div key={cat.name}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span>{cat.name}</span>
                                            <span className="font-medium">{cat.count}</span>
                                        </div>
                                        <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${(cat.count / total) * 100}%`,
                                                    backgroundColor: cat.color
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Weekly Trend */}
                        <GlassCard hover={false} className="p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
                                <h3 className="font-semibold">Weekly Reports</h3>
                            </div>

                            {/* Simple Bar Chart */}
                            <div className="flex items-end justify-between h-40 gap-2">
                                {weeklyData.map(day => (
                                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full rounded-t-lg bg-gradient-to-t from-[var(--primary)] to-[var(--accent)] transition-all duration-500"
                                            style={{ height: `${(day.count / maxWeekly) * 100}%` }}
                                        />
                                        <span className="text-xs text-[var(--muted)]">{day.day}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Top Locations */}
                    <GlassCard hover={false} className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
                            <h3 className="font-semibold">Top Reported Areas</h3>
                        </div>

                        <div className="grid md:grid-cols-5 gap-4">
                            {["Koramangala", "Indiranagar", "Whitefield", "HSR Layout", "MG Road"].map((area, i) => (
                                <div key={area} className="text-center p-4 rounded-xl bg-[var(--border)]/50">
                                    <div className="text-2xl font-bold gradient-text">{5 - i}</div>
                                    <div className="text-sm text-[var(--muted)]">{area}</div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </main>
        </div>
    );
}
