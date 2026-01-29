"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { Sun, Moon, LogIn, LogOut, Shield, BarChart3, Menu, Globe, Zap, User, X } from "lucide-react";
import { useState } from "react";
// import { cn } from "@/lib/utils";
import { NotificationsDropdown } from "@/components/ui/notifications-dropdown";

export function Header() {
    const { theme, toggleTheme } = useTheme();
    const { user, signOut } = useAuth();
    const { language, setLanguage } = useI18n();
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Feed" },
        { href: "/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/officer", label: "Officer" },
        { href: "/profile", label: "Profile", icon: User },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
            <nav className="glass-card-static mx-auto max-w-7xl bg-[var(--bg-surface)]/95 shadow-lg" role="navigation" aria-label="Main navigation">
                <div className="flex items-center justify-between h-14 px-2">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 group"
                        aria-label="Dhaal - Home"
                    >
                        <div className="relative w-9 h-9">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo.png" alt="Dhaal Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-semibold text-lg text-[var(--text-primary)]">Dhaal</span>
                            <span className="block text-[10px] text-[var(--text-subtle)] -mt-0.5 font-mono">CIVIC SHIELD</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="btn-ghost text-sm"
                            >
                                {link.icon && <link.icon className="w-4 h-4" aria-hidden="true" />}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-1">
                        {/* XP Badge */}
                        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[var(--info-bg)] border border-[rgba(59,130,246,0.2)]">
                            <Zap className="w-3.5 h-3.5 text-[var(--info)]" aria-hidden="true" />
                            <span className="text-xs font-semibold font-mono text-[var(--info)]">1,250</span>
                        </div>

                        {/* Notifications */}
                        <NotificationsDropdown />

                        {/* Language Toggle */}
                        <button
                            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-bold border border-[var(--glass-border)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors min-w-[3rem] justify-center"
                            aria-label={`Current language: ${language.toUpperCase()}`}
                        >
                            {language === "en" ? "EN" : "HI"}
                            <Globe className="w-3 h-3 text-[var(--text-subtle)]" />
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="btn-icon"
                            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        >
                            {theme === "dark" ? (
                                <Sun className="w-4.5 h-4.5" aria-hidden="true" />
                            ) : (
                                <Moon className="w-4.5 h-4.5" aria-hidden="true" />
                            )}
                        </button>

                        {/* Auth / Profile */}
                        {user ? (
                            <Link
                                href="/profile"
                                className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--brand-light)] text-white shadow-lg shadow-[var(--brand)]/20 hover:opacity-90 transition-opacity"
                                aria-label="My Profile"
                            >
                                <span className="text-sm font-bold">
                                    {user.email?.charAt(0).toUpperCase() || "U"}
                                </span>
                            </Link>
                        ) : (
                            <Link href="/login" className="btn-primary text-sm py-2 px-4">
                                <LogIn className="w-4 h-4" aria-hidden="true" />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden btn-icon"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                        >
                            {menuOpen ? (
                                <X className="w-5 h-5" aria-hidden="true" />
                            ) : (
                                <Menu className="w-5 h-5" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div
                        className="md:hidden border-t border-[var(--glass-border)] py-2 animate-fade-in"
                        role="menu"
                    >
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                                onClick={() => setMenuOpen(false)}
                                role="menuitem"
                            >
                                {link.icon && <link.icon className="w-4 h-4" aria-hidden="true" />}
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>
        </header>
    );
}
