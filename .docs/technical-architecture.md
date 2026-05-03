# VaultTech — Technical Architecture
> For agent consumption: every file, every function, every API call documented here.

---

## Repo Structure

```
vaulttech/
├── .nojekyll                  # Required: tells GitHub Pages to serve dotfiles
├── index.html                 # Single page app shell
├── config.js                  # API keys + feature flags (edit this first)
├── README.md                  # Judge-facing project description
├── .docs/                     # Project documentation (not served, for team)
│   ├── master-plan.md         # THIS IS THE PRIMARY BRIEF — start here
│   ├── technical-architecture.md
│   ├── api-reference.md
│   └── pitch-script.md
├── .thinking/                 # Process log, decisions, ideas
│   ├── process-log.md
│   ├── decisions.md
│   └── ideas-parking-lot.md
├── css/
│   ├── main.css               # Layout, typography, dark theme, component base
│   ├── vault-score.css        # VaultScore badge + threat level colours
│   └── animations.css         # Scan animation, card reveals, loading states
├── js/
│   ├── app.js                 # Main controller — entry point, wires all modules
│   ├── modules/
│   │   ├── recon.js           # Builds profile links and public face cards
│   │   ├── breach.js          # HIBP fetch + breach card rendering
│   │   ├── vault-score.js     # Score calculation + threat badge rendering
│   │   └── ai-report.js       # Claude API call + streaming text render
│   └── utils/
│       ├── api.js             # All fetch calls, CORS proxy, mock fallback logic
│       └── helpers.js         # URL builders, formatters, score math helpers
└── data/
    └── mock-results.json      # Demo data — used when APIs unavailable
```

---

## config.js — Write This First

```javascript
// config.js
// AGENT: Replace placeholder values before demo
const CONFIG = {
  ANTHROPIC_API_KEY: 'YOUR_KEY_HERE',   // Claude API key
  USE_MOCK_DATA: false,                  // Set true to force mock data for demo
  CORS_PROXY: 'https://corsproxy.io/?', // Prefix for HIBP fetch
  HIBP_BASE: 'https://haveibeenpwned.com/api/v3',
  APP_NAME: 'VaultTech',
  VERSION: '1.0.0-hackathon'
};
```

---

## index.html — Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta, title, Google Fonts (Space Mono + DM Sans), CSS imports -->
</head>
<body>
  <!-- SECTION 1: Hero/Landing -->
  <section id="landing">
    <div class="logo">VaultTech</div>
    <h1>What does the world see when they search you?</h1>
    <form id="scan-form">
      <input id="input-name" type="text" placeholder="Full Name" />
      <input id="input-email" type="email" placeholder="Email Address" />
      <button type="submit">Run VaultScan</button>
    </form>
  </section>

  <!-- SECTION 2: Scan Progress (hidden until scan starts) -->
  <section id="scanning" hidden>
    <div class="progress-bar"><div class="progress-fill"></div></div>
    <p id="scan-status">Initialising scan...</p>
  </section>

  <!-- SECTION 3: Results (hidden until scan complete) -->
  <section id="results" hidden>
    <!-- VaultScore badge -->
    <div id="vault-score-container"></div>
    <!-- Public Face cards -->
    <div id="public-face"></div>
    <!-- Breach Report cards -->
    <div id="breach-report"></div>
    <!-- AI Recommendations -->
    <div id="ai-recommendations"></div>
  </section>

  <!-- Scripts — load order matters -->
  <script src="config.js"></script>
  <script src="js/utils/helpers.js"></script>
  <script src="js/utils/api.js"></script>
  <script src="js/modules/recon.js"></script>
  <script src="js/modules/breach.js"></script>
  <script src="js/modules/vault-score.js"></script>
  <script src="js/modules/ai-report.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

---

## js/app.js — Main Controller

```javascript
// app.js
// Orchestrates the full scan flow. Calls modules in sequence.

document.getElementById('scan-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('input-name').value.trim();
  const email = document.getElementById('input-email').value.trim();

  showScanning();

  // Step 1: Recon
  updateStatus('Scanning public profiles...');
  const reconResults = await runRecon(name);

  // Step 2: Breach check
  updateStatus('Checking breach databases...');
  const breachResults = await runBreachCheck(email);

  // Step 3: VaultScore
  updateStatus('Calculating VaultScore...');
  const score = calculateVaultScore(reconResults, breachResults);

  // Step 4: Render results
  updateStatus('Compiling report...');
  renderRecon(reconResults);
  renderBreachReport(breachResults);
  renderVaultScore(score);

  showResults();

  // Step 5: AI recommendations (async, streams in after)
  await streamAIReport(name, email, reconResults, breachResults, score);
});
```

---

## js/modules/recon.js

**Function: runRecon(name)**
- Input: string name
- Output: object { profiles: [], searchLinks: [], databrokers: [] }

Profile links to construct (not fetch — just build URLs):
- LinkedIn: `https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(name)}`
- Twitter/X: `https://twitter.com/search?q=${encodeURIComponent(name)}`
- Facebook: `https://facebook.com/search/people/?q=${encodeURIComponent(name)}`
- Instagram: `https://instagram.com/explore/tags/${encodeURIComponent(name.replace(' ','')).toLowerCase()}`
- Google: `https://google.com/search?q="${encodeURIComponent(name)}"`
- Google News: `https://news.google.com/search?q=${encodeURIComponent(name)}`
- Spokeo: `https://spokeo.com/${encodeURIComponent(name.replace(' ','-'))}`
- Whitepages: `https://whitepages.com/name/${encodeURIComponent(name.replace(' ','-'))}`

**Function: renderRecon(results)**
- Renders platform cards into #public-face
- Each card: platform icon/name, constructed URL as clickable link, label "View Profile →"
- Mark social platforms separately from data brokers

---

## js/modules/breach.js

**Function: runBreachCheck(email)**
- Input: string email
- Output: array of breach objects OR mock data

Fetch logic:
```javascript
// Try real API first
const url = CONFIG.CORS_PROXY + CONFIG.HIBP_BASE + '/breachedaccount/' + encodeURIComponent(email);
// Headers: { 'hibp-api-key': not required for free tier }
// If 404: no breaches found (good!)
// If 200: parse JSON array of breach objects
// If CORS error or CONFIG.USE_MOCK_DATA: load from data/mock-results.json
```

Each breach object has: Name, Domain, BreachDate, Description, DataClasses[]

**Function: renderBreachReport(breaches)**
- If empty: green "No breaches found" card
- Else: one card per breach showing name, date, data types exposed
- Data types rendered as tags: email, password, phone, address, etc.

---

## js/modules/vault-score.js

**Function: calculateVaultScore(reconResults, breachResults)**
- Returns integer 0-100

Scoring:
```javascript
let score = 100;
// Breach penalty (40% weight = max 40 points)
score -= Math.min(breachResults.length * 8, 40);
// Profile visibility penalty (30% weight = max 30 points)
score -= Math.min(reconResults.profiles.length * 5, 30);
// Data broker penalty (20% = max 20 points) — fixed 10 for now (assumed present)
score -= 10;
// Email exposure (10% = max 10 points) — 5 if any breach
score -= breachResults.length > 0 ? 5 : 0;
return Math.max(score, 0);
```

**Function: renderVaultScore(score)**
- Render large badge in #vault-score-container
- Threat level:
  - 75-100: class="low", label="LOW RISK"
  - 50-74: class="medium", label="MEDIUM RISK"
  - 25-49: class="high", label="HIGH RISK"
  - 0-24: class="critical", label="CRITICAL"
- Animate score counting up from 0 to final value on reveal

---

## js/modules/ai-report.js

**Function: streamAIReport(name, email, recon, breaches, score)**

Claude API call:
```javascript
const prompt = `You are VaultTech's security AI. Analyse this digital exposure report and provide exactly 5 specific, actionable recommendations.

Subject: ${name}
Email: ${email}
VaultScore: ${score}/100 (${getThreatLevel(score)})
Breaches found: ${breaches.length}
Breach details: ${JSON.stringify(breaches.map(b => ({ name: b.Name, date: b.BreachDate, data: b.DataClasses })))}
Public profiles: ${recon.profiles.length} platforms

Return ONLY a numbered list of 5 recommendations. Be specific, practical, and prioritise by urgency. No preamble.`;

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': CONFIG.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 600,
    stream: true,
    messages: [{ role: 'user', content: prompt }]
  })
});
// Stream SSE response into #ai-recommendations with typewriter effect
```

---

## data/mock-results.json — Structure

```json
{
  "breaches": [
    {
      "Name": "LinkedIn",
      "Domain": "linkedin.com",
      "BreachDate": "2021-06-22",
      "Description": "LinkedIn data exposed including emails and professional information.",
      "DataClasses": ["Email addresses", "Full names", "Geographic locations", "Job titles"]
    },
    {
      "Name": "Adobe",
      "Domain": "adobe.com",
      "BreachDate": "2013-10-04",
      "Description": "Adobe suffered a massive breach exposing user account data.",
      "DataClasses": ["Email addresses", "Password hints", "Passwords", "Usernames"]
    }
  ],
  "note": "Mock data — for demo when live APIs unavailable"
}
```

---

## GitHub Pages Deploy Instructions

1. Push repo to GitHub: `git init && git add . && git commit -m "VaultTech v1" && git remote add origin YOUR_REPO_URL && git push -u origin main`
2. Go to repo Settings → Pages → Source: Deploy from branch → main → / (root)
3. Wait ~60 seconds → site live at `https://YOUR_USERNAME.github.io/vaulttech`
4. `.nojekyll` file in root ensures GitHub Pages serves all files including dotfolders

---

## Agent Notes

- Build files in the priority order listed in master-plan.md
- config.js must be the first file — all other files import from it via global CONFIG
- All JS files use plain ES6 — no bundler, no npm, no build step
- All CSS uses CSS custom properties (variables) defined in main.css :root
- Do not use any frameworks — pure vanilla only
- Mock data must work completely offline for demo reliability
- Test locally by opening index.html in browser before pushing
