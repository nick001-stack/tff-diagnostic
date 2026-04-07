import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { computeScores, Answers } from "@/lib/scoring";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompt";
import { SPECIALIZED_NEEDS, pick } from "@/lib/questions";
import type { Lang } from "@/lib/i18n";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  prospect: { company_name: string; contact_name: string; email: string; revenue_range?: string; employee_count?: string };
  team_structure: Record<string, string>;
  specialized_needs?: string[];
  answers: Answers;
  lang?: Lang;
};

function fallbackReport(scores: ReturnType<typeof computeScores>, lang: Lang) {
  const fr = lang === "fr";
  const tplEn: Record<string, any> = {
    Controlled: {
      executive_summary: `Composite score ${scores.composite}/100 — Controlled. Your finance function is structured and largely automated. TFF/ would add only marginal value at this stage.`,
      package: "Strategic Layer", pricing: "1.5K–3K€/month",
    },
    Structured: {
      executive_summary: `Composite score ${scores.composite}/100 — Structured. Processes exist but remain largely manual. You are a strong candidate for TFF/ Fast-Track onboarding.`,
      package: "Operating Layer", pricing: "2.5K–4K€/month",
    },
    Reactive: {
      executive_summary: `Composite score ${scores.composite}/100 — Reactive. Significant gaps across multiple finance functions. A Reconciliation Sprint is required before activating the Control Layer.`,
      package: "Full Suite", pricing: "4K–7K€/month",
    },
    Blind: {
      executive_summary: `Composite score ${scores.composite}/100 — Blind. Foundational finance work needed before TFF/ deployment. We recommend partnering with an expert-comptable first.`,
      package: "Pre-Qualification", pricing: "n/a",
    },
  };
  const tplFr: Record<string, any> = {
    Controlled: {
      executive_summary: `Score composite ${scores.composite}/100 — Maîtrisé. Votre fonction finance est structurée et largement automatisée. TFF/ n'apporterait qu'une valeur marginale à ce stade.`,
      package: "Strategic Layer", pricing: "1,5K–3K€/mois",
    },
    Structured: {
      executive_summary: `Score composite ${scores.composite}/100 — Structuré. Les processus existent mais restent largement manuels. Vous êtes un candidat solide pour l'onboarding Fast-Track TFF/.`,
      package: "Operating Layer", pricing: "2,5K–4K€/mois",
    },
    Reactive: {
      executive_summary: `Score composite ${scores.composite}/100 — Réactif. Écarts significatifs sur plusieurs fonctions finance. Un Sprint de Réconciliation est requis avant l'activation du Control Layer.`,
      package: "Full Suite", pricing: "4K–7K€/mois",
    },
    Blind: {
      executive_summary: `Score composite ${scores.composite}/100 — Aveugle. Travail de fond nécessaire avant tout déploiement TFF/. Nous recommandons un partenariat avec un expert-comptable d'abord.`,
      package: "Pre-Qualification", pricing: "n/a",
    },
  };
  const t = (fr ? tplFr : tplEn)[scores.maturityLevel.key];

  const dimComm = fr ? {
    D1: `Score ${scores.D1}/100. Visibilité Cash & Trésorerie à renforcer — TFF/ Keystone active la position de trésorerie temps réel et le forecast.`,
    D2: `Score ${scores.D2}/100. Maîtrise Comptes Fournisseurs incomplète — TFF/ LedgerCore automatise la saisie, la purge des drafts et le suivi de l'aging.`,
    D3: `Score ${scores.D3}/100. Recouvrement et créances à structurer — TFF/ FlowCollect orchestre le DSO, l'automatisation des relances et le risque de concentration.`,
    D4: `Score ${scores.D4}/100. Discipline de clôture mensuelle manquante — TFF/ LedgerCore impose des contrôles audit-grade et une clôture J+5.`,
    D5: `Score ${scores.D5}/100. Posture conformité à durcir — TFF/ VaultShield gère PAF, facturation électronique et archivage.`,
    D6: `Score ${scores.D6}/100. Visibilité décisionnelle limitée — TFF/ ClearView livre P&L live et dashboards KPI.`,
  } : {
    D1: `Score ${scores.D1}/100. Cash & Treasury visibility needs work — TFF/ Keystone activates real-time cash position and treasury forecasting.`,
    D2: `Score ${scores.D2}/100. Accounts Payable control gap — TFF/ LedgerCore automates invoice capture, draft purge, and aging monitoring.`,
    D3: `Score ${scores.D3}/100. Receivables and collections lag — TFF/ FlowCollect orchestrates DSO tracking, dunning automation, and concentration risk.`,
    D4: `Score ${scores.D4}/100. Monthly close discipline missing — TFF/ LedgerCore enforces audit-grade controls and J+5 close.`,
    D5: `Score ${scores.D5}/100. Compliance posture needs hardening — TFF/ VaultShield handles PAF, e-invoicing, and archiving.`,
    D6: `Score ${scores.D6}/100. Decision visibility limited — TFF/ ClearView delivers live P&L and KPI dashboards.`,
  };

  return {
    executive_summary: t.executive_summary,
    dimension_commentary: dimComm,
    team_analysis: fr
      ? "Analyse de secours statique — voir les scores et drapeaux de migration pour le contexte."
      : "Static fallback — see scores and migration flags for context.",
    migration_path: scores.migrationFlags.length > 0
      ? (fr
        ? `${scores.migrationFlags.length} outil(s) signalé(s) pour migration. Un Sprint de Réconciliation récupérera l'historique et établira la connectivité API.`
        : `${scores.migrationFlags.length} tool(s) flagged for migration. A Reconciliation Sprint will recover historical data and establish API connectivity.`)
      : (fr
        ? "Votre stack outil est largement API-ready — activation Fast-Track possible."
        : "Your tool stack is largely API-ready — Fast-Track activation possible."),
    recommended_package: {
      name: t.package,
      rationale: fr ? "Recommandation de secours basée sur le score composite et le niveau de maturité." : "Static fallback — based on composite score and maturity level.",
      modules_activated: ["TFF/ Keystone", "TFF/ LedgerCore", "TFF/ FlowCollect", "TFF/ VaultShield", "TFF/ ClearView"],
      indicative_monthly_pricing: t.pricing,
    },
    next_steps: fr ? [
      "Examinez vos scores par dimension ci-dessous",
      "Réservez un Diagnostic CFO de 30 minutes",
      scores.migrationFlags.length > 0 ? "Planifiez votre Sprint de Réconciliation" : "Planifiez votre activation Fast-Track",
      "Activez votre Control Layer TFF/",
    ] : [
      "Review your dimension scores below",
      "Book a 30-min CFO Diagnostic call",
      scores.migrationFlags.length > 0 ? "Plan your Reconciliation Sprint" : "Plan your Fast-Track activation",
      "Activate your TFF/ Control Layer",
    ],
    cta: fr
      ? "Réservez votre Diagnostic CFO gratuit de 30 minutes sur cfoai.fr/diagnostic pour valider ce rapport et définir votre plan d'activation."
      : "Book your free 30-minute CFO Diagnostic at cfoai.fr/diagnostic to validate this report and define your activation plan.",
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: Body = await req.json();
    const lang: Lang = body.lang === "fr" ? "fr" : "en";

    if (!body?.prospect?.email || !body?.answers) {
      return NextResponse.json({ error: "Missing prospect or answers" }, { status: 400 });
    }

    const scores = computeScores(body.answers, lang);

    const specializedNeedIds = body.specialized_needs || [];
    const specializedNeedsLabeled = specializedNeedIds
      .map((id) => SPECIALIZED_NEEDS.find((n) => n.id === id))
      .filter((n): n is (typeof SPECIALIZED_NEEDS)[number] => !!n)
      .map((n) => ({ id: n.id, label: pick(n.label, lang) }));

    const llmInput = {
      prospect: body.prospect,
      team_structure: body.team_structure,
      specialized_needs: specializedNeedsLabeled,
      answers: scores.answersDetailed,
      scores: { D1: scores.D1, D2: scores.D2, D3: scores.D3, D4: scores.D4, D5: scores.D5, D6: scores.D6 },
      composite: scores.composite,
      maturity_level: scores.maturityLevel.key,
      drq_class: scores.drqClass.key,
      migration_flags: scores.migrationFlags,
      positive_signals: scores.positiveSignals,
    };

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ scores, report: fallbackReport(scores, lang), source: "fallback-no-key", lang });
    }

    const client = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-6";

    try {
      const resp = await client.messages.create({
        model,
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserMessage(llmInput, lang) }],
      });
      const txt = resp.content
        .filter((b) => b.type === "text")
        .map((b: any) => b.text)
        .join("");
      const match = txt.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON in response");
      const report = JSON.parse(match[0]);
      return NextResponse.json({ scores, report, source: "ai", lang });
    } catch (err: any) {
      console.error("LLM error:", err?.message);
      return NextResponse.json({ scores, report: fallbackReport(scores, lang), source: "fallback-error", lang });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}
