# VaultTech — Master Plan
> Hurricane Hackathon · Spring 2026 · University of Tulsa
> Team: Solo · Stack: Vanilla JS + HTML + CSS · Deploy: GitHub Pages

---

## Mission Statement

VaultTech reveals your digital identity as the world sees it — and scores how exposed you are.

By 2030, every person will have a digital twin living online across social platforms, data brokers, and public records. Most people have no idea what that twin looks like or what it's leaking. VaultTech gives you a mirror and a shield.

**Demo hook:** Enter your name and email → see your public face → get your VaultScore → receive AI-powered recommendations to lock it down.

---

## The Product (MVP Scope — 24hrs)

### Three Outputs from Two Inputs

**Inputs:** Name (text) + Email (text)

**Output 1 — Your Public Face (Recon)**
- Google search link pre-populated with name
- Direct profile links: LinkedIn, Twitter/X, Facebook, Instagram (constructed URLs)
- News/article search link (Google News)
- People search sites: Spokeo, Whitepages, BeenVerified (links only)

**Output 2 — Exposure Report (Breach Check)**
- HaveIBeenPwned free endpoint: https://haveibeenpwned.com/api/v3/breachedaccount/{email}
- NOTE: Free endpoint has CORS restrictions — use corsproxy.io prefix or mock for demo
- Show: breach names, dates, data types exposed
- Fallback: if CORS blocks, use mock data with disclaimer

**Output 3 — VaultScore**
- Calculated client-side from weighted signals
- Visual: Colour-coded threat level badge
  - LOW (75-100): Minimal exposure
  - MEDIUM (50-74): Some exposure, action recommended
  - HIGH (25-49): Significant exposure, act now
  - CRITICAL (0-24): Severe exposure, immediate action required

**Output 4 — AI Recommendations**
- Claude API call with scan results as context
- Returns 3-5 specific actionable recommendations
- Streamed into UI for terminal effect
- API key stored in config.js (swappable by agent/user)

---

## Scoring Logic (VaultScore)

| Signal | Weight | How measured |
|--------|--------|--------------|
| Breach count | 40% | Number of breaches found |
| Profile visibility | 30% | Number of public profiles surfaced |
| Data broker presence | 20% | Estimated from name commonality |
| Email age/exposure | 10% | Inferred from breach dates |

Score = 100 minus weighted_penalty. Higher = safer.

---

## File Build Order (Agent: follow this sequence exactly)

1. config.js
2. js/utils/api.js
3. js/utils/helpers.js
4. js/modules/recon.js
5. js/modules/breach.js
6. js/modules/vault-score.js
7. js/modules/ai-report.js
8. js/app.js
9. css/main.css
10. css/vault-score.css
11. css/animations.css
12. index.html
13. data/mock-results.json
14. README.md

---

## Design System

**Palette (CSS variables):**
- --bg: #0a0a0f
- --surface: #111118
- --border: #1e1e2e
- --accent: #00ff88 (LOW/safe)
- --warning: #ffaa00 (MEDIUM)
- --danger: #ff4444 (HIGH)
- --critical: #ff0055 (CRITICAL)
- --text: #e0e0f0
- --muted: #666680

**Fonts (Google Fonts CDN):**
- Display/mono: Space Mono
- Body: DM Sans

**Three key UI moments:**
1. LANDING: Full viewport, minimal. Logo + 2 inputs + scan button only.
2. SCANNING: Animated progress bar + live status text cycling through scan steps.
3. RESULTS: Staggered card reveals. VaultScore badge pulses. AI text streams in.

---

## Constraints & Workarounds

| Constraint | Workaround |
|------------|------------|
| GitHub Pages = no backend | All logic client-side JS |
| HIBP CORS blocks browser | Prefix with https://corsproxy.io/? OR use mock data |
| LinkedIn/Facebook block scraping | Surface constructed links only |
| API key in client JS | Acceptable for hackathon; documented in README |

---

## Build Phases

Phase 1 — Scaffold (1hr): config, index shell, CSS variables
Phase 2 — Core Modules (4hrs): recon, breach, vaultscore, app controller
Phase 3 — AI Layer (2hrs): Claude API + streaming UI
Phase 4 — Polish (2hrs): animations, mobile, mock data reliability
Phase 5 — Submission (1hr): GitHub Pages deploy, README, thinking docs

---

## Submission Checklist

- Works in browser with no install required
- GitHub Pages URL live and accessible
- Demo works with mock data if APIs fail live
- README explains project clearly for judges
- .thinking/ folder documents process
- Pitch: Vision 2030 → Problem → Demo → VaultScore → Roadmap

---

## Team

Built by Will · VaultTech · Hurricane Hackathon 2026 · University of Tulsa
