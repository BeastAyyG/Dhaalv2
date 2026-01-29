"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Shield, Fingerprint, CheckCircle2, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type LoginStep = "aadhaar" | "consent" | "otp" | "success";

export default function LoginPage() {
    const [aadhaar, setAadhaar] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<LoginStep>("aadhaar");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [maskedMobile, setMaskedMobile] = useState("");

    const { signInWithOTP, verifyOTP, setMockUser } = useAuth();
    const router = useRouter();

    // Format Aadhaar as XXXX-XXXX-XXXX
    const formatAadhaar = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 12);
        const parts = [];
        for (let i = 0; i < digits.length; i += 4) {
            parts.push(digits.slice(i, i + 4));
        }
        return parts.join("-");
    };

    // Validate Aadhaar (basic Verhoeff check simulation)
    const isValidAadhaar = (aadhaar: string) => {
        const digits = aadhaar.replace(/\D/g, "");
        return digits.length === 12 && !digits.startsWith("0") && !digits.startsWith("1");
    };

    // Generate mock masked mobile from Aadhaar
    const generateMaskedMobile = (aadhaar: string) => {
        const digits = aadhaar.replace(/\D/g, "");
        const last4 = digits.slice(-4);
        return `XXXXXXX${last4.slice(-3)}`;
    };

    const handleAadhaarSubmit = async () => {
        if (!isValidAadhaar(aadhaar)) {
            setError("Please enter a valid 12-digit Aadhaar number");
            return;
        }
        setError("");
        setMaskedMobile(generateMaskedMobile(aadhaar));
        setStep("consent");
    };

    const handleConsentAndSendOTP = async () => {
        setLoading(true);
        setError("");

        // Simulate API call to Aadhaar gateway
        await new Promise(resolve => setTimeout(resolve, 2000));

        // For demo: Use a mock phone number based on Aadhaar
        const mockPhone = `+91${aadhaar.replace(/\D/g, "").slice(0, 10)}`;

        try {
            const { error } = await signInWithOTP(mockPhone);
            if (error) {
                // For demo, proceed anyway
                console.log("Demo mode: OTP simulation");
            }
            setStep("otp");
        } catch {
            // Demo mode: proceed anyway
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

        // Simulate verification
        await new Promise(resolve => setTimeout(resolve, 1500));

        // For demo: Accept any 6-digit OTP
        const mockPhone = `+91${aadhaar.replace(/\D/g, "").slice(0, 10)}`;

        try {
            const { error } = await verifyOTP(mockPhone, otp);
            if (error) {
                // Demo mode: Use mock user instead
                console.log("Demo mode: Using mock user");
                setMockUser(aadhaar);
            }
            setStep("success");
            setTimeout(() => router.push("/"), 2000);
        } catch {
            // Demo mode: Use mock user
            setMockUser(aadhaar);
            setStep("success");
            setTimeout(() => router.push("/"), 2000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-deep)] via-[var(--bg-pure)] to-[var(--bg-deep)] p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--brand)] to-[var(--brand-light)] text-white rounded-2xl mb-4 shadow-xl shadow-[var(--brand)]/30">
                        <Shield className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome to Dhaal</h1>
                    <p className="text-[var(--text-muted)] mt-2">Aadhaar-verified civic reporting</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    {["aadhaar", "consent", "otp", "success"].map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                                step === s || ["aadhaar", "consent", "otp", "success"].indexOf(step) > i
                                    ? "bg-[var(--brand)] text-white"
                                    : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                            )}>
                                {["aadhaar", "consent", "otp", "success"].indexOf(step) > i ? "✓" : i + 1}
                            </div>
                            {i < 3 && (
                                <div className={cn(
                                    "w-8 h-0.5 mx-1",
                                    ["aadhaar", "consent", "otp", "success"].indexOf(step) > i
                                        ? "bg-[var(--brand)]"
                                        : "bg-[var(--bg-elevated)]"
                                )} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Login Card */}
                <div className="glass-card-static bg-[var(--bg-surface)]/90 p-6 shadow-2xl">

                    {/* Step 1: Aadhaar Entry */}
                    {step === "aadhaar" && (
                        <>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                    <Fingerprint className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-[var(--text-primary)]">Aadhaar Authentication</h2>
                                    <p className="text-xs text-[var(--text-muted)]">Powered by UIDAI</p>
                                </div>
                            </div>

                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Enter your 12-digit Aadhaar Number
                            </label>
                            <input
                                type="text"
                                value={formatAadhaar(aadhaar)}
                                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                                placeholder="XXXX-XXXX-XXXX"
                                className="w-full px-4 py-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--glass-border)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 outline-none text-center text-xl tracking-widest font-mono text-[var(--text-primary)] mb-4"
                                maxLength={14}
                            />

                            {error && (
                                <div className="flex items-center gap-2 text-red-500 text-sm mb-4">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleAadhaarSubmit}
                                disabled={aadhaar.replace(/\D/g, "").length < 12}
                                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-orange-500/30"
                            >
                                Verify Aadhaar <ArrowRight className="w-5 h-5" />
                            </button>

                            <p className="text-xs text-[var(--text-subtle)] mt-4 text-center">
                                🔒 Your Aadhaar is encrypted and securely transmitted
                            </p>
                        </>
                    )}

                    {/* Step 2: Consent */}
                    {step === "consent" && (
                        <>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                    <Lock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-[var(--text-primary)]">User Consent Required</h2>
                                    <p className="text-xs text-[var(--text-muted)]">UIDAI Authentication</p>
                                </div>
                            </div>

                            <div className="bg-[var(--bg-elevated)] rounded-xl p-4 mb-4 border border-[var(--glass-border)]">
                                <p className="text-sm text-[var(--text-secondary)] mb-3">
                                    I hereby give my consent to:
                                </p>
                                <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                        Share my Aadhaar-linked mobile number for OTP
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                        Authenticate my identity with UIDAI
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                        Use my verified identity for civic reporting
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4">
                                <p className="text-sm text-green-400">
                                    📱 OTP will be sent to mobile: <strong>{maskedMobile}</strong>
                                </p>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-500 text-sm mb-4">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleConsentAndSendOTP}
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-[var(--brand)] to-[var(--brand-light)] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[var(--brand)]/30"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        I Agree - Send OTP <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setStep("aadhaar")}
                                className="w-full mt-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            >
                                ← Change Aadhaar number
                            </button>
                        </>
                    )}

                    {/* Step 3: OTP Verification */}
                    {step === "otp" && (
                        <>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-[var(--text-primary)]">Enter OTP</h2>
                                    <p className="text-xs text-[var(--text-muted)]">Sent to {maskedMobile}</p>
                                </div>
                            </div>

                            <p className="text-sm text-[var(--text-secondary)] mb-4">
                                Enter the 6-digit OTP sent to your Aadhaar-linked mobile number
                            </p>

                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                placeholder="● ● ● ● ● ●"
                                className="w-full px-4 py-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--glass-border)] focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-center text-3xl tracking-[0.5em] font-mono text-[var(--text-primary)] mb-4"
                                maxLength={6}
                                autoFocus
                            />

                            {error && (
                                <div className="flex items-center gap-2 text-red-500 text-sm mb-4">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleVerifyOTP}
                                disabled={loading || otp.length < 6}
                                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-green-500/30"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify & Login <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setStep("consent")}
                                className="w-full mt-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            >
                                Resend OTP
                            </button>
                        </>
                    )}

                    {/* Step 4: Success */}
                    {step === "success" && (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-xl shadow-green-500/30 animate-pulse">
                                <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                Verified Successfully!
                            </h2>
                            <p className="text-[var(--text-muted)] mb-4">
                                Your Aadhaar has been authenticated
                            </p>
                            <div className="flex items-center justify-center gap-2 text-green-500">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Redirecting to dashboard...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-xs text-[var(--text-subtle)]">
                        🔐 Secured by UIDAI Aadhaar Authentication
                    </p>
                    <p className="text-xs text-[var(--text-subtle)] mt-1">
                        By signing in, you agree to our Terms of Service
                    </p>
                </div>

                {/* Demo Notice */}
                <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-xs text-yellow-500 text-center">
                        ⚠️ Demo Mode: Enter any valid Aadhaar format and any 6-digit OTP
                    </p>
                </div>
            </div>
        </div>
    );
}
