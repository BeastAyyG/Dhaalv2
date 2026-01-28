"use client";

import { useState, useEffect } from "react";
import { Camera, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { analyzeImageAction } from "@/app/actions/analyze";
import { submitReportAction } from "@/app/actions/submit-report";
import type { AnalysisResult } from "@/lib/types";

interface NewReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewReportModal({ isOpen, onClose }: NewReportModalProps) {
    const [step, setStep] = useState<"capture" | "analyzing" | "details">("capture");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get Location on Mount
    useEffect(() => {
        if (isOpen) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => console.error("Location blocked", err)
            );
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Preview
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);

            // Start Analysis
            setStep("analyzing");
            setError(null);

            try {
                const formData = new FormData();
                formData.append("image", file);

                const result = await analyzeImageAction(formData);
                console.log("AI Result:", result);

                setAnalysis(result);
                setStep("details");
            } catch (err) {
                console.error(err);
                setError("Failed to analyze image. Please try again.");
                setStep("capture");
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                    <h2 className="font-semibold text-lg">Report Issue</h2>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {step === "capture" && (
                        <div className="space-y-4">
                            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                <Camera className="w-12 h-12 text-neutral-400 mb-2" />
                                <span className="text-sm font-medium text-neutral-600">Tap to take photo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    )}

                    {step === "analyzing" && (
                        <div className="h-64 flex flex-col items-center justify-center space-y-4">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
                                <div className="absolute inset-2 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                            </div>
                            <p className="text-sm font-medium text-blue-600 animate-pulse">AI is analyzing scene...</p>
                        </div>
                    )}


                    {step === "details" && analysis && (
                        <div className="space-y-4">
                            <div className="relative h-48 w-full rounded-lg overflow-hidden">
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                                )}
                                <div className={cn(
                                    "absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded-md font-bold shadow-sm",
                                    analysis.severityScore > 7 ? "bg-red-500" : "bg-green-500"
                                )}>
                                    Detected: {analysis.category} (Severity: {analysis.severityScore}/10)
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    rows={3}
                                    defaultValue={analysis.description}
                                />
                            </div>

                            <button
                                disabled={isSubmitting}
                                onClick={async () => {
                                    if (!imageFile || !location) return;
                                    setIsSubmitting(true);

                                    const formData = new FormData();
                                    formData.append("category", analysis.category);
                                    formData.append("severity", analysis.severityScore.toString());
                                    formData.append("description", (document.querySelector('textarea') as HTMLTextAreaElement).value);
                                    formData.append("lat", location.lat.toString());
                                    formData.append("lng", location.lng.toString());
                                    formData.append("image", imageFile);

                                    await submitReportAction(null, formData);
                                    setIsSubmitting(false);
                                    onClose();
                                }}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                            >
                                {isSubmitting ? "Saving..." : "Submit Report (+50 XP)"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
