"use client";

import { useState } from "react";
import { ArrowBigUp, Share2, Loader2, Link as LinkIcon, Download, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";

interface UpvoteButtonProps {
    count: number;
    reportId: string;
}

export function UpvoteButton({ count: initialCount, reportId }: UpvoteButtonProps) {
    const [count, setCount] = useState(initialCount);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleUpvote = () => {
        if (hasUpvoted) {
            setCount(c => c - 1);
            setHasUpvoted(false);
        } else {
            setCount(c => c + 1);
            setHasUpvoted(true);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 500); // Reset animation
        }
        // TODO: Call API to persist upvote
    };

    return (
        <button
            onClick={handleUpvote}
            className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-full transition-all active:scale-95 group relative overflow-hidden",
                hasUpvoted
                    ? "bg-orange-500/10 text-orange-600 border border-orange-500/20"
                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            )}
        >
            <ArrowBigUp
                className={cn(
                    "w-5 h-5 transition-transform",
                    hasUpvoted && "fill-current",
                    isAnimating && "animate-bounce"
                )}
            />
            <span className="font-bold text-sm">{count}</span>
            {hasUpvoted && (
                <span className="text-xs ml-1 font-medium hidden sm:inline">Me Too!</span>
            )}

            {/* Particle effect simulation for click */}
            {isAnimating && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full animate-ping"></div>
                </div>
            )}
        </button>
    );
}

interface ShareButtonProps {
    reportId: string;
    category: string;
    description: string;
}

export function ShareButton({ reportId, category, description }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/report/${reportId}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateStoryImage = async () => {
        setIsGenerating(true);
        // Mock generation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In a real app, we'd capture a specific element
        // const element = document.getElementById(`report-card-${reportId}`);
        // if (element) {
        //     const canvas = await html2canvas(element);
        //     const image = canvas.toDataURL("image/png");
        //     const link = document.createElement("a");
        //     link.href = image;
        //     link.download = `dhaal-report-${reportId}.png`;
        //     link.click();
        // }

        alert("Story Image Generated! (Mock Download)");
        setIsGenerating(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                aria-label="Share report"
            >
                <Share2 className="w-4 h-4" />
                <span className="text-xs font-medium">Share</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 bottom-full mb-2 z-50 w-64 bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-xl shadow-xl p-3 animate-in fade-in slide-in-from-bottom-2">
                        <h4 className="text-sm font-semibold mb-3 px-1">Share this Report</h4>

                        <div className="space-y-2">
                            <button
                                onClick={handleCopyLink}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-left text-sm"
                            >
                                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4" />}
                                {copied ? "Link Copied!" : "Copy Link"}
                            </button>

                            <button
                                onClick={generateStoryImage}
                                disabled={isGenerating}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-pink-500/10 hover:text-pink-500 transition-colors text-left text-sm"
                            >
                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                Generate Story Card
                            </button>

                            <button
                                onClick={() => {
                                    window.open(`https://wa.me/?text=Check out this issue on Dhaal: ${shareUrl}`, "_blank");
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-500/10 hover:text-green-500 transition-colors text-left text-sm"
                            >
                                <Share2 className="w-4 h-4" />
                                Share to WhatsApp
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
