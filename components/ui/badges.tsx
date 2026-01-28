import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
    severity: number;
    size?: "sm" | "md" | "lg";
}

export function SeverityBadge({ severity, size = "md" }: SeverityBadgeProps) {
    const level = severity >= 7 ? "critical" : severity >= 4 ? "warning" : "success";
    const label = severity >= 7 ? "Critical" : severity >= 4 ? "Medium" : "Low";

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 font-semibold rounded-full",
                `badge-${level}`,
                size === "sm" && "px-2 py-0.5 text-xs",
                size === "md" && "px-3 py-1 text-sm",
                size === "lg" && "px-4 py-1.5 text-base"
            )}
        >
            <span className={cn(
                "rounded-full animate-pulse",
                size === "sm" && "w-1.5 h-1.5",
                size === "md" && "w-2 h-2",
                size === "lg" && "w-2.5 h-2.5",
                level === "critical" && "bg-[#CF222E]",
                level === "warning" && "bg-[#D29922]",
                level === "success" && "bg-[#2DA44E]"
            )} />
            {label} ({severity}/10)
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
                "inline-flex items-center font-medium rounded-full",
                statusClass,
                size === "sm" && "px-2 py-0.5 text-xs",
                size === "md" && "px-3 py-1 text-sm"
            )}
        >
            {label}
        </span>
    );
}

interface XPBadgeProps {
    xp: number;
    showIcon?: boolean;
}

export function XPBadge({ xp, showIcon = true }: XPBadgeProps) {
    return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--brand)]/10 border border-[var(--brand)]/20">
            {showIcon && <span className="text-xs">⚡</span>}
            <span className="text-xs font-bold text-[var(--brand-light)]">
                {xp.toLocaleString()} XP
            </span>
        </div>
    );
}
