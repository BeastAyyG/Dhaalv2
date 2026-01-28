"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { Sun, Moon, LogIn, LogOut, Shield, BarChart3, User, Menu, Globe } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
    const { theme, toggleTheme } = useTheme();
    const { user, signOut } = useAuth();
    const { language, setLanguage, t } = useI18n();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
            <div className="glass-card mx-auto max-w-7xl">
                <div className="flex items-center justify-between h-16 px-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl hidden sm:block">Dhaal</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                        >
                            Feed
                        </Link>
                        <Link
                            href="/analytics"
                            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                        </Link>
                        <Link
                            href="/officer"
                            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                        >
                            Officer Panel
                        </Link>
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {/* XP Badge */}
                        <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
                            <span className="text-xs font-bold gradient-text">1,250 XP</span>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl hover:bg-[var(--border)] transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* Language Toggle */}
                        <button
                            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                            className="flex items-center gap-1 px-2 py-1.5 rounded-xl hover:bg-[var(--border)] transition-colors text-sm font-medium"
                            aria-label="Toggle language"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="hidden sm:inline">{language === "en" ? "हिं" : "EN"}</span>
                        </button>

                        {/* Auth Button */}
                        {user ? (
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--border)] hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline text-sm font-medium">Logout</span>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary"
                            >
                                <LogIn className="w-4 h-4" />
                                <span className="text-sm font-medium">Login</span>
                            </Link>
                        )}

                        {/* Mobile Menu */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden p-2 rounded-xl hover:bg-[var(--border)] transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {menuOpen && (
                    <div className="md:hidden border-t border-[var(--border)] py-4 px-4 space-y-2 animate-fade-in">
                        <Link
                            href="/"
                            className="block py-2 px-3 rounded-lg hover:bg-[var(--border)] transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            Feed
                        </Link>
                        <Link
                            href="/analytics"
                            className="block py-2 px-3 rounded-lg hover:bg-[var(--border)] transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            Analytics
                        </Link>
                        <Link
                            href="/officer"
                            className="block py-2 px-3 rounded-lg hover:bg-[var(--border)] transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            Officer Panel
                        </Link>
                        <Link
                            href="/profile"
                            className="block py-2 px-3 rounded-lg hover:bg-[var(--border)] transition-colors"
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
