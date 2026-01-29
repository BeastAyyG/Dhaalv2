"use client";

import { useState } from "react";
import { AlertTriangle, Radio, Flame, Zap, MapPin, Clock, ChevronRight, X, Siren, TriangleAlert } from "lucide-react";
import type { Report } from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmergencyAlertBannerProps {
    emergencies: Report[];
}

export function EmergencyAlertBanner({ emergencies }: EmergencyAlertBannerProps) {
    const [now] = useState(() => Date.now());
    const [dismissed, setDismissed] = useState(false);

    // ONLY show for severity 9-10 (true crisis)
    const criticalEmergencies = emergencies.filter(e => e.severity >= 9);

    if (!criticalEmergencies || criticalEmergencies.length === 0 || dismissed) return null;

    const formatTime = (dateStr: string) => {
        const diff = now - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
        return `${Math.floor(mins / 1440)}d ago`;
    };

    const getEmergencyIcon = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('fire') || cat.includes('explosion')) return Flame;
        if (cat.includes('electric') || cat.includes('power')) return Zap;
        if (cat.includes('earthquake') || cat.includes('collapse')) return TriangleAlert;
        return Siren;
    };

    return (
        <div className="relative z-0 shadow-2xl shadow-red-900/50">
            {/* DRAMATIC RED GRADIENT BACKGROUND */}
            <div className="relative overflow-hidden bg-gradient-to-r from-red-800 via-red-600 to-red-800">

                {/* Animated background effects */}
                <div className="absolute inset-0">
                    {/* Pulsing glow */}
                    <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
                    {/* Shimmer sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    {/* Danger stripes pattern */}
                    <div className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.3) 10px, rgba(0,0,0,0.3) 20px)`
                        }}
                    />
                </div>

                {/* Main Content */}
                <div className="relative">

                    {/* TOP BAR - BREAKING NEWS TICKER */}
                    <div className="flex items-center gap-4 px-4 py-3 bg-black/30 border-b border-red-400/30">

                        {/* ALERT ICON - Animated */}
                        <div className="shrink-0 flex items-center gap-3">
                            <div className="relative">
                                <Siren className="w-6 h-6 text-white animate-bounce" />
                                <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
                            </div>
                        </div>

                        {/* BREAKING BADGE - Large and prominent */}
                        <div className="shrink-0">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white rounded-lg animate-pulse opacity-30" />
                                <div className="relative bg-white text-red-700 px-4 py-1.5 rounded-lg font-black text-sm uppercase tracking-widest shadow-lg">
                                    🚨 BREAKING NEWS
                                </div>
                            </div>
                        </div>

                        {/* CRISIS COUNT */}
                        <div className="shrink-0 bg-red-900/50 border border-red-400/40 rounded-full px-3 py-1">
                            <span className="text-white font-bold text-sm">
                                {criticalEmergencies.length} CRITICAL {criticalEmergencies.length === 1 ? 'ALERT' : 'ALERTS'}
                            </span>
                        </div>

                        {/* Scrolling Ticker */}
                        <div className="flex-1 overflow-hidden">
                            <div className="flex animate-marquee whitespace-nowrap">
                                {[...criticalEmergencies, ...criticalEmergencies].map((alert, idx) => (
                                    <Link
                                        key={`${alert.id}-${idx}`}
                                        href={`/report/${alert.id}`}
                                        className="inline-flex items-center gap-3 mx-8 text-white hover:text-yellow-200 transition-colors"
                                    >
                                        <Radio className="w-3 h-3 text-yellow-300 animate-pulse" />
                                        <span className="font-bold text-lg">{alert.category.toUpperCase()}</span>
                                        <span className="text-white/70">•</span>
                                        <span className="text-white/80">{formatTime(alert.created_at)}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* LIVE Badge */}
                        <div className="shrink-0 flex items-center gap-2 bg-red-500 px-3 py-1.5 rounded-full border-2 border-white/30 animate-pulse">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                            </span>
                            <span className="text-white font-black text-xs uppercase tracking-widest">LIVE</span>
                        </div>

                        {/* Dismiss */}
                        <button
                            onClick={() => setDismissed(true)}
                            className="shrink-0 p-2 hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Dismiss alert"
                        >
                            <X className="w-5 h-5 text-white/70 hover:text-white" />
                        </button>
                    </div>

                    {/* EMERGENCY CARDS ROW */}
                    <div className="px-4 py-4 flex gap-4 overflow-x-auto scrollbar-hide">
                        {criticalEmergencies.slice(0, 4).map((alert) => {
                            const Icon = getEmergencyIcon(alert.category);
                            return (
                                <Link
                                    key={alert.id}
                                    href={`/report/${alert.id}`}
                                    className={cn(
                                        "flex-shrink-0 group relative overflow-hidden",
                                        "bg-black/40 backdrop-blur-md border-2 border-white/20",
                                        "rounded-2xl p-4 min-w-[260px] max-w-[300px]",
                                        "hover:bg-black/50 hover:border-yellow-400/50 transition-all duration-300",
                                        "hover:scale-[1.03] hover:shadow-2xl hover:shadow-yellow-500/20"
                                    )}
                                >
                                    {/* Hover glow */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/10 group-hover:to-orange-500/10 transition-all rounded-2xl" />

                                    <div className="relative flex gap-4 items-start">
                                        {/* Large Icon */}
                                        <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-red-600 flex items-center justify-center shadow-xl shadow-red-500/40 group-hover:scale-110 transition-transform">
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Severity badge */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                                    SEVERITY {alert.severity}/10
                                                </span>
                                            </div>

                                            {/* Category */}
                                            <h4 className="font-bold text-white text-lg leading-tight mb-1">
                                                {alert.category}
                                            </h4>

                                            {/* Time */}
                                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{formatTime(alert.created_at)}</span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all self-center" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
