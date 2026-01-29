"use client";

import { useState } from "react";
import { Flame, Zap, X, Siren, TriangleAlert, ArrowRight } from "lucide-react";
import type { Report } from "@/lib/types";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmergencyAlertBannerProps {
    emergencies: Report[];
}

export function EmergencyAlertBanner({ emergencies }: EmergencyAlertBannerProps) {
    const [now] = useState(() => Date.now());
    const [dismissed, setDismissed] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const criticalEmergencies = emergencies.filter((e: Report) => e.severity >= 9);

    if (!criticalEmergencies || criticalEmergencies.length === 0 || dismissed) return null;

    const activeAlert = criticalEmergencies[activeIndex];

    const formatTime = (dateStr: string) => {
        const diff = now - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
        return `${Math.floor(mins / 1440)}d ago`;
    };

    const renderIcon = (category: string) => {
        const cat = category.toLowerCase();
        const iconProps = { className: "w-5 h-5 sm:w-6 sm:h-6" };

        if (cat.includes('fire') || cat.includes('explosion')) return <Flame {...iconProps} />;
        if (cat.includes('electric') || cat.includes('power')) return <Zap {...iconProps} />;
        if (cat.includes('earthquake') || cat.includes('collapse')) return <TriangleAlert {...iconProps} />;
        return <Siren {...iconProps} />;
    };

    return (
        <div className="relative overflow-hidden rounded-xl border border-red-500/30 bg-red-950/40 backdrop-blur-xl shadow-lg shadow-red-900/10 transition-all duration-300 hover:shadow-red-900/20 hover:border-red-500/50 group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/5 pointer-events-none" />
            <div className="absolute inset-0 rounded-xl ring-1 ring-red-500/20 animate-pulse pointer-events-none" />

            <div className="relative p-0.5">
                <div className="flex items-stretch">
                    <div className="w-1.5 rounded-l-lg bg-gradient-to-b from-red-500 to-red-700" />
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="shrink-0 relative">
                                <span className="absolute inset-0 bg-red-500/20 blur-lg rounded-full animate-pulse" />
                                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-inner shadow-black/20 text-white">
                                    {renderIcon(activeAlert.category)}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white tracking-wider uppercase">
                                        Crisis Alert
                                    </span>
                                    <span className="text-[10px] text-red-300 font-mono font-medium">
                                        {formatTime(activeAlert.created_at)}
                                    </span>
                                </div>
                                <h3 className="text-sm sm:text-base font-bold text-white mb-1 truncate">
                                    {activeAlert.category}
                                </h3>
                                <p className="text-xs text-red-100/80 line-clamp-1 sm:line-clamp-2">
                                    {activeAlert.description || "Urgent attention required in this area."}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 sm:pl-4 sm:border-l sm:border-red-500/20">
                            <Link
                                href={`/report/${activeAlert.id}`}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
                            >
                                Take Action
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <button
                                onClick={() => setDismissed(true)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-red-300 transition-colors"
                                aria-label="Dismiss alert"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {criticalEmergencies.length > 1 && (
                    <div className="absolute bottom-1 right-4 flex gap-1">
                        {criticalEmergencies.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${activeIndex === idx ? 'bg-red-500 w-3' : 'bg-red-950/60'}`}
                                aria-label={`View alert ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
