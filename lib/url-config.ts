/**
 * Centralized configuration for URL resolution.
 * Handles Vercel preview URLs, production URLs, and local development.
 */
export function getBaseUrl() {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }

    // Vercel Production
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }

    // Fallback to local
    return "http://localhost:3000";
}

export const CURRENT_DOMAIN = getBaseUrl();
