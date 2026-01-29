"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhatsAppButton() {
    const handleWhatsAppClick = () => {
        const text = encodeURIComponent("Namaste! I want to report a civic issue in my area. Here are the details:");
        window.open(`https://wa.me/?text=${text}`, "_blank");
    };

    return (
        <button
            onClick={handleWhatsAppClick}
            className="fixed bottom-36 md:bottom-24 right-6 md:right-8 z-40 group"
            aria-label="Report via WhatsApp"
        >
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform duration-200">
                <MessageCircle className="w-6 h-6 text-white" fill="white" />
            </div>

            <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-white dark:bg-black px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none">
                Report via WhatsApp
            </span>
        </button>
    );
}
