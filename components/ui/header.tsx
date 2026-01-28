"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { Sun, Moon, LogIn, LogOut, Shield, BarChart3, Menu, Globe, Zap, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
    const { theme, toggleTheme } = useTheme();
    const { user, signOut } = useAuth();
    const { language, setLanguage } = useI18n();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
            <div className="glass-card-static mx-auto max-w-7xl">
                <div className="flex items-center justify-between h-16 px-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-[var(--gradient-brand)] flex items-center justify-center shadow-lg brand-glow transition-transform group-hover:scale-105">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-bold text-xl text-[var(--text-primary)]">Dhaal</span>
                            <span className="block text-[10px] text-[var(--text-muted)] -mt-1">Civic Shield</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link href="/" className="btn-ghost text-sm">
                            Feed
                        </Link>
                        <Link href="/analytics" className="btn-ghost text-sm flex items-center gap-1.5">
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                        </Link>
                        <Link href="/officer" className="btn-ghost text-sm">
                            Officer Panel
                        </Link>
                        <Link href="/profile" className="btn-ghost text-sm flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            Profile
                        </Link>
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-2">
                        {/* XP Badge */}
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--brand)]/10 border border-[var(--brand)]/20">
                            <Zap className="w-3.5 h-3.5 text-[var(--brand-light)]" />
                            <span className="text-xs font-bold text-[var(--brand-light)]">1,250 XP</span>
                        </div>

                        {/* Language Toggle */}
                        <button
                            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                            className="btn-ghost flex items-center gap-1.5 text-sm"
                            aria-label="Toggle language"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="hidden sm:inline font-medium">
                                {language === "en" ? "हिं" : "EN"}
                            </span>
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="btn-ghost"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* Auth Button */}
                        {user ? (
                            <button
                                onClick={() => signOut()}
                                className="btn-ghost text-[var(--error)] hover:bg-[var(--error-bg)]"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        ) : (
                            <Link href="/login" className="btn-primary text-sm flex items-center gap-2">
                                <LogIn className="w-4 h-4" />
                                <span>Login</span>
                            </Link>
                        )}

                        {/* Mobile Menu */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden btn-ghost"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {menuOpen && (
                    <div className="md:hidden border-t border-[var(--glass-border)] py-3 px-3 space-y-1 animate-fade-in">
                        <Link
                            href="/"
                            className="block py-2.5 px-3 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-sm font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            Feed
                        </Link>
                        <Link
                            href="/analytics"
                            className="block py-2.5 px-3 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-sm font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            Analytics
                        </Link>
                        <Link
                            href="/officer"
                            className="block py-2.5 px-3 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-sm font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            Officer Panel
                        </Link>
                        <Link
                            href="/profile"
                            className="block py-2.5 px-3 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-sm font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            Profile
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
