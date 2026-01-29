import { Level } from "./types";
import { Camera, Star, Shield, Trophy, TrendingUp, CheckCircle, Award } from "lucide-react";

export const LEVELS: Level[] = [
    { level: 1, name: "Citizen", minXp: 0 },
    { level: 2, name: "Watchdog", minXp: 100 },
    { level: 3, name: "Reporter", minXp: 300 },
    { level: 4, name: "Guardian", minXp: 600 },
    { level: 5, name: "Defender", minXp: 1000 },
    { level: 6, name: "Champion", minXp: 2000 },
    { level: 7, name: "Hero", minXp: 4000 },
    { level: 8, name: "Legend", minXp: 8000 },
];

export const BADGES_CONFIG = [
    { id: "first_report", name: "First Report", icon: Camera, description: "Submit your first report" },
    { id: "five_reports", name: "Active Citizen", icon: Star, description: "Submit 5 reports" },
    { id: "ten_reports", name: "Guardian", icon: Shield, description: "Submit 10 reports" },
    { id: "twenty_five", name: "Champion", icon: Trophy, description: "Submit 25 reports" },
    { id: "fifty_upvotes", name: "Influencer", icon: TrendingUp, description: "Get 50 upvotes" },
    { id: "resolved", name: "Solver", icon: CheckCircle, description: "Get 5 resolved" },
    { id: "perfect_report", name: "Perfectionist", icon: Award, description: "Submit a report with all details" },
];

export function calculateLevel(xp: number): Level {
    // Find level where xp >= minXp, take the highest one
    const level = LEVELS.slice().reverse().find(l => xp >= l.minXp);
    return level || LEVELS[0];
}

export function getNextLevel(currentLevel: number): Level | null {
    return LEVELS.find(l => l.level === currentLevel + 1) || null;
}

export function calculateProgress(xp: number): number {
    const current = calculateLevel(xp);
    const next = getNextLevel(current.level);

    if (!next) return 100; // Max level

    const range = next.minXp - current.minXp;
    const progress = xp - current.minXp;

    return Math.min(100, Math.max(0, (progress / range) * 100));
}

export function checkBadges(userStats: { reports: number, upvotes: number, resolved: number }) {
    const earnedIds: string[] = [];

    if (userStats.reports >= 1) earnedIds.push("first_report");
    if (userStats.reports >= 5) earnedIds.push("five_reports");
    if (userStats.reports >= 10) earnedIds.push("ten_reports");
    if (userStats.reports >= 25) earnedIds.push("twenty_five");
    if (userStats.upvotes >= 50) earnedIds.push("fifty_upvotes");
    if (userStats.resolved >= 5) earnedIds.push("resolved");

    return earnedIds;
}

export const XP_REWARDS = {
    SUBMIT_REPORT: 50,
    VERIFY_REPORT: 10,
    GET_UPVOTE: 5,
    REPORT_RESOLVED: 100,
};
