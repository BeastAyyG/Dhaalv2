"use client";

import { createContext, useContext, useState, useEffect, useSyncExternalStore } from "react";
import en from "./en.json";
import hi from "./hi.json";

type Language = "en" | "hi";
type Translations = typeof en;

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const translations: Record<Language, Translations> = { en, hi };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// SSR-safe subscription for hydration
function subscribe(callback: () => void) {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): Language {
    if (typeof window === "undefined") return "en";
    const stored = localStorage.getItem("dhaal-lang");
    return stored === "hi" ? "hi" : "en";
}

function getServerSnapshot(): Language {
    return "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const storedLang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const [language, setLanguageState] = useState<Language>(storedLang);

    // Sync when external storage changes
    useEffect(() => {
        setLanguageState(storedLang);
    }, [storedLang]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("dhaal-lang", lang);
    };

    const t = translations[language];

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        return {
            language: "en" as Language,
            setLanguage: () => { },
            t: en
        };
    }
    return context;
}
