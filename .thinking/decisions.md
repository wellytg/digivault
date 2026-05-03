# VaultTech — Decision Log
> Every significant decision, its reasoning, and its classification.

---

## D001 — Project Selection
**Decision:** Digital Presence Security over Digital Virtual Traveller
**Reasoning:** Security tools land on insight; travel apps require visual polish to compete. Security is more differentiating in a hackathon context.
**Classification:** Inductive (pattern from hackathon experience) + Deductive (static stack eliminates real-time travel data)
**Confidence:** High

## D002 — Static Stack
**Decision:** Vanilla JS + HTML + CSS, GitHub Pages
**Reasoning:** No build step = faster agent build time. No server = no ops risk during demo.
**Classification:** Deductive
**Confidence:** High

## D003 — VaultScore Visual
**Decision:** Colour-coded threat level (LOW/MEDIUM/HIGH/CRITICAL) over numeric score
**Reasoning:** Judges respond to visceral, immediate signals. A red "CRITICAL" badge is more powerful than "37/100".
**Classification:** Retroductive (inferred from judge psychology)
**Confidence:** Medium-High

## D004 — HIBP CORS Workaround
**Decision:** corsproxy.io prefix + mock fallback
**Reasoning:** Free, no setup, reliable for demo. Mock ensures demo never breaks.
**Classification:** Deductive
**Confidence:** High

## D005 — Profile Links (not live data)
**Decision:** Construct search URLs rather than attempt scraping
**Reasoning:** LinkedIn/Facebook block programmatic access. Legal risk. URL links achieve the demo effect without the technical barrier.
**Classification:** Deductive (constraint-driven)
**Confidence:** High
