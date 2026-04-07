"use client";
import { useState } from "react";
import DiagnosticForm from "@/components/DiagnosticForm";
import Report from "@/components/Report";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  return result ? (
    <Report data={result} onRestart={() => setResult(null)} />
  ) : (
    <DiagnosticForm onComplete={setResult} />
  );
}
