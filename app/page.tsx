"use client";
import { useState } from "react";
import DiagnosticForm from "@/components/DiagnosticForm";
import Report from "@/components/Report";
import { useLang } from "@/components/LanguageProvider";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const { lang } = useLang();
  return result ? (
    <Report data={result} lang={lang} onRestart={() => setResult(null)} />
  ) : (
    <DiagnosticForm lang={lang} onComplete={setResult} />
  );
}
