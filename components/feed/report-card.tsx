import type { Report } from "@/lib/types";
import { MessageSquare, ThumbsUp, MapPin, AlertTriangle } from "lucide-react";
import Image from "next/image";

interface ReportCardProps {
    report: Report;
    isOfficer?: boolean;
}

export function ReportCard({ report, isOfficer }: ReportCardProps) {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            {/* Header/Image */}
            <div className="relative h-48 w-full bg-neutral-100">
                {report.image_url ? (
                    <Image
                        src={report.image_url}
                        alt={report.category}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-neutral-400">
                        No Image
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white ring-1 ring-white/20">
                    {report.status}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg">{report.category}</h3>
                        <p className="text-sm text-neutral-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
                            {report.distance && ` • ${report.distance.toFixed(1)}km away`}
                        </p>
                    </div>
                    {report.severity >= 8 && (
                        <div className="flex items-center gap-1 text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded text-xs font-bold">
                            <AlertTriangle className="w-3 h-3" />
                            CRITICAL
                        </div>
                    )}
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                    {report.description}
                </p>

                {/* Actions */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex gap-4">
                        <button className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-blue-600 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{report.upvotes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-blue-600 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span>Comment</span>
                        </button>
                    </div>

                    {isOfficer && (
                        <button className="text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                            Take Action
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
