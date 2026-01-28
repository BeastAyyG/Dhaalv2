"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, Loader2, Shield } from "lucide-react";

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { signInWithOTP, verifyOTP } = useAuth();
    const router = useRouter();

    const handleSendOTP = async () => {
        if (!phone || phone.length < 10) {
            setError("Please enter a valid phone number");
            return;
        }

        setLoading(true);
        setError("");

        const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
        const { error } = await signInWithOTP(formattedPhone);

        if (error) {
            setError(error.message);
        } else {
            setStep("otp");
        }
        setLoading(false);
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            setError("Please enter 6-digit OTP");
            return;
        }

        setLoading(true);
        setError("");

        const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
        const { error } = await verifyOTP(formattedPhone, otp);

        if (error) {
            setError(error.message);
        } else {
            router.push("/");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-2xl mb-4">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome to Dhaal</h1>
                    <p className="text-neutral-500 mt-2">Sign in to report civic issues</p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-800">
                    {step === "phone" ? (
                        <>
                            <label className="block text-sm font-medium mb-2">Phone Number</label>
                            <div className="flex gap-2 mb-4">
                                <div className="flex items-center gap-2 px-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm">
                                    🇮🇳 +91
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                    placeholder="9876543210"
                                    className="flex-1 px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-0 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm mb-4">{error}</p>
                            )}

                            <button
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Send OTP <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <label className="block text-sm font-medium mb-2">Enter OTP</label>
                            <p className="text-sm text-neutral-500 mb-4">
                                We sent a 6-digit code to +91{phone}
                            </p>

                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                placeholder="123456"
                                className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-0 focus:ring-2 focus:ring-blue-500 outline-none text-center text-2xl tracking-widest mb-4"
                            />

                            {error && (
                                <p className="text-red-500 text-sm mb-4">{error}</p>
                            )}

                            <button
                                onClick={handleVerifyOTP}
                                disabled={loading}
                                className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Verify & Continue <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setStep("phone")}
                                className="w-full mt-3 py-2 text-sm text-neutral-500 hover:text-neutral-700"
                            >
                                Change phone number
                            </button>
                        </>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-neutral-400 mt-6">
                    By signing in, you agree to our Terms of Service
                </p>
            </div>
        </div>
    );
}
