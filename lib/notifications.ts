export type NotificationType = "status_change" | "upvote" | "achievement" | "system";

export type Notification = {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    link?: string;
};

export async function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return false;
    }

    if (Notification.permission === "granted") {
        return true;
    }

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    return false;
}

export function sendLocalNotification(title: string, body: string, icon?: string) {
    if (Notification.permission === "granted") {
        new Notification(title, {
            body,
            icon: icon || "/icons/icon-192x192.png", // Assuming PWA icon exists
            badge: "/icons/badge-72x72.png",
        });
    }
}

// Mock function to simulate receiving a push notification payload
export function handlePushPayload(payload: any) {
    if (payload.type === 'STATUS_UPDATE') {
        sendLocalNotification(
            `Report Update: ${payload.reportId}`,
            `Status changed to ${payload.status}`
        );
    } else if (payload.type === 'ACHIEVEMENT') {
        sendLocalNotification(
            "New Badge Earned! 🏆",
            `You earned the ${payload.badgeName} badge!`
        );
    }
}
