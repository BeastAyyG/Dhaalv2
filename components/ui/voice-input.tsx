"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, Globe, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
    onTranscript?: (text: string) => void;
    onCategoryDetect?: (category: string) => void;
    onRecordingComplete?: (text: string, language: string) => void;
}

export function VoiceInput({ onTranscript, onCategoryDetect, onRecordingComplete }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [language, setLanguage] = useState<"en-US" | "hi-IN">("en-US");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
            }
        }
    }, []);

    const detectCategory = (text: string) => {
        const lower = text.toLowerCase();

        // Hindi & English Keywords
        if (lower.includes("fire") || lower.includes("aag") || lower.includes("jal")) return "Fire / Explosion";
        if (lower.includes("accident") || lower.includes("crash") || lower.includes("takkar")) return "Accident";
        if (lower.includes("pothole") || lower.includes("gaddha") || lower.includes("road")) return "Pothole";
        if (lower.includes("water") || lower.includes("pani") || lower.includes("leak")) return "Water Issue";
        if (lower.includes("garbage") || lower.includes("kachra") || lower.includes("gandagi")) return "Garbage";
        if (lower.includes("light") || lower.includes("andhera") || lower.includes("electric")) return "Street Light";

        return null;
    };

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Voice recognition not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            // Trigger complete with the FINAL transcript
            onRecordingComplete?.(transcript, language);
        } else {
            // Reset for new session
            setTranscript("");
            recognitionRef.current.lang = language;
            recognitionRef.current.start();
            setIsListening(true);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognitionRef.current.onresult = (event: any) => {
                let currentTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
                onTranscript?.(currentTranscript);

                const category = detectCategory(currentTranscript);
                if (category && onCategoryDetect) {
                    onCategoryDetect(category);
                }
            };
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
                <button
                    type="button"
                    onClick={() => setLanguage(l => l === "en-US" ? "hi-IN" : "en-US")}
                    className="text-xs flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                    <Globe className="w-3 h-3" />
                    {language === "en-US" ? "English" : "Hindi (हिंदी)"}
                </button>
                {isListening && (
                    <span className="text-xs text-red-500 animate-pulse font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 block"></span>
                        Listening...
                    </span>
                )}
            </div>

            <div className="relative">
                <button
                    type="button"
                    onClick={toggleListening}
                    className={cn(
                        "w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all relative overflow-hidden",
                        isListening
                            ? "bg-red-500/10 text-red-500 border border-red-500/50"
                            : "bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/20 hover:opacity-90"
                    )}
                >
                    {isListening ? (
                        <>
                            <Square className="w-5 h-5 fill-current" />
                            Stop Recording
                            <div className="absolute inset-0 border-2 border-red-500/30 rounded-xl animate-ping opacity-20"></div>
                        </>
                    ) : (
                        <>
                            <Mic className="w-5 h-5" />
                            Tap to Speak
                        </>
                    )}
                </button>
            </div>

            {transcript && isListening && (
                <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--glass-border)] text-sm text-[var(--text-secondary)] animate-in fade-in slide-in-from-bottom-2">
                    <Volume2 className="w-3 h-3 text-[var(--brand)] mb-1" />
                    &quot;{transcript}&quot;
                </div>
            )}
        </div>
    );
}
