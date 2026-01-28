"use client";

import { Header } from "@/components/ui/header";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/lib/auth-context";
import {
    Trophy, Star, Zap, Shield, Target, Award,
    TrendingUp, MapPin, Camera, CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Gamification data (mock)
const userStats = {
    xp: 1250,
    level: 5,
    nextLevelXp: 2000,
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
    { id: "fifty_upvotes", name: "Influencer", icon: TrendingUp, earned: true, description: "Get 50 upvotes on your reports" },
    { id: "resolved", name: "Problem Solver", icon: CheckCircle, earned: true, description: "Get 5 reports resolved" },
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
    { rank: 1, name: "Rahul S.", xp: 5420, avatar: "🦹" },
    { rank: 2, name: "Priya M.", xp: 4830, avatar: "👩‍🦰" },
    { rank: 3, name: "Amit K.", xp: 4210, avatar: "🧔" },
    { rank: 4, name: "Sneha R.", xp: 3890, avatar: "👱‍♀️" },
    { rank: 5, name: "Vikram P.", xp: 3540, avatar: "👨‍🦱" },
];

export default function ProfilePage() {
    const { user } = useAuth();
    const currentLevel = levels.find(l => l.minXp <= userStats.xp && (levels[l.level]?.minXp || Infinity) > userStats.xp) || levels[0];
    const nextLevel = levels[currentLevel.level] || levels[levels.length - 1];
    const progressPercent = ((userStats.xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100;

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Header />

            <main className="pt-24 pb-8 px-4">
                <div className="max-w-4xl mx-auto">

                    {/* Profile Header */}
                    <GlassCard hover={false} className="p-6 mb-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-4xl">
                                    🦹
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-sm font-bold">
                                    {currentLevel.level}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-2xl font-bold mb-1">{user?.phone || "Anonymous Hero"}</h1>
                                <p className="text-[var(--muted)] mb-3">{currentLevel.name} · Rank #{userStats.rank}</p>

                                {/* XP Progress */}
                                <div className="max-w-md">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="font-medium">{userStats.xp} XP</span>
                                        <span className="text-[var(--muted)]">{nextLevel.minXp} XP</span>
                                    </div>
                                    <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-[var(--muted)] mt-1">
                                        {nextLevel.minXp - userStats.xp} XP to {nextLevel.name}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold gradient-text">{userStats.reports}</div>
                                    <div className="text-xs text-[var(--muted)]">Reports</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-500">{userStats.resolved}</div>
                                    <div className="text-xs text-[var(--muted)]">Resolved</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-amber-500">{userStats.upvotes}</div>
                                    <div className="text-xs text-[var(--muted)]">Upvotes</div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Badges */}
                    <GlassCard hover={false} className="p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Award className="w-5 h-5 text-[var(--primary)]" />
                            <h2 className="font-semibold">Badges</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {badges.map(badge => (
                                <div
                                    key={badge.id}
                                    className={cn(
                                        "p-4 rounded-xl border transition-all",
                                        badge.earned
                                            ? "bg-[var(--primary)]/5 border-[var(--primary)]/20"
                                            : "bg-[var(--border)]/30 border-[var(--border)] opacity-50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center",
                                            badge.earned ? "bg-[var(--primary)]/10" : "bg-[var(--border)]"
                                        )}>
                                            <badge.icon className={cn(
                                                "w-5 h-5",
                                                badge.earned ? "text-[var(--primary)]" : "text-[var(--muted)]"
                                            )} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{badge.name}</div>
                                            <div className="text-xs text-[var(--muted)]">{badge.description}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Leaderboard */}
                    <GlassCard hover={false} className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            <h2 className="font-semibold">Leaderboard</h2>
                        </div>

                        <div className="space-y-3">
                            {leaderboard.map((user, index) => (
                                <div
                                    key={user.rank}
                                    className={cn(
                                        "flex items-center gap-4 p-3 rounded-xl transition-colors",
                                        index < 3 ? "bg-amber-500/5" : "hover:bg-[var(--border)]/50"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                                        index === 0 && "bg-amber-500 text-white",
                                        index === 1 && "bg-gray-400 text-white",
                                        index === 2 && "bg-amber-700 text-white",
                                        index > 2 && "bg-[var(--border)]"
                                    )}>
                                        {user.rank}
                                    </div>
                                    <div className="text-2xl">{user.avatar}</div>
                                    <div className="flex-1">
                                        <div className="font-medium">{user.name}</div>
                                    </div>
                                    <div className="font-bold text-[var(--primary)]">{user.xp.toLocaleString()} XP</div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </main>
        </div>
    );
}
