"use client";

import {
    TrendingUp, Users, FileText, CheckCircle,
    PieChart, BarChart3, Activity, ArrowUp, ArrowDown
} from "lucide-react";

const categoryData = [
    { name: "Pothole", count: 45, color: "#EF4444" },
    { name: "Garbage", count: 32, color: "#EAB308" },
    { name: "Street Light", count: 28, color: "#3B82F6" },
    { name: "Water Leak", count: 20, color: "#22C55E" },
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
        <main className="pt-8 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-1">
                        <span className="gradient-text">Analytics</span> Dashboard
                    </h1>
                    <p className="text-sm text-[var(--text-muted)]">Track civic reporting trends and patterns</p>
                </header>

                {/* Stats */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" aria-label="Key metrics">
                    <div className="glass-card-static p-3.5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[var(--info-bg)] flex items-center justify-center">
                                <FileText className="w-4 h-4 text-[var(--info)]" />
                            </div>
                            <span className="flex items-center gap-0.5 text-[10px] text-[var(--success)] font-medium">
                                <ArrowUp className="w-3 h-3" /> 12%
                            </span>
                        </div>
                        <div className="text-xl font-semibold font-mono text-[var(--text-primary)]">{total}</div>
                        <div className="text-[10px] text-[var(--text-subtle)]">Total Reports</div>
                    </div>

                    <div className="glass-card-static p-3.5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[var(--success-bg)] flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                            </div>
                            <span className="flex items-center gap-0.5 text-[10px] text-[var(--success)] font-medium">
                                <ArrowUp className="w-3 h-3" /> 8%
                            </span>
                        </div>
                        <div className="text-xl font-semibold font-mono text-[var(--text-primary)]">72%</div>
                        <div className="text-[10px] text-[var(--text-subtle)]">Resolution Rate</div>
                    </div>

                    <div className="glass-card-static p-3.5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[var(--info-bg)] flex items-center justify-center">
                                <Activity className="w-4 h-4 text-[var(--info)]" />
                            </div>
                            <span className="flex items-center gap-0.5 text-[10px] text-[var(--error)] font-medium">
                                <ArrowDown className="w-3 h-3" /> 3%
                            </span>
                        </div>
                        <div className="text-xl font-semibold font-mono text-[var(--text-primary)]">2.4d</div>
                        <div className="text-[10px] text-[var(--text-subtle)]">Avg Resolution</div>
                    </div>

                    <div className="glass-card-static p-3.5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/12 flex items-center justify-center">
                                <Users className="w-4 h-4 text-purple-400" />
                            </div>
                            <span className="flex items-center gap-0.5 text-[10px] text-[var(--success)] font-medium">
                                <ArrowUp className="w-3 h-3" /> 25%
                            </span>
                        </div>
                        <div className="text-xl font-semibold font-mono text-[var(--text-primary)]">1.2k</div>
                        <div className="text-[10px] text-[var(--text-subtle)]">Active Users</div>
                    </div>
                </section>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                    <section className="glass-card-static p-4" aria-labelledby="category-heading">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-md bg-[var(--info-bg)] flex items-center justify-center">
                                <PieChart className="w-3.5 h-3.5 text-[var(--info)]" />
                            </div>
                            <h2 id="category-heading" className="font-medium text-sm text-[var(--text-primary)]">By Category</h2>
                        </div>
                        <div className="space-y-3">
                            {categoryData.map(cat => (
                                <div key={cat.name}>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-[var(--text-muted)]">{cat.name}</span>
                                        <span className="font-mono font-medium text-[var(--text-primary)]">{cat.count}</span>
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
                    </section>

                    <section className="glass-card-static p-4" aria-labelledby="weekly-heading">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-md bg-[var(--info-bg)] flex items-center justify-center">
                                <BarChart3 className="w-3.5 h-3.5 text-[var(--info)]" />
                            </div>
                            <h2 id="weekly-heading" className="font-medium text-sm text-[var(--text-primary)]">Weekly Trend</h2>
                        </div>
                        <div className="flex items-end justify-between h-32 gap-2">
                            {weeklyData.map(day => (
                                <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5">
                                    <span className="text-[10px] font-mono text-[var(--text-subtle)]">{day.count}</span>
                                    <div
                                        className="w-full rounded-t transition-all duration-500"
                                        style={{
                                            height: `${(day.count / maxWeekly) * 100}%`,
                                            background: 'var(--gradient-brand)'
                                        }}
                                    />
                                    <span className="text-[10px] text-[var(--text-subtle)]">{day.day}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Top Locations */}
                <section className="glass-card-static p-4" aria-labelledby="locations-heading">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-md bg-[var(--info-bg)] flex items-center justify-center">
                            <TrendingUp className="w-3.5 h-3.5 text-[var(--info)]" />
                        </div>
                        <h2 id="locations-heading" className="font-medium text-sm text-[var(--text-primary)]">Top Areas</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {["Koramangala", "Indiranagar", "Whitefield", "HSR Layout", "MG Road"].map((area, i) => (
                            <div key={area} className="text-center p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--glass-border)]">
                                <div className="text-lg font-semibold gradient-text mb-0.5">#{i + 1}</div>
                                <div className="text-xs text-[var(--text-muted)]">{area}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
