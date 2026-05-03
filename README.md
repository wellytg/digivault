# DigiVault

> Know your digital self. Protect it.

**Hurricane Hackathon 2026 · University of Tulsa**
Built by Will · Solo · 24hrs

---

## What is DigiVault?

By 2030, every person will have a digital twin living online — across social platforms, data broker sites, news archives, and breach databases. Most people have never seen what their twin looks like, or what doors it leaves open.

**DigiVault** gives you a mirror and a shield.

Enter your name and email → DigiVault shows you exactly what the world sees when they search you, checks if your data has been exposed in known breaches, and gives you a **DigiScore** — a single threat-level rating showing how exposed you are.

---

## Features

- **Public Face Scan** — One-click links to your presence across LinkedIn, Twitter, Facebook, Instagram, Google, and data broker sites.
- **Exposure Report** — Checks your email against HaveIBeenPwned's database of 15+ billion breached records.
- **DigiScore** — Colour-coded threat level: LOW / MEDIUM / HIGH / CRITICAL.
- **AI Recommendations** — Claude-powered, personalised action plan to reduce your exposure.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Vanilla JS, HTML5, CSS3 |
| AI | Claude Sonnet (Anthropic API) |
| Breach Data | HaveIBeenPwned (free endpoint) |
| Deploy | GitHub Pages (static, no backend) |

---

## Privacy

Nothing you enter is stored. All processing happens in your browser. DigiVault has no servers, no database, no accounts. Your data never leaves your machine except for the breach check API call.

---

## Run Locally

No build step. No npm. Just open:

```
index.html
```

Or serve with any static file server:
```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

---

## Configuration

Edit `config.js` to add your Anthropic API key:

```js
const CONFIG = {
  ANTHROPIC_API_KEY: 'your-key-here',
  USE_MOCK_DATA: false,  // set true to use demo data
  ...
};
```

**Note:** API key is client-side for hackathon demo purposes. In production this would be handled server-side.

---

## Project Structure

```
digivault/
├── index.html          # Single page app
├── config.js           # API keys + feature flags
├── css/                # Styles (main, vault-score, animations)
├── js/
│   ├── app.js          # Main controller
│   ├── modules/        # recon, breach, vault-score, ai-report
│   └── utils/          # api helpers, math utils
└── data/
    └── mock-results.json  # Demo data
```

---

## Roadmap

- **V1 (this):** Recon + breach check + DigiScore + AI recommendations.
- **V2:** Profile sync — unified digital presence across platforms.
- **V3:** DigiAgent — continuous monitoring, breach alerts, identity protection.

---

*DigiVault · Hurricane Hackathon 2026 · University of Tulsa*
