// TFF/ Finance Readiness Diagnostic — Bilingual question bank (spec v7)
// EN/FR support. French regulatory terms (PAF, NF 525, expert-comptable, URSSAF, TVA, PDP/PPF) kept as-is in English mode.
import type { Lang } from "./i18n";

export type Bilingual = { en: string; fr: string };
export type Option = { letter: string; text: Bilingual; score: number };
export type Question = {
  id: string;
  dimension: "D1" | "D2" | "D3" | "D4" | "D5" | "D6";
  text: Bilingual;
  options: Option[];
  toolApi?: boolean;
  footnote?: Bilingual;
};
export type FollowUp = {
  id: string;
  triggerQuestion: string;
  triggerOn: ("C" | "D" | "E")[];
  text: Bilingual;
  options: Option[];
  dimension: "D1" | "D2" | "D3" | "D4" | "D5" | "D6";
  footnote?: Bilingual;
};

export const pick = (b: Bilingual, lang: Lang): string => b[lang] || b.en;

export const DIMENSIONS = {
  D1: { name: { en: "Cash & Treasury Visibility", fr: "Visibilité Cash & Trésorerie" }, module: "TFF/ Keystone", weight: 0.20 },
  D2: { name: { en: "Accounts Payable Control", fr: "Maîtrise Comptes Fournisseurs" }, module: "TFF/ LedgerCore", weight: 0.15 },
  D3: { name: { en: "Accounts Receivable & Collections", fr: "Comptes Clients & Recouvrement" }, module: "TFF/ FlowCollect", weight: 0.20 },
  D4: { name: { en: "Monthly Close & GL Integrity", fr: "Clôture Mensuelle & Intégrité du GL" }, module: "TFF/ LedgerCore", weight: 0.20 },
  D5: { name: { en: "Compliance & Audit Trail", fr: "Conformité & Piste d'Audit" }, module: "TFF/ VaultShield", weight: 0.10 },
  D6: { name: { en: "Reporting & Decision Visibility", fr: "Reporting & Visibilité Décisionnelle" }, module: "TFF/ ClearView", weight: 0.15 },
} as const;

const o = (letter: string, en: string, fr: string, score: number): Option => ({ letter, text: { en, fr }, score });

export const TEAM_ROLES = [
  {
    id: "cfo",
    label: { en: "CFO / DAF", fr: "CFO / DAF" },
    staffing: [
      { en: "Full-time internal", fr: "Temps plein interne" },
      { en: "Part-time internal", fr: "Temps partiel interne" },
      { en: "Fractional / external", fr: "Fractionnel / externe" },
      { en: "None", fr: "Aucun" },
    ],
  },
  {
    id: "gl",
    label: { en: "Accounting — General Ledger (Compta Générale)", fr: "Comptabilité — Compta Générale" },
    staffing: [
      { en: "Full-time internal", fr: "Temps plein interne" },
      { en: "Part-time internal", fr: "Temps partiel interne" },
      { en: "Outsourced (cabinet)", fr: "Externalisé (cabinet)" },
      { en: "None", fr: "Aucun" },
    ],
  },
  {
    id: "ap",
    label: { en: "Accounts Payable (Compta Fournisseur)", fr: "Comptabilité Fournisseurs (Compta Fournisseur)" },
    staffing: [
      { en: "Full-time internal", fr: "Temps plein interne" },
      { en: "Part-time internal", fr: "Temps partiel interne" },
      { en: "Outsourced (cabinet)", fr: "Externalisé (cabinet)" },
      { en: "Shared with GL", fr: "Mutualisé avec la Compta Générale" },
      { en: "None", fr: "Aucun" },
    ],
  },
  {
    id: "ar",
    label: { en: "Accounts Receivable (Compta Client)", fr: "Comptabilité Clients (Compta Client)" },
    staffing: [
      { en: "Full-time internal", fr: "Temps plein interne" },
      { en: "Part-time internal", fr: "Temps partiel interne" },
      { en: "Outsourced (cabinet)", fr: "Externalisé (cabinet)" },
      { en: "Shared with GL", fr: "Mutualisé avec la Compta Générale" },
      { en: "Decentralized (embedded in operations)", fr: "Décentralisé (dans les fonctions opérationnelles)" },
      { en: "None", fr: "Aucun" },
    ],
  },
  {
    id: "otb",
    label: { en: "Order-to-Bill / Facturation (OTB)", fr: "Order-to-Bill / Facturation (OTB)" },
    staffing: [
      { en: "Full-time internal", fr: "Temps plein interne" },
      { en: "Part-time internal", fr: "Temps partiel interne" },
      { en: "Outsourced", fr: "Externalisé" },
      { en: "Automated", fr: "Automatisé" },
      { en: "Decentralized (embedded in operations)", fr: "Décentralisé (dans les fonctions opérationnelles)" },
      { en: "None", fr: "Aucun" },
    ],
  },
  {
    id: "fpa",
    label: { en: "FP&A / Contrôle de Gestion", fr: "FP&A / Contrôle de Gestion" },
    staffing: [
      { en: "Full-time internal", fr: "Temps plein interne" },
      { en: "Part-time internal", fr: "Temps partiel interne" },
      { en: "Fractional / external", fr: "Fractionnel / externe" },
      { en: "None", fr: "Aucun" },
    ],
  },
] as const;

export const QUESTIONS: Question[] = [
  // === D1 — Cash & Treasury ===
  {
    id: "Q1", dimension: "D1",
    text: { en: "How often do you know your exact cash position across all bank accounts?", fr: "À quelle fréquence connaissez-vous votre position de trésorerie exacte sur tous vos comptes bancaires ?" },
    options: [
      o("A", "Real-time or daily", "Temps réel ou quotidien", 10),
      o("B", "Weekly", "Hebdomadaire", 7),
      o("C", "Monthly", "Mensuel", 4),
      o("D", "Only when I check manually", "Uniquement quand je vérifie manuellement", 1),
    ],
  },
  {
    id: "Q2", dimension: "D1",
    text: { en: "How many business days does it take to reconcile your bank statements?", fr: "Combien de jours ouvrés faut-il pour rapprocher vos relevés bancaires ?" },
    options: [
      o("A", "Automatic / same day", "Automatique / le jour même", 10),
      o("B", "1–3 days", "1 à 3 jours", 7),
      o("C", "4–10 days", "4 à 10 jours", 4),
      o("D", "I don't know", "Je ne sais pas", 2),
      o("E", "We don't reconcile regularly", "Nous ne rapprochons pas régulièrement", 1),
    ],
  },
  {
    id: "Q3", dimension: "D1",
    text: { en: "Do you know your calendar of social and fiscal payouts (charges sociales, TVA, IS, CFE, etc.)?", fr: "Connaissez-vous votre calendrier des échéances sociales et fiscales (charges sociales, TVA, IS, CFE, etc.) ?" },
    options: [
      o("A", "Yes, fully mapped with amounts and dates", "Oui, totalement cartographié avec montants et dates", 10),
      o("B", "Roughly, I know the big ones", "Approximativement, je connais les principales", 6),
      o("C", "My accountant handles it, I don't track it", "Mon expert-comptable s'en occupe, je ne le suis pas", 3),
      o("D", "No", "Non", 1),
    ],
  },
  {
    id: "Q4", dimension: "D1",
    text: { en: "How often do you simulate your daily treasury evolution (cash forecast)?", fr: "À quelle fréquence simulez-vous l'évolution de votre trésorerie au quotidien (cash forecast / prévisionnel de trésorerie) ?" },
    options: [
      o("A", "Daily rolling forecast", "Forecast roulant quotidien", 10),
      o("B", "Weekly", "Hebdomadaire", 7),
      o("C", "Monthly or at close", "Mensuel ou à la clôture", 4),
      o("D", "Never / only when there's a problem", "Jamais / uniquement en cas de problème", 1),
    ],
  },
  {
    id: "Q5", dimension: "D1", toolApi: true,
    text: { en: "How are your bank transactions imported into your accounting system?", fr: "Comment vos transactions bancaires sont-elles importées dans votre système comptable ?" },
    options: [
      o("A", "Automatic — open banking API or aggregator auto-syncs to ERP, no separate banking tool needed", "Automatique — API open banking ou agrégateur synchronisé à l'ERP, sans outil bancaire séparé", 10),
      o("B", "Semi-automatic — bank provides electronic exports (CSV, OFX, CAMT) imported manually into ERP", "Semi-automatique — exports électroniques (CSV, OFX, CAMT) importés manuellement dans l'ERP", 6),
      o("C", "Manual — we check balances on the bank website and enter transactions by hand", "Manuel — nous vérifions les soldes sur le site bancaire et saisissons à la main", 3),
      o("D", "No import — bank and accounting are not connected", "Pas d'import — banque et comptabilité ne sont pas connectées", 1),
    ],
  },

  // === D2 — Accounts Payable ===
  {
    id: "Q6", dimension: "D2",
    text: { en: "How are supplier invoices currently entered into your accounting system?", fr: "Comment les factures fournisseurs sont-elles saisies dans votre système comptable ?" },
    options: [
      o("A", "Processed automatically by AI", "Traités automatiquement par IA", 10),
      o("B", "OCR pre-processing then manual entry by a bookkeeper", "Pré-traitement par OCR puis saisie manuelle par un comptable", 7),
      o("C", "Manual entry by a bookkeeper", "Saisie manuelle par un comptable", 5),
      o("D", "Batched by the external accountant", "Saisie en lot par l'expert-comptable", 3),
      o("E", "I don't know", "Je ne sais pas", 1),
    ],
  },
  {
    id: "Q7", dimension: "D2",
    text: { en: "What percentage of your supplier invoices are currently in draft status (unapproved)?", fr: "Quel pourcentage de vos factures fournisseurs est actuellement en statut brouillon (non approuvées) ?" },
    options: [
      o("A", "<10%", "<10%", 10),
      o("B", "10–30%", "10 à 30%", 6),
      o("C", "30–60%", "30 à 60%", 3),
      o("D", ">60%", ">60%", 1),
      o("E", "I don't know", "Je ne sais pas", 2),
    ],
  },
  {
    id: "Q8", dimension: "D2",
    text: { en: "Do you know how long it takes for a supplier invoice to be keyed in (receipt-to-entry delay)?", fr: "Connaissez-vous le délai entre la réception d'une facture fournisseur et sa saisie ?" },
    options: [
      o("A", "Same day or next day", "Le jour même ou le lendemain", 10),
      o("B", "2–5 days", "2 à 5 jours", 7),
      o("C", "6–15 days", "6 à 15 jours", 4),
      o("D", "No idea / no tracking", "Aucune idée / pas de suivi", 1),
    ],
  },
  {
    id: "Q9", dimension: "D2",
    text: { en: "How do you manage the relationship with your vendors' AR teams (payment confirmations, balance reconciliations, dispute resolution)?", fr: "Comment gérez-vous la relation avec les services Compta Client de vos fournisseurs (confirmations de paiement, rapprochements de soldes, litiges) ?" },
    options: [
      o("A", "Fully automated (auto-matching, portal integration, AI-drafted responses)", "Totalement automatisé (auto-matching, portails, réponses IA)", 10),
      o("B", "AI-assisted (AI generates drafts, human reviews and sends)", "Assisté par IA (l'IA génère, l'humain valide et envoie)", 7),
      o("C", "Fully manual (emails, phone calls, spreadsheets)", "Totalement manuel (emails, appels, tableurs)", 4),
      o("D", "No structured communication", "Pas de communication structurée", 1),
    ],
  },
  {
    id: "Q10", dimension: "D2", toolApi: true,
    text: { en: "What is your primary accounting/ERP system and is it API-accessible?", fr: "Quel est votre système comptable/ERP principal et est-il accessible par API ?" },
    options: [
      o("A", "Cloud ERP with open API (Odoo, Netsuite, Xero, Pennylane, etc.)", "ERP cloud avec API ouverte (Odoo, Netsuite, Xero, Pennylane, etc.)", 10),
      o("B", "Cloud software with limited or no API (QuickBooks desktop, Sage Cloud basic)", "Logiciel cloud avec API limitée ou absente (QuickBooks desktop, Sage Cloud basic)", 6),
      o("C", "Desktop/on-premise software with no API (Sage 100, Ciel, EBP desktop)", "Logiciel desktop/on-premise sans API (Sage 100, Ciel, EBP desktop)", 3),
      o("D", "Spreadsheets, paper, or no dedicated accounting tool", "Tableurs, papier, ou pas d'outil dédié", 1),
    ],
  },

  // === D3 — Accounts Receivable ===
  {
    id: "Q11", dimension: "D3",
    text: { en: "Do you know your DSO (Days Sales Outstanding) right now?", fr: "Connaissez-vous votre DSO (Days Sales Outstanding) en ce moment ?" },
    options: [
      o("A", "Yes, tracked weekly", "Oui, suivi hebdomadairement", 10),
      o("B", "Roughly, checked monthly", "Approximativement, vérifié mensuellement", 6),
      o("C", "My accountant calculates it at year-end", "Mon expert-comptable le calcule en fin d'année", 3),
      o("D", "No idea", "Aucune idée", 1),
    ],
    footnote: {
      en: "DSO (Days Sales Outstanding): average number of days between invoice issuance and customer payment.",
      fr: "DSO (Days Sales Outstanding) : nombre moyen de jours entre l'émission d'une facture client et son paiement.",
    },
  },
  {
    id: "Q12", dimension: "D3",
    text: { en: "What happens when a client invoice is 30+ days overdue?", fr: "Que se passe-t-il lorsqu'une facture client a plus de 30 jours de retard ?" },
    options: [
      o("A", "Automated reminder sequence", "Séquence de relance automatisée", 10),
      o("B", "Manual follow-up by someone on the team", "Relance manuelle par quelqu'un de l'équipe", 6),
      o("C", "We wait until year-end or when cash is tight", "Nous attendons la fin d'année ou un manque de cash", 3),
      o("D", "Nothing systematic", "Rien de systématique", 1),
    ],
  },
  {
    id: "Q13", dimension: "D3",
    text: { en: "Is your client invoicing automated? What is your delivery-to-bill time?", fr: "Votre facturation client est-elle automatisée ? Quel est votre délai entre livraison et facturation ?" },
    options: [
      o("A", "Fully automated, billed within 1–2 days of delivery", "Totalement automatisée, facturée sous 1 à 2 jours après livraison", 10),
      o("B", "Semi-automated, billed within a week", "Semi-automatisée, facturée dans la semaine", 7),
      o("C", "Manual, billed monthly in batch", "Manuelle, facturée en lot mensuel", 4),
      o("D", "Irregular, sometimes weeks or months late", "Irrégulière, parfois plusieurs semaines ou mois de retard", 1),
    ],
  },
  {
    id: "Q14", dimension: "D3",
    text: { en: "How do you manage the relationship with your customers' AP teams (payment follow-ups, statement reconciliations, dispute handling)?", fr: "Comment gérez-vous la relation avec les services Compta Fournisseur de vos clients (relances de paiement, rapprochements, gestion des litiges) ?" },
    options: [
      o("A", "Fully automated (auto-reminders, portal integration, AI-drafted messages)", "Totalement automatisé (relances auto, portails, messages IA)", 10),
      o("B", "AI-assisted (AI generates follow-ups, human reviews and sends)", "Assisté par IA (l'IA génère, l'humain valide et envoie)", 7),
      o("C", "Fully manual (emails, phone calls, spreadsheets)", "Totalement manuel (emails, appels, tableurs)", 4),
      o("D", "No structured communication", "Pas de communication structurée", 1),
    ],
  },
  {
    id: "Q15", dimension: "D3", toolApi: true,
    text: { en: "What tools do you use for client invoicing, CRM, and point-of-sale (POS), and are they integrated?", fr: "Quels outils utilisez-vous pour la facturation client, le CRM et le point de vente (POS), et sont-ils intégrés ?" },
    options: [
      o("A", "Integrated stack with APIs (CRM + invoicing all synced automatically)", "Stack intégrée avec API (CRM + facturation synchronisés automatiquement)", 10),
      o("B", "Separate tools with some API connections (e.g., CRM exports to invoicing)", "Outils séparés avec quelques connexions API (ex: CRM exporte vers la facturation)", 7),
      o("C", "Standalone tools with no integration (manual re-entry between systems)", "Outils isolés sans intégration (ressaisie manuelle entre systèmes)", 4),
      o("D", "No CRM, manual invoicing (Word/Excel)", "Pas de CRM, facturation manuelle (Word/Excel)", 1),
      o("E", "Other specialized tools: PoS (cash register / caisse), etc.", "Autres outils : PoS (caisse), etc.", 5),
    ],
  },

  // === D4 — Monthly Close ===
  {
    id: "Q16", dimension: "D4",
    text: { en: "How many calendar days after month-end do you have a closed P&L?", fr: "Combien de jours calendaires après la fin du mois disposez-vous d'un P&L clôturé ?" },
    options: [
      o("A", "1–5 days", "1 à 5 jours", 10),
      o("B", "6–15 days", "6 à 15 jours", 6),
      o("C", "16–30 days", "16 à 30 jours", 3),
      o("D", "We only close at quarter-end, semester-end or year-end", "Nous ne clôturons qu'en fin de trimestre, semestre ou année", 1),
    ],
    footnote: {
      en: "P&L (Profit & Loss / compte de résultat): summary of revenues and expenses over a period, producing the net result.",
      fr: "P&L (Profit & Loss / compte de résultat) : synthèse des produits et charges sur une période, qui dégage le résultat net.",
    },
  },
  {
    id: "Q17", dimension: "D4",
    text: { en: "Who performs your monthly accounting close?", fr: "Qui réalise votre clôture comptable mensuelle ?" },
    options: [
      o("A", "Internal team with automated checks", "Équipe interne avec contrôles automatisés", 10),
      o("B", "Internal team, mostly manual", "Équipe interne, principalement manuel", 6),
      o("C", "External accountant only", "Expert-comptable externe uniquement", 4),
      o("D", "No formal close process", "Pas de processus de clôture formel", 1),
    ],
  },
  {
    id: "Q18", dimension: "D4",
    text: { en: "Do you know the total cost of your monthly close (people hours, tools, external accountant fees)?", fr: "Connaissez-vous le coût total de votre clôture mensuelle (heures internes, outils, honoraires expert-comptable) ?" },
    options: [
      o("A", "Yes, fully tracked and benchmarked", "Oui, totalement suivi et benchmarké", 10),
      o("B", "Roughly — I know the accountant's fee but not internal time", "Approximativement — je connais les honoraires mais pas le temps interne", 6),
      o("C", "No idea", "Aucune idée", 3),
      o("D", "We don't do a monthly close", "Nous ne faisons pas de clôture mensuelle", 1),
      o("E", "I don't know", "Je ne sais pas", 2),
    ],
  },
  {
    id: "Q19", dimension: "D4", toolApi: true,
    text: { en: "What payroll and close-process tools does your finance team use?", fr: "Quels outils de paie et de clôture votre équipe finance utilise-t-elle ?" },
    options: [
      o("A", "Cloud payroll with API push to GL (journal de paie auto-posted)", "Paie cloud avec push API vers le GL (journal de paie auto-posté)", 10),
      o("B", "Cloud payroll but journal imported manually (CSV/PDF)", "Paie cloud mais journal importé manuellement (CSV/PDF)", 6),
      o("C", "External payroll bureau, we receive PDF only", "Cabinet de paie externe, nous recevons uniquement des PDF", 3),
      o("D", "Payroll done in spreadsheets or by hand", "Paie en tableur ou à la main", 1),
    ],
  },

  // === D5 — Compliance ===
  {
    id: "Q20", dimension: "D5",
    text: { en: "Are you prepared for mandatory e-invoicing (September 2026)?", fr: "Êtes-vous prêt pour la facturation électronique obligatoire (septembre 2026) ?" },
    options: [
      o("A", "PDP/PPF selected and tested", "PDP/PPF sélectionnée et testée", 10),
      o("B", "Evaluating platforms", "Évaluation des plateformes en cours", 6),
      o("C", "Aware but haven't started", "Conscient mais pas commencé", 3),
      o("D", "Not aware / not concerned", "Pas au courant / pas concerné", 1),
    ],
  },
  {
    id: "Q21", dimension: "D5",
    text: { en: "Do you have a documented Piste d'Audit Fiable (PAF)?", fr: "Disposez-vous d'une Piste d'Audit Fiable (PAF) documentée ?" },
    options: [
      o("A", "Yes, documented and reviewed within 12 months", "Oui, documentée et revue dans les 12 derniers mois", 10),
      o("B", "Yes, but outdated or incomplete", "Oui, mais obsolète ou incomplète", 5),
      o("C", "Don't know what a PAF is", "Je ne sais pas ce qu'est une PAF", 2),
      o("D", "No", "Non", 1),
    ],
  },
  {
    id: "Q22", dimension: "D5",
    text: { en: "When was the last fiscal or compliance review of your company (auditor, tax advisor, or administration fiscale)?", fr: "Quand a eu lieu le dernier contrôle fiscal ou de conformité de votre entreprise (auditeur, conseil fiscal ou administration fiscale) ?" },
    options: [
      o("A", "Within the last 12 months", "Dans les 12 derniers mois", 10),
      o("B", "1–2 years ago", "Il y a 1 à 2 ans", 6),
      o("C", "3+ years ago", "Il y a 3 ans ou plus", 3),
      o("D", "Never / don't remember", "Jamais / je ne me souviens pas", 1),
    ],
  },
  {
    id: "Q23", dimension: "D5",
    text: { en: "How often do you meet with your financial advisors (CFO, expert-comptable, commissaire aux comptes, accounting team)?", fr: "À quelle fréquence rencontrez-vous vos conseillers financiers (CFO, expert-comptable, commissaire aux comptes, équipe comptable) ?" },
    options: [
      o("A", "Weekly or biweekly", "Hebdomadaire ou bimensuel", 10),
      o("B", "Monthly", "Mensuel", 7),
      o("C", "Quarterly", "Trimestriel", 4),
      o("D", "Only at year-end or when there's a problem", "Uniquement en fin d'année ou en cas de problème", 1),
    ],
  },
  {
    id: "Q24", dimension: "D5",
    text: { en: "How often do you produce or update a budget during the fiscal year?", fr: "À quelle fréquence produisez-vous ou mettez-vous à jour un budget pendant l'exercice ?" },
    options: [
      o("A", "Rolling forecast updated monthly", "Forecast roulant mis à jour mensuellement", 10),
      o("B", "Annual budget reviewed quarterly", "Budget annuel revu trimestriellement", 7),
      o("C", "Annual budget set once, not revised", "Budget annuel défini une fois, non révisé", 4),
      o("D", "No budget", "Pas de budget", 1),
    ],
  },
  {
    id: "Q25", dimension: "D5", toolApi: true,
    text: { en: "What document management and archiving tools do you use for financial records?", fr: "Quels outils de gestion documentaire et d'archivage utilisez-vous pour vos pièces financières ?" },
    options: [
      o("A", "GED/DMS with versioning and retention policies, API-connected to ERP", "GED/DMS avec versioning et politiques de rétention, connectée par API à l'ERP", 10),
      o("B", "Cloud storage (Google Drive, SharePoint, Dropbox) with some organization", "Stockage cloud (Google Drive, SharePoint, Dropbox) avec une organisation minimale", 6),
      o("C", "Local folders or email archives, no systematic organization", "Dossiers locaux ou archives email, sans organisation systématique", 3),
      o("D", "Paper-based or no archiving system", "Sur papier ou aucun système d'archivage", 1),
    ],
  },

  // === D6 — Reporting ===
  {
    id: "Q26", dimension: "D6",
    text: { en: "How often does management receive a financial report with variance analysis (budget vs actual)?", fr: "À quelle fréquence la direction reçoit-elle un rapport financier avec analyse des écarts (budget vs réalisé) ?" },
    options: [
      o("A", "Weekly or real-time dashboard", "Hebdomadaire ou dashboard temps réel", 10),
      o("B", "Monthly", "Mensuel", 7),
      o("C", "Quarterly", "Trimestriel", 5),
      o("D", "Semester", "Semestriel", 3),
      o("E", "Only at year-end or never", "Uniquement en fin d'année ou jamais", 1),
    ],
  },
  {
    id: "Q27", dimension: "D6", toolApi: true,
    text: { en: "What tools do you use for financial reporting and business intelligence?", fr: "Quels outils utilisez-vous pour le reporting financier et la business intelligence ?" },
    options: [
      o("A", "Dedicated BI tool (Metabase, Power BI, Looker) connected to live data via API", "Outil BI dédié (Metabase, Power BI, Looker) connecté en API aux données live", 10),
      o("B", "ERP built-in reports exported to spreadsheets for analysis", "Rapports intégrés à l'ERP exportés en tableurs pour analyse", 6),
      o("C", "Manual spreadsheet compilation from multiple sources", "Compilation manuelle de tableurs depuis plusieurs sources", 3),
      o("D", "No reporting tool — we rely on the accountant's annual report", "Pas d'outil de reporting — nous dépendons du rapport annuel de l'expert-comptable", 1),
      o("E", "Dedicated specialized tools (treasury, FP&A, consolidation — e.g. Agicap, Pigment, Anaplan, Lucanet)", "Outils dédiés spécialisés (treasury, FP&A, consolidation — ex: Agicap, Pigment, Anaplan, Lucanet)", 8),
    ],
  },
];

export const FOLLOW_UPS: FollowUp[] = [
  {
    id: "F2", triggerQuestion: "Q2", triggerOn: ["C", "D", "E"], dimension: "D1",
    text: { en: "How many unreconciled bank lines are currently open?", fr: "Combien de lignes bancaires non rapprochées sont actuellement ouvertes ?" },
    options: [
      o("A", "<10", "<10", 10),
      o("B", "10–50", "10 à 50", 7),
      o("C", "50–200", "50 à 200", 4),
      o("D", ">200 or unknown", ">200 ou inconnu", 1),
    ],
  },
  {
    id: "F4", triggerQuestion: "Q4", triggerOn: ["C", "D"], dimension: "D1",
    text: { en: "How often do you update your runway estimate (months of cash remaining)?", fr: "À quelle fréquence mettez-vous à jour votre estimation de runway (mois de cash restants) ?" },
    options: [
      o("A", "Weekly", "Hebdomadaire", 10),
      o("B", "Monthly", "Mensuel", 7),
      o("C", "Quarterly", "Trimestriel", 4),
      o("D", "Never", "Jamais", 1),
    ],
  },
  {
    id: "F6", triggerQuestion: "Q6", triggerOn: ["C", "D", "E"], dimension: "D2",
    text: { en: "Do you have supplier invoices older than 30 days that haven't been entered yet?", fr: "Avez-vous des factures fournisseurs de plus de 30 jours qui ne sont pas encore saisies ?" },
    options: [
      o("A", "No", "Non", 10),
      o("B", "A few", "Quelques-unes", 6),
      o("C", "Yes, a backlog", "Oui, un backlog", 3),
      o("D", "Yes, large backlog (>50)", "Oui, gros backlog (>50)", 1),
    ],
  },
  {
    id: "F7", triggerQuestion: "Q7", triggerOn: ["C", "D", "E"], dimension: "D2",
    text: { en: "Do you know the monthly cost of your AP function (people + tools + external)?", fr: "Connaissez-vous le coût mensuel de votre fonction Compta Fournisseur (personnes + outils + externes) ?" },
    options: [
      o("A", "Yes, tracked", "Oui, suivi", 10),
      o("B", "Roughly", "Approximativement", 6),
      o("C", "No", "Non", 1),
    ],
  },
  {
    id: "F11", triggerQuestion: "Q11", triggerOn: ["C", "D"], dimension: "D3",
    text: { en: "Do you have any single client representing >20% of your receivables?", fr: "Avez-vous un seul client représentant plus de 20% de vos créances ?" },
    options: [
      o("A", "No", "Non", 10),
      o("B", "One around 20–30%", "Un client autour de 20–30%", 6),
      o("C", "Yes, >30%", "Oui, >30%", 1),
    ],
  },
  {
    id: "F12", triggerQuestion: "Q12", triggerOn: ["C", "D"], dimension: "D3",
    text: { en: "Do you use external tools or processes to track and recover overdue invoices?", fr: "Utilisez-vous des outils ou processus externes pour suivre et recouvrer les impayés ?" },
    options: [
      o("A", "Yes, integrated tools", "Oui, outils intégrés", 10),
      o("B", "Occasional external help", "Aide externe occasionnelle", 6),
      o("C", "Nothing", "Rien", 1),
    ],
  },
  {
    id: "F16a", triggerQuestion: "Q16", triggerOn: ["C", "D"], dimension: "D4",
    text: { en: "Is payroll (journal de paie) posted to your GL within 5 days of month-end?", fr: "Le journal de paie est-il posté à votre GL dans les 5 jours suivant la fin du mois ?" },
    options: [
      o("A", "Yes", "Oui", 10),
      o("B", "Sometimes", "Parfois", 5),
      o("C", "No", "Non", 1),
    ],
  },
  {
    id: "F16b", triggerQuestion: "Q16", triggerOn: ["C", "D"], dimension: "D4",
    text: { en: "Do you have journal entries (OD) older than 30 days in suspense accounts?", fr: "Avez-vous des Opérations Diverses (OD) de plus de 30 jours dans des comptes d'attente ?" },
    options: [
      o("A", "No", "Non", 10),
      o("B", "A few", "Quelques-unes", 6),
      o("C", "Yes, several", "Oui, plusieurs", 3),
      o("D", "Yes, many (>100 lines)", "Oui, beaucoup (>100 lignes)", 1),
    ],
  },
  {
    id: "F20", triggerQuestion: "Q20", triggerOn: ["C", "D"], dimension: "D5",
    text: { en: "Is your POS / caisse software NF 525 certified or do you have an attestation from the editor? (NF 525 only applies to systems recording customer payments — caisses enregistreuses — not general accounting software)", fr: "Votre logiciel de caisse / POS est-il certifié NF 525 ou disposez-vous d'une attestation de l'éditeur ? (NF 525 ne s'applique qu'aux systèmes enregistrant les paiements clients — caisses enregistreuses — pas aux logiciels comptables généraux)" },
    options: [
      o("A", "Yes, certified or attestation on file", "Oui, certifié ou attestation au dossier", 10),
      o("B", "No POS system", "Pas de POS", 7),
      o("C", "Don't know", "Je ne sais pas", 3),
      o("D", "No", "Non", 1),
    ],
  },
  {
    id: "F21", triggerQuestion: "Q21", triggerOn: ["C", "D"], dimension: "D5",
    text: { en: "Do you know what a PAF entails and whether your processes meet the requirements (art. 289 VII CGI)?", fr: "Savez-vous ce qu'implique une PAF et si vos processus respectent les exigences (art. 289 VII CGI) ?" },
    options: [
      o("A", "Yes", "Oui", 10),
      o("B", "Partially", "Partiellement", 5),
      o("C", "No", "Non", 1),
    ],
  },
  {
    id: "F26a", triggerQuestion: "Q26", triggerOn: ["C", "D"], dimension: "D6",
    text: { en: "Do you track gross margin by business unit / site / product line?", fr: "Suivez-vous la marge brute par business unit / site / ligne de produits ?" },
    options: [
      o("A", "Yes, weekly or monthly", "Oui, hebdomadaire ou mensuel", 10),
      o("B", "Yes, at end of quarter, semester or year only", "Oui, en fin de trimestre, semestre ou année uniquement", 5),
      o("C", "No", "Non", 1),
    ],
  },
  {
    id: "F26b", triggerQuestion: "Q26", triggerOn: ["C", "D"], dimension: "D6",
    text: { en: "Do you have a real-time or near-real-time KPI dashboard accessible to management?", fr: "Disposez-vous d'un dashboard KPI temps réel ou quasi temps réel accessible à la direction ?" },
    options: [
      o("A", "Yes", "Oui", 10),
      o("B", "Static reports only", "Rapports statiques uniquement", 5),
      o("C", "No", "Non", 1),
    ],
  },
];

export const MATURITY_LEVELS = [
  { min: 80, max: 100, level: 4, key: "Controlled", description: { en: "Finance function is structured and automated. TFF/ adds marginal value.", fr: "Fonction finance structurée et automatisée. TFF/ apporte une valeur marginale." } },
  { min: 55, max: 79.99, level: 3, key: "Structured", description: { en: "Processes exist but are manual and slow. High-value TFF/ prospect. Fast-Track onboarding.", fr: "Processus existants mais manuels et lents. Prospect TFF/ à forte valeur. Onboarding Fast-Track." } },
  { min: 30, max: 54.99, level: 2, key: "Reactive", description: { en: "Ad-hoc processes, significant gaps. Core TFF/ ICP. Reconciliation Sprint required.", fr: "Processus ad-hoc, écarts significatifs. Cœur de cible TFF/. Sprint de réconciliation requis." } },
  { min: 0, max: 29.99, level: 1, key: "Blind", description: { en: "No finance function. Needs foundational work before TFF/.", fr: "Pas de fonction finance. Travail de fond nécessaire avant TFF/." } },
];

export const SPECIALIZED_NEEDS: { id: string; label: Bilingual }[] = [
  { id: "fx_hedging", label: { en: "FX hedging (multi-currency exposure, forwards, swaps)", fr: "Couverture FX (exposition multi-devises, forwards, swaps)" } },
  { id: "consolidation", label: { en: "Multi-entity consolidation (subsidiaries, holding, IFRS)", fr: "Consolidation multi-entités (filiales, holding, IFRS)" } },
  { id: "intercompany", label: { en: "Intercompany accounting (cross-billing, eliminations)", fr: "Comptabilité intercompagnies (refacturation, éliminations)" } },
  { id: "revrec", label: { en: "Complex revenue recognition (IFRS 15, SaaS MRR/ARR, long-term projects)", fr: "Reconnaissance du revenu complexe (IFRS 15, SaaS MRR/ARR, projets long-terme)" } },
  { id: "captable", label: { en: "Cap table & equity management (BSPCE, BSA, stock-options, dilution)", fr: "Cap table & equity management (BSPCE, BSA, stock-options, dilution)" } },
  { id: "debt", label: { en: "Structured debt & covenants (LBO, senior debt, mezzanine)", fr: "Dette structurée & covenants (LBO, dette senior, mezzanine)" } },
  { id: "rd_credit", label: { en: "R&D tax credits (CIR, CII, JEI)", fr: "Crédits fiscaux R&D (CIR, CII, JEI)" } },
  { id: "grants", label: { en: "Grants & public financing (BPI, France 2030, Horizon)", fr: "Subventions & financements publics (BPI, France 2030, Horizon)" } },
  { id: "transfer_pricing", label: { en: "Transfer pricing (OECD documentation)", fr: "Prix de transfert (documentation OCDE)" } },
  { id: "investor_reporting", label: { en: "Investor / board reporting (LP letter, KPI deck, MRR cohorts)", fr: "Reporting investisseurs / board (LP letter, KPI deck, cohortes MRR)" } },
  { id: "esg_csrd", label: { en: "ESG / CSRD reporting (extra-financial, green taxonomy)", fr: "ESG / CSRD (extra-financier, taxonomie verte)" } },
  { id: "inventory", label: { en: "Inventory & stock valuation (FIFO, perpetual inventory)", fr: "Stocks & valorisation (FIFO, inventaire permanent)" } },
  { id: "vat_intra", label: { en: "Intracom & export VAT (DEB, DES, OSS/IOSS)", fr: "TVA intracommunautaire & export (DEB, DES, OSS/IOSS)" } },
  { id: "cash_pooling", label: { en: "Cash pooling & centralized treasury (ZBA, notional pooling)", fr: "Cash pooling & trésorerie centralisée (ZBA, notional pooling)" } },
  { id: "ma_ready", label: { en: "M&A due diligence ready (VDR, data room, quality of earnings)", fr: "Due diligence M&A ready (VDR, data room, quality of earnings)" } },
  { id: "subscriptions", label: { en: "Recurring billing / subscriptions (Stripe, Chargebee, dunning)", fr: "Facturation récurrente / abonnements (Stripe, Chargebee, dunning)" } },
  { id: "expenses", label: { en: "High-volume expense management (Spendesk, Qonto, Pleo)", fr: "Gestion des notes de frais volume élevé (Spendesk, Qonto, Pleo)" } },
  { id: "cost_accounting", label: { en: "Multi-site cost accounting (cost centers, BU, projects)", fr: "Comptabilité analytique multi-sites (cost centers, BU, projets)" } },
];

export const DRQ_CLASSES = [
  { min: 55, max: 100, key: "FastTrack", path: { en: "Phase 2: CFO Diagnostic → Direct Control Layer activation", fr: "Phase 2 : Diagnostic CFO → activation directe du Control Layer" }, duration: { en: "2–4 weeks", fr: "2 à 4 semaines" } },
  { min: 30, max: 54.99, key: "Reconciliation", path: { en: "Phase 2: CFO Diagnostic → Reconciliation Sprint first → then Control Layer", fr: "Phase 2 : Diagnostic CFO → Sprint de réconciliation d'abord → puis Control Layer" }, duration: { en: "6–10 weeks", fr: "6 à 10 semaines" } },
  { min: 0, max: 29.99, key: "PreQual", path: { en: "Refer to expert-comptable partner. Re-evaluate in 3–6 months.", fr: "Orientation vers un partenaire expert-comptable. Réévaluation dans 3 à 6 mois." }, duration: { en: "n/a", fr: "n/a" } },
];
