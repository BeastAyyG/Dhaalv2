"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, CheckCircle, AlertTriangle, Clock, Activity, Shield } from "lucide-react";
import { updateReportStatusAction, updateReportPriorityAction } from "@/app/actions/update-report";
import { ReportStatus, ReportPriority } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface ReportActionsProps {
    reportId: string;
    currentStatus: ReportStatus;
    currentPriority?: ReportPriority;
}

export function ReportActions({ reportId, currentStatus, currentPriority = 'NORMAL' }: ReportActionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { t } = useI18n();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleStatusChange = async (status: ReportStatus) => {
        setLoading(true);
        await updateReportStatusAction(reportId, status);
        setLoading(false);
        setIsOpen(false);
    };

    const handlePriorityChange = async (priority: ReportPriority) => {
        setLoading(true);
        await updateReportPriorityAction(reportId, priority);
        setLoading(false);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn-icon"
                aria-label="Report actions"
                aria-expanded={isOpen}
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 z-50 glass-card-static p-1 animate-fade-in shadow-xl">
                    <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] px-3 py-2 track-wider">
                        {t.officer.updateStatus}
                    </div>

                    <button
                        disabled={loading}
                        onClick={() => handleStatusChange("OPEN")}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[var(--bg-hover)] flex items-center gap-2 transition-colors"
                    >
                        <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                        <span className={cn(currentStatus === "OPEN" && "font-bold text-[var(--warning)]")}>{t.status.open}</span>
                    </button>

                    <button
                        disabled={loading}
                        onClick={() => handleStatusChange("IN_PROGRESS")}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[var(--bg-hover)] flex items-center gap-2 transition-colors"
                    >
                        <Clock className="w-4 h-4 text-[var(--info)]" />
                        <span className={cn(currentStatus === "IN_PROGRESS" && "font-bold text-[var(--info)]")}>{t.status.inProgress}</span>
                    </button>

                    <button
                        disabled={loading}
                        onClick={() => handleStatusChange("RESOLVED")}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[var(--bg-hover)] flex items-center gap-2 transition-colors"
                    >
                        <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                        <span className={cn(currentStatus === "RESOLVED" && "font-bold text-[var(--success)]")}>{t.status.resolved}</span>
                    </button>

                    <div className="h-px bg-[var(--glass-border)] my-1" />

                    <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] px-3 py-2 track-wider">
                        {t.officer.setPriority}
                    </div>

                    <button
                        disabled={loading}
                        onClick={() => handlePriorityChange("URGENT")}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[var(--bg-hover)] flex items-center gap-2 transition-colors"
                    >
                        <Activity className="w-4 h-4 text-[var(--error)]" />
                        <span className={cn(currentPriority === "URGENT" && "font-bold text-[var(--error)]")}>{t.officer.priority.urgent}</span>
                    </button>

                    <button
                        disabled={loading}
                        onClick={() => handlePriorityChange("HIGH")}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[var(--bg-hover)] flex items-center gap-2 transition-colors"
                    >
                        <Shield className="w-4 h-4 text-[var(--warning)]" />
                        <span className={cn(currentPriority === "HIGH" && "font-bold text-[var(--warning)]")}>{t.officer.priority.high}</span>
                    </button>
                </div>
            )}
        </div>
    );
}
