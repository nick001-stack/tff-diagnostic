"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Lang } from "@/lib/i18n";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };
const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {} });

export const useLang = () => useContext(LangContext);

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tff_lang");
      if (stored === "fr" || stored === "en") setLangState(stored);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("tff_lang", l); } catch {}
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-1 mono text-xs">
      <button
        onClick={() => setLang("en")}
        className={`px-2 py-1 transition ${lang === "en" ? "bg-tff-black text-tff-warm" : "text-tff-gray hover:text-tff-black"}`}
        aria-label="English"
      >EN</button>
      <span className="text-tff-gray">|</span>
      <button
        onClick={() => setLang("fr")}
        className={`px-2 py-1 transition ${lang === "fr" ? "bg-tff-black text-tff-warm" : "text-tff-gray hover:text-tff-black"}`}
        aria-label="Français"
      >FR</button>
    </div>
  );
}
