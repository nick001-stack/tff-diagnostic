import type { Metadata } from "next";
import "./globals.css";
import LanguageProvider, { LanguageToggle } from "@/components/LanguageProvider";

export const metadata: Metadata = {
  title: "TFF/ Finance Readiness Diagnostic — CFO AI",
  description:
    "Free 5-minute diagnostic to assess your finance function maturity across 6 dimensions. By CFO AI Fractional Agency.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <header className="no-print border-b border-[#d8d6d1] bg-[#F0EEEA]">
            <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
              <div className="font-display font-bold text-xl tracking-tight">
                TFF<span className="text-tff-green">/</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="mono text-xs text-tff-gray uppercase tracking-widest hidden sm:block">
                  Finance Readiness Diagnostic
                </div>
                <LanguageToggle />
              </div>
            </div>
          </header>
          <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
          <footer className="no-print border-t border-[#d8d6d1] mt-20 py-6">
            <div className="max-w-5xl mx-auto px-6 text-xs mono text-tff-gray uppercase tracking-widest flex justify-between">
              <span>CFO AI Fractional Agency</span>
              <span>cfoai.fr</span>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
