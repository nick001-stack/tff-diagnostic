import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { computeScores, Answers } from "@/lib/scoring";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  prospect: { company_name: string; contact_name: string; email: string; revenue_range?: string; employee_count?: string };
  team_structure: Record<string, string>;
  answers: Answers;
};

function fallbackReport(scores: ReturnType<typeof computeScores>) {
  const tpl: Record<string, any> = {
    Controlled: {
      executive_summary: `Composite score ${scores.composite}/100 — Controlled. Your finance function is structured and largely automated. TFF/ would add only marginal value at this stage.`,
      package: "Strategic Layer",
      pricing: "1.5K–3K€/month",
    },
    Structured: {
      executive_summary: `Composite score ${scores.composite}/100 — Structured. Processes exist but remain largely manual. You are a strong candidate for TFF/ Fast-Track onboarding.`,
      package: "Operating Layer",
      pricing: "2.5K–4K€/month",
    },
    Reactive: {
      executive_summary: `Composite score ${scores.composite}/100 — Reactive. Significant gaps across multiple finance functions. A Reconciliation Sprint is required before activating the Control Layer.`,
      package: "Full Suite",
      pricing: "4K–7K€/month",
    },
    Blind: {
      executive_summary: `Composite score ${scores.composite}/100 — Blind. Foundational finance work needed before TFF/ deployment. We recommend partnering with an expert-comptable first.`,
      package: "Pre-Qualification",
      pricing: "n/a",
    },
  };
  const t = tpl[scores.maturityLevel.name];
  return {
    executive_summary: t.executive_summary,
    dimension_commentary: {
      D1: `Score ${scores.D1}/100. Cash & Treasury visibility needs work — TFF/ Keystone activates real-time cash position and treasury forecasting.`,
      D2: `Score ${scores.D2}/100. Accounts Payable control gap — TFF/ LedgerCore automates invoice capture, draft purge, and aging monitoring.`,
      D3: `Score ${scores.D3}/100. Receivables and collections lag — TFF/ FlowCollect orchestrates DSO tracking, dunning automation, and concentration risk.`,
      D4: `Score ${scores.D4}/100. Monthly close discipline missing — TFF/ LedgerCore enforces audit-grade controls and J+5 close.`,
      D5: `Score ${scores.D5}/100. Compliance posture needs hardening — TFF/ VaultShield handles PAF, e-invoicing, and archiving.`,
      D6: `Score ${scores.D6}/100. Decision visibility limited — TFF/ ClearView delivers live P&L and KPI dashboards.`,
    },
    team_analysis: "Static fallback — see scores and migration flags for context.",
    migration_path: scores.migrationFlags.length > 0
      ? `${scores.migrationFlags.length} tool(s) flagged for migration. A Reconciliation Sprint will recover historical data and establish API connectivity.`
      : "Your tool stack is largely API-ready — Fast-Track activation possible.",
    recommended_package: {
      name: t.package,
      rationale: "Static fallback — based on composite score and maturity level.",
      modules_activated: ["TFF/ Keystone", "TFF/ LedgerCore", "TFF/ FlowCollect", "TFF/ VaultShield", "TFF/ ClearView"],
      indicative_monthly_pricing: t.pricing,
    },
    next_steps: [
      "Review your dimension scores below",
      "Book a 30-min CFO Diagnostic call",
      scores.migrationFlags.length > 0 ? "Plan your Reconciliation Sprint" : "Plan your Fast-Track activation",
      "Activate your TFF/ Control Layer",
    ],
    cta: "Book your free 30-minute CFO Diagnostic at cfoai.fr/diagnostic to validate this report and define your activation plan.",
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: Body = await req.json();
    if (!body?.prospect?.email || !body?.answers) {
      return NextResponse.json({ error: "Missing prospect or answers" }, { status: 400 });
    }

    const scores = computeScores(body.answers);

    const llmInput = {
      prospect: body.prospect,
      team_structure: body.team_structure,
      answers: scores.answersDetailed,
      scores: { D1: scores.D1, D2: scores.D2, D3: scores.D3, D4: scores.D4, D5: scores.D5, D6: scores.D6 },
      composite: scores.composite,
      maturity_level: scores.maturityLevel.name,
      drq_class: scores.drqClass.name,
      migration_flags: scores.migrationFlags,
      positive_signals: scores.positiveSignals,
    };

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ scores, report: fallbackReport(scores), source: "fallback-no-key" });
    }

    const client = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-6";

    try {
      const resp = await client.messages.create({
        model,
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserMessage(llmInput) }],
      });
      const txt = resp.content
        .filter((b) => b.type === "text")
        .map((b: any) => b.text)
        .join("");
      const match = txt.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON in response");
      const report = JSON.parse(match[0]);
      return NextResponse.json({ scores, report, source: "ai" });
    } catch (err: any) {
      console.error("LLM error:", err?.message);
      return NextResponse.json({ scores, report: fallbackReport(scores), source: "fallback-error" });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}
