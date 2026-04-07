// TFF/ Finance Readiness Diagnostic — Question Bank (from spec v7)
// 6 dimensions × 27 core questions + 12 conditional follow-ups
// Source of truth: TFF_Finance_Readiness_Diagnostic_Spec_20260402_v7.docx

export type Option = { letter: string; text: string; score: number };
export type Question = {
  id: string;
  dimension: "D1" | "D2" | "D3" | "D4" | "D5" | "D6";
  text: string;
  options: Option[];
  toolApi?: boolean; // true = answer C/D triggers migration flag
};

export type FollowUp = {
  id: string;
  triggerQuestion: string;
  triggerOn: ("C" | "D")[];
  text: string;
  options: Option[];
  dimension: "D1" | "D2" | "D3" | "D4" | "D5" | "D6";
};

export const DIMENSIONS = {
  D1: { name: "Cash & Treasury Visibility", module: "TFF/ Keystone", weight: 0.20 },
  D2: { name: "Accounts Payable Control", module: "TFF/ LedgerCore", weight: 0.15 },
  D3: { name: "Accounts Receivable & Collections", module: "TFF/ FlowCollect", weight: 0.20 },
  D4: { name: "Monthly Close & GL Integrity", module: "TFF/ LedgerCore", weight: 0.20 },
  D5: { name: "Compliance & Audit Trail", module: "TFF/ VaultShield", weight: 0.10 },
  D6: { name: "Reporting & Decision Visibility", module: "TFF/ ClearView", weight: 0.15 },
} as const;

// Helper for parsing the standard 4-option pattern
const opt = (data: [string, number][]): Option[] =>
  data.map(([text, score], i) => ({ letter: "ABCDE"[i], text, score }));

export const TEAM_ROLES = [
  { id: "cfo", label: "CFO / DAF", staffing: ["Full-time internal", "Part-time internal", "Fractional / external", "None"] },
  { id: "gl", label: "Accounting — General Ledger (Compta Générale)", staffing: ["Full-time internal", "Part-time internal", "Outsourced (cabinet)", "None"] },
  { id: "ap", label: "Accounts Payable (Compta Fournisseur)", staffing: ["Full-time internal", "Part-time internal", "Outsourced (cabinet)", "Shared with GL", "None"] },
  { id: "ar", label: "Accounts Receivable (Compta Client)", staffing: ["Full-time internal", "Part-time internal", "Outsourced (cabinet)", "Shared with GL", "None"] },
  { id: "otb", label: "Order-to-Bill / Facturation (OTB)", staffing: ["Full-time internal", "Part-time internal", "Outsourced", "Automated", "None"] },
  { id: "fpa", label: "FP&A / Contrôle de Gestion", staffing: ["Full-time internal", "Part-time internal", "Fractional / external", "None"] },
] as const;

export const QUESTIONS: Question[] = [
  // === D1 — Cash & Treasury ===
  { id: "Q1", dimension: "D1", text: "How often do you know your exact cash position across all bank accounts?",
    options: opt([["Real-time or daily", 10], ["Weekly", 7], ["Monthly", 4], ["Only when I check manually", 1]]) },
  { id: "Q2", dimension: "D1", text: "How many business days does it take to reconcile your bank statements?",
    options: opt([["Automatic / same day", 10], ["1–3 days", 7], ["4–10 days", 4], ["We don't reconcile regularly", 1]]) },
  { id: "Q3", dimension: "D1", text: "Do you know your calendar of social and fiscal payouts (charges sociales, TVA, IS, CFE, etc.)?",
    options: opt([["Yes, fully mapped with amounts and dates", 10], ["Roughly, I know the big ones", 6], ["My accountant handles it, I don't track it", 3], ["No", 1]]) },
  { id: "Q4", dimension: "D1", text: "How often do you simulate your daily treasury evolution (cash forecast)?",
    options: opt([["Daily rolling forecast", 10], ["Weekly", 7], ["Monthly or at close", 4], ["Never / only when there's a problem", 1]]) },
  { id: "Q5", dimension: "D1", toolApi: true, text: "How are your bank transactions imported into your accounting system?",
    options: opt([
      ["Automatic — open banking API or aggregator auto-syncs to ERP, no separate banking tool needed", 10],
      ["Semi-automatic — bank provides electronic exports (CSV, OFX, CAMT) imported manually into ERP", 6],
      ["Manual — we check balances on the bank website and enter transactions by hand", 3],
      ["No import — bank and accounting are not connected", 1],
    ]) },

  // === D2 — Accounts Payable ===
  { id: "Q6", dimension: "D2", text: "How are supplier invoices currently entered into your accounting system?",
    options: opt([["Auto-captured by AI/OCR", 10], ["Manual entry by bookkeeper", 5], ["Batched by external accountant monthly", 3], ["Inconsistent / backlog", 1]]) },
  { id: "Q7", dimension: "D2", text: "What percentage of your supplier invoices are currently in draft status (unapproved)?",
    options: opt([["<10%", 10], ["10–30%", 6], ["30–60%", 3], [">60% or unknown", 1]]) },
  { id: "Q8", dimension: "D2", text: "Do you know how long it takes for a supplier invoice to be keyed in (receipt-to-entry delay)?",
    options: opt([["Same day or next day", 10], ["2–5 days", 7], ["6–15 days", 4], ["No idea / no tracking", 1]]) },
  { id: "Q9", dimension: "D2", text: "How do you manage the relationship with your vendors' AR teams (payment confirmations, balance reconciliations, dispute resolution)?",
    options: opt([["Fully automated (auto-matching, portal integration, AI-drafted responses)", 10], ["AI-assisted (AI generates drafts, human reviews and sends)", 7], ["Fully manual (emails, phone calls, spreadsheets)", 4], ["No structured communication", 1]]) },
  { id: "Q10", dimension: "D2", toolApi: true, text: "What is your primary accounting/ERP system and is it API-accessible?",
    options: opt([
      ["Cloud ERP with open API (Odoo, Netsuite, Xero, Pennylane, etc.)", 10],
      ["Cloud software with limited or no API (QuickBooks desktop, Sage Cloud basic)", 6],
      ["Desktop/on-premise software with no API (Sage 100, Ciel, EBP desktop)", 3],
      ["Spreadsheets, paper, or no dedicated accounting tool", 1],
    ]) },

  // === D3 — Accounts Receivable ===
  { id: "Q11", dimension: "D3", text: "Do you know your DSO (Days Sales Outstanding) right now?",
    options: opt([["Yes, tracked weekly", 10], ["Roughly, checked monthly", 6], ["My accountant calculates it at year-end", 3], ["No idea", 1]]) },
  { id: "Q12", dimension: "D3", text: "What happens when a client invoice is 30+ days overdue?",
    options: opt([["Automated reminder sequence", 10], ["Manual follow-up by someone on the team", 6], ["We wait until year-end or when cash is tight", 3], ["Nothing systematic", 1]]) },
  { id: "Q13", dimension: "D3", text: "Is your client invoicing automated? What is your delivery-to-bill time?",
    options: opt([["Fully automated, billed within 1–2 days of delivery", 10], ["Semi-automated, billed within a week", 7], ["Manual, billed monthly in batch", 4], ["Irregular, sometimes weeks or months late", 1]]) },
  { id: "Q14", dimension: "D3", text: "How do you manage the relationship with your customers' AP teams (payment follow-ups, statement reconciliations, dispute handling)?",
    options: opt([["Fully automated (auto-reminders, portal integration, AI-drafted messages)", 10], ["AI-assisted (AI generates follow-ups, human reviews and sends)", 7], ["Fully manual (emails, phone calls, spreadsheets)", 4], ["No structured communication", 1]]) },
  { id: "Q15", dimension: "D3", toolApi: true, text: "What tools do you use for client invoicing, CRM, and point-of-sale (POS), and are they integrated?",
    options: opt([
      ["Integrated stack with APIs (CRM + invoicing + POS all synced automatically)", 10],
      ["Separate tools with some API connections (e.g., CRM exports to invoicing)", 7],
      ["Standalone tools with no integration (manual re-entry between systems)", 4],
      ["No CRM, manual invoicing (Word/Excel), or no POS system", 1],
    ]) },

  // === D4 — Monthly Close ===
  { id: "Q16", dimension: "D4", text: "How many calendar days after month-end do you have a closed P&L?",
    options: opt([["1–5 days", 10], ["6–15 days", 6], ["16–30 days", 3], ["We only close at year-end", 1]]) },
  { id: "Q17", dimension: "D4", text: "Who performs your monthly accounting close?",
    options: opt([["Internal team with automated checks", 10], ["Internal team, mostly manual", 6], ["External accountant only", 4], ["No formal close process", 1]]) },
  { id: "Q18", dimension: "D4", text: "Do you know the total cost of your monthly close (people hours, tools, external accountant fees)?",
    options: opt([["Yes, fully tracked and benchmarked", 10], ["Roughly — I know the accountant's fee but not internal time", 6], ["No idea", 3], ["We don't do a monthly close", 1]]) },
  { id: "Q19", dimension: "D4", toolApi: true, text: "What payroll and close-process tools does your finance team use?",
    options: opt([
      ["Cloud payroll with API push to GL (Silae, PayFit, etc. — journal de paie auto-posted)", 10],
      ["Cloud payroll but journal imported manually (CSV/PDF)", 6],
      ["External payroll bureau, we receive PDF only", 3],
      ["Payroll done in spreadsheets or by hand", 1],
    ]) },

  // === D5 — Compliance ===
  { id: "Q20", dimension: "D5", text: "Are you prepared for mandatory e-invoicing (September 2026)?",
    options: opt([["PDP/PPF selected and tested", 10], ["Evaluating platforms", 6], ["Aware but haven't started", 3], ["Not aware / not concerned", 1]]) },
  { id: "Q21", dimension: "D5", text: "Do you have a documented Piste d'Audit Fiable (PAF)?",
    options: opt([["Yes, documented and reviewed within 12 months", 10], ["Yes, but outdated or incomplete", 5], ["Don't know what a PAF is", 2], ["No", 1]]) },
  { id: "Q22", dimension: "D5", text: "When was the last fiscal or compliance review of your company (auditor, tax advisor, or administration fiscale)?",
    options: opt([["Within the last 12 months", 10], ["1–2 years ago", 6], ["3+ years ago", 3], ["Never / don't remember", 1]]) },
  { id: "Q23", dimension: "D5", text: "How often do you meet with your financial advisors (CFO, expert-comptable, accounting team)?",
    options: opt([["Weekly or biweekly", 10], ["Monthly", 7], ["Quarterly", 4], ["Only at year-end or when there's a problem", 1]]) },
  { id: "Q24", dimension: "D5", text: "How often do you produce or update a budget during the fiscal year?",
    options: opt([["Rolling forecast updated monthly", 10], ["Annual budget reviewed quarterly", 7], ["Annual budget set once, not revised", 4], ["No budget", 1]]) },
  { id: "Q25", dimension: "D5", toolApi: true, text: "What document management and archiving tools do you use for financial records?",
    options: opt([
      ["GED/DMS with versioning and retention policies, API-connected to ERP", 10],
      ["Cloud storage (Google Drive, SharePoint, Dropbox) with some organization", 6],
      ["Local folders or email archives, no systematic organization", 3],
      ["Paper-based or no archiving system", 1],
    ]) },

  // === D6 — Reporting ===
  { id: "Q26", dimension: "D6", text: "How often does management receive a financial report with variance analysis (budget vs actual)?",
    options: opt([["Weekly or real-time dashboard", 10], ["Monthly", 7], ["Quarterly", 5], ["Semester", 3], ["Only at year-end or never", 1]]) },
  { id: "Q27", dimension: "D6", toolApi: true, text: "What tools do you use for financial reporting and business intelligence?",
    options: opt([
      ["Dedicated BI tool (Metabase, Power BI, Looker) connected to live data via API", 10],
      ["ERP built-in reports exported to spreadsheets for analysis", 6],
      ["Manual spreadsheet compilation from multiple sources", 3],
      ["No reporting tool — we rely on the accountant's annual report", 1],
    ]) },
];

export const FOLLOW_UPS: FollowUp[] = [
  { id: "F2", triggerQuestion: "Q2", triggerOn: ["C", "D"], dimension: "D1",
    text: "How many unreconciled bank lines are currently open?",
    options: opt([["<10", 10], ["10–50", 7], ["50–200", 4], [">200 or unknown", 1]]) },
  { id: "F4", triggerQuestion: "Q4", triggerOn: ["C", "D"], dimension: "D1",
    text: "How often do you update your runway estimate (months of cash remaining)?",
    options: opt([["Weekly", 10], ["Monthly", 7], ["Quarterly", 4], ["Never", 1]]) },
  { id: "F6", triggerQuestion: "Q6", triggerOn: ["C", "D"], dimension: "D2",
    text: "Do you have supplier invoices older than 30 days that haven't been entered yet?",
    options: opt([["No", 10], ["A few", 6], ["Yes, a backlog", 3], ["Yes, large backlog (>50)", 1]]) },
  { id: "F7", triggerQuestion: "Q7", triggerOn: ["C", "D"], dimension: "D2",
    text: "Do you know the monthly cost of your AP function (people + tools + external)?",
    options: opt([["Yes, tracked", 10], ["Roughly", 6], ["No", 1]]) },
  { id: "F11", triggerQuestion: "Q11", triggerOn: ["C", "D"], dimension: "D3",
    text: "Do you have any single client representing >20% of your receivables?",
    options: opt([["No", 10], ["One around 20–30%", 6], ["Yes, >30%", 1]]) },
  { id: "F12", triggerQuestion: "Q12", triggerOn: ["C", "D"], dimension: "D3",
    text: "Do you use external tools or processes to track and recover overdue invoices?",
    options: opt([["Yes, integrated tools", 10], ["Occasional external help", 6], ["Nothing", 1]]) },
  { id: "F16a", triggerQuestion: "Q16", triggerOn: ["C", "D"], dimension: "D4",
    text: "Is payroll (journal de paie) posted to your GL within 5 days of month-end?",
    options: opt([["Yes", 10], ["Sometimes", 5], ["No", 1]]) },
  { id: "F16b", triggerQuestion: "Q16", triggerOn: ["C", "D"], dimension: "D4",
    text: "Do you have journal entries (OD) older than 30 days in suspense accounts?",
    options: opt([["No", 10], ["A few", 6], ["Yes, several", 3], ["Yes, many (>100 lines)", 1]]) },
  { id: "F20", triggerQuestion: "Q20", triggerOn: ["C", "D"], dimension: "D5",
    text: "Is your POS / caisse software NF 525 certified or do you have an attestation from the editor? (NF 525 only applies to systems recording customer payments — caisses enregistreuses — not general accounting software)",
    options: opt([["Yes, certified or attestation on file", 10], ["No POS system", 7], ["Don't know", 3], ["No", 1]]) },
  { id: "F21", triggerQuestion: "Q21", triggerOn: ["C", "D"], dimension: "D5",
    text: "Do you know what a PAF entails and whether your processes meet the requirements (art. 289 VII CGI)?",
    options: opt([["Yes", 10], ["Partially", 5], ["No", 1]]) },
  { id: "F26a", triggerQuestion: "Q26", triggerOn: ["C", "D"], dimension: "D6",
    text: "Do you track gross margin by business unit / site / product line?",
    options: opt([["Yes, weekly or monthly", 10], ["Yes, at year-end only", 5], ["No", 1]]) },
  { id: "F26b", triggerQuestion: "Q26", triggerOn: ["C", "D"], dimension: "D6",
    text: "Do you have a real-time or near-real-time KPI dashboard accessible to management?",
    options: opt([["Yes", 10], ["Static reports only", 5], ["No", 1]]) },
];

export const MATURITY_LEVELS = [
  { min: 80, max: 100, level: 4, name: "Controlled", description: "Finance function is structured and automated. TFF/ adds marginal value." },
  { min: 55, max: 79.99, level: 3, name: "Structured", description: "Processes exist but are manual and slow. High-value TFF/ prospect. Fast-Track onboarding." },
  { min: 30, max: 54.99, level: 2, name: "Reactive", description: "Ad-hoc processes, significant gaps. Core TFF/ ICP. Reconciliation Sprint required." },
  { min: 0, max: 29.99, level: 1, name: "Blind", description: "No finance function. Needs foundational work before TFF/." },
];

export const DRQ_CLASSES = [
  { min: 55, max: 100, name: "Fast-Track Ready", path: "Phase 2: CFO Diagnostic → Direct Control Layer activation", duration: "2–4 weeks" },
  { min: 30, max: 54.99, name: "Reconciliation Required", path: "Phase 2: CFO Diagnostic → Reconciliation Sprint first → then Control Layer", duration: "6–10 weeks" },
  { min: 0, max: 29.99, name: "Pre-Qualification Needed", path: "Refer to expert-comptable partner. Re-evaluate in 3–6 months.", duration: "n/a" },
];
