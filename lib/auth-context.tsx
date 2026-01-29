"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

// Mock user for demo purposes
const MOCK_USER_KEY = "dhaal_mock_user";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithOTP: (phone: string) => Promise<{ error: Error | null }>;
    verifyOTP: (phone: string, token: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    // Demo mode helpers
    setMockUser: (aadhaar: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            // Check for mock user first (demo mode)
            if (typeof window !== "undefined") {
                const mockUserData = localStorage.getItem(MOCK_USER_KEY);
                if (mockUserData) {
                    try {
                        const mockUser = JSON.parse(mockUserData) as User;
                        setUser(mockUser);
                        setLoading(false);
                        return;
                    } catch {
                        localStorage.removeItem(MOCK_USER_KEY);
                    }
                }
            }

            // Check Supabase session
            if (!supabase) {
                setLoading(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        initAuth();

        // Listen for auth changes
        if (supabase) {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
            });

            return () => subscription.unsubscribe();
        }
    }, []);

    const signInWithOTP = async (phone: string) => {
        if (!supabase) return { error: new Error("Supabase not configured") };

        const { error } = await supabase.auth.signInWithOtp({
            phone,
        });
        return { error: error as Error | null };
    };

    const verifyOTP = async (phone: string, token: string) => {
        if (!supabase) return { error: new Error("Supabase not configured") };

        const { error } = await supabase.auth.verifyOtp({
            phone,
            token,
            type: "sms",
        });
        return { error: error as Error | null };
    };

    const signOut = async () => {
        // Clear mock user
        localStorage.removeItem(MOCK_USER_KEY);

        if (supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
    };

    // Set mock user for demo mode
    const setMockUser = (aadhaar: string) => {
        const mockUser = {
            id: `mock-${aadhaar.replace(/\D/g, "")}`,
            email: `user${aadhaar.slice(-4)}@dhaal.demo`,
            phone: `+91${aadhaar.replace(/\D/g, "").slice(0, 10)}`,
            created_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {
                aadhaar_last4: aadhaar.slice(-4),
            },
            aud: "authenticated",
        } as unknown as User;

        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
        setUser(mockUser);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithOTP, verifyOTP, signOut, setMockUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    // Return default values if context is not available (SSR safety)
    if (!context) {
        return {
            user: null,
            loading: true,
            signInWithOTP: async () => ({ error: null }),
            verifyOTP: async () => ({ error: null }),
            signOut: async () => { },
            setMockUser: () => { },
        };
    }
    return context;
}

