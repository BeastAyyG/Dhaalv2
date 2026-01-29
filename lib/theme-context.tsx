"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// SSR-safe subscription for theme
function subscribe(callback: () => void) {
    window.addEventListener("storage", callback);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", callback);
    return () => {
        window.removeEventListener("storage", callback);
        mediaQuery.removeEventListener("change", callback);
    };
}

function getSnapshot(): Theme {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem("dhaal-theme") as Theme | null;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerSnapshot(): Theme {
    return "dark"; // Default to dark for OLED-optimized design
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const storedTheme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const [theme, setTheme] = useState<Theme>(storedTheme);

    // Sync when external storage changes
    useEffect(() => {
        setTheme(storedTheme);
    }, [storedTheme]);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.classList.toggle("light", theme === "light");
        localStorage.setItem("dhaal-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    // Return a default value if context is not available (SSR safety)
    if (!context) {
        return { theme: "dark" as const, toggleTheme: () => { } };
    }
    return context;
}
