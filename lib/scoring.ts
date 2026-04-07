// TFF/ Finance Readiness Diagnostic — Scoring engine (spec v7) — bilingual aware
import { QUESTIONS, FOLLOW_UPS, DIMENSIONS, MATURITY_LEVELS, DRQ_CLASSES, pick } from "./questions";
import type { Lang } from "./i18n";

export type Answers = Record<string, string>;

export type Scores = {
  D1: number; D2: number; D3: number; D4: number; D5: number; D6: number;
  composite: number;
  maturityLevel: { key: string; level: number; description: string };
  drqClass: { key: string; path: string; duration: string };
  migrationFlags: { dimension: string; question: string; currentState: string }[];
  positiveSignals: { dimension: string; question: string; signal: string }[];
  answersDetailed: Record<string, { value: string; score: number; text: string; question: string }>;
};

const findOpt = (qId: string, letter: string) => {
  const q = QUESTIONS.find((x) => x.id === qId) || FOLLOW_UPS.find((x) => x.id === qId);
  if (!q) return null;
  return q.options.find((o) => o.letter === letter) || null;
};

export function computeScores(answers: Answers, lang: Lang = "en"): Scores {
  const dims: Record<string, { core: number[]; coreMax: number[]; followups: number[]; followupsMax: number[] }> = {
    D1: { core: [], coreMax: [], followups: [], followupsMax: [] },
    D2: { core: [], coreMax: [], followups: [], followupsMax: [] },
    D3: { core: [], coreMax: [], followups: [], followupsMax: [] },
    D4: { core: [], coreMax: [], followups: [], followupsMax: [] },
    D5: { core: [], coreMax: [], followups: [], followupsMax: [] },
    D6: { core: [], coreMax: [], followups: [], followupsMax: [] },
  };

  const migrationFlags: Scores["migrationFlags"] = [];
  const positiveSignals: Scores["positiveSignals"] = [];
  const answersDetailed: Scores["answersDetailed"] = {};

  for (const q of QUESTIONS) {
    const letter = answers[q.id];
    if (!letter) continue;
    const op = findOpt(q.id, letter);
    if (!op) continue;
    dims[q.dimension].core.push(op.score);
    dims[q.dimension].coreMax.push(10);
    answersDetailed[q.id] = { value: letter, score: op.score, text: pick(op.text, lang), question: pick(q.text, lang) };

    if (q.toolApi) {
      if (letter === "C" || letter === "D") {
        migrationFlags.push({ dimension: q.dimension, question: q.id, currentState: pick(op.text, lang) });
      } else {
        positiveSignals.push({ dimension: q.dimension, question: q.id, signal: pick(op.text, lang) });
      }
    }
  }

  for (const f of FOLLOW_UPS) {
    const letter = answers[f.id];
    if (!letter) continue;
    const op = findOpt(f.id, letter);
    if (!op) continue;
    dims[f.dimension].followups.push(op.score);
    dims[f.dimension].followupsMax.push(10);
    answersDetailed[f.id] = { value: letter, score: op.score, text: pick(op.text, lang), question: pick(f.text, lang) };
  }

  const dimScore = (d: keyof typeof dims) => {
    const x = dims[d];
    const coreSum = x.core.reduce((a, b) => a + b, 0);
    const coreMax = x.coreMax.reduce((a, b) => a + b, 0);
    if (coreMax === 0) return 0;
    const coreNorm = coreSum / coreMax;
    if (x.followups.length === 0) return Math.round(coreNorm * 1000) / 10;
    const fSum = x.followups.reduce((a, b) => a + b, 0);
    const fMax = x.followupsMax.reduce((a, b) => a + b, 0);
    const fNorm = fMax === 0 ? 0 : fSum / fMax;
    return Math.round((coreNorm * 70 + fNorm * 30) * 10) / 10;
  };

  const D1 = dimScore("D1");
  const D2 = dimScore("D2");
  const D3 = dimScore("D3");
  const D4 = dimScore("D4");
  const D5 = dimScore("D5");
  const D6 = dimScore("D6");

  const composite = Math.round(
    (D1 * DIMENSIONS.D1.weight + D2 * DIMENSIONS.D2.weight + D3 * DIMENSIONS.D3.weight +
      D4 * DIMENSIONS.D4.weight + D5 * DIMENSIONS.D5.weight + D6 * DIMENSIONS.D6.weight) * 10
  ) / 10;

  const maturity = MATURITY_LEVELS.find((m) => composite >= m.min && composite <= m.max)!;
  const drq = DRQ_CLASSES.find((d) => composite >= d.min && composite <= d.max)!;

  return {
    D1, D2, D3, D4, D5, D6, composite,
    maturityLevel: { key: maturity.key, level: maturity.level, description: pick(maturity.description, lang) },
    drqClass: { key: drq.key, path: pick(drq.path, lang), duration: pick(drq.duration, lang) },
    migrationFlags,
    positiveSignals,
    answersDetailed,
  };
}
