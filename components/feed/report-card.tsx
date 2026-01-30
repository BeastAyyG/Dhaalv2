"use client";

import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import type { Report } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { UpvoteButton, ShareButton } from "@/components/feed/social-actions";

interface ReportCardProps {
    report: Report;
    onLocate: () => void;
}

export function ReportCard({ report, onLocate }: ReportCardProps) {
    const timeAgo = (dateStr: string) => {
        try {
            return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
        } catch {
            return "recently";
        }
    };

    return (
        <article className="group relative">
            {/* Glass Card Background */}
            <div className="absolute inset-x-0 bottom-0 top-4 bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl shadow-sm transition-all group-hover:shadow-[var(--brand)]/10 group-hover:border-[var(--brand)]/30"></div>

            <div className="relative flex gap-4 p-4 pl-5">
                {/* Severity Indicator Line */}
                {/* Severity Indicator Line */}
                <div className={cn(
                    "absolute left-0 top-8 bottom-8 w-1 rounded-r-full",
                    report.severity >= 8 ? "bg-[var(--brand)] shadow-[0_0_10px_var(--brand)]" :
                        report.severity >= 5 ? "bg-[var(--warning)]" :
                            "bg-[var(--success)]"
                )} />

                {/* Thumbnail */}
                <div className="shrink-0 pt-2">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-[var(--glass-border)] flex items-center justify-center">
                        {report.image_url ? (
                            <img
                                src={report.image_url}
                                alt={report.category}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                            />
                        ) : (
                            <div className="text-neutral-400">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/logo.png" className="w-8 h-8 opacity-40 grayscale" alt="No Photo" />
                            </div>
                        )}
                        {report.status === "RESOLVED" && (
                            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-[1px]">
                                <span className="text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full shadow-lg">FIXED</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                    <div className="flex justify-between items-start mb-1">
                        <Link href={`/report/${report.id}`} className="group-hover:text-[var(--brand)] transition-colors">
                            <h3 className="font-semibold text-[var(--text-primary)] truncate pr-2">
                                {report.category}
                            </h3>
                        </Link>
                        <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            report.status === "OPEN" && "bg-orange-500/10 text-orange-500 border border-orange-500/20",
                            report.status === "IN_PROGRESS" && "bg-blue-500/10 text-blue-500 border border-blue-500/20",
                            report.status === "RESOLVED" && "bg-green-500/10 text-green-500 border border-green-500/20"
                        )}>
                            {report.status.replace("_", " ")}
                        </span>
                    </div>

                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                        {report.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onLocate();
                            }}
                            className="flex items-center gap-1.5 hover:text-[var(--brand)] transition-colors"
                            aria-label="View this report on the map"
                        >
                            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Map</span>
                        </button>
                        <time
                            className="flex items-center gap-1.5"
                            dateTime={report.created_at}
                        >
                            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                            {timeAgo(report.created_at)}
                        </time>
                    </div>

                    {/* Divider */}
                    <hr className="border-[var(--glass-border)] mb-3" />

                    {/* Actions */}
                    <footer className="flex items-center justify-between">
                        <UpvoteButton count={report.upvotes || 0} reportId={report.id} />

                        <ShareButton
                            reportId={report.id}
                            category={report.category}
                            description={report.description}
                        />
                    </footer>
                </div>
            </div>
        </article>
    );
}
