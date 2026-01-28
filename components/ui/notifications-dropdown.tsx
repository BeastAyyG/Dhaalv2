"use client";

import { useState } from "react";
import { Bell, CheckCircle, AlertTriangle, TrendingUp, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification } from "@/lib/notifications";

const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "status_change",
        title: "Report Resolved",
        message: "Your report about 'Pothole on MG Road' has been resolved.",
        read: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        type: "achievement",
        title: "New Badge!",
        message: "You earned the 'Active Citizen' badge.",
        read: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: "3",
        type: "upvote",
        title: "Trending Report",
        message: "Your report received 10 upvotes.",
        read: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
];

export function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);
    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: Notification["type"]) => {
        switch (type) {
            case "status_change": return <CheckCircle className="w-4 h-4 text-[var(--success)]" />;
            case "achievement": return <Award className="w-4 h-4 text-[var(--warning)]" />;
            case "upvote": return <TrendingUp className="w-4 h-4 text-[var(--info)]" />;
            case "system": return <AlertTriangle className="w-4 h-4 text-[var(--text-muted)]" />;
            default: return <Bell className="w-4 h-4" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn-icon relative"
                aria-label="Notifications"
            >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--error)] animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 z-50 glass-card-static p-0 overflow-hidden shadow-xl animate-fade-in">
                    <div className="flex items-center justify-between p-3 border-b border-[var(--glass-border)]">
                        <h3 className="font-semibold text-sm text-[var(--text-primary)]">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-[var(--brand-light)] hover:text-[var(--brand-lighter)]"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-[var(--text-muted)] text-sm">
                                No notifications
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={cn(
                                        "flex gap-3 p-3 hover:bg-[var(--bg-hover)] transition-colors border-b border-[var(--glass-border)] last:border-0",
                                        !n.read && "bg-[var(--brand)]/5"
                                    )}
                                >
                                    <div className="mt-1 flex-shrink-0">
                                        {getIcon(n.type)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-[var(--text-primary)] mb-0.5">
                                            {n.title}
                                        </div>
                                        <div className="text-xs text-[var(--text-muted)] leading-relaxed">
                                            {n.message}
                                        </div>
                                        <div className="text-[10px] text-[var(--text-subtle)] mt-1">
                                            {new Date(n.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
