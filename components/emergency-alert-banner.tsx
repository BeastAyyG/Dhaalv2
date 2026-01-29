"use client";

import { useState } from "react";
import { Flame, Zap, Clock, X, Siren, TriangleAlert, ArrowRight } from "lucide-react";
import type { Report } from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmergencyAlertBannerProps {
    emergencies: Report[];
}

export function EmergencyAlertBanner({ emergencies }: EmergencyAlertBannerProps) {
    const [now] = useState(() => Date.now());
    const [dismissed, setDismissed] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // ONLY show for severity 9-10 (true crisis)
    const criticalEmergencies = emergencies.filter(e => e.severity >= 9);

    if (!criticalEmergencies || criticalEmergencies.length === 0 || dismissed) return null;

    const activeAlert = criticalEmergencies[activeIndex];

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

    const Icon = getEmergencyIcon(activeAlert.category);

    return (
        <div className="relative overflow-hidden rounded-xl border border-red-500/30 bg-red-950/40 backdrop-blur-xl shadow-lg shadow-red-900/10 transition-all duration-300 hover:shadow-red-900/20 hover:border-red-500/50 group">

            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/5 pointer-events-none" />

            {/* Subtle Pulse Effect on Border */}
            <div className="absolute inset-0 rounded-xl ring-1 ring-red-500/20 animate-pulse pointer-events-none" />

            <div className="relative p-0.5">
                <div className="flex items-stretch">

                    {/* Left Indicator Strip */}
                    <div className="w-1.5 rounded-l-lg bg-gradient-to-b from-red-500 to-red-700" />

                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">

                        {/* Main Content Area */}
                        <div className="flex items-start sm:items-center gap-4 min-w-0">

                            {/* Icon Box */}
                            <div className="shrink-0 relative">
                                <span className="absolute inset-0 bg-red-500/20 blur-lg rounded-full animate-pulse" />
                                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-inner shadow-black/20 text-white">
                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                            </div>

                            <div className="flex flex-col min-w-0">
                                {/* Badge Row */}
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    <span className="text-red-200 text-xs font-bold tracking-wider uppercase">Critical Alert</span>
                                    <span className="text-white/30 text-[10px]">•</span>
                                    <span className="text-white/60 text-xs font-mono">{formatTime(activeAlert.created_at)}</span>
                                </div>

                                {/* Headline */}
                                <h3 className="text-white font-semibold text-base sm:text-lg leading-tight truncate pr-2">
                                    {activeAlert.category}
                                </h3>

                                <p className="text-white/50 text-xs sm:text-sm truncate">
                                    {criticalEmergencies.length > 1
                                        ? `+${criticalEmergencies.length - 1} other critical incidents reported`
                                        : 'Immediate attention required in this area'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 sm:gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                            <Link
                                href={`/report/${activeAlert.id}`}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-100 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all group-hover:bg-red-500/30"
                            >
                                View Location
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <button
                                onClick={() => setDismissed(true)}
                                className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                aria-label="Dismiss"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination Doth (if multiple) */}
            {criticalEmergencies.length > 1 && (
                <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1 pb-1">
                    {criticalEmergencies.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all",
                                activeIndex === idx ? "bg-red-400 w-3" : "bg-white/20 hover:bg-white/40"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
