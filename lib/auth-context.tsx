"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithOTP: (phone: string) => Promise<{ error: Error | null }>;
    verifyOTP: (phone: string, token: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
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
        if (supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithOTP, verifyOTP, signOut }}>
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
        };
    }
    return context;
}

