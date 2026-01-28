"use client";

import { Header } from "@/components/ui/header";
import {
    TrendingUp, Users, FileText, CheckCircle,
    PieChart, BarChart3, Activity, ArrowUp, ArrowDown
} from "lucide-react";

// Mock analytics data
const categoryData = [
    { name: "Pothole", count: 45, color: "#CF222E" },
    { name: "Garbage", count: 32, color: "#D29922" },
    { name: "Street Light", count: 28, color: "#0047AB" },
    { name: "Water Leak", count: 20, color: "#2DA44E" },
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
        <div className="min-h-screen bg-[var(--bg-deep)]">
            <Header />

            <main className="pt-24 pb-8 px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                            <span className="gradient-text">Analytics</span> Dashboard
                        </h1>
                        <p className="text-[var(--text-muted)]">Track civic reporting trends and patterns</p>
                    </div>

                    {/* Top Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                        <div className="glass-card p-4 hover-lift cursor-default">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-[var(--brand-light)]" />
                                </div>
                                <span className="flex items-center gap-1 text-xs text-[var(--success)] font-medium">
                                    <ArrowUp className="w-3 h-3" /> 12%
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-[var(--text-primary)]">{total}</div>
                            <div className="text-xs text-[var(--text-muted)]">Total Reports</div>
                        </div>

                        <div className="glass-card p-4 hover-lift cursor-default">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--success-bg)] flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                                </div>
                                <span className="flex items-center gap-1 text-xs text-[var(--success)] font-medium">
                                    <ArrowUp className="w-3 h-3" /> 8%
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-[var(--text-primary)]">72%</div>
                            <div className="text-xs text-[var(--text-muted)]">Resolution Rate</div>
                        </div>

                        <div className="glass-card p-4 hover-lift cursor-default">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-[var(--brand-light)]" />
                                </div>
                                <span className="flex items-center gap-1 text-xs text-[var(--error)] font-medium">
                                    <ArrowDown className="w-3 h-3" /> 3%
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-[var(--text-primary)]">2.4 days</div>
                            <div className="text-xs text-[var(--text-muted)]">Avg Resolution</div>
                        </div>

                        <div className="glass-card p-4 hover-lift cursor-default">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-purple-400" />
                                </div>
                                <span className="flex items-center gap-1 text-xs text-[var(--success)] font-medium">
                                    <ArrowUp className="w-3 h-3" /> 25%
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-[var(--text-primary)]">1,234</div>
                            <div className="text-xs text-[var(--text-muted)]">Active Citizens</div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">

                        {/* Category Distribution */}
                        <div className="glass-card-static p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center">
                                    <PieChart className="w-4 h-4 text-[var(--brand-light)]" />
                                </div>
                                <h3 className="font-semibold text-[var(--text-primary)]">Reports by Category</h3>
                            </div>

                            <div className="space-y-4">
                                {categoryData.map(cat => (
                                    <div key={cat.name}>
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-[var(--text-muted)]">{cat.name}</span>
                                            <span className="font-medium text-[var(--text-primary)]">{cat.count}</span>
                                        </div>
                                        <div className="h-2 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{
                                                    width: `${(cat.count / total) * 100}%`,
                                                    backgroundColor: cat.color
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weekly Trend */}
                        <div className="glass-card-static p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center">
                                    <BarChart3 className="w-4 h-4 text-[var(--brand-light)]" />
                                </div>
                                <h3 className="font-semibold text-[var(--text-primary)]">Weekly Reports</h3>
                            </div>

                            <div className="flex items-end justify-between h-40 gap-2">
                                {weeklyData.map(day => (
                                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="text-xs text-[var(--text-muted)] mb-1">{day.count}</div>
                                        <div
                                            className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                                            style={{
                                                height: `${(day.count / maxWeekly) * 100}%`,
                                                background: 'var(--gradient-brand)'
                                            }}
                                        />
                                        <span className="text-xs text-[var(--text-subtle)]">{day.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top Locations */}
                    <div className="glass-card-static p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-[var(--brand-light)]" />
                            </div>
                            <h3 className="font-semibold text-[var(--text-primary)]">Top Reported Areas</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {["Koramangala", "Indiranagar", "Whitefield", "HSR Layout", "MG Road"].map((area, i) => (
                                <div key={area} className="text-center p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--glass-border)] hover-lift cursor-default">
                                    <div className="text-2xl font-bold gradient-text mb-1">#{i + 1}</div>
                                    <div className="text-sm text-[var(--text-muted)]">{area}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
