import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
    severity: number;
    size?: "sm" | "md" | "lg";
}

export function SeverityBadge({ severity, size = "md" }: SeverityBadgeProps) {
    const level = severity >= 7 ? "high" : severity >= 4 ? "medium" : "low";
    const label = severity >= 7 ? "Critical" : severity >= 4 ? "Medium" : "Low";

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 font-semibold rounded-full",
                `badge-${level}`,
                size === "sm" && "px-2 py-0.5 text-xs",
                size === "md" && "px-3 py-1 text-sm",
                size === "lg" && "px-4 py-1.5 text-base"
            )}
        >
            <span className={cn(
                "rounded-full",
                size === "sm" && "w-1.5 h-1.5",
                size === "md" && "w-2 h-2",
                size === "lg" && "w-2.5 h-2.5",
                level === "high" && "bg-red-500",
                level === "medium" && "bg-amber-500",
                level === "low" && "bg-green-500"
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
