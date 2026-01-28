"use client";

import { SeverityBadge, StatusBadge } from "@/components/ui/badges";
import { MapPin, Clock, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
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
        setUpvotes(hasUpvoted ? upvotes - 1 : upvotes + 1);
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
        <article className="glass-card-interactive overflow-hidden">
            {/* Image */}
            {report.imageUrl && (
                <div className="relative h-44 -mx-4 -mt-4 overflow-hidden">
                    <img
                        src={report.imageUrl}
                        alt={`${report.category} issue reported`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-pure)] via-transparent to-transparent" />

                    {/* Overlay Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                        <SeverityBadge severity={report.severity} size="sm" />
                    </div>
                    <div className="absolute top-3 right-3">
                        <StatusBadge status={report.status as "OPEN" | "IN_PROGRESS" | "RESOLVED"} size="sm" />
                    </div>

                    {/* Category */}
                    <div className="absolute bottom-3 left-3">
                        <h3 className="text-white font-semibold text-lg drop-shadow-lg">{report.category}</h3>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="space-y-3 pt-2">
                {/* No image header */}
                {!report.imageUrl && (
                    <header className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg text-[var(--text-primary)]">{report.category}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <SeverityBadge severity={report.severity} size="sm" />
                            <StatusBadge status={report.status as "OPEN" | "IN_PROGRESS" | "RESOLVED"} size="sm" />
                        </div>
                    </header>
                )}

                {/* Description */}
                <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                    {report.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-[var(--text-subtle)]">
                    <button
                        onClick={() => onLocate?.(report)}
                        className="flex items-center gap-1.5 hover:text-[var(--brand-light)] transition-colors cursor-pointer"
                        aria-label="View this report on the map"
                    >
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Map</span>
                    </button>
                    <time
                        className="flex items-center gap-1.5"
                        dateTime={report.createdAt}
                    >
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        {timeAgo(report.createdAt)}
                    </time>
                </div>

                {/* Divider */}
                <hr className="border-[var(--glass-border)]" />

                {/* Actions */}
                <footer className="flex items-center justify-between">
                    <button
                        onClick={handleUpvote}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors",
                            hasUpvoted
                                ? "bg-[var(--info-bg)] text-[var(--info)]"
                                : "hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
                        )}
                        aria-pressed={hasUpvoted}
                        aria-label={`Upvote this report. Current upvotes: ${upvotes}`}
                    >
                        <ThumbsUp className={cn("w-4 h-4", hasUpvoted && "fill-current")} aria-hidden="true" />
                        <span className="font-mono">{upvotes}</span>
                    </button>

                    <div className="flex items-center gap-1">
                        <button
                            className="btn-icon"
                            aria-label="Comment on this report"
                        >
                            <MessageCircle className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                            className="btn-icon"
                            aria-label="Share this report"
                        >
                            <Share2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                    </div>
                </footer>
            </div>
        </article>
    );
}
