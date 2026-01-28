import { cn } from "@/lib/utils";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    gradient?: boolean;
}

export function GlassCard({
    children,
    className,
    hover = true,
    gradient = false
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "glass-card p-4 transition-all duration-300",
                hover && "hover:shadow-lg hover:scale-[1.01] cursor-pointer",
                gradient && "gradient-border",
                className
            )}
        >
            {children}
        </div>
    );
}
