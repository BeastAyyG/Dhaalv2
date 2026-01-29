"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, Clock, MessageCircle, Send, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Report } from "@/lib/types";
import { addCommentAction, type Comment } from "@/app/actions/comments";

interface ReportDetailClientProps {
    report: Report;
    initialComments: Comment[];
}

export default function ReportDetailClient({ report, initialComments }: ReportDetailClientProps) {
    const router = useRouter();
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState("");
    const [userName, setUserName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("reportId", report.id);
        formData.append("content", newComment);
        formData.append("userName", userName || "Anonymous");

        const result = await addCommentAction(formData);

        if (result.success) {
            // Optimistic update
            setComments(prev => [...prev, {
                id: crypto.randomUUID(),
                report_id: report.id,
                user_id: "anonymous",
                user_name: userName || "Anonymous",
                content: newComment,
                created_at: new Date().toISOString()
            }]);
            setNewComment("");
        }
        setIsSubmitting(false);
    };

    const severityColor = report.severity > 7 ? "text-red-500" : report.severity > 4 ? "text-amber-500" : "text-green-500";
    const statusColor = {
        OPEN: "bg-amber-100 text-amber-700",
        IN_PROGRESS: "bg-blue-100 text-blue-700",
        RESOLVED: "bg-green-100 text-green-700"
    }[report.status] || "bg-gray-100 text-gray-700";

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="font-semibold text-lg">Report Details</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Image */}
                {report.image_url && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={report.image_url}
                            alt={report.category}
                            className="w-full h-full object-cover"
                        />
                        <div className={cn(
                            "absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium",
                            statusColor
                        )}>
                            {report.status.replace("_", " ")}
                        </div>
                    </div>
                )}

                {/* Details Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-sm border border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm font-medium mb-2">
                                <AlertTriangle className="w-4 h-4" />
                                {report.category}
                            </span>
                            <h2 className="text-xl font-bold mt-2">{report.description || "No description"}</h2>
                        </div>
                        <div className={cn("text-2xl font-bold", severityColor)}>
                            {report.severity}/10
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {new Date(report.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MessageCircle className="w-4 h-4" />
                            {comments.length} comments
                        </span>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-sm border border-neutral-100 dark:border-neutral-800">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Comments ({comments.length})
                    </h3>

                    {/* Comment List */}
                    <div className="space-y-4 mb-6">
                        {comments.length === 0 ? (
                            <p className="text-neutral-500 text-center py-8">No comments yet. Be the first!</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-sm">{comment.user_name}</span>
                                        <span className="text-xs text-neutral-400">
                                            {new Date(comment.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-neutral-700 dark:text-neutral-300">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add Comment Form */}
                    <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Your name (optional)"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full px-4 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                                className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                onClick={handleSubmitComment}
                                disabled={isSubmitting || !newComment.trim()}
                                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
