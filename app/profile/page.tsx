"use client";

import { Header } from "@/components/ui/header";
import { useAuth } from "@/lib/auth-context";
import {
    Trophy, Star, Zap, Shield, Award,
    TrendingUp, Camera, CheckCircle, Target, Crown
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
    { id: "fifty_upvotes", name: "Influencer", icon: TrendingUp, earned: true, description: "Get 50 upvotes" },
    { id: "resolved", name: "Problem Solver", icon: CheckCircle, earned: true, description: "Get 5 resolved" },
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
    { rank: 1, name: "Rahul S.", xp: 5420, avatar: "RS" },
    { rank: 2, name: "Priya M.", xp: 4830, avatar: "PM" },
    { rank: 3, name: "Amit K.", xp: 4210, avatar: "AK" },
    { rank: 4, name: "Sneha R.", xp: 3890, avatar: "SR" },
    { rank: 5, name: "Vikram P.", xp: 3540, avatar: "VP" },
];

export default function ProfilePage() {
    const { user } = useAuth();
    const currentLevel = levels.find(l => l.minXp <= userStats.xp && (levels[l.level]?.minXp || Infinity) > userStats.xp) || levels[0];
    const nextLevel = levels[currentLevel.level] || levels[levels.length - 1];
    const progressPercent = ((userStats.xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100;

    return (
        <div className="min-h-screen bg-[var(--bg-deep)]">
            <Header />

            <main className="pt-24 pb-8 px-4">
                <div className="max-w-4xl mx-auto">

                    {/* Profile Header */}
                    <div className="glass-card-static p-6 mb-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl bg-[var(--gradient-brand)] flex items-center justify-center text-3xl font-bold text-white shadow-xl brand-glow">
                                    {user?.phone?.slice(-2) || "DH"}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[var(--brand)] flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                    {currentLevel.level}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                                    {user?.phone || "Anonymous Hero"}
                                </h1>
                                <p className="text-[var(--text-muted)] mb-4">
                                    {currentLevel.name} · Rank #{userStats.rank}
                                </p>

                                {/* XP Progress */}
                                <div className="max-w-md">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="font-medium text-[var(--text-primary)]">
                                            <Zap className="w-4 h-4 inline text-[var(--brand-light)] mr-1" />
                                            {userStats.xp.toLocaleString()} XP
                                        </span>
                                        <span className="text-[var(--text-muted)]">{nextLevel.minXp.toLocaleString()} XP</span>
                                    </div>
                                    <div className="h-3 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${progressPercent}%`,
                                                background: 'var(--gradient-brand)'
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-[var(--text-subtle)] mt-2">
                                        {(nextLevel.minXp - userStats.xp).toLocaleString()} XP to {nextLevel.name}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex gap-6 text-center">
                                <div>
                                    <div className="text-2xl font-bold gradient-text">{userStats.reports}</div>
                                    <div className="text-xs text-[var(--text-muted)]">Reports</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[var(--success)]">{userStats.resolved}</div>
                                    <div className="text-xs text-[var(--text-muted)]">Resolved</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[var(--warning)]">{userStats.upvotes}</div>
                                    <div className="text-xs text-[var(--text-muted)]">Upvotes</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="glass-card-static p-6 mb-6">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center">
                                <Award className="w-4 h-4 text-[var(--brand-light)]" />
                            </div>
                            <h2 className="font-semibold text-[var(--text-primary)]">Badges</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {badges.map(badge => (
                                <div
                                    key={badge.id}
                                    className={cn(
                                        "p-4 rounded-xl border transition-all cursor-default",
                                        badge.earned
                                            ? "bg-[var(--brand)]/5 border-[var(--brand)]/20 hover-lift"
                                            : "bg-[var(--bg-surface)] border-[var(--glass-border)] opacity-50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center",
                                            badge.earned ? "bg-[var(--brand)]/10" : "bg-[var(--bg-elevated)]"
                                        )}>
                                            <badge.icon className={cn(
                                                "w-5 h-5",
                                                badge.earned ? "text-[var(--brand-light)]" : "text-[var(--text-subtle)]"
                                            )} />
                                        </div>
                                        <div>
                                            <div className={cn(
                                                "font-medium text-sm",
                                                badge.earned ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                                            )}>
                                                {badge.name}
                                            </div>
                                            <div className="text-xs text-[var(--text-subtle)]">{badge.description}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="glass-card-static p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-[var(--warning)]/10 flex items-center justify-center">
                                <Trophy className="w-4 h-4 text-[var(--warning)]" />
                            </div>
                            <h2 className="font-semibold text-[var(--text-primary)]">Leaderboard</h2>
                        </div>

                        <div className="space-y-2">
                            {leaderboard.map((user, index) => (
                                <div
                                    key={user.rank}
                                    className={cn(
                                        "flex items-center gap-4 p-3 rounded-xl transition-colors cursor-default",
                                        index < 3 ? "bg-[var(--warning)]/5" : "hover:bg-[var(--bg-hover)]"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                                        index === 0 && "bg-[var(--warning)] text-black",
                                        index === 1 && "bg-gray-400 text-white",
                                        index === 2 && "bg-amber-700 text-white",
                                        index > 2 && "bg-[var(--bg-surface)] text-[var(--text-muted)]"
                                    )}>
                                        {index === 0 ? <Crown className="w-4 h-4" /> : user.rank}
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-[var(--gradient-brand)] flex items-center justify-center text-white text-sm font-bold">
                                        {user.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-[var(--text-primary)]">{user.name}</div>
                                    </div>
                                    <div className="font-bold text-[var(--brand-light)]">
                                        <Zap className="w-3.5 h-3.5 inline mr-1" />
                                        {user.xp.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
