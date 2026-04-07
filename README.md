# TFF/ Finance Readiness Diagnostic — Web App

Free 5–8 minute self-assessment for French SMEs. Built for **CFO AI Fractional Agency** (cfoai.fr).

Stack: **Next.js 14 (App Router) + TypeScript + Tailwind + Anthropic SDK**, deployed on **Vercel** (free Hobby plan).

---

## What this app does

1. Collects prospect info + finance team structure
2. Asks 27 core questions (+ up to 12 conditional follow-ups) across 6 dimensions: Cash, AP, AR, Close, Compliance, Reporting
3. Computes 6 dimension scores + composite + maturity level + DRQ classification
4. Calls Claude (server-side, key never exposed) to generate the personalized commentary, package recommendation, and next steps
5. Displays the branded report with download buttons (Markdown, PDF via print)
6. Falls back gracefully to static templates if the API call fails

Brand identity: monochrome (#0A0A0A / #F0EEEA) + Trust Green accent (#1A6B5C). Typography: Space Grotesk + DM Sans + JetBrains Mono.

---

## File structure

```
tff-diagnostic-app/
├── package.json
├── next.config.mjs / tsconfig.json / tailwind.config.ts / postcss.config.mjs
├── .env.local.example       ← copy to .env.local with your key
├── .gitignore
├── app/
│   ├── layout.tsx           ← TFF/ header + footer
│   ├── globals.css          ← brand tokens, typography, components
│   ├── page.tsx             ← form ↔ report orchestration
│   └── api/diagnose/
│       └── route.ts         ← server-side Anthropic SDK call (key secure)
├── lib/
│   ├── questions.ts         ← 27 Q + team matrix + follow-ups (source of truth)
│   ├── scoring.ts           ← spec formula: dimension + composite + DRQ + flags
│   └── prompt.ts            ← system prompt — EDIT HERE to update Claude instructions
└── components/
    ├── DiagnosticForm.tsx   ← multi-step branded form
    └── Report.tsx           ← branded report + MD/PDF download
```

---

## Local development

```bash
cd tff-diagnostic-app
npm install
cp .env.local.example .env.local
# edit .env.local and paste your Anthropic API key
npm run dev
# open http://localhost:3000
```

Get your Anthropic API key at https://console.anthropic.com/settings/keys

---

## Deploy to Vercel (1-click, free, < 10 min)

### Step 1 — Push to GitHub
```bash
cd "tff-diagnostic-app"
git init
git add .
git commit -m "Initial commit: TFF/ Diagnostic"
gh repo create tff-diagnostic --public --source=. --push
# (or create the repo manually on github.com and push)
```

### Step 2 — Import to Vercel
1. Go to https://vercel.com/new
2. Click **Import Git Repository** and select `tff-diagnostic`
3. Framework: **Next.js** (auto-detected)
4. Click **Environment Variables** and add:
   - `ANTHROPIC_API_KEY` = `sk-ant-…` (paste your key)
   - `ANTHROPIC_MODEL` = `claude-opus-4-6` (optional, this is the default)
5. Click **Deploy**

Vercel builds in ~60 seconds and gives you a URL like `tff-diagnostic.vercel.app`.

### Step 3 — Custom domain (optional)
1. Vercel project → **Settings** → **Domains** → add `diagnostic.cfoai.fr`
2. Add the CNAME record Vercel shows you in your DNS provider
3. SSL is automatic. Live in 1–5 minutes.

---

## How to update the prompt later

The Claude system prompt lives in **one file**: `lib/prompt.ts`.

```bash
# Edit it
vim lib/prompt.ts
# Commit and push
git add lib/prompt.ts
git commit -m "Update diagnostic prompt"
git push
```

Vercel auto-redeploys on push (~60 seconds). The new prompt is live immediately.

To change the model: update `ANTHROPIC_MODEL` env var in Vercel → Settings → Environment Variables (or override in `.env.local` for local dev).

---

## How to update the questions

The 27 questions, team roles, follow-ups, dimensions, weights, maturity levels, and DRQ thresholds are all in **one file**: `lib/questions.ts`.

After editing, the form, scoring, and report all update automatically — no other file changes required.

---

## Cost & rate limits

- Vercel Hobby: free, 100 GB bandwidth/month, sufficient for hundreds of diagnostics/day
- Anthropic API: ~2K tokens in + ~1K out per diagnostic. With Claude Opus 4.6 ≈ $0.05–0.10 per report. Use Sonnet for ~10× cheaper.

To rate-limit, add a simple counter in `app/api/diagnose/route.ts` or put Cloudflare Turnstile on the form.

---

## Security notes

- Anthropic API key lives **only** in Vercel env vars and `.env.local` (gitignored)
- The `/api/diagnose` route runs server-side — the key is never sent to the browser
- No PII is stored — every report is computed in-memory and returned in the same response
- For HubSpot/CRM integration, add a write-to-CRM call inside the API route after the LLM response

---

## Built from

`TFF_Finance_Readiness_Diagnostic_Spec_20260402_v7.docx` — sections 4 (questions), 5 (scoring), 6.4 (AI output contract), 7.4 (AI generation layer).
