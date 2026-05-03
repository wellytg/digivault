# VaultTech — Process Log
> Document everything. This is both a thinking record and submission evidence.
> Format: [TIMESTAMP] ACTION — OUTCOME

---

## Pre-Build (Planning Session)

[2026-05-03] IDEA SELECTION
- Evaluated: Digital Presence Security vs Digital Virtual Traveller
- Decision: Digital Presence Security
- Reasoning: Higher judge impact (visceral, personal, live demo), less polish-dependent than travel apps
- Method: Deductive — constraints (static stack, 24hrs) + judge criteria → security wins

[2026-05-03] SCOPE DEFINITION
- Full vision: recon + breach + profile sync + AI agent
- MVP scope: recon + breach + VaultScore + AI recommendations
- Parking: profile sync, continuous monitoring, VaultAgent
- Reasoning: Deductive — GitHub Pages static constraint eliminates backend features

[2026-05-03] ARCHITECTURE DECISION
- Considered: React, Vue, Vanilla JS
- Decision: Vanilla JS
- Reasoning: No build step, no npm, deploys directly to GitHub Pages, agent builds faster

[2026-05-03] API DECISION — HIBP
- Free tier: no key, CORS-blocked from browser
- Solution: corsproxy.io prefix + mock fallback
- Risk: corsproxy could go down during demo
- Mitigation: USE_MOCK_DATA flag in config.js

---

## Build Log
> Agent: add entries here as you build each file

[TIMESTAMP] FILE: config.js — STATUS
[TIMESTAMP] FILE: js/utils/api.js — STATUS
[TIMESTAMP] FILE: js/modules/recon.js — STATUS
[TIMESTAMP] FILE: js/modules/breach.js — STATUS
[TIMESTAMP] FILE: js/modules/vault-score.js — STATUS
[TIMESTAMP] FILE: js/modules/ai-report.js — STATUS
[TIMESTAMP] FILE: js/app.js — STATUS
[TIMESTAMP] FILE: css/main.css — STATUS
[TIMESTAMP] FILE: index.html — STATUS

---

## Issues & Solutions
> Document problems encountered and how they were solved

