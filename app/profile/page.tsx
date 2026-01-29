"use client";

import { useAuth } from "@/lib/auth-context";
import {
    Trophy, Star, Zap, Shield, Award,
    TrendingUp, Camera, CheckCircle, Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

const userStats = {
    xp: 1250,
    level: 5,
    reports: 23,
    resolved: 18,
    upvotes: 156,
    rank: 42,
};

const badges = [
    { id: "first_report", name: "First Report", icon: Camera, earned: true, description: "Submit your first report" },
    { id: "five_reports", name: "Active Citizen", icon: Star, earned: true, description: "Submit 5 reports" },
    { id: "ten_reports", name: "Guardian", icon: Shield, earned: true, description: "Submit 10 reports" },
    { id: "twenty_five", name: "Champion", icon: Trophy, earned: false, description: "Submit 25 reports" },
    { id: "fifty_upvotes", name: "Influencer", icon: TrendingUp, earned: true, description: "Get 50 upvotes" },
    { id: "resolved", name: "Solver", icon: CheckCircle, earned: true, description: "Get 5 resolved" },
];

const levels = [
    { level: 1, name: "Citizen", minXp: 0 },
    { level: 2, name: "Watchdog", minXp: 100 },
    { level: 3, name: "Reporter", minXp: 300 },
    { level: 4, name: "Guardian", minXp: 600 },
    { level: 5, name: "Defender", minXp: 1000 },
    { level: 6, name: "Champion", minXp: 2000 },
    { level: 7, name: "Hero", minXp: 4000 },
    { level: 8, name: "Legend", minXp: 8000 },
];

const leaderboard = [
    { rank: 1, name: "Rahul S.", xp: 5420, initials: "RS" },
    { rank: 2, name: "Priya M.", xp: 4830, initials: "PM" },
    { rank: 3, name: "Amit K.", xp: 4210, initials: "AK" },
    { rank: 4, name: "Sneha R.", xp: 3890, initials: "SR" },
    { rank: 5, name: "Vikram P.", xp: 3540, initials: "VP" },
];

export default function ProfilePage() {
    const { user } = useAuth();
    const currentLevel = levels.find(l => l.minXp <= userStats.xp && (levels[l.level]?.minXp || Infinity) > userStats.xp) || levels[0];
    const nextLevel = levels[currentLevel.level] || levels[levels.length - 1];
    const progressPercent = ((userStats.xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100;

    return (
        <main className="pt-8 pb-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <section className="glass-card-static p-5 mb-5" aria-labelledby="profile-heading">
                    <div className="flex flex-col md:flex-row items-center gap-5">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-xl bg-[var(--gradient-brand)] flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                {user?.phone?.slice(-2) || "DH"}
                            </div>
                            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-md bg-[var(--brand)] flex items-center justify-center text-white text-xs font-bold">
                                {currentLevel.level}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 id="profile-heading" className="text-xl font-semibold text-[var(--text-primary)] mb-0.5">
                                {user?.phone || "Anonymous Hero"}
                            </h1>
                            <p className="text-sm text-[var(--text-muted)] mb-3">
                                {currentLevel.name} · Rank #{userStats.rank}
                            </p>

                            <div className="max-w-sm">
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="font-medium text-[var(--text-primary)] flex items-center gap-1">
                                        <Zap className="w-3.5 h-3.5 text-[var(--info)]" />
                                        <span className="font-mono">{userStats.xp.toLocaleString()}</span> XP
                                    </span>
                                    <span className="text-[var(--text-subtle)] font-mono">{nextLevel.minXp.toLocaleString()} XP</span>
                                </div>
                                <div className="h-2.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${progressPercent}%`, background: 'var(--gradient-brand)' }}
                                    />
                                </div>
                                <p className="text-[10px] text-[var(--text-subtle)] mt-1.5">
                                    <span className="font-mono">{(nextLevel.minXp - userStats.xp).toLocaleString()}</span> XP to {nextLevel.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-5 text-center">
                            <div>
                                <div className="text-xl font-semibold font-mono gradient-text">{userStats.reports}</div>
                                <div className="text-[10px] text-[var(--text-subtle)]">Reports</div>
                            </div>
                            <div>
                                <div className="text-xl font-semibold font-mono text-[var(--success)]">{userStats.resolved}</div>
                                <div className="text-[10px] text-[var(--text-subtle)]">Resolved</div>
                            </div>
                            <div>
                                <div className="text-xl font-semibold font-mono text-[var(--warning)]">{userStats.upvotes}</div>
                                <div className="text-[10px] text-[var(--text-subtle)]">Upvotes</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Badges */}
                <section className="glass-card-static p-5 mb-5" aria-labelledby="badges-heading">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-md bg-[var(--info-bg)] flex items-center justify-center">
                            <Award className="w-3.5 h-3.5 text-[var(--info)]" />
                        </div>
                        <h2 id="badges-heading" className="font-medium text-sm text-[var(--text-primary)]">Badges</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {badges.map(badge => (
                            <div
                                key={badge.id}
                                className={cn(
                                    "p-3 rounded-lg border transition-all",
                                    badge.earned ? "bg-[var(--info-bg)] border-[rgba(59,130,246,0.2)]" : "bg-[var(--bg-surface)] border-[var(--glass-border)] opacity-50"
                                )}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", badge.earned ? "bg-[var(--brand)]/10" : "bg-[var(--bg-elevated)]")}>
                                        <badge.icon className={cn("w-4 h-4", badge.earned ? "text-[var(--info)]" : "text-[var(--text-subtle)]")} />
                                    </div>
                                    <div>
                                        <div className={cn("font-medium text-xs", badge.earned ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]")}>{badge.name}</div>
                                        <div className="text-[10px] text-[var(--text-subtle)]">{badge.description}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Leaderboard */}
                <section className="glass-card-static p-5" aria-labelledby="leaderboard-heading">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-md bg-[var(--warning-bg)] flex items-center justify-center">
                            <Trophy className="w-3.5 h-3.5 text-[var(--warning)]" />
                        </div>
                        <h2 id="leaderboard-heading" className="font-medium text-sm text-[var(--text-primary)]">Leaderboard</h2>
                    </div>
                    <ol className="space-y-2">
                        {leaderboard.map((user, index) => (
                            <li key={user.rank} className={cn("flex items-center gap-3 p-2.5 rounded-lg transition-colors", index < 3 ? "bg-[var(--warning-bg)]" : "hover:bg-[var(--bg-hover)]")}>
                                <div className={cn(
                                    "w-7 h-7 rounded-md flex items-center justify-center font-semibold text-xs",
                                    index === 0 ? "bg-[var(--warning)] text-black" : index === 1 ? "bg-gray-400 text-white" : index === 2 ? "bg-amber-700 text-white" : "bg-[var(--bg-surface)] text-[var(--text-muted)]"
                                )}>
                                    {index === 0 ? <Crown className="w-3.5 h-3.5" /> : user.rank}
                                </div>
                                <div className="w-9 h-9 rounded-lg bg-[var(--gradient-brand)] flex items-center justify-center text-white text-xs font-semibold">{user.initials}</div>
                                <div className="flex-1 font-medium text-sm text-[var(--text-primary)]">{user.name}</div>
                                <div className="font-semibold text-sm font-mono text-[var(--info)] flex items-center gap-1"><Zap className="w-3 h-3" />{user.xp.toLocaleString()}</div>
                            </li>
                        ))}
                    </ol>
                </section>
            </div>
        </main>
    );
}
