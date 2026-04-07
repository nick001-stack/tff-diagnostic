"use client";
import { DIMENSIONS, pick } from "@/lib/questions";
import { tr, t, type Lang } from "@/lib/i18n";

type Props = { data: any; lang: Lang; onRestart: () => void };

const dimColor = (s: number) => (s >= 55 ? "#1A6B5C" : s >= 30 ? "#888888" : "#333333");

const maturityLabel = (key: string, lang: Lang): string => {
  const k = `maturity_${key}` as keyof typeof t;
  return (t as any)[k]?.[lang] || key;
};
const drqLabel = (key: string, lang: Lang): string => {
  const k = `drq_${key}` as keyof typeof t;
  return (t as any)[k]?.[lang] || key;
};

export default function Report({ data, lang, onRestart }: Props) {
  const { scores, report, prospect, source } = data;

  const downloadMD = () => {
    const md = renderMarkdown(data, lang);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TFF_Readiness_${(prospect.company_name || "Report").replace(/\s+/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPDF = () => window.print();

  const dateLocale = lang === "fr" ? "fr-FR" : "en-GB";

  return (
    <div className="space-y-8">
      <div className="no-print flex gap-3 justify-end">
        <button className="btn-ghost" onClick={onRestart}>↻ {tr("btn_new", lang)}</button>
        <button className="btn-ghost" onClick={downloadMD}>↓ {tr("btn_md", lang)}</button>
        <button className="btn-primary" onClick={printPDF}>↓ {tr("btn_pdf", lang)}</button>
      </div>

      {/* COVER */}
      <div className="card text-center py-12">
        <div className="font-display font-bold text-4xl mb-2">TFF<span className="text-tff-green">/</span></div>
        <div className="mono text-xs text-tff-gray uppercase tracking-widest mb-8">{tr("report_subtitle", lang)}</div>
        <div className="text-2xl font-display font-semibold mb-1">{prospect.company_name}</div>
        <div className="text-sm text-tff-gray mb-8">{new Date().toLocaleDateString(dateLocale, { day: "2-digit", month: "long", year: "numeric" })}</div>
        <div className="inline-block">
          <div className="text-7xl font-display font-bold mono" style={{ color: dimColor(scores.composite) }}>{scores.composite}</div>
          <div className="text-sm text-tff-gray uppercase tracking-widest mt-2">{tr("report_composite", lang)}</div>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Badge text={maturityLabel(scores.maturityLevel.key, lang)} />
          <Badge text={drqLabel(scores.drqClass.key, lang)} accent />
        </div>
      </div>

      {/* EXEC SUMMARY */}
      <div className="card">
        <SectionTitle>{tr("sec_executive", lang)}</SectionTitle>
        <p className="text-tff-charcoal leading-relaxed">{report.executive_summary}</p>
      </div>

      {/* DIMENSION SCORES */}
      <div className="card">
        <SectionTitle>{tr("sec_scores", lang)}</SectionTitle>
        <div className="space-y-4">
          {(["D1", "D2", "D3", "D4", "D5", "D6"] as const).map((d) => {
            const s = scores[d];
            const dim = DIMENSIONS[d];
            return (
              <div key={d}>
                <div className="flex justify-between text-sm mb-1">
                  <span><span className="mono font-bold">{d}</span> · {pick(dim.name, lang)} <span className="text-tff-gray">({dim.module})</span></span>
                  <span className="mono font-bold" style={{ color: dimColor(s) }}>{s}/100</span>
                </div>
                <div className="h-2 bg-[#e8e6e1]">
                  <div className="h-full" style={{ width: `${s}%`, background: dimColor(s) }} />
                </div>
                <p className="text-sm text-tff-charcoal mt-2 leading-relaxed">{report.dimension_commentary?.[d]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* TEAM ANALYSIS */}
      <div className="card">
        <SectionTitle>{tr("sec_team", lang)}</SectionTitle>
        <p className="text-tff-charcoal leading-relaxed">{report.team_analysis}</p>
      </div>

      {/* MIGRATION PATH */}
      <div className="card">
        <SectionTitle>{tr("sec_migration", lang)}</SectionTitle>
        <p className="text-tff-charcoal leading-relaxed mb-4">{report.migration_path}</p>
        {scores.migrationFlags?.length > 0 && (
          <div className="mt-4">
            <div className="mono text-xs uppercase tracking-widest text-tff-gray mb-2">{tr("migration_flags", lang)}</div>
            <ul className="space-y-1 text-sm">
              {scores.migrationFlags.map((f: any, i: number) => (
                <li key={i}><span className="mono font-bold">{f.dimension}/{f.question}</span> — {f.currentState}</li>
              ))}
            </ul>
          </div>
        )}
        {scores.positiveSignals?.length > 0 && (
          <div className="mt-4">
            <div className="mono text-xs uppercase tracking-widest text-tff-gray mb-2">{tr("positive_signals", lang)}</div>
            <ul className="space-y-1 text-sm">
              {scores.positiveSignals.map((p: any, i: number) => (
                <li key={i}><span className="mono font-bold text-tff-green">{p.dimension}/{p.question}</span> — {p.signal}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* PACKAGE */}
      <div className="card border-l-4" style={{ borderLeftColor: "#1A6B5C" }}>
        <SectionTitle>{tr("sec_package", lang)}</SectionTitle>
        <div className="text-2xl font-display font-bold mb-2">{report.recommended_package?.name}</div>
        <div className="mono text-sm text-tff-gray mb-3">{report.recommended_package?.indicative_monthly_pricing}</div>
        <p className="text-tff-charcoal leading-relaxed mb-4">{report.recommended_package?.rationale}</p>
        <div className="flex flex-wrap gap-2">
          {report.recommended_package?.modules_activated?.map((m: string) => (
            <span key={m} className="mono text-xs px-2 py-1 bg-[#F0EEEA] border border-[#d8d6d1]">{m}</span>
          ))}
        </div>
      </div>

      {/* NEXT STEPS */}
      <div className="card">
        <SectionTitle>{tr("sec_next", lang)}</SectionTitle>
        <ol className="space-y-2">
          {report.next_steps?.map((s: string, i: number) => (
            <li key={i} className="flex gap-3">
              <span className="mono font-bold text-tff-green">{String(i + 1).padStart(2, "0")}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* CTA */}
      <div className="card text-center bg-tff-black text-tff-warm">
        <div className="font-display text-2xl font-bold mb-3">{tr("sec_cta_title", lang)}</div>
        <p className="mb-6 opacity-90">{report.cta}</p>
        <a href="https://cfoai.fr/diagnostic" className="inline-block bg-tff-warm text-tff-black px-6 py-3 font-semibold hover:bg-white transition">{tr("sec_cta_btn", lang)}</a>
      </div>

      {source !== "ai" && (
        <p className="text-xs text-tff-gray text-center mono">{tr("fallback_notice", lang)} ({source}).</p>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-lg font-bold mb-4 uppercase tracking-wide">{children}</h3>;
}
function Badge({ text, accent }: { text: string; accent?: boolean }) {
  return (
    <span className={`mono text-xs px-3 py-1 uppercase tracking-widest ${accent ? "bg-tff-green text-white" : "bg-[#F0EEEA] border border-[#d8d6d1]"}`}>{text}</span>
  );
}

function renderMarkdown(data: any, lang: Lang): string {
  const { scores, report, prospect } = data;
  const fr = lang === "fr";
  const matLabel = maturityLabel(scores.maturityLevel.key, lang);
  const drqL = drqLabel(scores.drqClass.key, lang);
  return `# ${fr ? "Rapport TFF/ de Maturité Finance" : "TFF/ Finance Readiness Report"} — ${prospect.company_name}
Date: ${new Date().toISOString().slice(0, 10)}

## ${fr ? "Score Composite" : "Composite Score"}: ${scores.composite}/100
- ${fr ? "Maturité" : "Maturity"}: **${matLabel}** (${fr ? "niveau" : "level"} ${scores.maturityLevel.level})
- DRQ: **${drqL}**
- ${fr ? "Parcours" : "Path"}: ${scores.drqClass.path}

## ${tr("sec_executive", lang)}
${report.executive_summary}

## ${tr("sec_scores", lang)}
${(["D1","D2","D3","D4","D5","D6"] as const).map((d) => `### ${d} — ${pick(DIMENSIONS[d].name, lang)} (${scores[d]}/100)\n${report.dimension_commentary?.[d] || ""}`).join("\n\n")}

## ${tr("sec_team", lang)}
${report.team_analysis}

## ${tr("sec_migration", lang)}
${report.migration_path}

${scores.migrationFlags?.length ? `### ${tr("migration_flags", lang)}\n${scores.migrationFlags.map((f:any) => `- ${f.dimension}/${f.question}: ${f.currentState}`).join("\n")}\n` : ""}

## ${tr("sec_package", lang)}: ${report.recommended_package?.name}
**${fr ? "Tarif" : "Pricing"}:** ${report.recommended_package?.indicative_monthly_pricing}

${report.recommended_package?.rationale}

Modules: ${report.recommended_package?.modules_activated?.join(", ")}

## ${tr("sec_next", lang)}
${report.next_steps?.map((s:string,i:number) => `${i+1}. ${s}`).join("\n")}

---
${report.cta}

cfoai.fr — CFO AI Fractional Agency
`;
}
