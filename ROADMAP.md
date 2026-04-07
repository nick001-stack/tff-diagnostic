# TFF/ Finance Readiness Diagnostic — Roadmap

Backlog versionnée des améliorations. Mise à jour à chaque session.

## v1.2.0 — In progress (2026-04-07)
- [x] **Intro text** — Remplacement "running inside HUDI SAS" par "running inside TFF (Trusted Finance Framework)"
- [x] **Team roles** — Ajout option "Décentralisé (dans les fonctions opérationnelles)" pour AR (Compta Client) et OTB
- [x] **Q2 (rapprochement bancaire)** — Ancien D déplacé en E, nouveau D "Je ne sais pas" (2 pts)
- [x] **Q4 (prévisionnel trésorerie)** — Ajout "(prévisionnel de trésorerie)" en FR
- [x] **Q6 (saisie factures fournisseurs)** — Refonte : A=10 (IA/auto), B=7 (OCR+manuel), C=5 (manuel), D=3 (cabinet), E=1 (Je ne sais pas)
- [x] **Q7 (% drafts)** — Split : nouveau D ">60%" (1 pt), nouveau E "Je ne sais pas" (2 pts)
- [x] **Q11 (DSO)** — Ajout note de bas de page définissant DSO
- [x] **Q15 (CRM/POS)** — Retrait mentions PoS options A-D, ajout option E "Autres outils : PoS (caisse), etc." (5 pts)
- [x] **Q16 (clôture P&L)** — Ajout note P&L, modif D "Nous ne clôturons qu'en fin de trimestre/semestre/année"
- [x] **Q18 (coût clôture)** — Ajout option E "Je ne sais pas" (2 pts)
- [x] **Q19 (outils paie)** — Retrait mention "Silae, PayFit" option A
- [x] **Q23 (conseils externes)** — Ajout "commissaire aux comptes" dans la question
- [x] **F26a (marge brute)** — Option B "Oui, en fin de trimestre, semestre ou année uniquement"
- [x] **Q27 (outils BI)** — Ajout option E "Outils dédiés spécialisés (Agicap, Pigment, Anaplan, Lucanet)" (8 pts)
- [x] **Section Besoins spécifiques** — Nouvelle checklist 18 items (FX, consolidation, rev rec, cap table, R&D, CSRD, inventory, etc.) en fin d'étape 2. Non scorée, transmise à Claude, peut upgrade la recommandation package.
- [x] **Follow-ups trigger** — F2/F6/F7 `triggerOn` étendu à "C/D/E" pour rester cohérent après split d'options.
- [x] **Report** — Nouvelle section "Specialized Needs Flagged" (UI + markdown download) quand ≥1 besoin coché.

## v1.1.0 — Shipped 2026-04-07
- [x] **i18n EN/FR** — Toggle EN/FR dans le header, traduction complète UI + report (questions, options, labels, badges, sections, commentaires Claude). Termes réglementaires français (PAF, NF 525, expert-comptable, URSSAF, TVA, PDP/PPF) restent identiques en mode EN.

## v1.0.0 — Shipped 2026-04-07
- [x] Next.js 14 + TypeScript + Tailwind + Anthropic SDK
- [x] 27 questions adaptatives + 12 follow-ups + matrice équipe finance
- [x] Scoring complet (6 dimensions + composite + maturity + DRQ + migration flags)
- [x] System prompt model-agnostic (Section 6.4 / 7.4 du spec v7)
- [x] API route serveur sécurisée (clé API jamais exposée)
- [x] Report branded TFF/ + download MD/PDF
- [x] Fallback statique si Claude échoue
- [x] Déploiement Vercel + repo GitHub `nick001-stack/tff-diagnostic`

## Backlog priorisé

### P1 — High value, low effort
- [ ] **Domaine custom** `diagnostic.cfoai.fr` (Vercel Settings → Domains, ajout CNAME)
- [ ] **Vercel Analytics** (1 clic, gratuit, dashboard de fréquentation)
- [ ] **Anti-spam Cloudflare Turnstile** sur la soumission du formulaire

### P2 — Lead capture & CRM
- [ ] **Intégration HubSpot** : POST contact + properties (`tff_diagnostic_score`, `tff_diagnostic_level`, `tff_drq_classification`) après le call Claude
- [ ] **Email du report en PDF** : envoi auto via Resend/Postmark à la soumission
- [ ] **Webhook Slack** : ping Nicolas à chaque diagnostic terminé avec score + email

### P3 — Optimisation produit
- [ ] **A/B testing prompt** : 2 branches Vercel avec versions différentes du prompt, mesurer la qualité perçue
- [ ] **Sauvegarde des réponses** : permettre de reprendre un diagnostic interrompu (cookie/localStorage)
- [ ] **Mode "Guided" dual-language** : Nicolas remplit pendant l'appel avec un mode admin, ajout de notes qualitatives
- [ ] **Export Excel détaillé** : ajout d'un download .xlsx avec breakdown question par question
- [ ] **Benchmark sectoriel** : si on a >50 diagnostics, montrer "your D1 score vs industry median"

### P4 — Brand & GTM
- [ ] **Page d'accueil marketing** dédiée avec hero, social proof, exemples de reports
- [ ] **Témoignages prospects** sur la page d'intro
- [ ] **Logo SVG TFF/** propre (actuellement texte)
- [ ] **Open Graph image** pour partage LinkedIn
- [ ] **Share buttons** : "I scored X/100 on TFF/ Finance Readiness — take yours"

### P5 — Tech debt & robustesse
- [ ] **Tests unitaires Jest** sur `lib/scoring.ts` (cas limites, follow-ups, edge cases)
- [ ] **Tests E2E Playwright** sur le parcours complet
- [ ] **Rate limiting API route** (Upstash Redis ou simple in-memory)
- [ ] **Error tracking Sentry** (gratuit jusqu'à 5K events/mois)
- [ ] **Schema validation Zod** sur le payload API

## Notes architecture

- **Source de vérité unique** : `lib/questions.ts` pour le contenu, `lib/prompt.ts` pour le prompt, `lib/scoring.ts` pour la formule. Modifier ces 3 fichiers = modifier toute l'app.
- **Fallback obligatoire** : tout appel Claude doit avoir un fallback statique pour ne jamais bloquer un prospect.
- **i18n maison** : pas de lib externe (next-intl, i18next). Dictionnaire dans `lib/i18n.ts`, prop-drilling de `lang` aux composants.
- **Pas de DB pour l'instant** : tout est in-memory pendant la session. À ajouter quand on intégrera HubSpot.

## Décisions tranchées
- **Default langue** : EN (cohérent avec branding TFF/ international)
- **Termes FR en mode EN** : gardés tels quels (PAF, NF 525, expert-comptable…)
- **Persistance toggle** : `localStorage` (pas de cookie, pas de query param)
- **Modèle Claude par défaut** : `claude-opus-4-6` (override via env var `ANTHROPIC_MODEL`)
