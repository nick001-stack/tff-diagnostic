// TFF/ Finance Readiness Diagnostic — i18n dictionary
// Lightweight bilingual support (EN / FR). Edit values here to update copy.

export type Lang = "en" | "fr";

export const LANGS: Lang[] = ["en", "fr"];

export const t = {
  // Header
  header_subtitle: { en: "Finance Readiness Diagnostic", fr: "Diagnostic de Maturité Finance" },
  language_label: { en: "Language", fr: "Langue" },

  // Steps
  step_intro: { en: "Step 1 of 3 — Introduction", fr: "Étape 1 sur 3 — Introduction" },
  step_team: { en: "Step 2 of 3 — Team Structure", fr: "Étape 2 sur 3 — Structure de l'équipe" },
  step_questions: { en: "Step 3 of 3 — Diagnostic", fr: "Étape 3 sur 3 — Diagnostic" },
  step_generating: { en: "Generating your report", fr: "Génération de votre rapport" },

  // Intro
  intro_title: { en: "Finance Readiness Diagnostic", fr: "Diagnostic de Maturité Finance" },
  intro_p1: {
    en: "A free 5–8 minute self-assessment built from real production automations running inside TFF (Trusted Finance Framework).",
    fr: "Une auto-évaluation gratuite de 5 à 8 minutes, conçue à partir des automatisations en production dans TFF (Trusted Finance Framework).",
  },
  intro_p2: {
    en: "You will receive an instant score across 6 dimensions, a personalized report, and a recommended TFF/ activation path.",
    fr: "Vous recevrez un score immédiat sur 6 dimensions, un rapport personnalisé, et un parcours d'activation TFF/ recommandé.",
  },
  field_company: { en: "Company name *", fr: "Nom de la société *" },
  field_contact: { en: "Your name *", fr: "Votre nom *" },
  field_email: { en: "Email *", fr: "Email *" },
  field_revenue: { en: "Revenue range", fr: "Tranche de chiffre d'affaires" },
  field_employees: { en: "Employee count", fr: "Effectif" },
  select_placeholder: { en: "— Select —", fr: "— Sélectionner —" },

  // Team step
  team_title: { en: "Your finance team", fr: "Votre équipe finance" },
  team_intro: {
    en: "For each role, select the staffing model. This is not scored — it informs the package recommendation.",
    fr: "Pour chaque rôle, sélectionnez le modèle de staffing. Non scoré — sert à la recommandation de package.",
  },

  // Specialized needs (end of team step)
  specneeds_title: { en: "Specialized needs", fr: "Besoins spécifiques" },
  specneeds_intro: {
    en: "Check any that apply to your business. Not scored — helps tailor the package recommendation.",
    fr: "Cochez tout ce qui s'applique à votre activité. Non scoré — permet d'ajuster la recommandation de package.",
  },

  // Definitions (footnotes under questions)
  def_dso: {
    en: "DSO (Days Sales Outstanding): average number of days between invoice issuance and customer payment.",
    fr: "DSO (Days Sales Outstanding) : nombre moyen de jours entre l'émission d'une facture client et son paiement.",
  },
  def_pnl: {
    en: "P&L (Profit & Loss / compte de résultat): summary of revenues and expenses over a period, producing the net result.",
    fr: "P&L (Profit & Loss / compte de résultat) : synthèse des produits et charges sur une période, qui dégage le résultat net.",
  },

  // Submitting
  generating_title: { en: "Analyzing your finance function…", fr: "Analyse de votre fonction finance en cours…" },
  generating_p: {
    en: "Computing scores across 6 dimensions and drafting your personalized TFF/ readiness report. This takes 15–30 seconds.",
    fr: "Calcul des scores sur 6 dimensions et rédaction de votre rapport TFF/ personnalisé. 15 à 30 secondes.",
  },

  // Buttons
  btn_continue: { en: "Continue", fr: "Continuer" },
  btn_back: { en: "Back", fr: "Retour" },
  btn_next: { en: "Next", fr: "Suivant" },
  btn_generate: { en: "Generate Report", fr: "Générer le rapport" },
  btn_new: { en: "New diagnostic", fr: "Nouveau diagnostic" },
  btn_md: { en: "Markdown", fr: "Markdown" },
  btn_pdf: { en: "PDF", fr: "PDF" },

  // Errors
  err_select: { en: "Please select an answer", fr: "Veuillez sélectionner une réponse" },
  err_required: { en: "Please fill all required fields", fr: "Veuillez remplir tous les champs obligatoires" },
  err_team: { en: "Please answer all team roles", fr: "Veuillez répondre pour tous les rôles de l'équipe" },

  // Report sections
  report_subtitle: { en: "Finance Readiness Report", fr: "Rapport de Maturité Finance" },
  report_composite: { en: "Composite Score / 100", fr: "Score Composite / 100" },
  sec_executive: { en: "Executive Summary", fr: "Résumé exécutif" },
  sec_scores: { en: "Scores by Dimension", fr: "Scores par dimension" },
  sec_team: { en: "Team Structure Analysis", fr: "Analyse de la structure d'équipe" },
  sec_specneeds: { en: "Specialized Needs Flagged", fr: "Besoins spécifiques signalés" },
  sec_migration: { en: "Tooling & Migration Path", fr: "Outils & parcours de migration" },
  sec_package: { en: "Recommended Package", fr: "Package recommandé" },
  sec_next: { en: "Next Steps", fr: "Prochaines étapes" },
  sec_cta_title: { en: "Ready to activate?", fr: "Prêt à activer ?" },
  sec_cta_btn: { en: "Book your CFO Diagnostic →", fr: "Réserver votre Diagnostic CFO →" },
  migration_flags: { en: "Migration Flags", fr: "Drapeaux de migration" },
  positive_signals: { en: "Positive Signals", fr: "Signaux positifs" },
  fallback_notice: {
    en: "Report generated using fallback templates",
    fr: "Rapport généré avec les modèles de secours",
  },

  // Maturity levels
  maturity_Controlled: { en: "Controlled", fr: "Maîtrisé" },
  maturity_Structured: { en: "Structured", fr: "Structuré" },
  maturity_Reactive: { en: "Reactive", fr: "Réactif" },
  maturity_Blind: { en: "Blind", fr: "Aveugle" },

  // DRQ
  drq_FastTrack: { en: "Fast-Track Ready", fr: "Prêt pour Fast-Track" },
  drq_Reconciliation: { en: "Reconciliation Required", fr: "Réconciliation requise" },
  drq_PreQual: { en: "Pre-Qualification Needed", fr: "Pré-qualification nécessaire" },

  // Revenue / employees options
  rev_lt1m: { en: "< 1M€", fr: "< 1M€" },
  rev_1_5: { en: "1–5M€", fr: "1–5M€" },
  rev_5_10: { en: "5–10M€", fr: "5–10M€" },
  rev_10_25: { en: "10–25M€", fr: "10–25M€" },
  rev_25plus: { en: "25M€+", fr: "25M€+" },
  emp_1_10: { en: "1–10", fr: "1–10" },
  emp_11_50: { en: "11–50", fr: "11–50" },
  emp_51_100: { en: "51–100", fr: "51–100" },
  emp_101_250: { en: "101–250", fr: "101–250" },
  emp_250plus: { en: "250+", fr: "250+" },
} as const;

export type TKey = keyof typeof t;
export const tr = (key: TKey, lang: Lang): string => t[key][lang] || t[key].en;
