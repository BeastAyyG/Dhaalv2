"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { SeverityBadge, StatusBadge } from "@/components/ui/badges";
import { MapPin, Clock, ThumbsUp, MessageCircle, Share2, ExternalLink } from "lucide-react";
import type { Report } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ReportCardProps {
    report: Report;
    onLocate?: (report: Report) => void;
}

export function ReportCard({ report, onLocate }: ReportCardProps) {
    const [upvotes, setUpvotes] = useState(report.upvotes || 0);
    const [hasUpvoted, setHasUpvoted] = useState(false);

    const handleUpvote = () => {
        if (hasUpvoted) {
            setUpvotes(upvotes - 1);
        } else {
            setUpvotes(upvotes + 1);
        }
        setHasUpvoted(!hasUpvoted);
    };

    const timeAgo = (date: string) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return "just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="glass-card overflow-hidden hover-lift">
            {/* Image */}
            {report.imageUrl && (
                <div className="relative h-48 -mx-4 -mt-4 overflow-hidden">
                    <img
                        src={report.imageUrl}
                        alt={report.category}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-transparent to-transparent" />

                    {/* Overlay Badges */}
                    <div className="absolute top-3 left-3">
                        <SeverityBadge severity={report.severity} size="sm" />
                    </div>
                    <div className="absolute top-3 right-3">
                        <StatusBadge status={report.status as "OPEN" | "IN_PROGRESS" | "RESOLVED"} size="sm" />
                    </div>

                    {/* Category Label */}
                    <div className="absolute bottom-3 left-3">
                        <span className="text-white font-bold text-lg drop-shadow-lg">{report.category}</span>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* No image fallback header */}
                {!report.imageUrl && (
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-bold text-lg text-[var(--text-primary)]">{report.category}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <SeverityBadge severity={report.severity} size="sm" />
                                <StatusBadge status={report.status as "OPEN" | "IN_PROGRESS" | "RESOLVED"} size="sm" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Description */}
                <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                    {report.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-[var(--text-subtle)]">
                    <button
                        onClick={() => onLocate?.(report)}
                        className="flex items-center gap-1 hover:text-[var(--brand-light)] transition-colors cursor-pointer"
                    >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>View on Map</span>
                        <ExternalLink className="w-3 h-3" />
                    </button>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {timeAgo(report.createdAt)}
                    </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--glass-border)]" />

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleUpvote}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium cursor-pointer",
                            hasUpvoted
                                ? "bg-[var(--brand)]/10 text-[var(--brand-light)]"
                                : "hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
                        )}
                    >
                        <ThumbsUp className={cn("w-4 h-4", hasUpvoted && "fill-current")} />
                        <span>{upvotes}</span>
                    </button>

                    <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-muted)] cursor-pointer">
                            <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-muted)] cursor-pointer">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
