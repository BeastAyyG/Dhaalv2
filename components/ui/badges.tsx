import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
    severity: number;
    size?: "sm" | "md";
    showDot?: boolean;
}

export function SeverityBadge({ severity, size = "md", showDot = true }: SeverityBadgeProps) {
    const level = severity >= 7 ? "critical" : severity >= 4 ? "warning" : "success";
    const label = severity >= 7 ? "Critical" : severity >= 4 ? "Medium" : "Low";

    return (
        <span
            className={cn(
                "badge",
                `badge-${level}`,
                size === "sm" && "text-[11px] px-2 py-0.5",
                size === "md" && "text-xs px-2.5 py-1"
            )}
            role="status"
            aria-label={`Severity: ${label}, score ${severity} out of 10`}
        >
            {showDot && (
                <span
                    className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        level === "critical" && "bg-[var(--error)]",
                        level === "warning" && "bg-[var(--warning)]",
                        level === "success" && "bg-[var(--success)]"
                    )}
                    aria-hidden="true"
                />
            )}
            {label}
        </span>
    );
}

interface StatusBadgeProps {
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
    size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
    const config = {
        OPEN: { label: "Open", class: "status-open" },
        IN_PROGRESS: { label: "In Progress", class: "status-progress" },
        RESOLVED: { label: "Resolved", class: "status-resolved" },
    };

    const { label, class: statusClass } = config[status] || config.OPEN;

    return (
        <span
            className={cn(
                "badge",
                statusClass,
                size === "sm" && "text-[11px] px-2 py-0.5",
                size === "md" && "text-xs px-2.5 py-1"
            )}
            role="status"
            aria-label={`Status: ${label}`}
        >
            {label}
        </span>
    );
}

interface XPBadgeProps {
    xp: number;
}

export function XPBadge({ xp }: XPBadgeProps) {
    return (
        <div
            className="badge badge-info font-mono"
            aria-label={`${xp.toLocaleString()} experience points`}
        >
            <span aria-hidden="true">⚡</span>
            {xp.toLocaleString()} XP
        </div>
    );
}

/* Skeleton Loading Components */
export function SkeletonCard() {
    return (
        <div className="glass-card-static space-y-3" aria-busy="true" aria-label="Loading content">
            <div className="skeleton h-40 w-full" />
            <div className="skeleton skeleton-heading" />
            <div className="skeleton skeleton-text w-full" />
            <div className="skeleton skeleton-text w-3/4" />
        </div>
    );
}

export function SkeletonRow() {
    return (
        <div className="flex items-center gap-3 p-3" aria-busy="true">
            <div className="skeleton skeleton-avatar" />
            <div className="flex-1 space-y-2">
                <div className="skeleton skeleton-text w-1/2" />
                <div className="skeleton skeleton-text w-1/3" />
            </div>
        </div>
    );
}
