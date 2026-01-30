"use client";

import { useState, useEffect } from "react";
import { Camera, X, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { compressImage } from "@/lib/image-utils";

import { analyzeImageAction } from "@/app/actions/analyze";
import { submitReportAction } from "@/app/actions/submit-report";
import { checkDuplicateAction, type DuplicateCheckResult } from "@/app/actions/check-duplicate";
import type { AnalysisResult } from "@/lib/types";
import { VoiceInput } from "@/components/ui/voice-input";
import { useAuth } from "@/lib/auth-context";
import { translateAction } from "@/app/actions/translate";

interface NewReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewReportModal({ isOpen, onClose }: NewReportModalProps) {
    const { user } = useAuth(); // Get user for auth/mock auth
    const [step, setStep] = useState<"capture" | "analyzing" | "details" | "duplicate">("capture");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [duplicateInfo, setDuplicateInfo] = useState<DuplicateCheckResult | null>(null);

    // Get Location on Mount
    useEffect(() => {
        if (isOpen) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => console.error("Location blocked", err)
            );
        }
    }, [isOpen]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStep("capture");
            setImagePreview(null);
            setImageFile(null);
            setAnalysis(null);
            setError(null);
            setDuplicateInfo(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Preview original
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);

            // Check for duplicates first
            setStep("analyzing");
            setError(null);

            try {
                // Compress image before processing (max 500KB)
                console.log(`Original size: ${(file.size / 1024).toFixed(0)}KB`);
                const compressedFile = await compressImage(file, 500);
                setImageFile(compressedFile);

                // Check for duplicate with location
                const dupFormData = new FormData();
                dupFormData.append("image", compressedFile);
                if (location) {
                    dupFormData.append("lat", location.lat.toString());
                    dupFormData.append("lng", location.lng.toString());
                }
                const dupResult = await checkDuplicateAction(dupFormData);

                if (dupResult.isDuplicate) {
                    setDuplicateInfo(dupResult);
                    setStep("duplicate");
                    return;
                }

                // If not duplicate, proceed with analysis
                const formData = new FormData();
                formData.append("image", compressedFile);

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

    const proceedAnyway = async () => {
        if (!imageFile) return;

        setStep("analyzing");
        try {
            const formData = new FormData();
            formData.append("image", imageFile);

            const result = await analyzeImageAction(formData);
            setAnalysis(result);
            setStep("details");
        } catch (err) {
            console.error(err);
            setError("Failed to analyze image. Please try again.");
            setStep("capture");
        }
    };


    const CATEGORIES = ["Fire / Explosion", "Gas Leak", "Accident", "Pothole", "Water Issue", "Garbage", "Street Light", "Traffic", "Violence", "Other"];

    const handleSkipPhoto = () => {
        setImageFile(null);
        setImagePreview(null);
        // Default analysis for manual entry
        setAnalysis({
            category: "Other",
            severityScore: 5,
            description: "",
            isEmergency: false
        });
        setStep("details");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                    <h2 className="font-semibold text-lg">Report Issue</h2>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                    {error && <div className="hidden">{error}</div>}
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

                            <div className="flex flex-col items-center gap-2 pt-2">
                                <span className="text-xs text-neutral-400 font-medium">OR</span>
                                <button
                                    onClick={handleSkipPhoto}
                                    className="text-sm font-medium text-[var(--brand)] hover:text-red-700 hover:underline px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    Report without photo (e.g. Gas Leak, Fire)
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "analyzing" && (
                        <div className="h-64 flex flex-col items-center justify-center space-y-4">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 border-4 border-red-200/20 rounded-full animate-pulse"></div>
                                <div className="absolute inset-2 border-4 border-[var(--brand)] rounded-full animate-spin border-t-transparent"></div>
                            </div>
                            <p className="text-sm font-medium text-[var(--brand)] animate-pulse">AI is analyzing scene...</p>
                        </div>
                    )}

                    {step === "duplicate" && duplicateInfo?.existingReport && (
                        <div className="space-y-4">
                            <div className="flex flex-col items-center text-center p-4">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                                    <AlertTriangle className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-red-600 mb-2">⚠️ Fraud Alert!</h3>
                                <p className="text-sm text-neutral-500 mb-2">
                                    This photo appears to match an existing report.
                                </p>
                                {duplicateInfo.similarityScore && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-neutral-400">AI Confidence:</span>
                                        <span className={cn(
                                            "text-sm font-bold px-2 py-0.5 rounded",
                                            duplicateInfo.similarityScore >= 90
                                                ? "bg-red-100 text-red-700"
                                                : "bg-amber-100 text-amber-700"
                                        )}>
                                            {duplicateInfo.similarityScore}%
                                        </span>
                                    </div>
                                )}
                                {duplicateInfo.reason && (
                                    <p className="text-xs text-neutral-400 italic mb-3">
                                        &quot;{duplicateInfo.reason}&quot;
                                    </p>
                                )}
                                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 text-left">
                                    <p className="text-sm font-medium mb-1">{duplicateInfo.existingReport.category}</p>
                                    <p className="text-xs text-neutral-500">
                                        Status: <span className={cn(
                                            "font-medium",
                                            duplicateInfo.existingReport.status === "RESOLVED" && "text-green-600",
                                            duplicateInfo.existingReport.status === "OPEN" && "text-amber-600",
                                            duplicateInfo.existingReport.status === "IN_PROGRESS" && "text-blue-600"
                                        )}>{duplicateInfo.existingReport.status}</span>
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        Reported: {new Date(duplicateInfo.existingReport.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-xl hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={proceedAnyway}
                                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                                >
                                    Report Anyway
                                </button>
                            </div>
                        </div>
                    )}


                    {step === "details" && analysis && (
                        <div className="space-y-4">
                            {imagePreview ? (
                                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                                    <div className={cn(
                                        "absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded-md font-bold shadow-sm",
                                        analysis.severityScore > 7 ? "bg-red-500" : "bg-green-500"
                                    )}>
                                        Detected: {analysis.category} (Severity: {analysis.severityScore}/10)
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Category</label>
                                        <select
                                            value={analysis.category}
                                            onChange={(e) => setAnalysis({ ...analysis, category: e.target.value })}
                                            className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-medium focus:ring-2 focus:ring-[var(--brand)] outline-none"
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                                            Severity ({analysis.severityScore}/10)
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={analysis.severityScore}
                                            onChange={(e) => setAnalysis({ ...analysis, severityScore: parseInt(e.target.value) })}
                                            className="w-full accent-[var(--brand)] cursor-pointer"
                                        />
                                        <div className="flex justify-between text-xs text-neutral-400 mt-1">
                                            <span>Low</span>
                                            <span>Critical</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-[var(--brand)] outline-none resize-none mb-3"
                                    rows={3}
                                    value={analysis.description}
                                    onChange={(e) => setAnalysis({ ...analysis, description: e.target.value })}
                                />

                                <VoiceInput
                                    onTranscript={() => {
                                        // Optional: Visual feedback if needed, but VoiceInput handles preview
                                    }}
                                    onRecordingComplete={async (text, lang) => {
                                        if (!text.trim()) return;

                                        let finalText = text;
                                        // Auto-translate Hindi to English
                                        if (lang === "hi-IN") {
                                            try {
                                                finalText = await translateAction(text);
                                            } catch (e) {
                                                console.error("Translation failed", e);
                                            }
                                        }

                                        setAnalysis(prev => prev ? ({
                                            ...prev,
                                            description: (prev.description + " " + finalText).trim()
                                        }) : null);
                                    }}
                                    onCategoryDetect={(cat) => {
                                        console.log("Voice detected category:", cat);
                                    }}
                                />
                            </div>

                            <button
                                disabled={isSubmitting}
                                onClick={async () => {
                                    const finalLocation = location || { lat: 28.6139, lng: 77.2090 }; // Default to New Delhi if GPS blocked
                                    setIsSubmitting(true);

                                    const formData = new FormData();
                                    formData.append("category", analysis.category);
                                    formData.append("severity", analysis.severityScore.toString());
                                    // Use state value instead of querySelector
                                    formData.append("description", analysis.description);
                                    formData.append("lat", finalLocation.lat.toString());
                                    formData.append("lng", finalLocation.lng.toString());
                                    if (imageFile) {
                                        formData.append("image", imageFile);
                                    }
                                    // Attach User ID for Auth/Mock Auth
                                    if (user?.id) {
                                        formData.append("user_id", user.id);
                                    }

                                    await submitReportAction(null, formData);
                                    setIsSubmitting(false);
                                    onClose();
                                }}
                                className="w-full py-3 bg-[var(--brand)] hover:opacity-90 disabled:opacity-50 text-white font-medium rounded-xl shadow-lg shadow-[var(--brand)]/20 active:scale-95 transition-all"
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
