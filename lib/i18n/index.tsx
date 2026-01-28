"use client";

import { createContext, useContext, useState, useEffect } from "react";
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

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("dhaal-lang") as Language | null;
        if (stored && (stored === "en" || stored === "hi")) {
            setLanguageState(stored);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("dhaal-lang", lang);
    };

    const t = translations[language];

    if (!mounted) {
        return <>{children}</>;
    }

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
